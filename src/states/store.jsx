import { configureStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

const store = configureStore(reducers, {}, applyMiddleware(thunk))
export default store