import {
  createAction,
  defaultRootState,
  IAction,
  IRootState
} from "@misk/simpleredux"
import axios from "axios"
import { HTTPMethod } from "http-method-enum"
import { fromJS, Map, Set } from "immutable"
import { chain, get, uniqueId } from "lodash"
import { all, AllEffect, call, put, takeLatest } from "redux-saga/effects"

export const enum TypescriptBaseTypes {
  "any" = "any",
  "boolean" = "boolean",
  "enum" = "enum",
  "null" = "null",
  "number" = "number",
  "string" = "string"
}

export const enum KotlinTypes {
  "Boolean" = "Boolean",
  "Byte" = "Byte",
  "ByteString" = "ByteString",
  "Char" = "Char",
  "Double" = "Double",
  "Int" = "Int",
  "Long" = "Long",
  "Short" = "Short",
  "String" = "String"
}

export interface IBaseFieldTypes {
  [kotlinType: string]: TypescriptBaseTypes
}

export const BaseFieldTypes: IBaseFieldTypes = {
  [KotlinTypes.Boolean]: TypescriptBaseTypes.boolean,
  [KotlinTypes.Short]: TypescriptBaseTypes.number,
  [KotlinTypes.Int]: TypescriptBaseTypes.number,
  [KotlinTypes.Long]: TypescriptBaseTypes.number,
  [KotlinTypes.Double]: TypescriptBaseTypes.number,
  [KotlinTypes.ByteString]: TypescriptBaseTypes.string,
  [KotlinTypes.String]: TypescriptBaseTypes.string
}

export interface IFieldTypeMetadata {
  name: string
  repeated: boolean
  type: IBaseFieldTypes | any
}

export interface IActionTypes {
  [type: string]: {
    fields: IFieldTypeMetadata[]
  }
}

export interface IWebActionAPI {
  allowedServices: string[]
  allowedRoles: string[]
  applicationInterceptors: string[]
  dispatchMechanism: HTTPMethod
  function: string
  functionAnnotations: string[]
  name: string
  networkInterceptors: string[]
  parameterTypes: string[]
  pathPattern: string
  requestMediaTypes: string[]
  responseMediaType: string
  returnType: string
  requestType: string
  types: IActionTypes
}

export interface IWebActionInternal {
  allFields: string
  allowedRoles: string
  allowedServices: string
  applicationInterceptors: string[]
  authFunctionAnnotations: string[]
  dispatchMechanism: HTTPMethod[]
  function: string
  functionAnnotations: string[]
  name: string
  networkInterceptors: string[]
  nonAccessOrTypeFunctionAnnotations: string[]
  parameterTypes: string[]
  pathPattern: string
  requestMediaTypes: string[]
  responseMediaType: string
  returnType: string
  requestType: string
  types: IActionTypes
  typesMetadata: { [key: string]: ITypesFieldMetadata }
}

export interface ITypesFieldMetadata {
  parent: string
  children: Set<string>
  id: string
  name: string
  repeated: boolean
  kotlinType: KotlinTypes | null
  typescriptType: TypescriptBaseTypes | null
}

export interface ITypesMetadata {
  [key: string]: ITypesFieldMetadata
}

/**
 * Titlecase versions of IWebActionInternal fields for use in Filter UI
 */
export const WebActionInternalLabel: { [key: string]: string } = {
  "All Metadata": "allFields",
  "Allowed Roles": "allowedRoles",
  "Allowed Services": "allowedServices",
  "Application Interceptor": "applicationInterceptors",
  "Dispatch Mechanism": "dispatchMechanism",
  Function: "function",
  "Function Annotations": "functionAnnotations",
  Name: "name",
  "Network Interceptor": "networkInterceptors",
  "Parameter Types": "parameterTypes",
  "Path Pattern": "pathPattern",
  "Request Type": "requestMediaTypes",
  "Response Type": "responseMediaType"
}

/**
 * Actions
 * string enum of the defined actions that is used as type enforcement for Reducer and Sagas arguments
 */
