import extension from 'extensionizer';

class Store {
  public all (cb: (key: string, value: any) => void): Promise<any> {
    return new Promise((resolve, reject) => {
      extension.storage.local.get(null, (result: any): void => {
        if (extension.runtime.lastError) {
          reject()
          return;
        }

        Object.entries(result).forEach(([key, value]): void => {
          cb(key, value);
        });

        resolve()
      });
    })
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

export default new Store();
