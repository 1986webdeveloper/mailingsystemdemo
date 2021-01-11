import { SET_MESSAGE, CLEAR_MESSAGE } from "./types";

/**
 * set message
 * @param {*} message 
 */
export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: message,
});

/**
 * clear message
 */
export const clearMessage = () => ({
  type: CLEAR_MESSAGE,
});