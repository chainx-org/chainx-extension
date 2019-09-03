import extension from 'extensionizer';

export default class ExtensionStore {
  public all (cb: (key: string, value: any) => void): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extension.storage.local.get(null, (result: any): void => {
      Object.entries(result).forEach(([key, value]): void => {
        cb(key, value);
      });
    });
  }

  public get (key: string, cb: (value: any) => void): void {
    extension.storage.local.get([key], (result: any): void => {
      cb(result[key]);
    });
  }

  public remove (key: string, cb?: () => void): void {
    extension.storage.local.remove(key, (): void => {
      cb && cb();
    });
  }

  public set (key: string, value: any, cb?: () => void): void {
    // shortcut, don't save testing accounts in extension storage
    if (key.startsWith('account:') && value.meta && value.meta.isTesting) {
      cb && cb();

      return;
    }

    extension.storage.local.set({ [key]: value }, (): void => {
      cb && cb();
    });
  }
}
