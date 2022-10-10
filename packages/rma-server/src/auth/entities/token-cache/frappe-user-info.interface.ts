export interface FrappeUserInfoSocialLoginInterface {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  parent: string;
  parentfield: string;
  parenttype: string;
  idx: string;
  docstatus: string;
  provider: string;
  userid: string;
  doctype: string;
}

export interface FrappeUserInfoRolesInterface {
  name: string;
  creation: string;
  modified: string;
  parent: string;
  role: string;
}

export interface FrappeUserInfoInterface {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  enabled: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  language: string;
  role_profile_name: string;
  user_type: string;
  doctype: string;
  roles: FrappeUserInfoRolesInterface[];
  social_logins: FrappeUserInfoSocialLoginInterface[];
}
