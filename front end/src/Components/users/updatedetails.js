import React, { Component } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { APP_CONFIG } from '../../config/app-config';
import axios from 'axios';
import '../Register/register.css';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';

class UpdateDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      lastName:'',
      dob:'',
      gender:'',
      password: '',
      cpassword:'',
      oldPassword:'',
       isError: {
        userName: '',
        lastName: '',
        gender:'',
        dob:'',
        password: '',
        cpassword:'',
        oldPassword:''
    },
      loginError: false,
      isLoading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordSubmit =   this.handlePasswordSubmit.bind(this);
  }

  inputValueChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let isError = { ...this.state.isError };
    this.setState({
      [e.target.id]: e.target.value
    });

    const {password} = this.state;
    switch (name) {
        case "userName":
            isError.userName =
                value.length < 4 ? "Atleast 4 characaters required" : "";
            break;
            case "lastName":
            isError.lastName =
                value.length < 4 ? "Atleast 4 characaters required" : "";
            break;
        case "dob":
              isError.dob =
                  value.length < 6 ? "Please select date of birth" : "";
              break;   
        case "gender":
                isError.gender =
                    value.length < 4 ? "Please select gender" : "";
                break;    
        case "password":
            isError.password =
                value.length < 6 ? "Atleast 6 characaters required" : "";
            break;
    case "oldPassword":
        isError.password =
            value.length < 6 ? "Atleast 6 characaters required" : "";
        break;
        case "cpassword":
            if(password.toUpperCase() === value.toUpperCase()){
            isError.cpassword ="";
            } else {
            isError.cpassword = "Please enter correct password";
            }
            break;       
        default:
            break;
    }
    this.setState({
        isError,
        [name]: value
    })
};

componentDidMount(){
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    this.setState({userName: user.data.firstName, lastName:user.data.lastName,dob:moment(user.data.dob).format("YYYY-MM-DD"),
        gender:user.data.gender});
}

// update user action
  handleSubmit = event => {
    const user = JSON.parse(localStorage.getItem("user"));
    event.preventDefault();
    const { userName,dob, lastName, gender } = this.state;
    const payLoad = {
        "firstName": userName,
        "lastName": lastName,
        "dob":dob,
        "gender": gender,
      }
      console.log(payLoad);
    if (userName && lastName && gender && dob) {
      axios.post(APP_CONFIG.API_ROOT + '/update/user', payLoad,
      {
        headers: {
          Authorization: 'Bearer ' + user.data.access_token.token
        }
      })
        .then(res => {
            console.log('res', res);
          if (res.data && res.data.status && res.data.status.toLowerCase() === "success") {
            user.data.firstName = userName;
            user.data.lastName = lastName;
            user.data.dob = dob;
            user.data.gender = gender;
            localStorage.setItem('user', JSON.stringify(user));
            toast.success(res.data.message);
          }
        }).catch(err => {
          console.log(err);
        });
    }
  }

  // update password user action
  handlePasswordSubmit = event => {
    const user = JSON.parse(localStorage.getItem("user"));
    event.preventDefault();
    const { password,oldPassword } = this.state;
    if (password) {
      axios.post(APP_CONFIG.API_ROOT + '/password/change', {
        "oldPassword": oldPassword,
        "newPassword": password
      },{
        headers: {
          Authorization: 'Bearer ' + user.data.access_token.token
        }
      })
        .then(res => {
          if (res.data && res.data.status && res.data.status.toLowerCase() === "success") {
            this.setState( {password:"", cpassword : "", oldPassword:""})
            toast.success(res.data.message);
          }
        }).catch(err => {
          console.log(err);
        });
    }
  }
  validateForm() {
    const {userName ,dob} = this.state;
    return userName.length > 0  && dob.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  render() {
    const { userName, isError,dob,lastName, gender, password, cpassword, oldPassword } = this.state;

    return (
      <div className="update-details">
        <div className="update-wrapper">
            <div className='row'>
                <div className='col-6'>
            <h3 className='update'>User Details</h3>
                <form className="profile__form" name="form" onSubmit={this.handleSubmit}>
                  <FormGroup className="field" controlId="userName">
                    <FormLabel className="label" >First Name</FormLabel>
                    <FormControl className="input"
                      autoFocus
                      type="text"
                      name="userName"
                      value={userName}
                      onChange={this.inputValueChange}
                    />
                    {isError.userName.length > 0 && (
                        <span className="error">{isError.userName}</span>
                    )}
                  </FormGroup>
                  <FormGroup className="field" controlId="lastName">
                    <FormLabel className="label" >Last Name</FormLabel>
                    <FormControl className="input"
                      autoFocus
                      type="text"
                      name="lastName"
                      value={lastName}
                      onChange={this.inputValueChange}
                    />
                    {isError.lastName.length > 0 && (
                        <span className="error">{isError.lastName}</span>
                    )}
                  </FormGroup>
                  <FormGroup className="field" controlId="dob">
                    <FormLabel className="label" >Date of Birth</FormLabel>
                    <FormControl className="input"
                      autoFocus
                      type="date"
                      name="dob"
                      value={dob}
                      onChange={this.inputValueChange}
                    />
                    {isError.dob.length > 0 && (
                        <span className="error">{isError.dob}</span>
                    )}
                  </FormGroup>
                  <FormGroup className="field" controlId="gender">
                    <FormLabel className="label" >Gender</FormLabel>
                    <FormControl className="input"
                      autoFocus
                      type="text"
                      name="gender"
                      value={gender}
                      onChange={this.inputValueChange}
                    />
                    {isError.gender.length > 0 && (
                        <span className="error">{isError.gender}</span>
                    )}
                  </FormGroup>
                  <div className="profile__footer">
                    <Button
                      disabled={!this.validateForm()}
                      type="submit">
                      Submit
                    </Button>
                  </div>
                </form>
                </div>
                <div className='col-6'>
                <h3 className='update'>Password</h3>
                <form className="profile__form" name="form" onSubmit={this.handlePasswordSubmit}>
                <FormGroup className="field" controlId="oldPassword">
                    <FormLabel className="label" >Old Password</FormLabel>
                    <FormControl className="input"
                      value={oldPassword}
                      onChange={this.inputValueChange}
                      type="password"
                      name="oldPassword"
                    />
                    {isError.oldPassword.length > 0 && (
                        <span className="error">{isError.oldPassword}</span>
                    )}
                  </FormGroup>
                  <FormGroup className="field" controlId="password">
                    <FormLabel className="label" >New Password</FormLabel>
                    <FormControl className="input"
                      value={password}
                      onChange={this.inputValueChange}
                      type="password"
                      name="password"
                    />
                    {isError.password.length > 0 && (
                        <span className="error">{isError.password}</span>
                    )}
                  </FormGroup>
                  <FormGroup className="field" controlId="cpassword">
                    <FormLabel className="label" >Confirm Password</FormLabel>
                    <FormControl className="input"
                      value={cpassword}
                      onChange={this.inputValueChange}
                      type="password"
                      name="cpassword"
                    />
                    {isError.cpassword.length > 0 && (
                        <span className="error">{isError.cpassword}</span>
                    )}
                  </FormGroup>
                  <div className="profile__footer">
                    <Button
                      type="submit">
                      Submit
                    </Button>
                  </div>
                </form>
                </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default UpdateDetails;
