export enum redirectSessions {
  viewNotifiSession = 'viewNotifi',
  viewUcsSession = 'viewUcs',
  viewDisucss = 'viewDisucss'
}
export enum OrgTypesEnum {
  corporate = "corporate",
  startup = "startups",
  system_admin = "system_admin"
}
export enum discussionType {
  solution = "solution",
  usecase = "usecase",
  question = "question",
  comment = "comment",
  idea = "idea",
  challenge = "challenge"
}
export enum UsecaseSolutoinTypes {
  usecase = "usecase",
  solution = "solution"
}
export enum orgTypes {
  corporate = "corporate",
  startups = "startups",
  systemAdmin = "system_admin",
}

export enum userRoles {
  cgAdmin = "cgAdmin",
  startupAdmin = "startupAdmin",
  startupUser = "startupUser",
  corporateAdmin = "corporateAdmin",
  corporateUser = "corporateUser",
  corporateGuestUser = "corporateGuestUser",
  startupGuestUser = "startupGuestUser",
  corporateSampleUser = "corporateSampleUser",
  startupSampleUser = "startupSampleUser",
}

export enum userStatus {
  active = "active",
  deleted = "deleted",
  inactive = "inactive",
}
export enum orgStatus {
  active = "active",
  deleted = "deleted",
  inactive = "inactive",
  approvalPending = "approval_pending",
}

export enum OperationEnum {
  View,
  Add,
  Modify,
  Delete
}

export enum DateFormatEnum {
  DDMMYYYY = "DD/MM/YYYY",
  MMDDYYYY = "MM/DD/YYYY",
  YYYYMMDD = "YYYY/MM/DD",
  YYYY_MM_DD = "YYYY-MM-DD",
  DDMMMYYYY = "DD MMM YYYY"
}

export enum StatusEnum {
  Pending = "pending",
  Verified = "verified",
  Rejected = "rejected",
  Processing = "processing",
  RequestMoreDetails = "more_details_required",
  DocumentResubmitted = "document_resubmitted",
  Other = "other",
  approvalPending = "approval_pending"
}

export enum AlertType {
  success = "success",
  info = "info",
  warning = "warning",
  danger = "danger",
  primary = "primary",
  secondary = "secondary",
  dark = "dark",
  light = "light"
}

export enum PopupType {
  ForgotPassword = "ForgotPassword",
  Login = "Login",
  SigUp = "SigUp",
  ProForgotPassword = "ProForgotPassword",
  proLogin = "proLogin",
  proSendInvitation = "sendInvitation",
  cpSignUp = "cpSignUp",
  proSignUp = "proSignUp",
  proNewUserSignup = "proNewUserSignup",
  partnerSignup = "partSignup"
}

export enum BoolStatus {
  yes = "yes",
  no = "no"
}



export enum PageSlug {
  privacyPolicy = "privacy-policy",
  aboutUs = "about-us",
  termsConditions = "terms-and-conditions",
  refundPolicy = "refund-policy"
}
export enum DownloadableLinks {
  exampleCACert = "data/documents/ca-cert-example.doc"
}
export enum paging {
  item_per_page = 10
}
export enum RoleType {
  professional = "professional",
  users = "customer",
  channel_partner = "channel_partner"
}
export enum deviceType {
  website = "website",
  ios = "website",
  android = "android"
}
