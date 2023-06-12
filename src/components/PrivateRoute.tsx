import React, { Component as ReactComponent, FC, PropsWithChildren, ReactNode, ComponentType } from "react"
// import { navigate } from "gatsby"
import { RouteComponentProps } from "@reach/router";

export interface PrivateRouteProps extends RouteComponentProps {
  Component: ComponentType<any>;
}

export const PrivateRoute: FC<PropsWithChildren<PrivateRouteProps>> = ({ Component, location }) => {

  // if (!isLoggedIn() && location.pathname !== `/app/login`) {
  //   navigate("/app/login")
  //   return null
  // }

  return <Component />;
}

export default PrivateRoute