// @ts-ignore
import store from './store';
import { ChainxNode } from "./types";

export const NODE_PREFIX = 'node_';

class Nodes {
  nodes: ChainxNode[];

  constructor() {
    this.nodes = [];
  }

  loadAll(): Promise<any> {
    return store.all((key, item) => {
      if (key.startsWith(NODE_PREFIX)) {
        this.nodes.push({ name: key.slice(NODE_PREFIX.length), ...item });
      }
    })
  }

  async addNode(name: string, url: string): Promise<any> {
    const node: ChainxNode = { name, url };

    await store.set(`${NODE_PREFIX}${name}`, node, () => {
      this.nodes.push(node);
    })
  }
}

const nodes = new Nodes();

export default nodes;
