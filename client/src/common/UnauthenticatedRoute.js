import React from "react";
import { Route, Redirect } from "react-router-dom";


export default function UnauthenticatedRoute({ component: C, appProps, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          appProps ? <Redirect to={`/todos?redirect=${props.location.pathname}${props.location.search}`} /> : <C {...props} {...appProps}  />}
      />
    );
  }