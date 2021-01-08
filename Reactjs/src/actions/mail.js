import {
    COMPOSE_SUCCESS,
    COMPOSE_FAIL,
    SET_MESSAGE,
  } from "./types";
  
  import MailService from "../services/mail.service";
  
  export const composeMessage = (fromUserId, toUserId, subject, message) => (dispatch) => {
    console.log("fromUserId ==>", fromUserId)
    console.log("toUserId ==>", toUserId)
    console.log("subject ==>", subject)
    console.log("message ==>", message)
    return MailService.composeMessage(fromUserId, toUserId, subject, message).then(
      (response) => {
        dispatch({
          type: COMPOSE_SUCCESS,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message,
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: COMPOSE_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };