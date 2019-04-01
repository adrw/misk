import { simpleSelect, simpleType } from "@misk/simpleredux"
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

export const requestBodyData = (
  props: { action: IWebActionInternal; tag: string } & IState & IDispatchProps
) => {
  const { requestType, types } = props.action
  const { tag } = props
  if (requestType && types && types[requestType] && types[requestType].fields) {
    const { fields } = types[requestType]
    const fieldsData = fields.map((field: IFieldTypeMetadata) => {
      const fieldKeys = safeNumberArray(
        simpleSelect(
          props.simpleForm,
          generateKeyTag({ field, nestPath: "/", tag }),
          "data",
          simpleType.array
        )
      )
      return fieldKeys.map((key: number) => {
        const keyData = simpleSelect(
          props.simpleForm,
          `${tag}::/${key}::Data`,
          "data"
        )
        console.log(field.name, key, keyData)
        return { [field.name]: keyData }
      })
    })
    return fieldsData
  } else {
    return []
  }
}
