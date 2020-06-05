import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from 'react-router-dom';
import TodoDetail from './todos/TodoDetail';
import TodoIndex from "./todos/TodoIndex";
import TodoForm from './todos/TodoForm';
import UserLogin from './users/UserLogin';
import AuthenticatedRoute from './common/AuthenticatedRoute';
import UnauthenticatedRoute from './common/UnauthenticatedRoute';
import Cookies from 'js-cookie';

export default class App extends React.Component {

      checkLoginStatus() {
        if(Cookies.get("loggedIn")){
            return true;
        } else {
            return false;
        }
    }

render() {
  return (
  	<Router>
      <div className="container">
 	  <Switch>
         <UnauthenticatedRoute exact path="/" component={ UserLogin } appProps={this.checkLoginStatus()} />
         <AuthenticatedRoute path="/todos/show/:id" component={ TodoDetail } appProps={this.checkLoginStatus()} />
         <AuthenticatedRoute path="/todos/create" component={ TodoForm } appProps={this.checkLoginStatus()} />
         <AuthenticatedRoute exact path="/todos" component={TodoIndex} appProps={this.checkLoginStatus()} />
    	   <AuthenticatedRoute path="/todos/edit/:id" component={ TodoForm } appProps={this.checkLoginStatus()} />
 	  </Switch>
      </div>
     
      </Router>
  );
}
}