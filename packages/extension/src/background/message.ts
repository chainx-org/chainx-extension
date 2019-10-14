import { PORT_CONTENT } from '@chainx/extension-defaults';

const ports = {
  [PORT_CONTENT]: []
};
let idCounter = 0;

function getId() {
  return `chainx.background.${Date.now()}.${++idCounter}`;
}

export function registerPort(port) {
  if (port.name !== PORT_CONTENT) {
    return;
  }

  const nowPorts = ports[PORT_CONTENT];
  // @ts-ignore
  const index = nowPorts.findIndex(p => p.sender.tab.id === port.sender.tab.id);
  if (index < 0) {
    // @ts-ignore
    nowPorts.push(port);
  } else {
    // @ts-ignore
    nowPorts.splice(index, 1, port);
  }

  console.log('register new port', port.name);
  console.log(ports);
}

export const sendToContent = function(message: string, info: any = null) {
  // @ts-ignore
  const contentPorts = ports[PORT_CONTENT];

  if (contentPorts.length <= 0) {
    console.error('no ports');
  }

  for (let port of contentPorts) {
    // @ts-ignore
    port.postMessage({ id: getId(), message, info });
  }
};
