import extension from 'extensionizer';

class Store {
  public all(cb: (key: string, value: any) => void): Promise<any> {
    return new Promise((resolve, reject) => {
      extension.storage.local.get(
        null,
        (result: any): void => {
          if (extension.runtime.lastError) {
            reject(extension.runtime.lastError);
            return;
          }

          Object.entries(result).forEach(
            ([key, value]): void => {
              cb(key, value);
            }
          );

          resolve();
        }
      );
    });
  }

  public get(key: string, cb: (value: any) => void): Promise<any> {
    return new Promise((resolve, reject) => {
      extension.storage.local.get(
        [key],
        (result: any): void => {
          if (extension.runtime.lastError) {
            reject(extension.runtime.lastError);
            return;
          }

          cb(result[key]);
          resolve();
        }
      );
    });
  }

  public remove(key: string, cb?: () => void): Promise<any> {
    return new Promise((resolve, reject) => {
      extension.storage.local.remove(
        key,
        (): void => {
          if (extension.runtime.lastError) {
            reject(extension.runtime.lastError);
            return;
          }

          cb && cb();
          resolve();
        }
      );
    });
  }

  public set(key: string, value: any, cb?: () => void): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // shortcut, don't save testing accounts in extension storage
      extension.storage.local.set(
        { [key]: value },
        (): void => {
          if (extension.runtime.lastError) {
            reject(extension.runtime.lastError);
            return;
          }

          cb && cb();
          resolve();
        }
      );
    });
  }
}

export default new Store();
