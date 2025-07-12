import { Component } from 'react';
import { Link } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import { BsPlusSquare, BsDashSquare } from 'react-icons/bs';
import { MdOutlineStar } from 'react-icons/md';

import CartContext from '../../context/CartContext';
import Header from '../Header';

import './index.css';
import MobileHeader from '../MobileHeader';
import Footer from '../Footer';

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
};

class ProductDetails extends Component {
  state = {
    productData: {},
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  };

  componentDidMount() {
    this.getProductData();
  }

  getFormattedData = product => ({
    brand: product.brand,
    description: product.description,
    imageUrl: product.imageUrl,
    id: product.id,
    quantity: product.quantity,
    category: product.category,
    price: product.price,
    rating: product.rating,
    stock: product.stock,
    title: product.title,
  });

  getProductData = async () => {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;

    this.setState({ apiStatus: apiStatusConstants.inProgress });

    const jwtToken = localStorage.getItem('jwt_token');
    const apiUrl = `http://localhost:3000/product/${id}`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    };

    try {
      const response = await fetch(apiUrl, options);
      if (response.ok) {
        const fetchedData = await response.json();
        const updatedData = this.getFormattedData(fetchedData);
        this.setState({
          productData: updatedData,
          apiStatus: apiStatusConstants.success,
        });
      } else {
        this.setState({ apiStatus: apiStatusConstants.failure });
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  renderLoadingView = () => (
    <div className="product-details-loader-container" data-testid="loader">
      <ThreeDots color="#0b69ff" height="50" width="50" />
    </div>
  );

  renderFailureView = () => (
    <div className="product-details-error-view">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="product-details-error-image"
      />
      <h1 className="product-details-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="product-details-continue-shopping-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  );

  onDecrementQuantity = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity > 1 ? prevState.quantity - 1 : prevState.quantity,
    }));
  };

  onIncrementQuantity = () => {
    this.setState(prevState => ({ quantity: prevState.quantity + 1 }));
  };

  renderProductDetailsView = () => (
    <CartContext.Consumer>
      {value => {
        const { productData, quantity } = this.state;
        const { brand, description, imageUrl, price, rating, title, stock } = productData;
        const { addCartItem } = value;

        const onClickAddToCart = () => {
          addCartItem({ ...productData, quantity });
        };

        return (
          <div className="product-details-success-view">
            <div className="product-details-main-container">
              <img src={imageUrl} alt="product" className="product-details-image" />
              <div className="product-details-info">
                <h1 className="product-details-title">{title}</h1>
                <p className="product-details-price">Rs {price}/-</p>
                <div className="product-details-rating-reviews">
                  <div className="product-details-rating">
                    <p className="product-details-rating-value">{rating}</p>
                    <MdOutlineStar className="product-details-star-icon" />
                  </div>
                </div>
                <p className="product-details-description">{description}</p>
                <div className="product-details-label-value">
                  <p className="product-details-label">Stock:</p>
                  <p className="product-details-value">{stock}</p>
                </div>
                <div className="product-details-label-value">
                  <p className="product-details-label">Brand:</p>
                  <p className="product-details-value">{brand}</p>
                </div>
                <hr className="product-details-line" />
                <div className="product-details-quantity-container">
                  <button
                    type="button"
                    className="product-details-quantity-btn"
                    onClick={this.onDecrementQuantity}
                    data-testid="minus"
                  >
                    <BsDashSquare className="product-details-quantity-icon" />
                  </button>
                  <p className="product-details-quantity">{quantity}</p>
                  <button
                    type="button"
                    className="product-details-quantity-btn"
                    onClick={this.onIncrementQuantity}
                    data-testid="plus"
                  >
                    <BsPlusSquare className="product-details-quantity-icon" />
                  </button>
                </div>
                <button
                  type="button"
                  className="product-details-add-to-cart-btn"
                  onClick={onClickAddToCart}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </CartContext.Consumer>
  );

  renderProductDetails = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  render() {
    return (
      <>
        <MobileHeader />
        <Header />
        <div className="product-details-container">{this.renderProductDetails()}</div>
        <Footer />
      </>
    );
  }
}

export default ProductDetails;
