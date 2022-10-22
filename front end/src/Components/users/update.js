import './users.css';
import Header from '../Header/Header';
import React, { useState } from 'react';
import { APP_CONFIG } from '../../config/app-config';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import UpdateDetails from '../users/updatedetails';

function UserUpdate() {
    const [selectedFile, setSelectedFile] = useState();

    const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};

// upload action
const handleSubmit = event => {
    event.preventDefault();
      let URL = APP_CONFIG.API_ROOT+ '/upload';
      const user = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();

		formData.append('file', selectedFile);
      axios.post(URL, formData, 
      {
        headers: {
          Authorization: 'Bearer ' + user.data.access_token.token
        }
      })
      .then(res => {
          console.log(res);
        if(res.data && res.data.status && res.data.status === "success"){
          toast.success(res.data.message);
        }
      }).catch(err => {
        console.log('err');
        toast.error('Pease try again');
      });
  }

  return (
  <div className='user-update'> 
    <Header />
      <div className="container">
      <h3 className='update'>Update</h3>
        <div className="d-flex justify-content-center trade-100">
              <form className="profile__form" name="form" onSubmit={handleSubmit}>
                <FormGroup className="field upload-field" controlId="userName">
                  <FormLabel className="label" >Upload</FormLabel>
                  <FormControl className="input"
                    autoFocus
                    type="file"
                    name ="file"
                    onChange={changeHandler}
                  />
                </FormGroup>
                <div className="upload profile__footer">
                  <Button
                    type="submit">
                    Submit
                  </Button>
                </div>
              </form>
      </div>
      <UpdateDetails />
      </div>
      <ToastContainer />
    </div>
  )
}

export default UserUpdate;
