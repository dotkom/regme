/**
 * File that fetches the project configurations from environment 
 * variables passed to webpack via node
 */

/** @const */
export const BASE = process.env.RG_BASE;
/** @const */
export const API_BASE = `${BASE}${process.env.RG_API_BASE}`;
/** @const */
export const API_EVENTS = process.env.RG_API_EVENTS;
/** @const */
export const API_AUTH = process.env.RG_API_AUTH;
/** @const */
export const API_ATTENDEES = process.env.RG_API_ATTENDEES;
/** @const */
export const API_ATTEND = process.env.RG_API_ATTEND;
/** @const */
export const API_USERS = process.env.RG_API_USERS;


export const OIDC_SETTINGS = {
  authority: process.env.RG_OIDC_AUTHORITY,
  client_id: process.env.RG_OIDC_CLIENT_ID,
  response_type: 'id_token token',
  redirect_uri: process.env.RG_OIDC_REDIRECT_URI,
  scope: ['openid', 'profile', 'email', 'onlineweb4'].join(' '),
  automaticSilentRenew: true,
  popupWindowFeatures: 'location=no,toolbar=no,width=900,height=700,left=100,top=100'
}
