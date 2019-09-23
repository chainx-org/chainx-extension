import { getCurrentChainxNode, getAllChainxNodes } from '../messaging'
import fetchFromWs from './fetch'

const TIMEOUT = 7000

async function updateNodeStatus(setCurrentNode, setNodeList) {
  async function getNodeList() {
    const nodeListResult = await getAllChainxNodes();
    setNodeList({ nodeList: nodeListResult });
    return nodeListResult
  }

  async function getCurrentNode() {
    const currentNodeResult = await getCurrentChainxNode();
    setCurrentNode({ currentNode: currentNodeResult });
  }

  async function getDelay(nodeList) {
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
          setNodeList({ nodeList: nodeList});
        });
    }) 
  }

  await getCurrentNode()
  const nodeList = await getNodeList()
  getDelay(nodeList)
}

export default updateNodeStatus