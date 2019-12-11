import extension from 'extensionizer';
import {
  CHAINX_ORIGIN_CONTENT,
  CHAINX_ORIGIN_PAGE,
  PORT_CONTENT
} from '@chainx/extension-defaults';

// connect to the extension
const port = extension.runtime.connect({ name: PORT_CONTENT });

// send any messages from the extension back to the page
port.onMessage.addListener((data): void => {
  window.postMessage({ ...data, origin: CHAINX_ORIGIN_CONTENT }, '*');
});

// all messages from the page, pass them to the extension
window.addEventListener('message', ({ data, source }): void => {
  // only allow messages from our window, by the inject
  if (source !== window || data.origin !== CHAINX_ORIGIN_PAGE) {
    return;
  }

  port.postMessage(data);
});

// inject our data injector
const script = document.createElement('script');

script.src = extension.extension.getURL('page.js');
script.onload = (): void => {
  // remove the injecting tag when loaded
  if (script.parentNode) {
    script.parentNode.removeChild(script);
  }
};

// @ts-ignore
(document.head || document.documentElement).appendChild(script);
