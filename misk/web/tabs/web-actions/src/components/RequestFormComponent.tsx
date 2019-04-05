import {
  Button,
  Card,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
  Pre,
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
import findIndex from "lodash/findIndex"
import * as React from "react"
import styled from "styled-components"
import {
  IDispatchProps,
  IState,
  ITypesFieldMetadata,
  IWebActionInternal,
  TypescriptBaseTypes
} from "../ducks"

const RequestFieldGroup = styled(Card)`
  margin-bottom: 10px;
`

const RequestFormGroup = styled(FormGroup)`
  margin: 0 !important;
`

// import {
//   Button,
//   Card,
//   ControlGroup,
//   FormGroup,
//   InputGroup,
//   Intent,
//   TextArea,
//   Tooltip
// } from "@blueprintjs/core"
// import { IconNames } from "@blueprintjs/icons"
// import {
//   onChangeFnCall,
//   onChangeToggleFnCall,
//   simpleSelect,
//   simpleType
// } from "@misk/simpleredux"
// import { OrderedSet } from "immutable"
// import uniqueId from "lodash/uniqueId"
// import * as React from "react"
// import styled from "styled-components"
// import {
//   BaseFieldTypes,
//   IActionTypes,
//   IDispatchProps,
//   IFieldTypeMetadata,
//   IState,
//   IWebActionInternal,
//   TypescriptBaseTypes
// } from "../ducks"

// interface IFieldProps {
//   field: IFieldTypeMetadata
//   id: number
//   nestPath: string
//   tag: string
//   types: IActionTypes
// }

// const generateKeyTag = (props: IFieldProps) =>
//   `${props.tag}::${props.nestPath}${props.field.name}::Keys`

// const safeNumberArray = (ids: number | number[]) => {
//   if (typeof ids === "number") {
//     return [ids]
//   } else {
//     return ids
//   }
// }

// const RepeatableFieldButton = (
//   props: IFieldProps & IState & IDispatchProps
// ) => {
//   const { repeated } = props.field
//   const { id } = props
//   const tag = generateKeyTag(props)
//   const ids = safeNumberArray(
//     simpleSelect(props.simpleForm, tag, "data", simpleType.array)
//   )
//   if (repeated) {
//     return (
//       <div>
//         <Button
//           icon={IconNames.PLUS}
//           onClick={onChangeFnCall(
//             props.simpleFormInput,
//             tag,
//             OrderedSet(ids)
//               .add(parseInt(uniqueId()))
//               .toJS()
//           )}
//         />
//         {ids && ids.length > 1 ? (
//           <Button
//             icon={IconNames.MINUS}
//             onClick={onChangeFnCall(
//               props.simpleFormInput,
//               tag,
//               OrderedSet(ids)
//                 .delete(id)
//                 .toJS()
//             )}
//           />
//         ) : (
//           <span />
//         )}
//       </div>
//     )
//   } else {
//     return <span />
//   }
// }

// const RequestFormField = (props: IFieldProps & IState & IDispatchProps) => {
//   const { field, id, nestPath, tag } = props
//   const { name, type } = field
//   if (BaseFieldTypes.hasOwnProperty(type)) {
//     if (BaseFieldTypes[type] === TypescriptBaseTypes.boolean) {
//       return (
//         <ControlGroup>
//           <Tooltip content={type}>
//             <Button>{name}</Button>
//           </Tooltip>
//           <RepeatableFieldButton {...props} id={id} nestPath={nestPath} />
//           <Button
//             intent={
//               simpleSelect(
//                 props.simpleForm,
//                 `${tag}::${nestPath}${id}::Data`,
//                 "data",
//                 simpleType.boolean
//               )
//                 ? Intent.PRIMARY
//                 : Intent.WARNING
//             }
//             onClick={onChangeToggleFnCall(
//               props.simpleFormToggle,
//               `${tag}::${nestPath}${id}::Data`,
//               props.simpleForm
//             )}
//           >
//             {simpleSelect(
//               props.simpleForm,
//               `${tag}::${nestPath}${id}::Data`,
//               "data",
//               simpleType.boolean
//             ).toString()}
//           </Button>
//         </ControlGroup>
//       )
//     } else if (BaseFieldTypes[type] === TypescriptBaseTypes.number) {
//       return (
//         <ControlGroup>
//           <Tooltip content={type}>
//             <Button>{name}</Button>
//           </Tooltip>
//           <RepeatableFieldButton {...props} id={id} nestPath={nestPath} />
//           <InputGroup
//             onChange={onChangeFnCall(
//               props.simpleFormInput,
//               `${tag}::${nestPath}${id}::Data`
//             )}
//             placeholder={type}
//             value={simpleSelect(
//               props.simpleForm,
//               `${tag}::${nestPath}${id}::Data`,
//               "data"
//             )}
//           />
//         </ControlGroup>
//       )
//     } else if (BaseFieldTypes[type] === TypescriptBaseTypes.string) {
//       return (
//         <ControlGroup>
//           <Tooltip content={type}>
//             <Button>{name}</Button>
//           </Tooltip>
//           <RepeatableFieldButton {...props} id={id} nestPath={nestPath} />
//           <TextArea
//             fill={true}
//             onChange={onChangeFnCall(
//               props.simpleFormInput,
//               `${tag}::${nestPath}${id}::Data`
//             )}
//             placeholder={`${type}\nDrag bottom right corner of text area input to expand.`}
//             value={simpleSelect(
//               props.simpleForm,
//               `${tag}::${nestPath}${id}::Data`,
//               "data"
//             )}
//           />
//         </ControlGroup>
//       )
//     } else {
//       return (
//         <span>
//           Valid Base Field Type {type} has no handler for the corresponding
//           Tyepscript Type {BaseFieldTypes[type]}
//         </span>
//       )
//     }
//   } else if (props.types.hasOwnProperty(type)) {
//     return (
//       <div>
//         <RepeatableFieldButton id={id} nestPath={nestPath} {...props} />
//         <RequestFieldGroup>
//           <RequestFormGroup label={`${name} (${type})`}>
//             {props.types[type].fields.map((field: IFieldTypeMetadata) => {
//               return (
//                 <div>
//                   <RequestFormFields
//                     {...props}
//                     field={field}
//                     id={parseInt(`${id}${uniqueId()}`)}
//                     nestPath={`${nestPath}${id}/`}
//                     types={props.types}
//                   />
//                 </div>
//               )
//             })}
//           </RequestFormGroup>
//         </RequestFieldGroup>
//       </div>
//     )
//   } else {
//     return (
//       <div>
//         <RepeatableFieldButton id={id} nestPath={nestPath} {...props} /> {name}:
//         <RequestFormGroup label={`${name}:${JSON.stringify(type)}:${id}`}>
//           <TextArea
//             fill={true}
//             onChange={onChangeFnCall(
//               props.simpleFormInput,
//               `${tag}::${nestPath}${id}::Data`
//             )}
//             placeholder={
//               "Unparseable type. (JSON or Text).\nDrag bottom right corner of text area input to expand."
//             }
//           />
//         </RequestFormGroup>
//       </div>
//     )
//   }
// }

// const RequestFormFields = (props: IFieldProps & IState & IDispatchProps) => {
//   const uid = props.id || parseInt(uniqueId())
//   const keyTag = generateKeyTag(props)
//   const ids = safeNumberArray(
//     simpleSelect(props.simpleForm, keyTag, "data", simpleType.array) ||
//       (props.simpleFormInput(keyTag, OrderedSet([uid]).toJS()) && [uid])
//   )
//   return (
//     <div>
//       {ids.map((id: number) => (
//         <RequestFormField {...props} id={id} />
//       ))}
//     </div>
//   )
// }

const RepeatableFieldButton = (
  props: {
    action: IWebActionInternal
    id: string
    typesMetadata: { [key: string]: ITypesFieldMetadata }
  } & IState &
    IDispatchProps
) => {
  const { action, id, typesMetadata } = props
  const metadata = typesMetadata[id]
  if (metadata.repeated) {
    return (
      <div>
        <Button
          icon={IconNames.PLUS}
          onClick={onChangeFnCall(
            props.webActionsAdd,
            id,
            findIndex(
              props.webActions.toJS().metadata,
              (iteratedAction: IWebActionInternal) =>
                iteratedAction.allFields === action.allFields
            ),
            props.webActions
          )}
        />
        {/* {typesMetadata.get(id).children.size > 1 ? (
              <Button
                icon={IconNames.MINUS}
                onClick={onChangeFnCall(props.webActionsRemove, id)}
              />
            ) : (
              <span />
            )} */}
      </div>
    )
  } else {
    return <span />
  }
}

const RequestFormFieldBuilder = (
  props: {
    action: IWebActionInternal
    id: string
    tag: string
    typesMetadata: { [key: string]: ITypesFieldMetadata }
  } & IState &
    IDispatchProps
) => {
  const { id, tag, typesMetadata } = props
  console.log(typesMetadata)
  const metadata = typesMetadata[id]
  console.log(metadata)
  const { children, kotlinType, name, repeated, typescriptType } = metadata
  console.log(kotlinType, repeated, typescriptType)

  if (typescriptType === null) {
    return (
      <div>
        <RepeatableFieldButton {...props} id={id} />
        <RequestFieldGroup>
          <RequestFormGroup label={`${name} (${kotlinType})`}>
            {children.map((id: string) => (
              <RequestFormFieldBuilder {...props} id={id} />
            ))}
          </RequestFormGroup>
        </RequestFieldGroup>
      </div>
    )
  } else if (typescriptType === TypescriptBaseTypes.boolean) {
    return (
      <ControlGroup>
        <Tooltip content={kotlinType}>
          <Button>{name}</Button>
        </Tooltip>
        <RepeatableFieldButton {...props} id={id} />
        <Button
          intent={
            simpleSelect(
              props.simpleForm,
              `${tag}::${id}`,
              "data",
              simpleType.boolean
            )
              ? Intent.PRIMARY
              : Intent.WARNING
          }
          onClick={onChangeToggleFnCall(
            props.simpleFormToggle,
            `${tag}::${id}`,
            props.simpleForm
          )}
        >
          {simpleSelect(
            props.simpleForm,
            `${tag}::${id}`,
            "data",
            simpleType.boolean
          ).toString()}
        </Button>
      </ControlGroup>
    )
  } else if (typescriptType === TypescriptBaseTypes.number) {
    return (
      <ControlGroup>
        <Tooltip content={kotlinType}>
          <Button>{name}</Button>
        </Tooltip>
        <RepeatableFieldButton {...props} id={id} />
        <InputGroup
          onChange={onChangeFnCall(props.simpleFormInput, `${tag}::${id}`)}
          placeholder={kotlinType}
          value={simpleSelect(props.simpleForm, `${tag}::${id}`, "data")}
        />
      </ControlGroup>
    )
  } else if (typescriptType === TypescriptBaseTypes.string) {
    return (
      <ControlGroup>
        <Tooltip content={kotlinType}>
          <Button>{name}</Button>
        </Tooltip>
        <RepeatableFieldButton {...props} id={id} />
        <TextArea
          fill={true}
          onChange={onChangeFnCall(props.simpleFormInput, `${tag}::${id}`)}
          placeholder={`${kotlinType}\nDrag bottom right corner of text area input to expand.`}
          value={simpleSelect(props.simpleForm, `${tag}::${id}`, "data")}
        />
      </ControlGroup>
    )
  } else {
    return (
      <div>
        <RepeatableFieldButton {...props} id={id} /> {name}:
        <RequestFormGroup label={`${name}:${JSON.stringify(kotlinType)}:${id}`}>
          <TextArea
            fill={true}
            onChange={onChangeFnCall(props.simpleFormInput, `${tag}::${id}`)}
            placeholder={
              "Unparseable type. (JSON or Text).\nDrag bottom right corner of text area input to expand."
            }
          />
        </RequestFormGroup>
      </div>
    )
  }
}

export const RequestFormComponent = (
  props: {
    action: IWebActionInternal
    tag: string
  } & IState &
    IDispatchProps
) => {
  const { action } = props
  const { typesMetadata } = action
  const a = props.webActions
  const b = props.webActions.get("metadata")
  const c = props.webActions.get("metadata")
  const d = props.webActions
    .get("metadata")
    .filter(
      (metadata: any) => metadata.typesMetadata.get("0").children.length > 0
    )
  console.log(typesMetadata, a, b, c, d)
  return (
    <div>
      <InputGroup
        onChange={onChangeFnCall(
          props.simpleFormInput,
          `${props.tag}::RepeatedForm`
        )}
        placeholder={"repeated id"}
      />
      <RepeatableFieldButton
        {...props}
        id={simpleSelect(
          props.simpleForm,
          `${props.tag}::RepeatedForm`,
          "data"
        )}
        typesMetadata={typesMetadata}
      />
      <RequestFormFieldBuilder
        {...props}
        id={"0"}
        typesMetadata={typesMetadata}
      />
      <Pre>{JSON.stringify(typesMetadata, null, 2)}</Pre>
    </div>
  )

  // if (requestType && types && types[requestType] && types[requestType].fields) {
  //   // const { fields } = types[requestType]
  //   return (
  //     <Pre>{JSON.stringify(typesMetadata, null, 2)}</Pre>
  //     // <div>
  //     //   {fields.map((field: IFieldTypeMetadata) => (
  //     //     <RequestFormFields
  //     //       {...props}
  //     //       field={field}
  //     //       id={0}
  //     //       nestPath={"/"}
  //     //       types={types}
  //     //     />
  //     //   ))}
  //     // </div>
  //   )
  // } else {
  //   const { tag } = props
  //   return (
  //     <TextArea
  //       fill={true}
  //       onChange={onChangeFnCall(props.simpleFormInput, `${tag}::Body`)}
  //       placeholder={
  //         "Request Body (JSON or Text).\nDrag bottom right corner of text area input to expand."
  //       }
  //     />
  //   )
  // }
}
