import store from '../store';
import {
  getAllChainxNodes,
  getCurrentChainxNode
} from '@chainx/extension-ui/messaging';
import {
  mainNetNodesSelector,
  setChainxMainNetNodes,
  setChainxTestNetNodes,
  setCurrentChainXMainNetNode,
  setCurrentChainXTestNetNode,
  setNodeDelay,
  testNetNodesSelector
} from '../store/reducers/nodeSlice';
import { fetchFromWs } from './index';

export const TIMEOUT = 10000;

export default async function() {
  const mainNetNodes = await getAllChainxNodes(false);
  store.dispatch(setChainxMainNetNodes(mainNetNodes));
  const testNetNodes = await getAllChainxNodes(true);
  store.dispatch(setChainxTestNetNodes(testNetNodes));

  const currentMainNetNode = await getCurrentChainxNode(false);
  store.dispatch(setCurrentChainXMainNetNode(currentMainNetNode));
  const currentTestNetNode = await getCurrentChainxNode(true);
  store.dispatch(setCurrentChainXTestNetNode(currentTestNetNode));
}

export const updateDelay = async function() {
  // TODO: 判断下是测试网还是主网，然后决定测试那些节点
  const state = store.getState();
  const nodes = mainNetNodesSelector(state);
  const testnetNodes = testNetNodesSelector(state);
  for (const node of [...nodes, ...testnetNodes]) {
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
