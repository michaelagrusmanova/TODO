import React from "react";
import { Route, Redirect } from "react-router-dom";


export default function AuthenticatedRoute({ component: C, appProps, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          appProps ? <C {...props} {...appProps} /> : <Redirect to={`/?redirect=${props.location.pathname}${props.location.search}`} />}
      />
    );
  }