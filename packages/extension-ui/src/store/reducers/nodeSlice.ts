import { createSelector, createSlice } from '@reduxjs/toolkit';

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
    },
    setChainxTestNetNodes(state, action) {
      state.chainxTestNetNodes = action.payload;
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
export const mainNetNodesSelector = state => state.node.chainxMainNetNodes;
export const testNetNodesSelector = state => state.node.chainxTestNetNodes;
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

export default nodeSlice.reducer;
