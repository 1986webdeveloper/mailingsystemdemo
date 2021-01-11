import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import MailService from "../services/mail.service";
import { updateInbox } from "../actions/mail";

const Inbox = (props) => {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [inboxList, setInboxList] = useState("");

  const dispatch = useDispatch();

  /**
   * on click read/unread 
   * @param {*} e 
   * @param {number} messageId 
   * @param {number} isReadData 
   */
  const onClickOnUnread = (e, messageId, isReadData) =>{
    e.preventDefault();

    let data = {
      messageId: messageId,
      isRead: isReadData
    }

    dispatch(updateInbox(data))
      .then(() => {
        props.history.push("/inbox");
        window.location.reload();
      })
      .catch(() => {
      });
  }

  /**
   * get inbox data
   */
  useEffect(() => {
    if(!inboxList) {
      MailService.getInboxData().then(
        (response) => {
          setInboxList(response.data.data);
        },
        (error) => {
          const _inboxList =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

            setInboxList(_inboxList);
        }
      );
    } else {
      return null
    }
  }, [inboxList]);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
           Inbox
        </h3>
      </header>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Full name</th>
            <th scope="col">Subject</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {inboxList && inboxList.length > 0 && 
              inboxList.map( (inboxData, index) => {
                return (
                  <tr className={
                    inboxData.isRead === 1 ? "read-view" :"unread-view"
                  }>
                    <th scope="row">{index + 1}</th>
                    <td>{inboxData._fromUserId.fullName}</td>
                    <td>{inboxData.subject}</td>
                    <td><a className="btn btn-link" href={'/inboxview/'+ inboxData.id}>view</a></td>
                    {inboxData.isRead === 0 &&
                      <td><button className="btn btn-link" onClick={(e)=>onClickOnUnread(e,inboxData.id, 1)}>Read</button></td>
                    }
                    {inboxData.isRead === 1 &&
                      <td><button className="btn btn-link" onClick={(e)=>onClickOnUnread(e,inboxData.id, 0)}>Unread</button></td>
                    }
                  </tr>
                )
              })
            }
        </tbody>
      </table>
    </div>
  );
};

export default Inbox;