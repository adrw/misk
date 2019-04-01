import { simpleSelect } from "@misk/simpleredux"
import HTTPMethod from "http-method-enum"
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

export const generateKeyTag = (props: {
  field: { name: string }
  nestPath: string
  tag: string
}) => `${props.tag}::${props.nestPath}${props.field.name}::Keys`

export const safeNumberArray = (ids: null | number | number[]) => {
  if (typeof ids === "number") {
    return [ids]
  } else if (ids === null || typeof ids === "undefined") {
    return []
  } else {
    return ids
  }
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
