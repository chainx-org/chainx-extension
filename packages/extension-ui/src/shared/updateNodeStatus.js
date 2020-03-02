import { getCurrentChainxNode, getAllChainxNodes } from '../messaging';
import { INIT_NODES, TESTNET_INIT_NODES } from '@chainx/extension-defaults';
import fetchFromWs from './fetch';
import store from '../store';
import {
  mainNetNodesSelector,
  setNodeDelay
} from '../store/reducers/nodeSlice';

export const TIMEOUT = 7000;

export const getNodeList = async (setNodeList, isTestNet) => {
  const nodeListResult = await getAllChainxNodes(isTestNet);
  setNodeList({ nodeList: nodeListResult });
  return nodeListResult;
};

export const getCurrentNode = async (setCurrentNode, isTestNet) => {
  const currentNodeResult = await getCurrentChainxNode(isTestNet);
  setCurrentNode({ currentNode: currentNodeResult });
  return currentNodeResult;
};

export const isCurrentNodeInit = (node, isTestNet) => {
  let result = false;
  if (isTestNet) {
    TESTNET_INIT_NODES.some(item => {
      if (item.url === node.url) {
        result = true;
      }
    });
  } else {
    INIT_NODES.some(item => {
      if (item.url === node.url) {
        result = true;
      }
    });
  }
  return result;
};

export const updateDelay = async function() {
  const state = store.getState();
  const nodes = mainNetNodesSelector(state);
  for (const node of nodes) {
    try {
      const result = await fetchFromWs({
        url: node.url,
        method: 'chain_getBlock',
        timeOut: TIMEOUT
      });
      store.dispatch(setNodeDelay({ url: node.url, delay: result.wastTime }));
    } catch (e) {
      store.dispatch(setNodeDelay({ url: node.url, delay: 'timeout' }));
    }
  }
};

export const getDelay = async (
  currentNode,
  setCurrentDelay,
  nodeList,
  delayList,
  setDelayList,
  isTestNet
) => {
  nodeList.map((item, index) => {
    fetchFromWs({
      url: item.url,
      method: 'chain_getBlock',
      timeOut: TIMEOUT
    })
      .then((result = {}) => {
        if (result.data) {
          nodeList[index].delay = result.wastTime;
        }
      })
      .catch(() => {
        nodeList[index].delay = 'timeout';
      })
      .finally(() => {
        if (nodeList[index].url === currentNode.url) {
          if (isTestNet) {
            setCurrentDelay({ currentTestDelay: nodeList[index].delay });
          } else {
            setCurrentDelay({ currentDelay: nodeList[index].delay });
          }
        }
        delayList[index] = nodeList[index].delay;
        if (isTestNet) {
          setDelayList({ testDelayList: delayList });
        } else {
          setDelayList({ delayList: delayList });
        }
      });
  });
};

async function updateNodeStatus(
  setCurrentNode,
  setCurrentDelay,
  setNodeList,
  delayList = [],
  setDelayList,
  isTestNet
) {
  const currentNode = await getCurrentNode(setCurrentNode, isTestNet);

  const nodeList = await getNodeList(setNodeList, isTestNet);
  updateDelay()
    .then(() => console.log('Node network status updated'))
    .catch(() => console.error('Fail to update node network status'));

  getDelay(
    currentNode,
    setCurrentDelay,
    nodeList,
    delayList,
    setDelayList,
    isTestNet
  );
}

export default updateNodeStatus;
