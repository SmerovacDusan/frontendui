import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation eventDelete($id: UUID!, $lastchange: DateTime!) {
  eventDelete(event: {id: $id, lastchange: $lastchange}) {
    ...EventGQLModelDeleteError
  }
}

fragment EventGQLModelDeleteError on EventGQLModelDeleteError {
  __typename
  Entity {
    ...Large
  }
  msg
  code
  failed
  location
  input
}
`;

const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`, LargeFragment)
export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation)
