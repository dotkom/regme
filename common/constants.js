export const BASE = process.env.RG_BASE;
export const API_BASE = `${BASE}${process.env.RG_API_EVENTS}`;
export const API_EVENTS = process.env.RG_API_EVENTS;
export const API_AUTH = process.env.RG_API_AUTH;
export const API_ATTENDEES = process.env.RG_API_ATTENDEES;
export const API_ATTEND = process.env.RG_API_ATTEND;
export const API_USERS = process.env.RG_API_USERS;
export const CLIENT_SECRET = process.env.RG_CLIENT_SECRET;
export const CLIENT_ID = process.env.RG_CLIENT_ID || 'GzVOtC61yt2t4B4zYyyk25FBEqnjTRPgFoftlfjq';

console.log(process,BASE, CLIENT_SECRET)