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

  const title = query && query.type === 'edit' ? '修改节点' : '添加节点'

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
    const result = await addChainxNode(name, url).catch(error => {
      setErrMsg(error.message);
      console.log('occur error: ', error);
      return;
    });
    setErrMsg('');
    console.log('result ', result);
  };

  const deleteNode = async (name: string, url: string) => {
    removeChainxNode(name, url)
  }

  return (
    <div className="node-action">
      <span className="title">{title}</span>
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
      {
        query && query.type === 'edit' ? 
        <button className="button button-white margin-top-16"
          onClick={() => deleteNode(query.nodeInfo.name, query.nodeInfo.url)}
        >Delete</button>
        :
        null
      }
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </div>
  );
}

export default AddNode;
