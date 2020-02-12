export const { Extrinsic: OriginExtrinsic } = require('@chainx/types');

export class Extrinsic extends OriginExtrinsic {
  get methodName() {
    return this.meta.get('name').toString();
  }

  get argsArr() {
    const args = [];

    const entries = this.method.get('args').entries();
    for (let [name, value] of entries) {
      // @ts-ignore
      args.push({ name, value });
    }

    return args;
  }
}
