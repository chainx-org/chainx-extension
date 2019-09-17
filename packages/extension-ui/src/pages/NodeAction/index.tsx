import React, { useState } from 'react';
import { addChainxNode, removeChainxNode } from '../../messaging';
import ErrorMessage from '../../components/ErrorMessage';
import './nodeAction.scss';

function AddNode(props: any) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const {
    location: { query }
  } = props;

  let action = '';
  let title = '添加节点';
  if (query && query.type === 'edit') {
    action = 'edit';
    title = '修改节点';
  } else if (query && query.type === 'remove') {
    action = 'remove';
    title = '删除节点';
  }

  const check = () => {
    if (!name || !url) {
      setErrMsg('name and url are required');
      return false;
    }
    return true;
  };

  const enter = async () => {
    if (!check()) {
      return;
    }
    try {
      await addChainxNode(name, url);
      setErrMsg('');
      props.history.push('/');
    } catch (error) {
      setErrMsg(error.message);
      console.log('occur error: ', error);
    }
  };

  const deleteNode = async (name: string, url: string) => {
    try {
      removeChainxNode(name, url);
      setErrMsg('');
      props.history.push('/');
    } catch (error) {
      setErrMsg(error.message);
      console.log('occur error: ', error);
    }
  };

  return (
    <div className="node-action">
      <span className="title">{title}</span>
      {action !== 'remove' ? (
        <>
          <input
            className="input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="名称（12字符以内）"
          />
          <span className="node-url">节点地址（提供核心资产数据）</span>
          <input
            className="input"
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                enter();
              }
            }}
            placeholder="wss://w1.chainx.org/ws"
          />
          <button
            className="button button-yellow margin-top-40"
            onClick={() => enter()}
          >
            Confirm
          </button>
        </>
      ) : null}

      {action === 'remove' ? (
        <button
          className="button button-white margin-top-16"
          onClick={() => deleteNode(query.nodeInfo.name, query.nodeInfo.url)}
        >
          Delete
        </button>
      ) : null}
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </div>
  );
}

export default AddNode;
