import ApplicationConstants from "./ApplicationConstants";

const apiPath = ApplicationConstants.API_PATH;

class ResourceURL {
  // AUTHENTICATION
  static LOGIN = apiPath + "/auth/login";
  static REGISTER = apiPath + "/auth/register";
  static LOGOUT = apiPath + "/auth/logout";

  static REGISTRATION_RESEND_TOKEN = (userId: number) =>
    apiPath + `/auth/registration/${userId}/resend-token`;
  static CLIENT_REGISTRATION_CONFIRM = apiPath + "/auth/registration/confirm";
  static REGISTRATION_CHANGE_EMAIL = (userId: number) =>
    apiPath + `/auth/registration/${userId}/change-email`;
  static FORGOT_PASSWORD = apiPath + "/auth/forgot-password";
  static RESET_PASSWORD = apiPath + "/auth/reset-password";

  // USER
  static USER = apiPath + "/user/";

  // CATEGORY
  static CATEGORY = apiPath + "/categories";

  // GROUP
  static GROUP = apiPath + "/groups";

  // GROUP MEMBER
  static GROUP_MEMBER = apiPath + "/group-members";

  // GROUP EXPENSE
  static EXPENSE_GROUP = apiPath + "/expense-groups";
  static EXPENSE_GROUP_UPDATE = (groupId: string) =>
    apiPath + `/expense-groups/groups/${groupId}/expenses`;
  static EXPENSE_GROUP_DELETE = (groupId: string) =>
    apiPath + `/expense-groups/groups/${groupId}/expenses`;
  static EXPENSE = apiPath + "/expenses";

  // EXPENSE
  static EXPENSES = apiPath + "expenses";

}

export default ResourceURL;
