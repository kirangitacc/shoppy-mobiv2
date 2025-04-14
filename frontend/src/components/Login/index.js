import React, { Component } from 'react';
import './index.css';

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
  };

  onChangeUsername = event => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = event => {
    this.setState({ password: event.target.value });
  };

  onSubmit = async event => {
    event.preventDefault();
    const { username, password } = this.state;
    const userData = { username, password };

    const url = 'http://localhost:3000/login/'; // Backend login endpoint

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };

    try {
      const req = await fetch(url, options);
      const res = await req.json();

      if (req.ok) {
        const { history } = this.props;
        const jwtToken = res.jwtToken;
        const userId = res.userId;

        // Save JWT and userId to localStorage
        localStorage.setItem('jwt_token', jwtToken);
        localStorage.setItem('user_id', userId);

        // Redirect to home page on success
        history.replace('/');
      } else {
        this.setState({
          errorMsg: res.error_msg || 'Login failed. Please try again.',
        });
      }
    } catch (error) {
      this.setState({
        errorMsg: 'Wrong username or password',
      });
    }
  };

  render() {
    const { username, password, errorMsg } = this.state;

    return (
      <div className="login-con">
        <div className="login-card">
          <h1 className="logo">Shoppy</h1>
          <form className="form" onSubmit={this.onSubmit}>
            <label className="label" htmlFor="user">
              USERNAME
            </label>
            <input
              className="inp"
              type="text"
              id="user"
              onChange={this.onChangeUsername}
              value={username}
              placeholder="Enter your username"
            />
            <label className="label" htmlFor="pass">
              PASSWORD
            </label>
            <input
              className="inp"
              type="password"
              id="pass"
              onChange={this.onChangePassword}
              value={password}
              placeholder="Enter your password"
            />
            <button type="submit" className="login-btn">
              Login
            </button>
            {errorMsg && <p className="err-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    );
  }
}

export default Login;