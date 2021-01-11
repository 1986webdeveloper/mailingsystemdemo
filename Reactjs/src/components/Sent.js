import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import MailService from "../services/mail.service";

const Sent = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [sentList, setSentList] = useState("");

  /**
   * get sent data 
   */
  useEffect(() => {
    if(!sentList) {
      MailService.getSentData().then(
        (response) => {
          setSentList(response.data.data);
        },
        (error) => {
          const _sentList =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

            setSentList(_sentList);
        }
      );
    } else {
      return null
    }
  }, [sentList]);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
           Sent
        </h3>
      </header>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Full name</th>
            <th scope="col">Subject</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {sentList && sentList.length > 0 && 
            sentList.map( (sentData, index) => {
              return (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{sentData._toUserId.fullName}</td>
                  <td>{sentData.subject}</td>
                  <td><a className="btn btn-link" href={'/sentview/'+ sentData.id}>view</a></td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
};

export default Sent;