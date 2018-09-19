import { createAction, IMiskAction } from "@misk/common"
import axios from "axios"
import { fromJS, Map } from "immutable"
import { all, call, put, takeLatest } from "redux-saga/effects"
const dayjs = require("dayjs")

/**
 * Actions
 */
interface IActionType {
  CONFIG: CONFIG
}

export enum CONFIG {
  FAILURE = "CONFIG_FAILURE",
  GET_ALL = "CONFIG_GET_ALL",
  SUCCESS = "CONFIG_SUCCESS"
}

export const dispatchConfig = {
  failure: (error: any) => createAction(CONFIG.FAILURE, { ...error, loading: false, success: false }),
  getAll: (url: string) => createAction(CONFIG.GET_ALL, { url, loading: true, success: false, error: null }),
  success: (data: any) => createAction(CONFIG.SUCCESS, { ...data, loading: false, success: true, error: null }),
}

/**
 * Reducer
 * @param state 
 * @param action 
 */
export interface IConfigState {
  resources: any
  status: string
  toJS: () => any
}

const initialState = fromJS({
  data: Map(),
  error: null,
  loading: false,
  success: false,
})

export default function ConfigReducer (state = initialState, action: IMiskAction<string, {}>) {
  switch (action.type) {
    case CONFIG.GET_ALL:
    case CONFIG.SUCCESS:
    case CONFIG.FAILURE:
      return state.merge(action.payload)
    default:
      return state
  }
}

/**
 * Sagas
 */
const dateFormat = "YYYY-MM-DD HH:mm:ss"

function * handleGetAll (action: IMiskAction<IActionType, { url: string}>) {
  const { url } = action.payload
  const resources: any = []
  let data: any = {}
  try {
    const response = yield call(axios.get, url)
    data = response.data

    resources.push({name: "live-config.yaml", file: data.effective_config})
    Object.entries(data.yaml_files).forEach(([key,value]) => {
      resources.push({name: key, file: value})
    })
    yield put(dispatchConfig.success({
      data,
      lastOnline: dayjs().format(dateFormat),
      resources,
      status: `Online as of: ${dayjs().format(dateFormat)}`
      }))
  } catch (e) {
    yield put(dispatchConfig.failure({ 
      error: { ...e }
     }))
  }
}

export function * watchConfigSagas () {
  yield all([
    takeLatest(CONFIG.GET_ALL, handleGetAll)
  ])
}
