import React, { Component } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { BsFilterRight } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import Header from '../Header';
import FiltersGroup from '../FiltersGroup';
import './index.css';
import MobileHeader from '../MobileHeader';
import Footer from '../Footer';
import Popup from 'reactjs-popup'; // Import the Popup component
import 'reactjs-popup/dist/index.css'; // Import default styles

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
};

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
];

class Products extends Component {
  state = {
    apiStatus: apiStatusConstants.inProgress,
    productsList: [],
    filteredProductsList: [],
    searchInput: '',
    activeCategory: '',
    activeRatingId: '',
    activeOptionId: sortbyOptions[0].optionId,
    showMobileFilters: false,
  };

  componentDidMount() {
    this.getProductsData();
  }

  getProductsData = async () => {
    const url = 'https://shoppy-mobiv2.onrender.com/products';
    const jwtToken = localStorage.getItem('jwt_token');
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map(product => ({
          title: product.title,
          imageUrl: product.imageUrl,
          rating: product.rating,
          id: product.id,
          category: product.category,
          price: product.price,
        }));
        this.setState({
          productsList: formattedData,
          filteredProductsList: formattedData,
          apiStatus: apiStatusConstants.success,
        });
      } else {
        this.setState({ apiStatus: apiStatusConstants.failure });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  onChangeSearchInput = event => {
    this.setState({ searchInput: event.target.value }, this.filterProducts);
  };

  onChangeSortby = event => {
    this.setState({ activeOptionId: event.target.value }, this.filterProducts);
  };

  changeCategory = category => {
    this.setState({ activeCategory: category }, this.filterProducts);
  };

  changeRating = ratingId => {
    this.setState({ activeRatingId: ratingId }, this.filterProducts);
  };

  clearFilters = () => {
    this.setState(
      {
        activeCategory: '',
        activeRatingId: '',
        searchInput: '',
      },
      this.filterProducts
    );
  };

  filterProducts = () => {
    const { productsList, searchInput, activeCategory, activeRatingId, activeOptionId } = this.state;

    let sortedProductsList = [...productsList];
    if (activeOptionId === 'PRICE_HIGH') {
      sortedProductsList = sortedProductsList.sort((a, b) => b.price - a.price);
    } else if (activeOptionId === 'PRICE_LOW') {
      sortedProductsList = sortedProductsList.sort((a, b) => a.price - b.price);
    }

    const filteredProductsList = sortedProductsList.filter(product => {
      const productsSearch = product.title.toLowerCase().includes(searchInput.toLowerCase());
      const productsCategory = activeCategory ? product.category === activeCategory : true;
      const productsRating = activeRatingId ? product.rating >= parseInt(activeRatingId, 10) : true;

      return productsSearch && productsCategory && productsRating;
    });

    this.setState({ filteredProductsList });
  };

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <ThreeDots height="50" width="50" color="blue" ariaLabel="loading" />
    </div>
  );

  renderFailureView = () => (
    <div className="fail-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="fail-img"
        alt="failure"
      />
      <h1 className="fail-h1">Oops! Something Went Wrong</h1>
      <p className="fail-p">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="profile-btn"
        type="button"
        onClick={this.getProductsData}
      >
        Retry
      </button>
    </div>
  );

  renderProductsList = () => {
    const { filteredProductsList } = this.state;

    if (filteredProductsList.length === 0) {
      return <p className="no-products">No products found</p>;
    }

    return (
      <ul className="products-list2">
        {filteredProductsList.map(product => (
          <li key={product.id} className="product-item2">
            <img src={product.imageUrl} alt={product.title} className="product-image2" />
            <div className="product-rating-con2">
              <h1 className="product-title2">{product.title}</h1>
              <p className="product-rating2">Rating: {product.rating}</p>
            </div>
            <Link to={`/product/${product.id}`}>
              <p className="item-link">Click here to see all details</p>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  renderProductsView = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsList();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  toggleMobileFilters = () => {
    this.setState(prevState => ({
      showMobileFilters: !prevState.showMobileFilters,
    }));
  };

  renderMobileFilters = () => {
    const { showMobileFilters, activeCategory, activeRatingId } = this.state;
    console.log('showMobileFilters', showMobileFilters);
    const categoryOptions = [
      { categoryId: '1', name: 'Electronics' },
      { categoryId: '2', name: 'Food' },
      { categoryId: '3', name: 'Clothes' },
      { categoryId: '6', name: 'Toys' },
    ];

    const ratingsList = [
      { ratingId: '4', imageUrl: 'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png' },
      { ratingId: '3', imageUrl: 'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png' },
      { ratingId: '2', imageUrl: 'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png' },
      { ratingId: '1', imageUrl: 'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png' },
    ];

    return (
      <Popup
        open={showMobileFilters}
        closeOnDocumentClick
        contentStyle={{ marginLeft: '20px', width: '70%', maxWidth: '400px' }} // Custom styles
      >
        <div className="mobile-filter-popup-content">
          <div className="mobile-filter-header">
            <button
              type="button"
              className="mobile-filter-close-button"
              onClick={this.toggleMobileFilters}
            >
              <AiOutlineClose />
            </button>
            <h1 className="mobile-filter-heading">Filters</h1>
          </div>
          <FiltersGroup
            categoryOptions={categoryOptions}
            ratingsList={ratingsList}
            changeCategory={this.changeCategory}
            changeRating={this.changeRating}
            activeCategory={activeCategory}
            activeRatingId={activeRatingId}
            clearFilters={this.clearFilters}
          />
        </div>
      </Popup>
    );
  };

  render() {
    const { searchInput, activeCategory, activeRatingId, activeOptionId } = this.state;

    const categoryOptions = [
      { categoryId: '1', name: 'Electronics' },
      { categoryId: '2', name: 'Food' },
      { categoryId: '3', name: 'Clothes' },
      { categoryId: '6', name: 'Toys' },
    ];

    const ratingsList = [
      { ratingId: '4', imageUrl: 'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png' },
      { ratingId: '3', imageUrl: 'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png' },
      { ratingId: '2', imageUrl: 'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png' },
      { ratingId: '1', imageUrl: 'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png' },
    ];

    return (
      <div className="products-bg">
        <MobileHeader />
        <Header />
        <div className="products-bg-container">
          <button
            type="button"
            className="mobile-filter-button popup"
            onClick={this.toggleMobileFilters}

          >
            <BsFilterRight /> Filters
          </button>

          {this.renderMobileFilters()}
          <div className="filters-container">
            <FiltersGroup
              categoryOptions={categoryOptions}
              ratingsList={ratingsList}
              changeCategory={this.changeCategory}
              changeRating={this.changeRating}
              activeCategory={activeCategory}
              activeRatingId={activeRatingId}
              clearFilters={this.clearFilters}
            />
          </div>
          <div className="products-con">
            <div className="product-header">
              <div className="search-container">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search for products"
                  value={searchInput}
                  onChange={this.onChangeSearchInput}
                />
                <button type="button" className="search-btn" onClick={this.filterProducts}>
                  Search
                </button>
              </div>
              <div className="sort-by-container">
                <BsFilterRight className="sort-by-icon" />
                <p className="sort-by">Sort by</p>
                <select
                  className="sort-by-select"
                  value={activeOptionId}
                  onChange={this.onChangeSortby}
                >
                  {sortbyOptions.map(eachOption => (
                    <option
                      key={eachOption.optionId}
                      value={eachOption.optionId}
                      className="select-option"
                    >
                      {eachOption.displayText}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="products-container">
              {this.renderProductsView()}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Products;

