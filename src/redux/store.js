import { createStore } from 'redux';
import listReducer from '../redux/reducers';

const store = createStore(listReducer);

export default store;