export enum WEBACTIONS {
  ADD_REPEATED_FIELD = "WEBACTIONS_ADD_REPEATED_FIELD",
  REMOVE_REPEATED_FIELD = "WEBACTIONS_REMOVE_REPEATED_FIELD",
  METADATA = "WEBACTIONS_METADATA",
  SUCCESS = "WEBACTIONS_SUCCESS",
  FAILURE = "WEBACTIONS_FAILURE"
}

/**
 * Dispatch Object
 * Object of functions that dispatch Actions with standard defaults and any required passed in input
 * dispatch Object is used within containers to initiate any saga provided functionality
 */
export interface IWebActionsPayload {
  data?: any
  error: any
  fieldId?: string
  loading: boolean
  repeatedId?: string
  success: boolean
  webActionIndex?: number
  webActionMetadata?: any
}

export interface IDispatchWebActions {
  webActionsAdd: (
    repeatedId: string,
    webActionIndex: number,
    oldState: IWebActionsState
  ) => IAction<WEBACTIONS.ADD_REPEATED_FIELD, IWebActionsPayload>
  webActionsFailure: (
    error: any
  ) => IAction<WEBACTIONS.FAILURE, IWebActionsPayload>
  webActionsMetadata: () => IAction<WEBACTIONS.METADATA, IWebActionsPayload>
  webActionsRemove: (
    repeatedId: string,
    fieldId: string,
    webActionIndex: number,
    oldState: IWebActionsState
  ) => IAction<WEBACTIONS.REMOVE_REPEATED_FIELD, IWebActionsPayload>
  webActionsSuccess: (
    data: any
  ) => IAction<WEBACTIONS.SUCCESS, IWebActionsPayload>
}

export const dispatchWebActions: IDispatchWebActions = {
  webActionsAdd: (
    repeatedId: string,
    webActionIndex: number,
    oldState: IWebActionsState
  ) =>
    createAction<WEBACTIONS.ADD_REPEATED_FIELD, IWebActionsPayload>(
      WEBACTIONS.ADD_REPEATED_FIELD,
      {
        error: null,
        loading: true,
        repeatedId,
        success: false,
        webActionIndex,
        webActionMetadata: oldState.metadata
      }
    ),
  webActionsFailure: (error: any) =>
    createAction<WEBACTIONS.FAILURE, IWebActionsPayload>(WEBACTIONS.FAILURE, {
      ...error,
      loading: false,
      success: false
    }),
  webActionsMetadata: () =>
    createAction<WEBACTIONS.METADATA, IWebActionsPayload>(WEBACTIONS.METADATA, {
      error: null,
      loading: true,
      success: false
    }),
  webActionsRemove: (
    repeatedId: string,
    fieldId: string,
    webActionIndex: number,
    oldState: IWebActionsState
  ) =>
    createAction<WEBACTIONS.REMOVE_REPEATED_FIELD, IWebActionsPayload>(
      WEBACTIONS.REMOVE_REPEATED_FIELD,
      {
        error: null,
        fieldId,
        loading: true,
        repeatedId,
        success: false,
        webActionIndex,
        webActionMetadata: oldState.metadata
      }
    ),
  webActionsSuccess: (data: any) =>
    createAction<WEBACTIONS.SUCCESS, IWebActionsPayload>(WEBACTIONS.SUCCESS, {
      ...data,
      error: null,
      loading: false,
      success: true
    })
}

/**
 * Sagas are generating functions that consume actions and
 * pass either latest (takeLatest) or every (takeEvery) action
 * to a handling generating function.
 *
 * Handling function is where obtaining web resources is done
 * Web requests are done within try/catch so that
 *  if request fails: a failure action is dispatched
 *  if request succeeds: a success action with the data is dispatched
 * Further processing of the data should be minimized within the handling
 *  function to prevent unhelpful errors. Ie. a failed request error is
 *  returned but it actually was just a parsing error within the try/catch.
 */

