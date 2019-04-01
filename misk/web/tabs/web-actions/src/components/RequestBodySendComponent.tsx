import {
  Button,
  Collapse,
  ControlGroup,
  HTMLSelect,
  Label,
  Tag
} from "@blueprintjs/core"
import {
  CodePreContainer,
  HTTPMethodDispatch,
  HTTPMethodIntent
} from "@misk/core"
import {
  onChangeFnCall,
  onClickFnCall,
  simpleSelect,
  simpleType
} from "@misk/simpleredux"
import * as React from "react"
import {
  IDispatchProps,
  IFieldTypeMetadata,
  IState,
  IWebActionInternal
} from "../ducks"
import {
  generateKeyTag,
  parseWebActionConstants,
  safeNumberArray
} from "./utilities"

const selectTypedData = (
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
        return keyData
      })
    })
    return fieldsData
  } else {
    return []
  }
}

export const RequestBodySendComponent = (
  props: { action: IWebActionInternal; tag: string } & IState & IDispatchProps
) => {
  const { requestType, types } = props.action
  const { url, method, tag } = parseWebActionConstants(props)
  const typedData = selectTypedData(props)
  if (requestType && types && types[requestType] && types[requestType].fields) {
    return (
      <div>
        <ControlGroup>
          <HTMLSelect
            large={true}
            onChange={onChangeFnCall(props.simpleFormInput, `${tag}::Method`)}
            options={props.action.dispatchMechanism.sort()}
            value={method}
          />
          <Button
            large={true}
            onClick={onClickFnCall(
              HTTPMethodDispatch(props)[method],
              `${tag}::Response`,
              url,
              typedData
            )}
            intent={HTTPMethodIntent[method]}
            loading={simpleSelect(
              props.simpleNetwork,
              `${tag}::Response`,
              "loading"
            )}
            text={"Submit"}
          />
        </ControlGroup>
        <Label>
          Request <Tag>{url}</Tag>
        </Label>
        <Collapse isOpen={typedData.length > 0}>
          <CodePreContainer>
            {JSON.stringify(typedData, null, 2)}
          </CodePreContainer>
        </Collapse>
      </div>
    )
  } else {
    return (
      <div>
        <ControlGroup>
          <HTMLSelect
            large={true}
            onChange={onChangeFnCall(props.simpleFormInput, `${tag}::Method`)}
            options={props.action.dispatchMechanism.sort()}
            value={method}
          />
          <Button
            large={true}
            onClick={onClickFnCall(
              HTTPMethodDispatch(props)[method],
              `${tag}::Response`,
              url,
              simpleSelect(props.simpleForm, `${tag}::Body`, "data")
            )}
            intent={HTTPMethodIntent[method]}
            loading={simpleSelect(
              props.simpleNetwork,
              `${tag}::Response`,
              "loading"
            )}
            text={"Submit"}
          />
        </ControlGroup>
        <Label>
          Request <Tag>{url}</Tag>
        </Label>
        <Collapse
          isOpen={simpleSelect(props.simpleForm, `${tag}::Body`, "data")}
        >
          <CodePreContainer>
            {JSON.stringify(
              simpleSelect(props.simpleForm, `${tag}::Body`, "data"),
              null,
              2
            )}
          </CodePreContainer>
        </Collapse>
      </div>
    )
  }
}
