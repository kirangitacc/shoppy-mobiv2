import { Link } from 'react-router-dom';
import CartContext from '../../context/CartContext'
import './index.css';

const Footer = () => {

    const renderCartItemsCount = () => (
        <CartContext.Consumer>
          {value => {
            const {cartList} = value
            const cartItemsCount = cartList.length
    
            return (
              <>
                {cartItemsCount > 0 ? (
                  <span className="cart-count-badge">{cartList.length}</span>
                ) : null}
              </>
            )
          }}
        </CartContext.Consumer>
      )

  return (
    <div className="nav-menu-mobile">
      <ul className="nav-menu-list-mobile">
        <li className="nav-menu-item-mobile">
          <Link to="/" className="nav-link">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-icon.png"
              alt="nav home"
              className="nav-bar-img"
            />
          </Link>
        </li>

        <li className="nav-menu-item-mobile">
          <Link to="/products" className="nav-link">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-products-icon.png"
              alt="nav products"
              className="nav-bar-img"
            />
          </Link>
        </li>

        <li className="nav-menu-item-mobile">
          <Link to="/cart" className="nav-link">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-icon.png"
              alt="nav cart"
              className="nav-bar-img"
            />
            {renderCartItemsCount()}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Footer;