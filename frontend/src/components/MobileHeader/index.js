import { withRouter, Link } from 'react-router-dom';
import CartContext from '../../context/CartContext';
import './index.css';

const MobileHeader = (props) => (
  <CartContext.Consumer>
    {value => {
      const { orders, cartList } = value;

      const onClickLogout = async () => {
        const { history } = props;

        const url = 'https://shoppy-mobiv2.onrender.com/storeUserData';
        const requestData = {
          orders,
          cartList,
          userId: localStorage.getItem('user_id'),
        };

        const options = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        };

        try {
          const req = await fetch(url, options);
          const res = await req.json();

          if (req.ok) {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_id');
            history.replace('/login');
          } else {
            console.error('Error storing data:', res.error_msg);
          }
        } catch (error) {
          console.error('Error storing data:', error);
        }
      };

      return (
        <div className="nav-bar-mobile-logo-container">
          <Link to="/">
            <p className="logo">shoppy</p>
          </Link>
          <Link to="/orders">
            <button type="button" className="nav-mobile-btn">
              Your Orders
            </button>
          </Link>
          <button type="button" className="nav-mobile-btn" onClick={onClickLogout}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
              alt="nav logout"
              className="nav-bar-img"
            />
          </button>
        </div>
      );
    }}
  </CartContext.Consumer>
);

export default withRouter(MobileHeader);
