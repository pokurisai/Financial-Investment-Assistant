import React from 'react';
import './admindashboard.css';
import Header from '../Header/Header';
import UserList from '../users/users';

function adminDashboard() {
  return (
  <div>
    <Header />
    <UserList />
  </div>
  );
}


export default adminDashboard;
