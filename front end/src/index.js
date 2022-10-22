import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import ReactDOM from "react-dom";
import "./App";
import "./index";
import Login from "./Components/Login/login";
import { Route, Router, Switch } from "react-router-dom";
import { history } from "./helpers/history";
import UserDashboard from "./Components/User-dashboard/userdashboard";
import AdminDashboard from "./Components/Admin-dashboard/admindashboard";
import Register from "./Components/Register/register";
import UsersList from "./Components/users/users";
import UserUpdate from "./Components/users/update";
import PortfolioPage from "./Components/Portfolio/Portfolio";
import reportWebVitals from "./reportWebVitals";
import ProtectedRoute from "./Components/Protected-route/ProtectedRoute";

const routing = (
  <Router history={history}>
    <div>
      <Switch>
        <Route exact path={"/"} component={Login} />
        <Route exact path={"/login"} component={Login} />
        <ProtectedRoute
          exact
          path={"/userdashboard"}
          component={UserDashboard}
        />
        <ProtectedRoute
          exact
          path={"/admindashboard"}
          component={AdminDashboard}
        />
        <ProtectedRoute exact path={"/register"} component={Register} />
        <ProtectedRoute
          exact
          path={"/admindashboard/users"}
          component={UsersList}
        />
        <ProtectedRoute
          exact
          path={"/userdashboard/update"}
          component={UserUpdate}
        />
        <ProtectedRoute
          exact
          path={"/userdashboard/portfolio"}
          component={PortfolioPage}
        />
      </Switch>
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById("root"));
reportWebVitals();
