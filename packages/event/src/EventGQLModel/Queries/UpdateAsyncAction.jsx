import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation eventUpdate(
  $id: UUID!, 
  $lastchange: DateTime!, 
  $name: String, 
  $nameEn: String, 
  $description: String, 
  $startdate: DateTime, 
  $enddate: DateTime
) {
  eventUpdate(
    event: {
      id: $id, 
      lastchange: $lastchange, 
      name: $name, 
      nameEn: $nameEn, 
      description: $description, 
      startdate: $startdate, 
      enddate: $enddate
    }
  ) {
      ... on EventGQLModel { ...Large }
      ... on EventGQLModelUpdateError { ...Error }
  }
}

fragment Error on EventGQLModelUpdateError {
  __typename
  Entity {
    ...Large
  }
  msg
  failed
  code
  location
  input
}


fragment User on UserGQLModel {
      __typename
      id
      studies { id }
      invitations { id }
      lastchange
      created
      createdbyId
      changedbyId
      rbacobjectId
      createdby { id }
      changedby { id }
      rbacobject { id }
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
      memberships { id }
      roles { id }
      isThisMe
      rolesOn { id }
      gdpr
      fullname
      memberOf { id }
    }

fragment RBACObject on RBACObjectGQLModel {
      __typename
      id
      roles { id }
      currentUserRoles { id }
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
      createdby { id }
      changedby { id }
      rbacobject { id }
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
      reservations { id }
      groupId
      facilitytypeId
      masterFacilityId
      type { id }
      masterFacility { id }
      masterFacilities { id }
      subFacilities { id }
      group { id }
    }

fragment EventFacilityReservation on EventFacilityReservationGQLModel {
      __typename
      id
      lastchange
      created
      createdbyId
      changedbyId
      rbacobjectId
      createdby { id }
      changedby { id }
      rbacobject { id }
      eventId
      event { id }
      facilityId
      facility { id }
      stateId
      state { id }
    }

fragment EventType on EventTypeGQLModel {
      __typename
      id
      lastchange
      created
      createdbyId
      changedbyId
      rbacobjectId
      createdby { id }
      changedby { id }
      rbacobject { id }
      path
      name
      nameEn
      description
      parentId
      parent { id }
      children { id }
      events { id }
    }

fragment EventInvitation on EventInvitationGQLModel {
      __typename
      id
      lastchange
      created
      createdbyId
      changedbyId
      rbacobjectId
      createdby { id }
      changedby { id }
      rbacobject { id }
      eventId
      userId
      stateId
      event { id }
      user { id }
      state { id }
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
    masterevent { id }
    subevents { id }
    typeId
    type {
  ...EventType
}
    userInvitations {
  ...EventInvitation
}
    # duration
  }

fragment Error on EventGQLModelUpdateError {
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

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)
export const UpdateAsyncAction = createAsyncGraphQLAction2(UpdateMutation, 
    updateItemsFromGraphQLResult, reduceToFirstEntity)