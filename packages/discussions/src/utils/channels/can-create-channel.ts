import { IGroup, IUser } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  IChannel,
  IChannelAclPermissionDefinition,
  IDiscussionsUser,
  SharingAccess,
} from "../../types";
import { isOrgAdmin } from "../platform";

const ALLOWED_USER_GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);

type ILegacyChannelPermissions = Pick<IChannel, "access" | "groups" | "orgs">;

type PermissionsDefinitionsByAclCategoryMap = {
  [key in AclCategory]?: IChannelAclPermissionDefinition[];
};

export function canCreateChannel(
  channel: IChannel,
  user: IDiscussionsUser
): boolean {
  const { channelAcl, access, groups, orgs } = channel;

  if (channelAcl) {
    return isAuthorizedToCreateByChannelAcl(user, channelAcl);
  }

  return isAuthorizedToCreateByLegacyPermissions(user, {
    access,
    groups,
    orgs,
  });
}

function isAuthorizedToCreateByChannelAcl(
  user: IDiscussionsUser,
  channelAcl: IChannelAclPermissionDefinition[]
): boolean {
  const { username } = user;

  if (username === null || channelAcl.length === 0) {
    return false;
  }

  const permissions = mapByCategory(channelAcl);

  return (
    canAllowAnonymous(user, permissions[AclCategory.ANONYMOUS_USER]) &&
    canAllowAuthenticated(user, permissions[AclCategory.AUTHENTICATED_USER]) &&
    canAllowGroups(user, permissions[AclCategory.GROUP]) &&
    canAllowOrgs(user, permissions[AclCategory.ORG]) &&
    canAllowUsers(user, permissions[AclCategory.USER])
  );
}

function mapByCategory(channelAcl: IChannelAclPermissionDefinition[]) {
  return channelAcl.reduce((accum, permission) => {
    const { category } = permission;

    accum[category]?.push(permission) || (accum[category] = [permission]);
    return accum;
  }, {} as PermissionsDefinitionsByAclCategoryMap);
}

function canAllowAnonymous(
  user: IDiscussionsUser,
  anonPermissions?: IChannelAclPermissionDefinition[]
) {
  if (!anonPermissions) {
    return true;
  }
  return isOrgAdmin(user);
}

function canAllowAuthenticated(
  user: IDiscussionsUser,
  authenticatedPermissions?: IChannelAclPermissionDefinition[]
) {
  if (!authenticatedPermissions) {
    return true;
  }
  return isOrgAdmin(user);
}

function canAllowGroups(
  user: IDiscussionsUser,
  groupPermissions?: IChannelAclPermissionDefinition[]
) {
  if (!groupPermissions) {
    return true;
  }
  return isMemberOfAllChannelGroups(user.groups, groupPermissions);
}

function isMemberOfAllChannelGroups(
  userGroups: IGroup[],
  groupPermissions?: IChannelAclPermissionDefinition[]
) {
  const userGroupsById = buildUserGroupsById(userGroups);

  return groupPermissions.every((groupPermission) => {
    const { key: groupId } = groupPermission;

    return userGroupsById[groupId];
  });
}

function buildUserGroupsById(userGroups: IGroup[]) {
  return userGroups.reduce((accum, userGroup) => {
    const {
      id: userGroupId,
      userMembership: { memberType },
    } = userGroup;

    if (ALLOWED_USER_GROUP_ROLES.includes(memberType)) {
      accum[userGroupId] = true;
    }

    return accum;
  }, {} as Record<string, boolean>);
}

function canAllowOrgs(
  user: IDiscussionsUser,
  orgPermissions?: IChannelAclPermissionDefinition[]
) {
  if (!orgPermissions) {
    return true;
  }
  return (
    isOrgAdmin(user) && isEveryPermissionForUserOrg(user.orgId, orgPermissions)
  );
}

function isEveryPermissionForUserOrg(
  userOrgId: string,
  orgPermissions: IChannelAclPermissionDefinition[]
) {
  return orgPermissions.every((permission) => {
    const { key: orgId } = permission;
    return userOrgId === orgId;
  });
}

// for now user permissions are disabled on channel create
// since users are not notified and cannot opt out
function canAllowUsers(
  user: IDiscussionsUser,
  userPermissions?: IChannelAclPermissionDefinition[]
) {
  return !userPermissions;
}

// Once ACL usage is enforced, we will remove authorization by legacy permissions
function isAuthorizedToCreateByLegacyPermissions(
  user: IDiscussionsUser,
  channelParams: ILegacyChannelPermissions
): boolean {
  const { username, groups: userGroups } = user;
  const { access, groups: channelGroupIds, orgs: channelOrgs } = channelParams;

  // ensure authenticated
  if (username === null) {
    return false;
  }

  if (access === SharingAccess.PRIVATE) {
    return isMemberOfAllChanelGroupsLegacy(userGroups, channelGroupIds);
  }

  // public or org access
  return isOrgAdminAndInChannelOrgs(user, channelOrgs);
}

function isMemberOfAllChanelGroupsLegacy(
  userGroups: IGroup[],
  channelGroupIds: string[]
): boolean {
  const userGroupsById = buildUserGroupsById(userGroups);

  return channelGroupIds.every(
    (channelGroupId) => userGroupsById[channelGroupId]
  );
}

function isOrgAdminAndInChannelOrgs(
  user: IDiscussionsUser,
  channelOrgs: string[]
): boolean {
  return isOrgAdmin(user) && channelOrgs.includes(user.orgId);
}
