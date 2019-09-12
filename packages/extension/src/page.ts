window.addEventListener('message', ({ source, data }): void => {
  // only allow messages from our window, by the inject
  if (source !== window || data.origin !== 'content') {
    return;
  }

  const handler = handlers[data.id];
  if (!handler) {
    console.error(`Uknown response: ${JSON.stringify(data)}`);
    return;
  }

  if (data.error) {
    handler.reject(new Error(data.error));
  } else {
    handler.resolve(data.response);
  }

});

const handlers: any = {};
let idCounter = 0;

function sendMessage(message: any, request: any = null): Promise<any> {
  return new Promise((resolve, reject): void => {
    const id = `chainx.${Date.now()}.${++idCounter}`;

    handlers[id] = { resolve, reject };

    window.postMessage({ id, message, origin: 'page', request }, '*');
  });
}

async function enable(): Promise<any> {
  return await sendMessage('chainx.accounts.current');
}

// @ts-ignore
window.chainxProvider = {
  enable
}
