import {Redirect, Route} from 'react-router-dom'

const ProtectedRoute = props => {
  const token = localStorage.getItem('jwt_token')

  if (token === null) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default ProtectedRoute