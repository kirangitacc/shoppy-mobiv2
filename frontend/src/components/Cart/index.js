import Header from '../Header'
import CartListView from '../CartListView'
import CartSummary from '../CartSummary'
import CartContext from '../../context/CartContext'
import EmptyCartView from '../EmptyCartView'
import MobileHeader from '../MobileHeader'
import Footer from '../Footer'

import './index.css'

const Cart = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList, removeAllCartItems} = value
      const showEmptyView = cartList.length === 0

      return (
        <>
          <MobileHeader />
          <Header />
          <div className="cart-container">
            {showEmptyView ? (
              <EmptyCartView />
            ) : (
              <div className="cart-content-container1">
                <h1 className="cart-heading">My Cart</h1>
                <button
                  type="button"
                  className="btn1"
                  onClick={removeAllCartItems}
                >
                  Remove All
                </button>
              </div>
            )}
            <CartListView />
            <CartSummary />
          </div>
          <Footer />
        </>
      )
    }}
  </CartContext.Consumer>
)

export default Cart