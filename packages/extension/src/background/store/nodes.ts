import store from './store';
import { ChainxNode } from '../types';
import {
  INIT_NODES as initNodes,
  TESTNET_INIT_NODES as testnetInitNodes
} from '@chainx/extension-defaults';
import settings from './settings';

export const NODE_PREFIX = 'node_';
export const TESTNET_NODE_PREFIX = 'testnet_node_';
export const CURRENT_NODE_KEY = 'current_node_key';
export const CURRENT_TESTNET_NODE_KEY = 'current_testnet_node_key';

class Nodes {
  nodes: ChainxNode[];
  testNetNodes: ChainxNode[];
  currentNode: ChainxNode | null;
  currentTestNetNode: ChainxNode | null;

  constructor() {
    this.nodes = [];
    this.testNetNodes = [];
    this.currentNode = null;
    this.currentTestNetNode = null;
  }

  _reset() {
    this.nodes = [];
    this.currentNode = null;

    this.testNetNodes = [];
    this.currentTestNetNode = null;
  }

  async initNodes() {
    for (let node of initNodes) {
      try {
        await this.addNode(node.name, node.url, false);
      } catch (e) {
        console.log(`init node ${node.name} failed, maybe exist, ignore`, e);
      }
    }

    await this.setCurrentNode(initNodes[0].url);

    for (let node of testnetInitNodes) {
      try {
        await this.addNode(node.name, node.url, true);
      } catch (e) {
        console.log(`init node ${node.name} failed, maybe exist, ignore`, e);
      }
    }
  }

  async loadAll(): Promise<ChainxNode[]> {
    this._reset();

    await store.all((key, item) => {
      if (key.startsWith(NODE_PREFIX)) {
        this.nodes.push(item);
      }

      if (key.startsWith(TESTNET_NODE_PREFIX)) {
        this.testNetNodes.push(item);
      }
    });

    await store.get(CURRENT_NODE_KEY, node => {
      if (!node) {
        this.currentNode = this.nodes[0] || null;
        return;
      }

      const target = this.nodes.find(item => item.url === node.url);
      this.currentNode = target || this.nodes[0];
    });

    await store.get(CURRENT_TESTNET_NODE_KEY, node => {
      if (!node) {
        this.currentTestNetNode = this.testNetNodes[0] || null;
        return;
      }

      const target = this.testNetNodes.find(item => item.url === node.url);
      this.currentTestNetNode = target || this.testNetNodes[0];
    });

    // @ts-ignore
    if (settings.settings.isTestNet) {
      return this.testNetNodes;
    }

    return this.nodes;
  }

  async addNode(
    name: string,
    url: string,
    isTestNet: boolean = false
  ): Promise<ChainxNode> {
    const node: ChainxNode = { name, url, isTestNet };

    const nodes = isTestNet ? this.testNetNodes : this.nodes;
    const prefix = isTestNet ? TESTNET_NODE_PREFIX : NODE_PREFIX;

    if (nodes.find(item => item.name === name)) {
      return Promise.reject({ message: 'name already exist' });
    }

    if (nodes.find(item => item.url === url)) {
      return Promise.reject({ message: 'url already exist' });
    }

    await store.set(`${prefix}${name}`, node, () => {
      nodes.push(node);
    });

    return node;
  }

  async setCurrentNode(url: string, isTestNet: boolean = false): Promise<any> {
    const nodes = isTestNet ? this.testNetNodes : this.nodes;
    const key = isTestNet ? CURRENT_TESTNET_NODE_KEY : CURRENT_NODE_KEY;

    const target = nodes.find(item => item.url === url);
    if (!target) {
      return Promise.reject({ message: 'url not exist' });
    }

    await store.set(key, target, () => {
      if (isTestNet) {
        this.currentTestNetNode = target;
      } else {
        this.currentNode = target;
      }
    });
  }

  async getCurrentNode(isTestNet: boolean = false) {
    if (isTestNet) {
      return this.currentTestNetNode;
    }

    return this.currentNode;
  }

  async removeNode(url: string, isTestNet: boolean = false): Promise<any> {
    const nodes = isTestNet ? this.testNetNodes : this.nodes;
    const prefix = isTestNet ? TESTNET_NODE_PREFIX : NODE_PREFIX;

    const target = nodes.find(item => item.url === url);
    if (!target) {
      return Promise.reject({ message: 'name not exist' });
    }

    await store.remove(`${prefix}${target.name}`);
    if (!isTestNet && this.currentNode && this.currentNode.url === url) {
      await store.remove(CURRENT_NODE_KEY);
    } else if (
      isTestNet &&
      this.currentTestNetNode &&
      this.currentTestNetNode.url === url
    ) {
      await store.remove(CURRENT_TESTNET_NODE_KEY);
    }

    await this.loadAll();
  }
}

const nodes = new Nodes();

export default nodes;
