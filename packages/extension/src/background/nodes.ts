// @ts-ignore
import store from './store';
import { ChainxNode } from "./types";

export const NODE_PREFIX = 'node_';
export const CURRENT_NODE_KEY = 'current_node_key';

class Nodes {
  nodes: ChainxNode[];
  currentNode: ChainxNode | null;

  constructor() {
    this.nodes = [];
    this.currentNode = null;
  }

  _reset() {
    this.nodes = [];
    this.currentNode = null;
  }

  async loadAll(): Promise<ChainxNode[]> {
    this._reset();

    await store.all((key, item) => {
      if (key.startsWith(NODE_PREFIX)) {
        this.nodes.push(item);
      }
    })

    if (this.nodes.length <= 0) {
      return this.nodes;
    }

    await store.get(CURRENT_NODE_KEY, node => {
      if (!node) {
        this.currentNode = this.nodes[0] || null;
        return;
      }

      const target = this.nodes.find(item => item.url === node.url);
      this.currentNode = target || this.nodes[0];
    })

    return this.nodes;
  }

  async addNode(name: string, url: string): Promise<ChainxNode> {
    const node: ChainxNode = { name, url };

    await store.set(`${NODE_PREFIX}${name}`, node, () => {
      this.nodes.push(node);
    })

    return { name, url };
  }
}

const nodes = new Nodes();

export default nodes;