function* handleAddRepeatedField(
  action: IAction<WEBACTIONS, IWebActionsPayload>
) {
  try {
    const { repeatedId, webActionIndex, webActionMetadata } = action.payload
    const { types, typesMetadata } = webActionMetadata[webActionIndex]
    let newTypesMetadata = fromJS(typesMetadata)
    const repeatedMetadata = newTypesMetadata.get(repeatedId)
    const repeatedChildId = uniqueId()
    newTypesMetadata = newTypesMetadata
      .setIn(
        [repeatedId, "children"],
        repeatedMetadata
          .get("children")
          .toSet()
          .add(repeatedChildId)
      )
      .mergeDeep(
        generateFieldTypesMetadata(
          {
            name: repeatedMetadata.get("name"),
            repeated: false,
            type: repeatedMetadata.get("kotlinType")
          },
          types,
          newTypesMetadata,
          repeatedChildId,
          repeatedId
        )
      )
      .map((metadata: any) =>
        fromJS(metadata)
          .toMap()
          .update("children", (c: any) => c.toSet())
      )
    const newWebAction = {
      ...webActionMetadata[webActionIndex],
      typesMetadata: newTypesMetadata
    }
    webActionMetadata[webActionIndex] = newWebAction
    yield put(
      dispatchWebActions.webActionsSuccess({
        metadata: webActionMetadata
      })
    )
  } catch (e) {
    yield put(dispatchWebActions.webActionsFailure({ error: { ...e } }))
  }
}

// const recursivelyDelete = (id: string, typesMetadata: Map<string, ITypesFieldMetadata>) => {
// let newTypesMetadata = typesMetadata
// const danglingChildren = typesMetadata.get(id).children
//   for (const i in danglingChildren) {
//    newTypesMetadata = newTypesMetadata.mergeDeep(recursivelyDelete(danglingChildren[i], newTypesMetadata))
// }
// return newTypesMetadata
// }

// return recursivelyDelete(fieldId, typesMetadata).setIn([repeatedId, "children"], typesMetadata.get(repeatedId).children.delete(fieldId))

function* handleRemoveRepeatedField(
  action: IAction<WEBACTIONS, IWebActionsPayload>
) {
  try {
    const {
      repeatedId,
      fieldId,
      webActionIndex: webAction,
      webActionMetadata
    } = action.payload
    const { typesMetadata } = webActionMetadata[webAction]
    const repeatedMetadata = typesMetadata.get(repeatedId)
    const danglingChildren = typesMetadata.getIn([fieldId, "children"])
    let newTypesMetadata = typesMetadata
      .delete(fieldId)
      .setIn(
        repeatedMetadata.id,
        buildTypeFieldMetadata(
          repeatedMetadata.children.delete(fieldId),
          repeatedMetadata.id,
          repeatedMetadata.name,
          repeatedMetadata.repeated,
          repeatedMetadata.parent,
          repeatedMetadata.kotlinType,
          repeatedMetadata.typescriptType
        )
      )
    for (const i in danglingChildren) {
      if (danglingChildren[i]) {
        newTypesMetadata = newTypesMetadata.delete(danglingChildren[i])
      }
    }
    const newWebactionMetadata = webActionMetadata
    const newWebAction = {
      ...newWebactionMetadata[webAction],
      typesMetadata: newTypesMetadata
    }
    newWebactionMetadata[webAction] = newWebAction
    yield put(
      dispatchWebActions.webActionsSuccess({
        metadata: newWebactionMetadata
      })
    )
  } catch (e) {
    yield put(dispatchWebActions.webActionsFailure({ error: { ...e } }))
  }
}

/**
 * hash for groupBy that provides a string hash that uses an aggregate of
 * non-dispatchMechanism metadata. This allows coalescing of web action entries
 * that only differ by dispatchMechanism (GET, POST, PUT...)
 */
const groupByWebActionHash = (
  action: IWebActionInternal | IWebActionAPI
): string =>
  "" +
  action.pathPattern +
  action.function +
  action.functionAnnotations +
  action.applicationInterceptors +
  action.networkInterceptors +
  action.parameterTypes +
  action.requestMediaTypes +
  action.responseMediaType +
  action.returnType

const buildTypeFieldMetadata = (
  children: Set<string> = Set(),
  id: string = "",
  name: string = "",
  repeated: boolean = false,
  parent: string = "0",
  kotlinType: KotlinTypes | null = null,
  typescriptType: TypescriptBaseTypes | null = null
): ITypesFieldMetadata => ({
  children,
  id,
  kotlinType,
  name,
  parent,
  repeated,
  typescriptType
})

