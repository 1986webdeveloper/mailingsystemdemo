import React from "react";
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";

const Sent = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

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
            <th scope="col">Message</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>test</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>test 2</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>test 3</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Sent;