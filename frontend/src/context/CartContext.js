import React from 'react'

const CartContext = React.createContext({
  cartList: [],
  orders:[],
  updateState: () => {},
  addOrders: () => {},
  getCartList: () => {},
  removeAllCartItems: () => {},
  addCartItem: () => {},
  removeCartItem: () => {},
  incrementCartItemQuantity: () => {},
  decrementCartItemQuantity: () => {},
})

export default CartContext
