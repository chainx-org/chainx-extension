// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export const PORT_CONTENT = 'chainx-content';
export const PORT_POPUP = 'chainx-popup';
export const PORT_NOTIFICATION = 'chainx-notification';
export const CHAINX_ACCOUNT_CREATE = 'chainx.accounts.create';
export const CHAINX_ACCOUNT_ALL = 'chainx.accounts.all';
export const CHAINX_ACCOUNT_SELECT = 'chainx.accounts.select'; // 设置目标账户
export const CHAINX_ACCOUNT_CURRENT = 'chainx.accounts.current'; // 获取当前账户
export const CHAINX_ACCOUNT_CURRENT_CHANGE = 'chainx.accounts.change'; // 当前账户改变
export const CHAINX_ACCOUNT_REMOVE = 'chainx.accounts.remove';
export const CHAINX_ACCOUNT_SIGN_MESSAGE = 'chainx.accounts.sign.message';
export const CHAINX_TRANSACTION_SIGN = 'chainx.transaction.sign';
export const CHAINX_TRANSACTION_SIGN_AND_SEND = 'chainx.transaction.sign.send';
export const CHAINX_TRANSACTION_CALL_REQUEST =
  'chainx.transaction.call.request';
export const CHAINX_TRANSACTION_GET_TO_SIGN = 'chainx.transaction.get.to.sign';
export const CHAINX_TRANSACTION_SIGN_REJECT = 'chainx.transaction.sign.reject';
export const CHAINX_TRANSACTION_SEND = 'chainx.transaction.send';
export const CHAINX_NODE_CREATE = 'chainx.nodes.create';
export const CHAINX_NODE_ALL = 'chainx.nodes.all';
export const CHAINX_NODE_SELECT = 'chainx.nodes.select'; // 设置节点
export const CHAINX_NODE_CURRENT = 'chainx.nodes.current'; // 获取当前节点
export const CHAINX_NODE_CURRENT_CHANGE = 'chainx.nodes.current.change'; // 当前节点改变
export const CHAINX_NODE_REMOVE = 'chainx.nodes.remove';

export const INIT_NODES = [
  {
    name: 'w1.org',
    url: 'wss://w1.chainx.org/ws'
  },
  {
    name: 'w2.org',
    url: 'wss://w2.chainx.org/ws'
  },
  {
    name: 'HashQuark',
    url: 'wss://chainx.hashquark.io'
  },
  {
    name: 'BuildLinks',
    url: 'wss://chainx.buildlinks.org'
  },
  {
    name: 'w1.cn',
    url: 'wss://w1.chainx.org.cn/ws'
  }
];
