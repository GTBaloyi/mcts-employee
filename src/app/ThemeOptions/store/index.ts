import { combineReducers } from 'redux';
import { ConfigReducer } from './config.reducer';

export class DashboardUIState {
  config;
};

export const rootReducer = combineReducers<DashboardUIState>({
  config: ConfigReducer,
});


