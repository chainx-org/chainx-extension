import React, { useState, useEffect } from 'react';
import { addChainxNode, removeChainxNode } from '../../messaging';
import ErrorMessage from '../../components/ErrorMessage';
import { TextInput } from '@chainx/ui';
import './nodeAction.scss';
import { isTestNetSelector } from '@chainx/extension-ui/store/reducers/networkSlice';
import { useDispatch, useSelector } from 'react-redux';
import initNodes, { TIMEOUT } from '@chainx/extension-ui/shared/nodeUtils';
import {
  mainNetNodesSelector,
  testNetNodesSelector
} from '@chainx/extension-ui/store/reducers/nodeSlice';
import { setShowNodeMenu } from '@chainx/extension-ui/store/reducers/statusSlice';
import { fetchFromWs } from '@chainx/extension-ui/shared';
import { ButtonLine, Title } from '@chainx/extension-ui/components/styled';
import { PrimaryButton } from '@chainx/ui/dist';

function AddNode(props: any) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const isTestNet = useSelector(isTestNetSelector);
  let nodeList = useSelector(
    isTestNet ? testNetNodesSelector : mainNetNodesSelector
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setShowNodeMenu(false));
  }, [dispatch]);

  const {
    location: { query }
  } = props;

  let action = '';
  let title = 'Add node';
  if (query && query.type === 'edit') {
    action = 'edit';
    title = 'Edit node';
  } else if (query && query.type === 'remove') {
    action = 'remove';
    title = 'Delete node';
  }

  const enter = async () => {
    if (!name || !url) {
      setErrMsg('name and url are required');
      return;
    }

    try {
      await fetchFromWs({
        url: url,
        method: 'system_health',
        timeOut: TIMEOUT
      });
    } catch (e) {
      setErrMsg('Node not available');
      return;
    }

    try {
      await addChainxNode(name, url, isTestNet);
      props.history.push('/');
      await initNodes();
      setErrMsg('');
    } catch (error) {
      setErrMsg(error.message);
    }
  };

  const deleteNode = async (name: string, url: string) => {
    if (nodeList.length < 2) {
      setErrMsg('can not remove the last node');
      return;
    }
    try {
      await removeChainxNode(name, url, isTestNet);
      props.history.push('/');
      await initNodes();
      setErrMsg('');
    } catch (error) {
      setErrMsg(error.message);
    }
  };

  return (
    <div className="node-action">
      <Title>{title}</Title>
      {action !== 'remove' ? (
        <>
          <TextInput
            showClear={false}
            className="fixed-width"
            value={name}
            onChange={setName}
            placeholder="Name(12 characters max)"
          />
          <span className="node-url">Node address</span>
          <TextInput
            showClear={false}
            className="fixed-width"
            value={url}
            onChange={setUrl}
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
      ) : (
        <ButtonLine>
          <PrimaryButton
            size="large"
            onClick={() => {
              deleteNode(query.nodeInfo.name, query.nodeInfo.url);
            }}
          >
            Delete
          </PrimaryButton>
        </ButtonLine>
      )}
      {errMsg ? <ErrorMessage msg={errMsg} /> : null}
    </div>
  );
}

export default AddNode;
