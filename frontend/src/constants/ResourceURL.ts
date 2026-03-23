import ApplicationConstants from "./ApplicationConstants";

const apiPath = ApplicationConstants.API_PATH;

class ResourceURL {
  // AUTHENTICATION
  static LOGIN = apiPath + "/auth/login";
  static REGISTER = apiPath + "/auth/register";
  static LOGOUT = apiPath + "/auth/logout";

  // USER
  static USER = apiPath + "/user/";

  // CATEGORY
  static CATEGORY = apiPath + "/categories";

  // GROUP
  static GROUP = apiPath + "/groups";

  // GROUP MEMBER
  static GROUP_MEMBER = apiPath + "/group-members";
  static GROUP_MEMBER_LEAVE = apiPath + "/group-members/leave-group";
  static BALANCE = apiPath + "/balances";

  // SETTLEMENT
  static SETTLEMENT = apiPath + "/settlements";
  static SETTLEMENT_CREATE = (groupId: string) =>
    apiPath + `/settlements/${groupId}`;

  // GROUP EXPENSE
  static EXPENSE_GROUP = apiPath + "/expense-groups";
  static EXPENSE_GROUP_UPDATE = (groupId: string) =>
    apiPath + `/expense-groups/groups/${groupId}/expenses`;
  static EXPENSE_GROUP_DELETE = (groupId: string) =>
    apiPath + `/expense-groups/groups/${groupId}/expenses`;
  static EXPENSE = apiPath + "/expenses";

  // EXPENSE
  static EXPENSES = apiPath + "/expenses";

  // DASHBOARD
  static DASHBOARD = apiPath + "/dashboard";
}

export default ResourceURL;
