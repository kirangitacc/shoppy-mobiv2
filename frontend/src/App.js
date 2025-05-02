
import { Route, Switch} from 'react-router-dom';
import { Component } from 'react';
import CartContext from './context/CartContext';
import Home from './components/Home';
import Login from './components/Login';
import Products from './components/Products';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Orders from './components/Orders';
import ProtectedRoute from './components/ProtectedRoute';


class App extends Component {
  state = {
    cartList: [],
    orders:[],
  };

  addOrders = () => {
    const { cartList } = this.state; 

    this.setState(prevState => ({
      orders: [...prevState.orders, ...cartList], 
    }));

    this.removeAllCartItems(); 
};


  updateState=(cartList, orders) => {
    this.setState({ cartList:[...cartList], orders:[...orders] });
  }

  removeCartItem = id => {
    const { cartList } = this.state;
    const newList = cartList.filter(i => i.id !== id);

    this.setState({ cartList: [...newList] });
  };

  removeAllCartItems = () => {
    this.setState({ cartList: [] });
  };

  addCartItem = product => {
    const { cartList } = this.state;
    const existingProduct = cartList.find(i => i.id === product.id);
    if (!existingProduct) {
      this.setState(prevState => ({ cartList: [...prevState.cartList, product] }));
    }
  };

  incrementCartItemQuantity = cartItemDetails => {
    const { cartList } = this.state;
    const { id, quantity, brand, title, price, imageUrl } = cartItemDetails;
    console.log(cartItemDetails);
    const updatedList = cartList.map(j => {
      if (j.id === id) {
        return {
          id,
          quantity: quantity + 1,
          brand,
          title,
          price,
          imageUrl,
        };
      }
      return j;
    });

    this.setState({ cartList: [...updatedList] });
  };

  decrementCartItemQuantity = cartItemDetails => {
    const { cartList } = this.state;
    const { id, quantity, brand, title, price, imageUrl } = cartItemDetails;
    const updatedList = cartList.map(j => {
      if (j.id === id) {
        return {
          id,
          quantity: quantity - 1,
          brand,
          title,
          price,
          imageUrl,
        };
      }
      return j;
    });

    this.setState({ cartList: [...updatedList] });
  };

  render() {
    const { cartList,orders} = this.state;
    console.log(cartList);

    return (
      <CartContext.Provider
        value={{
          cartList,
          orders,
          updateState: this.updateState,
          addOrders: this.addOrders,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute exact path="/product/:id" component={ProductDetails} />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <ProtectedRoute exact path="/orders" component={Orders} />
        </Switch>
      </CartContext.Provider>
    );
  }
}

export default App;