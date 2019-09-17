import { getCurrentChainxNode, getAllChainxNodes } from '../messaging'
import fetchFromWs from './fetch'

async function updateNodeStatus(setCurrentNode, setNodeList) {
  async function getNodeList() {
    const nodeListResult = await getAllChainxNodes();
    nodeListResult.map((item, index) => {
      fetchFromWs({
        url: item.url,
        method: 'chain_getBlock',
        timeOut: 7000
      })
        .then((result = {}) => {
          if (result.data) {
            nodeListResult[index].delay = result.wastTime;
          }
        })
        .catch(() => {
          nodeListResult[index].delay = 'timeout';
        })
        .finally(() => {
          setNodeList({ nodeList: nodeListResult });
        });
    });
  }

  async function getCurrentNode() {
    const currentNodeResult = await getCurrentChainxNode();
    fetchFromWs({
      url: currentNodeResult.url,
      method: 'chain_getBlock',
      timeOut: 7000
    })
      .then((result = {}) => {
        if (result.data) {
          currentNodeResult.delay = result.wastTime;
        }
      })
      .catch(() => {
        currentNodeResult.delay = 'timeout';
      })
      .finally(() => {
        setCurrentNode({ currentNode: currentNodeResult });
      });
  }

  await getNodeList()
  await getCurrentNode()
}

export default updateNodeStatus