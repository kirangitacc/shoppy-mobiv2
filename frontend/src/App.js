
import { Route, Switch} from 'react-router-dom';
import { Component } from 'react';
import CartContext from './context/CartContext';
import Home from './components/Home';
import Login from './components/Login';
import Products from './components/Products';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import ProtectedRoute from './components/ProtectedRoute';


class App extends Component {
  state = {
    cartList: [],
  };

  /*getCartList = async (id) => {
    const url = `http://localhost:3000/userdetails/${id}`; // Backend endpoint for products
    const jwtToken = localStorage.getItem('jwt_token'); // Retrieve JWT token from localStorage
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    };

    const request=await fetch(url, options);
    const response=await request.json();
    console.log('initial'+response);
    const cartList = response[0].cartList;
    const formattedData = cartList.map(product => ({
      title: product.title,
      imageUrl: product.imageUrl,
      brand: product.brand,
      price: product.price,
      id: product.id,
    }));
    this.setState({
      cartList: formattedData,
    });

  }*/

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
    const { cartList} = this.state;
    console.log(cartList);

    return (
      <CartContext.Provider
        value={{
          cartList,
          getCartList: this.getCartList,
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
        </Switch>
      </CartContext.Provider>
    );
  }
}

export default App;