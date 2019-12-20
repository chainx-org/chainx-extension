import extension from 'extensionizer';
import { Popup } from './types';

const NOTIFICATION_HEIGHT = 620;
const NOTIFICATION_WIDTH = 358;

class NotificationManager {
  _popupId: Number | null;

  constructor() {
    this._popupId = null;
  }

  showPopup() {
    this._getPopup((err, popup: Popup) => {
      if (err) throw err;
      // Bring focus to chrome popup
      if (popup) {
        // bring focus to existing chrome popup
        // @ts-ignore
        extension.windows.update(popup.id, { focused: true });
      } else {
        const { screenX, screenY, outerWidth, outerHeight } = window;
        const notificationTop = Math.round(
          screenY + outerHeight / 2 - NOTIFICATION_HEIGHT / 2
        );
        const notificationLeft = Math.round(
          screenX + outerWidth / 2 - NOTIFICATION_WIDTH / 2
        );
        const cb = currentPopup => {
          this._popupId = currentPopup.id;
        };
        // create new notification popup
        const creation = extension.windows.create(
          {
            url: 'notification.html',
            type: 'popup',
            width: NOTIFICATION_WIDTH,
            height: NOTIFICATION_HEIGHT,
            top: Math.max(notificationTop, 0),
            left: Math.max(notificationLeft, 0)
          },
          cb
        );
        // @ts-ignore
        creation && creation.then && creation.then(cb);
      }
    });
  }

  closePopup() {
    // closes notification popup
    this._getPopup((err, popup: Popup) => {
      if (err) throw err;
      if (!popup) return;
      // @ts-ignore
      extension.windows.remove(popup.id, console.error);
    });
  }

  _getPopup(cb: Function) {
    this._getWindows((err, windows) => {
      if (err) throw err;
      cb(null, this._getPopupIn(windows));
    });
  }

  _getWindows(cb: Function) {
    // Ignore in test environment
    if (!extension.windows) {
      return cb();
    }

    extension.windows.getAll({}, (windows: Popup[]) => {
      cb(null, windows);
    });
  }

  _getPopupIn(windows: Popup[]) {
    return windows
      ? windows.find((win: Popup) => {
          // Returns notification popup
          return win && win.type === 'popup' && win.id === this._popupId;
        })
      : null;
  }
}

const notificationManager = new NotificationManager();

export default notificationManager;
