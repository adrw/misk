import {
  Button,
  Card,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
  Tooltip
} from "@blueprintjs/core"
import { IconNames } from "@blueprintjs/icons"
import {
  onChangeFnCall,
  onChangeToggleFnCall,
  simpleSelect,
  simpleType
} from "@misk/simpleredux"
import { OrderedSet } from "immutable"
import uniqueId from "lodash/uniqueId"
import * as React from "react"
import styled from "styled-components"
import {
  BaseFieldTypes,
  IDispatchProps,
  IFieldTypeMetadata,
  IState,
  IWebActionInternal,
  TypescriptBaseTypes
} from "../ducks"
import { generateKeyTag, IFieldProps, safeArray } from "./utilities"

const RequestFieldGroup = styled(Card)`
  margin-bottom: 10px;
`

const RequestFormGroup = styled(FormGroup)`
  margin: 0 !important;
`

const RepeatableFieldButton = (
  props: IFieldProps & IState & IDispatchProps
) => {
  const { repeated } = props.field
  const { id } = props
  const tag = generateKeyTag(props)
  const ids = safeArray(
    simpleSelect(props.simpleForm, tag, "data", simpleType.array)
  )
  if (repeated) {
    return (
      <div>
        <Button
          icon={IconNames.PLUS}
          onClick={onChangeFnCall(
            props.simpleFormInput,
            tag,
            OrderedSet(ids)
              .add(parseInt(uniqueId()))
              .toJS()
          )}
        />
        {ids && ids.length > 1 ? (
          <Button
            icon={IconNames.MINUS}
            onClick={onChangeFnCall(
              props.simpleFormInput,
              tag,
              OrderedSet(ids)
                .delete(id)
                .toJS()
            )}
          />
        ) : (
          <span />
        )}
      </div>
    )
  } else {
    return <span />
  }
}

