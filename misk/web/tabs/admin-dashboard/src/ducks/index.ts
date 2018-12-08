import {
  dispatchSimpleNetwork,
  IDispatchSimpleNetwork,
  ISimpleNetworkState,
  SimpleNetworkReducer,
  simpleNetworkSelector,
  watchSimpleNetworkSagas
} from "@misk/core"
export { dispatchSimpleNetwork } from "@misk/core"
import {
  connectRouter,
  LocationChangeAction,
  RouterState
} from "connected-react-router"
import { History } from "history"
import { combineReducers, Reducer } from "redux"
import { all, fork } from "redux-saga/effects"

/**
 * Redux Store State
 */
export interface IState {
  router: Reducer<RouterState, LocationChangeAction>
  simpleNetwork: ISimpleNetworkState
}

/**
 * Dispatcher
 */
export interface IDispatchProps extends IDispatchSimpleNetwork {}

export const rootDispatcher: IDispatchProps = {
  ...dispatchSimpleNetwork
}

/**
 * State Selectors
 */
export const rootSelectors = (state: IState) => ({
  simpleNetwork: simpleNetworkSelector(state)
})

/**
 * Reducers
 */
export const rootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    simpleNetwork: SimpleNetworkReducer
  })

/**
 * Sagas
 */
export function* rootSaga() {
  yield all([fork(watchSimpleNetworkSagas)])
}



// import {
//   connectRouter,
//   LocationChangeAction,
//   RouterState
// } from "connected-react-router"
// import { History } from "history"
// import { combineReducers, Reducer } from "redux"
// import { all, fork } from "redux-saga/effects"
// import {
//   default as LoaderReducer,
//   ILoaderState,
//   watchLoaderSagas
// } from "./loader"
// export * from "./loader"

// /**
//  * Redux Store State
//  */
// export interface IState {
//   loader: ILoaderState
//   router: Reducer<RouterState, LocationChangeAction>
// }

// /**
//  * Reducers
//  */
// export const rootReducer = (history: History) =>
//   combineReducers({
//     loader: LoaderReducer,
//     router: connectRouter(history)
//   })

// /**
//  * Sagas
//  */
// export function* rootSaga() {
//   yield all([fork(watchLoaderSagas)])
// }
