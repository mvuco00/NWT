import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
//REDUCERS
import userReducer from "./reducers/userReducer";
import dataReducer from "./reducers/dataReducers";
import uiReducer from "./reducers/uiReducer";

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  user: userReducer, //sve iz userReducera ce bit u useru
  data: dataReducer,
  UI: uiReducer
});

const store = createStore(
  reducers,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
