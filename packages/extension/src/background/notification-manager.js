import extension from 'extensionizer'

const NOTIFICATION_HEIGHT = 580
const NOTIFICATION_WIDTH = 358

class NotificationManager {
  constructor() {
    this._popupId = null
  }

  showPopup () {
    this._getPopup((err, popup) => {
      if (err) throw err
      // Bring focus to chrome popup
      if (popup) {
        // bring focus to existing chrome popup
        extension.windows.update(popup.id, { focused: true })
      } else {
        const {screenX, screenY, outerWidth, outerHeight} = window
        const notificationTop = Math.round(screenY + (outerHeight / 2) - (NOTIFICATION_HEIGHT / 2))
        const notificationLeft = Math.round(screenX + (outerWidth / 2) - (NOTIFICATION_WIDTH / 2))
        const cb = (currentPopup) => { this._popupId = currentPopup.id }
        // create new notification popup
        const creation = extension.windows.create({
          url: 'notification.html',
          type: 'popup',
          width: NOTIFICATION_WIDTH,
          height: NOTIFICATION_HEIGHT,
          top: Math.max(notificationTop, 0),
          left: Math.max(notificationLeft, 0),
        }, cb)
        creation && creation.then && creation.then(cb)
      }
    })
  }

  closePopup () {
    // closes notification popup
    this._getPopup((err, popup) => {
      if (err) throw err
      if (!popup) return
      extension.windows.remove(popup.id, console.error)
    })
  }

  _getPopup (cb) {
    this._getWindows((err, windows) => {
      if (err) throw err
      cb(null, this._getPopupIn(windows))
    })
  }

  _getWindows (cb) {
    // Ignore in test environment
    if (!extension.windows) {
      return cb()
    }

    extension.windows.getAll({}, (windows) => {
      cb(null, windows)
    })
  }

  _getPopupIn (windows) {
    return windows ? windows.find((win) => {
      // Returns notification popup
      return (win && win.type === 'popup' && win.id === this._popupId)
    }) : null
  }

}

export default NotificationManager
