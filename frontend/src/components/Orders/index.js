import Header from '../Header'; // Import Header component
import './index.css';
import CartContext from '../../context/CartContext';
import MobileHeader from '../MobileHeader';
import Footer from '../Footer'; 

const Orders = () => (
  <>
   <MobileHeader />
    <Header /> {/* Display Header at the top */}
    <CartContext.Consumer>
      {value => {
        const { orders } = value;
        console.log('orders', orders); // Log the orders to the console for debugging

        return (
          <div className="orders-container">
            <h2 className="orders-heading">Your Orders</h2>

            {orders.length === 0 ? (
              <p className="no-orders-message">You have no orders placed yet.</p>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-item">
                    <img src={order.imageUrl} alt={order.title} className="order-image" />
                    <div className="order-details">
                      <h3 className="order-title">{order.title}</h3>
                      <p className="order-category">Category: {order.quantity}</p>
                      <p className="order-price">Price: Rs {order.price}/-</p>
                      <p className="order-status">✅ Order Placed</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }}
    </CartContext.Consumer>
    <Footer />
  </>
);

export default Orders;

