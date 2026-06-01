import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation eventInsert($mastereventId: UUID!, $name: String, $nameEn: String, $description: String, $startDate: DateTime, $endDate: DateTime, $id: UUID, $subevents: [EventInsertGQLModel!]) {
  eventInsert(event: {mastereventId: $mastereventId, name: $name, nameEn: $nameEn, description: $description, startDate: $startDate, endDate: $endDate, id: $id, subevents: $subevents}) {
    ... on EventGQLModel { ...Event }
    ... on EventGQLModelInsertError { ...EventGQLModelInsertError }
  }
}

fragment User on UserGQLModel {
    __typename
    id
    studies { __typename }
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    createdby { __typename }
    changedby { __typename }
    rbacobject { __typename }
    name
    givenname
    middlename
    email
    firstname
    surname
    valid
    startdate
    enddate
    typeId
    memberships { __typename }
    roles { __typename }
    isThisMe
    rolesOn { __typename }
    gdpr
    fullname
    memberOf { __typename }
    }

fragment RBACObject on RBACObjectGQLModel {
    __typename
    id
    roles { __typename }
    currentUserRoles { __typename }
    # userCanWithState
    # userCanWithoutState
    }

fragment Facility on FacilityGQLModel {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    createdby { __typename }
    changedby { __typename }
    rbacobject { __typename }
    path
    name
    nameEn
    label
    startdate
    enddate
    address
    valid
    capacity
    geometry
    geolocation
    reservations { __typename }
    groupId
    facilitytypeId
    masterFacilityId
    type { __typename }
    masterFacility { __typename }
    masterFacilities { __typename }
    subFacilities { __typename }
    group { __typename }
    }

fragment EventFacilityReservation on EventFacilityReservationGQLModel {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    createdby { __typename }
    changedby { __typename }
    rbacobject { __typename }
    eventId
    event { __typename }
    facilityId
    facility { __typename }
    stateId
    state { __typename }
    }

fragment EventType on EventTypeGQLModel {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    createdby { __typename }
    changedby { __typename }
    rbacobject { __typename }
    path
    name
    nameEn
    description
    parentId
    parent { __typename }
    children { __typename }
    events { __typename }
    }

fragment EventInvitation on EventInvitationGQLModel {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    createdby { __typename }
    changedby { __typename }
    rbacobject { __typename }
    eventId
    userId
    stateId
    event { __typename }
    user { __typename }
    state { __typename }
    }

fragment Event on EventGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  createdby {
  ...User
}
  changedby {
  ...User
}
  rbacobject {
  ...RBACObject
}
  path
  name
  nameEn
  description
  startdate
  enddate
  duration_raw
  valid
  place
  facilityId
  facility {
  ...Facility
}
  facilityReservations {
  ...EventFacilityReservation
}
  mastereventId
  subevents { __typename }
  typeId
  type {
  ...EventType
}
  userInvitations {
  ...EventInvitation
}
  # duration
  }

fragment EventGQLModelInsertError on EventGQLModelInsertError {
  __typename
  Entity {
  ...Event
}
  msg
  failed
  code
  location
  input
  }
`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment)
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation)