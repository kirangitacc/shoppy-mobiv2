import './index.css'
import CartContext from '../../context/CartContext'

const CartSummary = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList} = value

      const totalPrice = cartList.reduce((acc, k) => {
        return acc + k.price * k.quantity
      }, 0)

      return (
        <div className="summary-con">
          <p className="p1">
            Order Total: <span className="sp">Rs {totalPrice}/-</span>
          </p>
          <p className="p2">{cartList.length} items in cart</p>
          <button type="button" className="btn2">
            Checkout
          </button>
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default CartSummary