const generateFieldTypesMetadata = (
  field: IFieldTypeMetadata,
  types: IActionTypes,
  typesMetadata: Map<string, ITypesFieldMetadata>,
  id: string = uniqueId(),
  parent: string = ""
): Map<string, ITypesFieldMetadata> => {
  const { name, repeated, type } = field
  if (repeated) {
    const repeatedChildId = uniqueId()
    return typesMetadata
      .set(
        id,
        buildTypeFieldMetadata(
          Set().add(repeatedChildId),
          id,
          name,
          true,
          parent,
          type
        )
      )
      .mergeDeep(
        generateFieldTypesMetadata(
          { ...field, repeated: false },
          types,
          typesMetadata,
          repeatedChildId,
          id
        )
      )
  } else if (BaseFieldTypes.hasOwnProperty(type)) {
    if (
      BaseFieldTypes[type] === TypescriptBaseTypes.boolean ||
      BaseFieldTypes[type] === TypescriptBaseTypes.number ||
      BaseFieldTypes[type] === TypescriptBaseTypes.string
    ) {
      return typesMetadata.mergeDeep(
        Map<string, ITypesFieldMetadata>().set(
          id,
          buildTypeFieldMetadata(
            Set(),
            id,
            name,
            repeated,
            parent,
            type,
            BaseFieldTypes[type]
          )
        )
      )
    } else {
      console.log(
        `Valid Base Field Type ${type} has no handler for the corresponding Tyepscript Type ${
          BaseFieldTypes[type]
        }`
      )
      return typesMetadata
    }
  } else if (types.hasOwnProperty(type)) {
    const fields = types[type].fields
    let childIds = Set()
    let subMap = typesMetadata
    for (const subField in fields) {
      if (fields.hasOwnProperty(subField)) {
        const childId = uniqueId()
        childIds = childIds.add(childId)
        subMap = subMap.mergeDeep(
          generateFieldTypesMetadata(
            fields[subField],
            types,
            typesMetadata,
            childId,
            id
          )
        )
      }
    }
    return typesMetadata
      .set(
        id,
        buildTypeFieldMetadata(
          childIds,
          id,
          name,
          repeated,
          parent,
          type,
          BaseFieldTypes[type]
        )
      )
      .mergeDeep(subMap)
  } else {
    return typesMetadata.set(
      id,
      buildTypeFieldMetadata(
        Set(),
        id,
        name,
        repeated,
        parent,
        type,
        BaseFieldTypes[type]
      )
    )
  }
}

const generateTypesMetadata = (
  action: IWebActionAPI
): Map<string, ITypesFieldMetadata> => {
  const { requestType, types } = action
  let typesMetadata = Map<string, ITypesFieldMetadata>().set(
    "0",
    buildTypeFieldMetadata(Set(), "0")
  )
  if (requestType && types && get(types, requestType)) {
    const { fields } = get(types, requestType)
    for (const field in fields) {
      if (fields.hasOwnProperty(field)) {
        const id = uniqueId()
        typesMetadata = typesMetadata.mergeDeep(
          generateFieldTypesMetadata(
            fields[field],
            types,
            typesMetadata,
            id,
            "0"
          )
        )
        typesMetadata = typesMetadata.setIn(
          ["0", "children"],
          typesMetadata.getIn(["0", "children"]).add(id)
        )
      }
    }
    return typesMetadata
  } else {
    return Map<string, ITypesFieldMetadata>().set(
      "0",
      buildTypeFieldMetadata(
        Set(),
        uniqueId(),
        "",
        false,
        "",
        KotlinTypes.String,
        TypescriptBaseTypes.string
      )
    )
  }
}

