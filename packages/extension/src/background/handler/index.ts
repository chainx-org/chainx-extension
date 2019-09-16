import handleContent from "./content";
import handlePopup from "./popup";
import { MessageRequest } from './types';
// @ts-ignore
import { PORT_POPUP, PORT_CONTENT, PORT_NOTIFICATION } from '@chainx/extension-defaults';

export default function (request: MessageRequest, port: chrome.runtime.Port): Promise<any> {
  if (port.name === PORT_POPUP) {
    return handlePopup(request);
  } else if (port.name === PORT_CONTENT) {
    return handleContent(request);
  }

  return Promise.reject({ message: 'invalid port' });
}
