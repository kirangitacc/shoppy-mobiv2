import { Link, withRouter } from 'react-router-dom';
import CartContext from '../../context/CartContext';
import './index.css';

const Header = props => {
  const onClickLogout = async (orders, cartList) => {
    const { history } = props;

    const url = 'https://shoppy-mobi.onrender.com/storeUserData'; // Backend API endpoint
    const requestData = {
      orders,
      cartList,
      userId: localStorage.getItem('user_id'), // Fetch user ID from localStorage
    };

    const options = {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${localStorage.getItem('jwt_token')}`, // Fetch JWT token from localStorage
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    };

    try {
      const req = await fetch(url, options);
      console.log('Response:', req);
      const res = await req.json();

      if (req.ok) {
        // Remove local storage items & redirect
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

  const renderCartItemsCount = () => (
    <CartContext.Consumer>
      {value => {
        const { cartList } = value;
        const cartItemsCount = cartList.length;

        return cartItemsCount > 0 ? (
          <span className="cart-count-badge">{cartList.length}</span>
        ) : null;
      }}
    </CartContext.Consumer>
  );

  return (
    <CartContext.Consumer>
      {value => {
        const { orders, cartList } = value;

        return (
          <nav className="nav-header">
            <div className="nav-content">
              <div className="nav-bar-large-container">
                <Link to="/">
                  <h1 className="logo">Shoppy</h1>
                </Link>
                <ul className="nav-menu">
                  <li className="nav-menu-item">
                    <Link to="/" className="nav-link">Home</Link>
                  </li>
                  <li className="nav-menu-item">
                    <Link to="/products" className="nav-link">Products</Link>
                  </li>
                  <li className="nav-menu-item">
                    <Link to="/orders" className="nav-link">Orders</Link> 
                  </li>
                  <li className="nav-menu-item">
                    <Link to="/cart" className="nav-link">
                      Cart {renderCartItemsCount()}
                    </Link>
                  </li>
                </ul>
                <button
                  type="button"
                  className="logout-desktop-btn"
                  onClick={() => onClickLogout(orders, cartList)}
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        );
      }}
    </CartContext.Consumer>
  );
};

export default withRouter(Header);