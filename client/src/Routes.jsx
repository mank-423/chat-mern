import React, { useContext } from 'react'
import RegisterAndLoginForm from './pages/RegisterAndLoginForm'
import { UserContext } from './UserContext';

export default function Routes() {

  const {username, id} = useContext(UserContext);

  if (username){
    return "Logged in! " + username;
  }

  return (
      <RegisterAndLoginForm />
  )
}
