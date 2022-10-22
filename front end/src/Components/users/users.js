import './users.css';
import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from '../../config/app-config';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';


function UserList() {
  const [users,setUsers] = useState([]);


  useEffect(() => {
    usersData();
  },[]);


  // Fetch users data
  const usersData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.get(APP_CONFIG.API_ROOT + '/users/data',{
      headers: {
        Authorization: 'Bearer ' + user.data.access_token.token
      }
    })
    .then(res => {
      if(res.data && res.data.status && res.data.status === "success"){
        if(res.data && res.data.data){
          console.log(res.data.data);
          setUsers(JSON.parse(JSON.stringify(res.data.data)));
        }
      } else {
        toast.warning('User is not an admin');
      }
    }).catch(err => {
      toast.warning('User is not an admin');
    });
  }

  // Acctivate user account
  const activate = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.get(APP_CONFIG.API_ROOT + '/activate/user/'+id,{
      headers: {
        Authorization: 'Bearer ' + user.data.access_token.token
      }
    })
    .then(res => {
      if(res.data && res.data.status && res.data.status === "success"){
          toast.success(res.data.message);
          usersData();
      } else {
        toast.warning('User is not an admin');
      }
    }).catch(err => {
      toast.warning('User is not an admin');
    });
  }

  const download = (URL) => {
   window.open('http://localhost:8080/api/v1/files/'+URL, "_blank");
  }

  return (
  <div className='users'> 
    <div className="container">
      <h3 className='users-title'>All Users</h3>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Is Profile Completed</th>
            <th>Activate</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
        {
                        users.map((item) => (
                            <tr key={item.id}>
                               <td>{item.lastName}</td>
                                <td>{item.email}</td>
                                <td>{!item.account_verified && 
                                  <Badge bg="warning" text="dark" >No</Badge>
                                  }
                                  {item.account_verified && 
                                  <Badge bg="primary" text="dark" >Yes</Badge>
                                  }</td>
                                <td>
                                {item.account_verified && 
                                  <Badge bg="primary" text="dark" >Yes</Badge>
                                  }
                                {!item.account_verified && 
                                  <Button variant="outline-success" onClick={()=> activate(item._id)}>Activate</Button>
                                  }
                                </td>
                                <td><a href="#" onClick={() => download(item.documentUrl)}>Download</a></td>
                            </tr>
                        ))
                    }
        </tbody>
      </Table>
  </div>
  <ToastContainer />
  </div>
  )
}

export default UserList;
