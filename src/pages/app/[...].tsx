import React, { FC, useEffect } from "react"
import { Link, Redirect, Router } from "@reach/router"
import { PrivateRoute } from "../../components/PrivateRoute"

const Profile: FC = () => {
  useEffect(() => {
    console.log('mount profile');
    return () => {
      console.log('unmount profile');
    }
  }, [])
  return <div>
    Profile:{' '}
    <Link to="/app/details">goto home</Link>
  </div>
}

const Details: FC = () => {
  useEffect(() => {
    console.log('mount Details');
    return () => {
      console.log('unmount Details');
    }
  }, [])
  return <div>
    Details:{' '}
    <Link to="/app/profile">goto profile</Link>
  </div>
}

const App = () => {
  return (
    <Router basepath="/app">
      <PrivateRoute path="/profile" Component={Profile} />
      <PrivateRoute path="/details" Component={Details} />
      <Redirect noThrow from="/" to="/app/details" />
    </Router>
  )
}

export default App