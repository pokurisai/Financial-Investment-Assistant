import React, { Component } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import {Link } from 'react-router-dom';
import './login.css';
import { ToastContainer, toast } from 'react-toastify';
import { APP_CONFIG } from '../../config/app-config';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email: '',
        password: '',
        isError: {
          email: '',
          password: '',
        },
        loginError: false,
        isLoading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
}

inputValueChange = e => {
  e.preventDefault();
  const { name, value } = e.target;
  let isError = { ...this.state.isError };
  this.setState({
    [e.target.id]: e.target.value
  });
  switch (name) {
      case "email":
          isError.email = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i).test(value)
              ? ""
              : "Email address is invalid";
          break;
      case "password":
          isError.password =
              value.length < 6 ? "Atleast 6 characaters required" : "";
          break;
      default:
          break;
  }
  this.setState({
      isError,
      [name]: value
  })
};


// Login action
handleSubmit = event => {
  event.preventDefault();
  const { email, password } = this.state;
  if (email && password) {
    let URL = APP_CONFIG.API_ROOT+ '/admin/login';
    if(email  === 'admin@gmail.com'){
      URL = APP_CONFIG.API_ROOT+ '/admin/login';
    } else {
      URL = APP_CONFIG.API_ROOT+ '/login';
    }
    axios.post(URL, {
      "account": email,
      "password": password
    })
    .then(res => {
      if(res.data && res.data.status && res.data.status === "success"){
        toast.success(res.data.message);
        localStorage.setItem('user', JSON.stringify(res.data))
      setTimeout(() => {
        if(email  === 'admin@gmail.com'){
        this.props.history.push("/admindashboard");
        } else {
          this.props.history.push("/userdashboard");
        }
      }, 1000);
      }
    }).catch(err => {
      console.log('err');
      toast.error('Invalid account/password, please try again');
    });
}
  // if (userName && password) {
  //     this.setState({
  //         isLoading: true
  //     });
  //     toast("Wow so easy!");
  //     setTimeout(() => {
  //       this.props.history.push("/userdashboard");
  //     }, 1000);
  // }
}
validateForm() {
  return this.state.email.length > 0 && this.state.password.length > 0;
}

render() {
  const { email, password, isError } = this.state;

  return (
    <div className="App login">
      <div className="container">
        <div className="d-flex justify-content-center trade-100">
        <div className="col-6 steps">
          <div className="steps-wrapper">
          <h3>FINANCIAL INVESTMENT ASSISTANT</h3>
          <p className="title">Steps to invest</p>
          <ul>
            <li>Complete registration</li>
           <li>Login to the account </li>
           <li>Complete ID verification </li>
           <li> Choose portfolio based on funds</li>
           <li>Invest on the stocks </li>
           <li> Watch portfolio for updated funds</li>
          </ul>
        </div>
        </div>
          <div className="card">
            <div className="card-header">
              <h3>Sign In</h3>
            </div>
            <div className="card-body">
              <form className="profile__form" name="form" onSubmit={this.handleSubmit}>
                <FormGroup className="field" controlId="userName">
                  <FormLabel className="label" >Email</FormLabel>
                  <FormControl className="input"
                    autoFocus
                    type="email"
                    value={email}
                    name ="email"
                    onChange={this.inputValueChange}
                  />
                  {isError.email.length > 0 && (
                        <span className="error">{isError.email}</span>
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
                <div className="profile__footer">
                  <Button
                    disabled={!this.validateForm()}
                    type="submit">
                    LOGIN
                  </Button>
                  <div class="d-flex justify-content-center t-links">
                Don't have an account?<Link to="/register">Sign Up</Link>
              </div>
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

export default Login;
