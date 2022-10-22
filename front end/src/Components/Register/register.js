import React, { Component } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { APP_CONFIG } from '../../config/app-config';
import axios from 'axios';
import './register.css';
import { ToastContainer, toast } from 'react-toastify';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      lastName:'',
      password: '',
      email:'',
      dob:'',
      gender:'',
      cpassword:'',
       isError: {
        userName: '',
        lastName: '',
        gender:'',
        password: '',
        email:'',
        cpassword:'',
        dob:''
            },
      loginError: false,
      isLoading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        case "email":
            isError.email = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i).test(value)
                ? ""
                : "Email address is invalid";
            break;
        case "password":
            isError.password =
                value.length < 6 ? "Atleast 6 characaters required" : "";
            break;
        case "dob":
              isError.dob =
                  value.length < 6 ? "Please select date of birth" : "";
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

// register user action
  handleSubmit = event => {
    event.preventDefault();
    const { userName, password,dob, firstName,email } = this.state;
    if (userName && password) {
      axios.post(APP_CONFIG.API_ROOT + '/register/user', {
        "email": email,
        "firstName": firstName,
        "lastName": userName,
         "dob":dob,
         "gender":"m",
        "password": password
      })
        .then(res => {
          if (res.data && res.data.status && res.data.status.toLowerCase() === "success") {
            console.log('res', res);
            toast.success(res.data.message);
            setTimeout(() => {
              this.props.history.push("/login");
            }, 1000);
          }
        }).catch(err => {
          console.log(err);
          toast.warning('Already user exists');
        });
    }
  }
  validateForm() {
    const {userName, password,cpassword,email,dob} = this.state;
    return userName.length > 0 && password.length > 0 && email.length > 0 &&  cpassword.length > 0 && dob.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  render() {
    const { userName, password, email, isError, cpassword,dob,lastName } = this.state;

    return (
      <div className="App register">
        <div className="container">
          <div className="d-flex justify-content-center trade-100">
            <div className="card">
              <div className="card-header">
                <h3>Sign Up</h3>
              </div>
              <div className="card-body">
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
                  <FormGroup className="field" controlId="email">
                    <FormLabel className="label" >Email</FormLabel>
                    <FormControl className="input"
                      autoFocus
                      type="email"
                      name="email"
                      value={email}
                      onChange={this.inputValueChange}
                    />
                    {isError.email.length > 0 && (
                        <span className="error">{isError.email}</span>
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
                  <FormGroup className="field" controlId="password">
                    <FormLabel className="label" >Password</FormLabel>
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
                      disabled={!this.validateForm()}
                      type="submit">
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default Register;
