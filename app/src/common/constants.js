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
/** @const */
export const CLIENT_SECRET = process.env.RG_CLIENT_SECRET;
/** @const */
export const CLIENT_ID = process.env.RG_CLIENT_ID;