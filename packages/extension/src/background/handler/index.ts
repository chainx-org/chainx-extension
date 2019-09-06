import handleContent from "./content";
import handlePopup from "./popup";
import { MessageRequest } from './types';
// @ts-ignore
import { PORT_POPUP } from '@chainx/extension-defaults';

export default function (request: MessageRequest, port: chrome.runtime.Port): Promise<any> {
  if (port.name === PORT_POPUP) {
    return handlePopup(request);
  } else {
    return handleContent(request);
  }
}
