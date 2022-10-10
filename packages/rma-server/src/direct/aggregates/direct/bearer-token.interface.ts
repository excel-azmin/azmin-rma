export interface BearerToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id_token?: string;
}
