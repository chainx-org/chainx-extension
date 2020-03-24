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
import { instances } from '@chainx/extension-ui/shared/chainxInstances';
import { sleep } from '@chainx/extension-ui/shared/chainx';

export const TIMEOUT = 10000;

export default async function initNodes() {
  await getNodes();
  await updateDelay();
}

export async function getNodes() {
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
  const testNetNodes = testNetNodesSelector(state);

  async function updateNodeDelay(node) {
    const instance = instances.get(node.url);
    if (!instance) {
      return;
    }

    let delay;
    try {
      delay = await testNet(instance);
    } catch (e) {
      console.log('e', e);
      delay = 'timeout';
    }
    store.dispatch(setNodeDelay({ url: node.url, delay }));
  }

  return Promise.all(
    [...nodes, ...testNetNodes].map(node => updateNodeDelay(node))
  );
};

const fetchInstanceTime = async instance => {
  const startTime = Date.now();
  await instance.chain.api.rpc.system.chain();
  const endTime = Date.now();

  return endTime - startTime;
};

const testNet = async instance => {
  const result = await Promise.race([
    fetchInstanceTime(instance),
    sleep(TIMEOUT)
  ]);
  return typeof result === 'number' ? result : 'timeout';
};