const RequestFormField = (props: IFieldProps & IState & IDispatchProps) => {
  const { field, id, nestPath, tag } = props
  const { name, type } = field
  if (BaseFieldTypes.hasOwnProperty(type)) {
    if (BaseFieldTypes[type] === TypescriptBaseTypes.boolean) {
      // props.simpleFormInput(`${tag}::Meta${id}`, { name: field.name, id, type })
      return (
        <ControlGroup>
          <Tooltip content={type}>
            <Button>{name}</Button>
          </Tooltip>
          <RepeatableFieldButton {...props} id={id} nestPath={nestPath} />
          <Button
            intent={
              simpleSelect(
                props.simpleForm,
                `${tag}::${nestPath}${id}::Data`,
                "data",
                simpleType.boolean
              )
                ? Intent.PRIMARY
                : Intent.WARNING
            }
            onClick={onChangeToggleFnCall(
              props.simpleFormToggle,
              `${tag}::${nestPath}${id}::Data`,
              props.simpleForm
            )}
          >
            {simpleSelect(
              props.simpleForm,
              `${tag}::${nestPath}${id}::Data`,
              "data",
              simpleType.boolean
            ).toString()}
          </Button>
        </ControlGroup>
      )
    } else if (BaseFieldTypes[type] === TypescriptBaseTypes.number) {
      // props.simpleFormInput(`${tag}::Meta${id}`, { name: field.name, id, type })
      return (
        <ControlGroup>
          <Tooltip content={type}>
            <Button>{name}</Button>
          </Tooltip>
          <RepeatableFieldButton {...props} id={id} nestPath={nestPath} />
          <InputGroup
            onChange={onChangeFnCall(
              props.simpleFormInput,
              `${tag}::${nestPath}${id}::Data`
            )}
            placeholder={type}
            value={simpleSelect(
              props.simpleForm,
              `${tag}::${nestPath}${id}::Data`,
              "data"
            )}
          />
        </ControlGroup>
      )
    } else if (BaseFieldTypes[type] === TypescriptBaseTypes.string) {
      // props.simpleFormInput(`${tag}::Meta${id}`, { name: field.name, id, type })
      return (
        <ControlGroup>
          <Tooltip content={type}>
            <Button>{name}</Button>
          </Tooltip>
          <RepeatableFieldButton {...props} id={id} nestPath={nestPath} />
          <TextArea
            fill={true}
            onChange={onChangeFnCall(
              props.simpleFormInput,
              `${tag}::${nestPath}${id}::Data`
            )}
            placeholder={`${type}\nDrag bottom right corner of text area input to expand.`}
            value={simpleSelect(
              props.simpleForm,
              `${tag}::${nestPath}${id}::Data`,
              "data"
            )}
          />
        </ControlGroup>
      )
    } else {
      return (
        <span>
          Valid Base Field Type {type} has no handler for the corresponding
          Tyepscript Type {BaseFieldTypes[type]}
        </span>
      )
    }
  } else if (props.types.hasOwnProperty(type)) {
    const childrenIds = props.types[type].fields.map(
      (subField: IFieldTypeMetadata) => ({
        field: subField,
        id: parseInt(`${id}${uniqueId()}`)
      })
    )
    // props.simpleFormInput(`${tag}::Meta${id}`, { name: field.name, id, type })

    return (
      <div>
        <RepeatableFieldButton id={id} nestPath={nestPath} {...props} />
        <RequestFieldGroup>
          <RequestFormGroup label={`${name} (${type})`}>
            {childrenIds.map(
              (child: { id: number; field: IFieldTypeMetadata }) => {
                return (
                  <div>
                    <RequestFormFields
                      {...props}
                      field={child.field}
                      id={child.id}
                      nestPath={`${nestPath}${id}/`}
                      types={props.types}
                    />
                  </div>
                )
              }
            )}
          </RequestFormGroup>
        </RequestFieldGroup>
      </div>
    )
  } else {
    // props.simpleFormInput(`${tag}::Meta${id}`, { name: field.name, id, type })
    return (
      <div>
        <RepeatableFieldButton id={id} nestPath={nestPath} {...props} /> {name}:
        <RequestFormGroup label={`${name}:${JSON.stringify(type)}:${id}`}>
          <TextArea
            fill={true}
            onChange={onChangeFnCall(
              props.simpleFormInput,
              `${tag}::${nestPath}${id}::Data`
            )}
            placeholder={
              "Unparseable type. (JSON or Text).\nDrag bottom right corner of text area input to expand."
            }
          />
        </RequestFormGroup>
      </div>
    )
  }
}

const RequestFormFields = (props: IFieldProps & IState & IDispatchProps) => {
  const uid = props.id || parseInt(uniqueId())
  const keyTag = generateKeyTag(props)
  const ids = safeArray(
    simpleSelect(props.simpleForm, keyTag, "data", simpleType.array) ||
      (props.simpleFormInput(keyTag, OrderedSet([uid]).toJS()) && [uid])
  )
  return (
    <div>
      {ids.map((id: number) => (
        <RequestFormField {...props} id={id} />
      ))}
    </div>
  )
}

export const RequestFormComponent = (
  props: { action: IWebActionInternal; tag: string } & IState & IDispatchProps
) => {
  const { requestType, types } = props.action
  if (requestType && types && types[requestType] && types[requestType].fields) {
    const { fields } = types[requestType]
    for (let i = 0; i < fields.length; i++) {
      props.simpleFormInput(`${props.tag}::Meta${i}`, {
        index: i,
        name: fields[i].name,
        requestType
      })
    }
    return (
      <div>
        {fields.map((field: IFieldTypeMetadata, index: number) => (
          <RequestFormFields
            {...props}
            field={field}
            id={index}
            nestPath={"/"}
            types={types}
          />
        ))}
      </div>
    )
  } else {
    const { tag } = props
    return (
      <TextArea
        fill={true}
        onChange={onChangeFnCall(props.simpleFormInput, `${tag}::Body`)}
        placeholder={
          "Request Body (JSON or Text).\nDrag bottom right corner of text area input to expand."
        }
      />
    )
  }
}
