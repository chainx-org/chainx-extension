import { getCurrentChainxNode, getAllChainxNodes } from '../messaging'
import fetchFromWs from './fetch'

const TIMEOUT = 7000

export const getNodeList = async (setNodeList) => {
  const nodeListResult = await getAllChainxNodes();
  setNodeList({ nodeList: nodeListResult });
  return nodeListResult
}

export const getCurrentNode = async (setCurrentNode) => {
  const currentNodeResult = await getCurrentChainxNode();
  setCurrentNode({ currentNode: currentNodeResult });
  return currentNodeResult
}

export const getDelay = async (currentNode, setCurrentNode, nodeList, delayList, setDelayList) => {
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
          currentNode.delay = nodeList[index].delay;
          setCurrentNode({ currentNode: currentNode });
        }
        delayList[index] = nodeList[index].delay
        setDelayList({ delayList: delayList })
      });
  })
}

async function updateNodeStatus(setCurrentNode, setNodeList, delayList=[], setDelayList) {
  const currentNode = await getCurrentNode(setCurrentNode)
  const nodeList = await getNodeList(setNodeList)
  getDelay(currentNode, setCurrentNode, nodeList, delayList, setDelayList)
}

export default updateNodeStatus
