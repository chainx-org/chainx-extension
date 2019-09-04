window.addEventListener('message', (msg): void => {
  // only allow messages from our window, by the inject
  if (msg.source !== window || msg.data.origin !== 'content') {
    return;
  }

  console.log('page msg from content', msg);
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

async function enable (origin: string): Promise<any> {
  await sendMessage('chainx.accounts.create', { origin });

  return "ok";
}

console.log('abcd');

console.log("hello world from ChainX extension");

// @ts-ignore
window.chainxProvider = {
  enable
}
