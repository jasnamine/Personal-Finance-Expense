import ApplicationConstants from "./ApplicationConstants";

const apiPath = ApplicationConstants.API_PATH;

class ResourceURL {
  // AUTHENTICATION
  static LOGIN = apiPath + "/auth/login";
  static REGISTER = apiPath + "/auth/register";
  static ADMIN_USER_INFO = apiPath + "/auth/info";
  static CATEGORY = apiPath + "/categories";
  static GROUP = apiPath + "/groups";
  static GROUP_MEMBER = apiPath + "/group-members";
  static EXPENSE_GROUP = apiPath + "/expense-groups";
  static EXPENSE = apiPath + "/expenses";

  static CLIENT_REGISTRATION_RESEND_TOKEN = (userId: number) =>
    apiPath + `/auth/registration/${userId}/resend-token`;
  static CLIENT_REGISTRATION_CONFIRM = apiPath + "/auth/registration/confirm";
  static CLIENT_REGISTRATION_CHANGE_EMAIL = (userId: number) =>
    apiPath + `/auth/registration/${userId}/change-email`;
  static CLIENT_FORGOT_PASSWORD = apiPath + "/auth/forgot-password";
  static CLIENT_RESET_PASSWORD = apiPath + "/auth/reset-password";
}

export default ResourceURL;
