import { combineReducers } from 'redux';
import statusReducer from './statusSlice';

export default combineReducers({
  status: statusReducer
});
