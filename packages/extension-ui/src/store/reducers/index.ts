import { combineReducers } from 'redux';
import statusReducer from './statusSlice';
import intentionSlice from './intentionSlice';
import tradeSlice from './tradeSlice';
import tx from './txSlice';
import assetReducer from './assetSlice';
import node from './nodeSlice';
import network from './networkSlice';

export default combineReducers({
  assets: assetReducer,
  status: statusReducer,
  intentions: intentionSlice,
  trade: tradeSlice,
  tx,
  node,
  network
});
