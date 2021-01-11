import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import MailService from "../services/mail.service";
import { updateInbox } from "../actions/mail";

const InboxView = (props) => {
  console.log("props ==>", props);
  const messageId = props.match.params.id
  const { user: currentUser } = useSelector((state) => state.auth);
  const [inboxMessage, setInboxMessage] = useState("");
  const { message } = useSelector(state => state.message);

  const dispatch = useDispatch();

  const onClickOnUnread = (e) =>{
    e.preventDefault();
    let data = {
        messageId: messageId,
        isRead: 0
    }

    dispatch(updateInbox(data))
        .then(() => {
          props.history.push("/inbox");
          window.location.reload();
        })
        .catch(() => {
        });

  }

  const onClickOnReplay = (e) =>{
    e.preventDefault();

    let path = "/compose/"+messageId;
    props.history.push(path);
    window.location.reload();
    
  }


  useEffect(() => {
    if(!inboxMessage) {
      MailService.getInboxMessageById(messageId).then(
        (response) => {
            setInboxMessage(response.data.data);
        },
        (error) => {
          const _inboxMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

            setInboxMessage(_inboxMessage);
        }
      );
    } else {
      return null
    }
  }, [inboxMessage, messageId]);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
           Inbox View Meesage
        </h3>
      </header>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">
                <button type="button" className="btn btn-primary" onClick={onClickOnUnread}>Unread</button>
            </th>
            <th scope="col">
              <button type="button" className="btn btn-primary" onClick={onClickOnReplay}>Replay</button>
            </th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
      </table>
      {/* <p>
        <strong>From:</strong> {!!inboxMessage._fromUserId && inboxMessage._fromUserId.fullName}
      </p>
      <p>
        <strong>To:</strong> {currentUser.data.fullName}
      </p>
      <p>
        <strong>Subject:</strong> {inboxMessage.subject}
      </p>
      <p>
        <strong>Message:</strong> {inboxMessage.message}
      </p> */}

      {inboxMessage && inboxMessage.length > 0 && 
        inboxMessage.map( (inboxData, index) => {
          return (
            <>
            <div><h5>{inboxData.messageId === 0 ? 'To me': ( index > 0 ? 'Replay': 'To me' )}</h5></div>
            <ul>
              <li>
                <strong>From:</strong> {!!inboxData._fromUserId && inboxData._fromUserId.fullName}
              </li>
              <li>
                <strong>To:</strong> {!!inboxData._toUserId && inboxData._toUserId.fullName}
              </li>
              <li>
                <strong>Subject:</strong> {inboxData.subject}
              </li>
              <li>
                <strong>Message:</strong> {inboxData.message}
              </li>
            </ul>
            <hr></hr>
            </>
          )
        })
      }

    </div>
  );
};

export default InboxView;