function* handleMetadata() {
  try {
    // const { data } = yield call(axios.get, "/api/webaction/metadata")
    const { data } = yield call(
      axios.get,
      "https://raw.githubusercontent.com/adrw/misk-web/adrw/20190325.WebActionsExampleData/examples/data/demo/webactions.json"
    )
    const { webActionMetadata } = data
    const metadata = chain(webActionMetadata)
      .map((action: IWebActionAPI) => {
        const authFunctionAnnotations = action.functionAnnotations.filter(
          a => a.includes("Access") || a.includes("authz")
        )
        const nonAccessOrTypeFunctionAnnotations = action.functionAnnotations.filter(
          a =>
            !(
              a.includes("RequestContentType") ||
              a.includes("ResponseContentType") ||
              a.includes("Access") ||
              a.includes("authz") ||
              a.toUpperCase().includes(HTTPMethod.DELETE) ||
              a.toUpperCase().includes(HTTPMethod.GET) ||
              a.toUpperCase().includes(HTTPMethod.HEAD) ||
              a.toUpperCase().includes(HTTPMethod.PATCH) ||
              a.toUpperCase().includes(HTTPMethod.POST) ||
              a.toUpperCase().includes(HTTPMethod.PUT)
            )
        )
        const emptyAllowedArrayValue =
          authFunctionAnnotations.length > 0 &&
          authFunctionAnnotations[0].includes("Unauthenticated")
            ? "All"
            : "None"
        const allowedRoles =
          action.allowedRoles && action.allowedRoles.length > 0
            ? action.allowedRoles.join(", ")
            : emptyAllowedArrayValue

        const allowedServices =
          action.allowedServices && action.allowedServices.length > 0
            ? action.allowedServices.join(", ")
            : emptyAllowedArrayValue
        return {
          ...action,
          allFields: JSON.stringify(action),
          allowedRoles,
          allowedServices,
          authFunctionAnnotations,
          dispatchMechanism: [action.dispatchMechanism],
          function: action.function.split("fun ").pop(),
          nonAccessOrTypeFunctionAnnotations,
          typesMetadata: generateTypesMetadata(action)
        }
      })
      .groupBy(groupByWebActionHash)
      .map((actions: IWebActionInternal[]) => {
        const dispatchMechanism = chain(actions)
          .flatMap(action => action.dispatchMechanism)
          // remove duplicate identical dispatchMechanisms that come from
          // duplicate installation of the same webAction
          .uniq()
          .value()
        const mergedAction = actions[0]
        mergedAction.dispatchMechanism = dispatchMechanism.sort().reverse()
        return mergedAction
      })
      .sortBy(["name", "pathPattern"])
      .value()
    // TODO(adrw) build index of keyspace for filterable fields
    console.log("webact2", metadata)
    yield put(dispatchWebActions.webActionsSuccess({ metadata }))
  } catch (e) {
    yield put(dispatchWebActions.webActionsFailure({ error: { ...e } }))
  }
}

export function* watchWebActionsSagas(): IterableIterator<AllEffect> {
  yield all([
    takeLatest(WEBACTIONS.ADD_REPEATED_FIELD, handleAddRepeatedField),
    takeLatest(WEBACTIONS.REMOVE_REPEATED_FIELD, handleRemoveRepeatedField),
    takeLatest(WEBACTIONS.METADATA, handleMetadata)
  ])
}

/**
 * Initial State
 * Reducer merges all changes from dispatched action objects on to this initial state
 */
const initialState = defaultRootState("webActions")

/**
 * Duck Reducer
 * Merges dispatched action objects on to the existing (or initial) state to generate new state
 */
export const WebActionsReducer = (
  state = initialState,
  action: IAction<WEBACTIONS, {}>
) => {
  switch (action.type) {
    case WEBACTIONS.ADD_REPEATED_FIELD:
    case WEBACTIONS.REMOVE_REPEATED_FIELD:
    case WEBACTIONS.FAILURE:
    case WEBACTIONS.METADATA:
    case WEBACTIONS.SUCCESS:
      return state.merge(action.payload)
    default:
      return state
  }
}

/**
 * State Interface
 * Provides a complete Typescript interface for the object on state that this duck manages
 * Consumed by the root reducer in ./ducks index to update global state
 * Duck state is attached at the root level of global state
 */
export interface IWebActionsState extends IRootState {
  metadata: IWebActionInternal[]
  [key: string]: any
}

export interface IWebActionsImmutableState {
  toJS: () => IWebActionsState
}
