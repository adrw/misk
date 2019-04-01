import {
  Collapse,
  Icon,
  InputGroup,
  Intent,
  Label,
  Tag
} from "@blueprintjs/core"
import { IconNames } from "@blueprintjs/icons"
import { CodePreContainer, HTTPStatusCodeIntent } from "@misk/core"
import {
  onChangeFnCall,
  onChangeToggleFnCall,
  simpleSelect
} from "@misk/simpleredux"
import * as React from "react"
import { RequestFormComponent } from "../components"
import { IDispatchProps, IState, IWebActionInternal } from "../ducks"
import { RequestBodySendComponent } from "./RequestBodySendComponent"
import { parseWebActionConstants } from "./utilities"

/**
 * Collapse wrapped Send a Request form for each Web Action card
 */
export const SendRequestCollapseComponent = (
  props: { action: IWebActionInternal; tag: string } & IState & IDispatchProps
) => {
  const { isOpen, methodHasBody, tag } = parseWebActionConstants(props)
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
      <RequestBodySendComponent {...props} tag={tag} />
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
