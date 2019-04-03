import { simpleSelect } from "@misk/simpleredux"
import HTTPMethod from "http-method-enum"
import { get, has, set } from "lodash"
import {
  IActionTypes,
  IDispatchProps,
  IFieldTypeMetadata,
  IState,
  IWebActionInternal
} from "../ducks"

export interface IFieldProps {
  field: IFieldTypeMetadata
  id: number
  nestPath: string
  tag: string
  types: IActionTypes
}

export interface IFieldMetadata {
  parent: string
  children: string[]
  id: string
  name: string
}

export const initializeKeyMap = (
  props: { tag: string } & IState & IDispatchProps
): void => {
  const { tag } = props
  const keyMap = simpleSelect(props.simpleForm, `${tag}::KeyMap`, "data")
  console.log("init", keyMap)
  if (!keyMap) {
    props.simpleFormInput(`${props.tag}::KeyMap`, {
      root: {
        children: [],
        key: "",
        name: "",
        parent: ""
      }
    })
  }
}

export interface IFieldMap {
  [key: string]: IFieldMetadata
}

export const addFieldToKeyMap = (
  props: {
    key: string
    name: string
    parent?: string
    tag: string
  } & IState &
    IDispatchProps
) => {
  const { key, name, parent, tag } = props
  initializeKeyMap(props)
  const keyMap: IFieldMap = simpleSelect(
    props.simpleForm,
    `${tag}::KeyMap`,
    "data"
  )
  console.log("add to keymap", key, name, parent, tag, keyMap)
  if (keyMap) {
    if (parent) {
      if (has(keyMap, [parent, "children"])) {
        set(
          keyMap,
          [parent, "children"],
          get(keyMap, [parent, "children"]) + [key]
        )
      }
      set(keyMap, key, { children: [], key, name, parent })

      // keyMap = keyMap.setIn(
      //   [parent, "children"],
      //   keyMap.get(parent).children.push(key)
      // )
      // keyMap = keyMap.set(key, { children: [], key, name, parent })
      console.log("add with parent", keyMap)
      props.simpleFormInput(`${props.tag}::KeyMap`, keyMap)
    } else {
      const root = get(keyMap, "root")
      set(keyMap, "root", { ...root, children: [...root.children, key] })
      set(keyMap, key, {
        children: [],
        key,
        name,
        parent: ""
      })
      // keyMap = keyMap.set("root", {
      //   children: fromJS([...keyMap.get("root").children, key]),
      //   key: "",
      //   name: "",
      //   parent: ""
      // })
      // keyMap = keyMap.set(key, {
      //   children: [],
      //   key,
      //   name,
      //   parent: ""
      // })
      console.log("add without parent", keyMap)
      props.simpleFormInput(`${props.tag}::KeyMap`, keyMap)
    }
  }
}

export const generateKeyTag = (props: {
  field: { name: string }
  nestPath: string
  tag: string
}) => `${props.tag}::${props.nestPath}${props.field.name}::Keys`

export const safeArray = (ids: null | number | number[]) => {
  if (
    typeof ids === "number" ||
    typeof ids === "object" ||
    typeof ids === "string"
  ) {
    return [ids]
  } else if (ids === null || typeof ids === "undefined") {
    return []
  } else {
    return ids
  }
}

export const requestBodyData = (
  props: { action: IWebActionInternal; tag: string } & IState & IDispatchProps
) => {
  return [] as string[]
  // const { requestType, types } = props.action
  // const { tag } = props
  // if (requestType && types && types[requestType] && types[requestType].fields) {
  //   const { fields } = types[requestType]
  //   const fieldsData = fields.map((field: IFieldTypeMetadata) => {
  //     const fieldKeys = safeArray(
  //       simpleSelect(
  //         props.simpleForm,
  //         generateKeyTag({ field, nestPath: "/", tag }),
  //         "data",
  //         simpleType.array
  //       )
  //     )
  //     const fieldKeyData = fieldKeys.map((key: number) => {
  //       const keyData = simpleSelect(
  //         props.simpleForm,
  //         `${tag}::/${key}::Data`,
  //         "data"
  //       )
  //       console.log(field.name, key, keyData)
  //       return keyData
  //     })
  //     if (fieldKeyData.length === 1) {
  //       return { [field.name]: fieldKeyData[0] }
  //     } else {
  //       return { [field.name]: fieldKeyData }
  //     }
  //   })
  //   return fieldsData
  // } else {
  //   return []
  // }
}

export const parseWebActionConstants = (
  props: { action: IWebActionInternal; tag: string } & IState & IDispatchProps
) => {
  const { tag } = props
  // Determine if Send Request form for the Web Action should be open
  const isOpen =
    simpleSelect(props.simpleForm, `${tag}::Request`, "data") || false
  const url = simpleSelect(props.simpleForm, `${tag}::URL`, "data")
  // Pre-populate the URL field with the action path pattern on open of request form
  if (isOpen && !url) {
    props.simpleFormInput(`${tag}::URL`, props.action.pathPattern)
  }
  const method: HTTPMethod =
    simpleSelect(props.simpleForm, `${tag}::Method`, "data") ||
    props.action.dispatchMechanism.reverse()[0]
  const methodHasBody =
    method === HTTPMethod.PATCH ||
    method === HTTPMethod.POST ||
    method === HTTPMethod.PUT
  return { isOpen, url, method, methodHasBody, tag }
}
