import {
  Button,
  Collapse,
  ControlGroup,
  HTMLSelect,
  Icon,
  InputGroup,
  Intent,
  Label,
  Tag
} from "@blueprintjs/core"
import { IconNames } from "@blueprintjs/icons"
import {
  CodePreContainer,
  HTTPMethodDispatch,
  HTTPMethodIntent,
  HTTPStatusCodeIntent
} from "@misk/core"
import {
  onChangeFnCall,
  onChangeToggleFnCall,
  onClickFnCall,
  simpleSelect
} from "@misk/simpleredux"
import { HTTPMethod } from "http-method-enum"
import * as React from "react"
import { RequestFormComponent } from "../components"
import { IDispatchProps, IState, IWebActionInternal } from "../ducks"
import { requestBodyData } from "./utilities"

/**
 * Collapse wrapped Send a Request form for each Web Action card
 */
export const SendRequestCollapseComponent = (
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
  return (
    <Collapse isOpen={isOpen}>
      <InputGroup
        defaultValue={props.action.pathPattern}
        onChange={onChangeFnCall(props.simpleFormInput, `${tag}::URL`)}
        placeholder={
          "Request URL: absolute ( http://your.url.com/to/send/a/request/to/ ) or internal service endpoint ( /service/web/action )"
        }
        type={"url"}
      />
      <Collapse isOpen={methodHasBody}>
        <RequestFormComponent {...props} tag={tag} />
        <br />
      </Collapse>
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
            requestBodyData(props)
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
      <Collapse isOpen={requestBodyData(props).length > 0}>
        <CodePreContainer>
          {JSON.stringify(requestBodyData(props), null, 2)}
        </CodePreContainer>
      </Collapse>
      <Collapse
        isOpen={simpleSelect(props.simpleNetwork, `${tag}::Response`, "status")}
      >
        <Label>
          Response{" "}
          <Tag
            intent={HTTPStatusCodeIntent(
              simpleSelect(props.simpleNetwork, `${tag}::Response`, "status")[0]
            )}
          >
            {(
              simpleSelect(props.simpleNetwork, `${tag}::Response`, "status") ||
              []
            ).join(" ")}
          </Tag>{" "}
          <Tag
            intent={Intent.NONE}
            onClick={onChangeToggleFnCall(
              props.simpleFormToggle,
              `${tag}::ButtonRawResponse`,
              props.simpleForm
            )}
          >
            <span>
              Raw Response{" "}
              {simpleSelect(
                props.simpleForm,
                `${tag}::ButtonRawResponse`,
                "data"
              ) ? (
                <Icon icon={IconNames.CARET_DOWN} />
              ) : (
                <Icon icon={IconNames.CARET_RIGHT} />
              )}
            </span>
          </Tag>
        </Label>
      </Collapse>
      <Collapse
        isOpen={simpleSelect(props.simpleNetwork, `${tag}::Response`, "data")}
      >
        <CodePreContainer>
          {JSON.stringify(
            simpleSelect(props.simpleNetwork, `${tag}::Response`, "data"),
            null,
            2
          )}
        </CodePreContainer>
      </Collapse>
      <Collapse
        isOpen={simpleSelect(
          props.simpleForm,
          `${tag}::ButtonRawResponse`,
          "data"
        )}
      >
        <Label>Raw Network Redux State</Label>
        <CodePreContainer>
          {JSON.stringify(
            simpleSelect(props.simpleNetwork, `${tag}::Response`),
            null,
            2
          )}
        </CodePreContainer>
      </Collapse>
    </Collapse>
  )
}
