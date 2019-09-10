// @ts-ignore
import store from './store';
import { ChainxNode } from "./types";

export const NODE_PREFIX = 'node_';

class Nodes {
  nodes: ChainxNode[];

  constructor() {
    this.nodes = [];
  }

  async loadAll(): Promise<ChainxNode[]> {
    await store.all((key, item) => {
      if (key.startsWith(NODE_PREFIX)) {
        this.nodes.push({ name: key.slice(NODE_PREFIX.length), ...item });
      }
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
