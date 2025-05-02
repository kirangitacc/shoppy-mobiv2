import React, { Component } from 'react';
import CartContext from '../../context/CartContext'

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

  onSubmit = async (event, updateState) => {
    event.preventDefault();
    const { username, password } = this.state;
    const userData = { username, password };

    const url = 'https://shoppy-mobi.onrender.com/login/'; // Backend login endpoint

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };

    try {
      const req = await fetch(url, options);
      console.log(req)
      const res = await req.json();
      console.log('Response:', res);

      if (req.ok) {
        const { history } = this.props;
        const jwtToken = res.jwtToken;
        console.log('jwtToken', jwtToken)
        const userId = res.userId;
        console.log('userId', userId)
        const cartList = JSON.parse(res.cartList || '[]');
        const orders = JSON.parse(res.orders || '[]');
        console.log('login - Orders:', orders, 'Cart List:', cartList);

       // Save JWT and userId to localStorage
        localStorage.setItem('jwt_token', jwtToken);
        localStorage.setItem('user_id', userId);

       console.log('JWT Token stored in localStorage:', localStorage.getItem('jwt_token'));

        // Update context state
        updateState(cartList, orders);

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
      <CartContext.Consumer>
        {({ updateState }) => (
          <div className="login-con">
            <div className="login-card">
              <h1 className="logo">Shoppy</h1>
              <form
                className="form"
                onSubmit={event => this.onSubmit(event, updateState)}
              >
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
        )}
      </CartContext.Consumer>
    );
  }
}

export default Login;
