import { createSelector, createSlice } from '@reduxjs/toolkit';
import { INIT_NODES, TESTNET_INIT_NODES } from '@chainx/extension-defaults';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import { setInstances } from '@chainx/extension-ui/shared/chainxInstances';

const nodeSlice = createSlice({
  name: 'node',
  initialState: {
    chainxMainNetNodes: [],
    currentChainXMainNetNode: {
      name: '',
      url: '',
      delay: ''
    },
    chainxTestNetNodes: [],
    currentChainXTestNetNode: {
      name: '',
      url: '',
      delay: ''
    }
  },
  reducers: {
    setChainxMainNetNodes(state, action) {
      state.chainxMainNetNodes = action.payload;
      // @ts-ignore
      setInstances(state.chainxMainNetNodes.map(node => node.url));
    },
    setChainxTestNetNodes(state, action) {
      state.chainxTestNetNodes = action.payload;
      // @ts-ignore
      setInstances(state.chainxTestNetNodes.map(node => node.url));
    },
    setCurrentChainXMainNetNode(state, action) {
      state.currentChainXMainNetNode = action.payload;
    },
    setCurrentChainXTestNetNode(state, action) {
      state.currentChainXTestNetNode = action.payload;
    },
    setNodeDelay(state, { payload: { url, delay } }) {
      // @ts-ignore
      const target = state.chainxMainNetNodes.find(n => n.url === url);
      if (target) {
        // @ts-ignore
        target.delay = delay;
      }

      // @ts-ignore
      const testnetTarget = state.chainxTestNetNodes.find(n => n.url === url);
      if (testnetTarget) {
        // @ts-ignore
        testnetTarget.delay = delay;
      }
    }
  }
});

export const {
  setChainxMainNetNodes,
  setChainxTestNetNodes,
  setCurrentChainXMainNetNode,
  setCurrentChainXTestNetNode,
  setNodeDelay
} = nodeSlice.actions;

const mainNetNode = state => state.node.currentChainXMainNetNode;
export const mainNetNodesSelector = state =>
  state.node.chainxMainNetNodes.map(node => {
    const isInit = [...INIT_NODES, ...TESTNET_INIT_NODES].some(
      n => n.url === node.url
    );

    return {
      ...node,
      isInit
    };
  });
export const testNetNodesSelector = state =>
  state.node.chainxTestNetNodes.map(node => {
    const isInit = [...INIT_NODES, ...TESTNET_INIT_NODES].some(
      n => n.url === node.url
    );

    return {
      ...node,
      isInit
    };
  });
const testNetNode = state => state.node.currentChainXTestNetNode;

export const currentMainNetNodeSelector = createSelector(
  mainNetNodesSelector,
  mainNetNode,
  (nodes, node) => {
    return nodes.find(n => n.url === node.url);
  }
);

export const currentTestNetNodeSelector = createSelector(
  testNetNodesSelector,
  testNetNode,
  (nodes, node) => {
    return nodes.find(n => n.url === node.url);
  }
);

export const currentNodeSelector = createSelector(
  isTestNetSelector,
  currentMainNetNodeSelector,
  currentTestNetNodeSelector,
  (isTestNet, mainNetNode, testNetNode) => {
    return isTestNet ? testNetNode : mainNetNode;
  }
);

export default nodeSlice.reducer;
