import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState(null);

  // Fetch the product list from the server when the application mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to load products from server:", err));
  }, []);

  // Add an item to the shopping cart or increment quantity if it exists
  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...currentCart, { ...product, qty: 1 }];
    });
  };

  // Submit cart items to the server to process the order mock checkout
  const processCheckout = () => {
    fetch('http://localhost:5000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: cart })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrderId(data.orderId);
          setCart([]); // Reset the cart after successful order placement
        }
      })
      .catch((err) => console.error("Checkout process failed:", err));
  };

  // Calculate the total cost of items present in the shopping cart
  const totalCost = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="store-wrapper">
      <header className="header-navigation">
        <h1>MiniShop Storefront</h1>
        <div className="cart-counter">
          Cart Count: {cart.reduce((total, item) => total + item.qty, 0)}
        </div>
      </header>

      {orderId && (
        <div className="notification-banner">
          Success! Order #{orderId} has been generated successfully.
          <button onClick={() => setOrderId(null)}>Dismiss</button>
        </div>
      )}

      <main className="layout-content">
        <section className="catalog-grid">
          {products.map((product) => (
            <div key={product.id} className="catalog-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </section>

        <aside className="sidebar-cart">
          <h2>Shopping Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} className="sidebar-cart-item">
                  <span>{item.name} (x{item.qty})</span>
                  <span>${item.price * item.qty}</span>
                </div>
              ))}
              <div className="sidebar-total">
                <strong>Total Amount: ${totalCost}</strong>
              </div>
              <button className="checkout-action-btn" onClick={processCheckout}>
                Complete Checkout
              </button>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;