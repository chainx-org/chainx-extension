import { combineReducers } from 'redux';
import statusReducer from './statusSlice';
import intentionSlice from './intentionSlice';
import tradeSlice from './tradeSlice';

export default combineReducers({
  status: statusReducer,
  intentions: intentionSlice,
  trade: tradeSlice
});
