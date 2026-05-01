import { useState, useEffect } from "react";

const BASE_URL = "https://ecommerce-backend-g1wa.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const [showPayment, setShowPayment] = useState(false);

  // LOGIN
  const login = async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    setUser(data);
  };

  // FETCH
  useEffect(() => {
    if (user) {
      fetch(`${BASE_URL}/api/products`)
        .then(res => res.json())
        .then(setProducts);

      fetch(`${BASE_URL}/cart/${user.id}`)
        .then(res => res.json())
        .then(setCart);

      fetch(`${BASE_URL}/orders/${user.id}`)
        .then(res => res.json())
        .then(setOrders);
    }
  }, [user]);

  // ADD CART
  const addToCart = (p) => {
    fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        productId: p.id,
        productName: p.name,
        price: p.price
      })
    }).then(() => {
      fetch(`${BASE_URL}/cart/${user.id}`)
        .then(res => res.json())
        .then(setCart);
    });
  };

  // REMOVE CART
  const removeFromCart = (id) => {
    fetch(`${BASE_URL}/cart/${id}`, { method: "DELETE" })
      .then(() => {
        fetch(`${BASE_URL}/cart/${user.id}`)
          .then(res => res.json())
          .then(setCart);
      });
  };

  // LOGIN UI
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br /><br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br /><br />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  // FILTER PRODUCTS
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome {user.username}</h2>

      {/* SEARCH */}
      <input
        placeholder="Search product..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      {/* PRODUCTS */}
      <h3>Products</h3>
      {filteredProducts.map(p => (
        <div key={p.id}>
          {p.name} - ₹{p.price}
          <button onClick={() => addToCart(p)}> Add</button>
        </div>
      ))}

      {/* CART */}
      <h3>Your Cart 🛒</h3>
      {cart.map(c => (
        <div key={c.id}>
          {c.productName} - ₹{c.price}
          <button onClick={() => removeFromCart(c.id)}> Remove</button>
        </div>
      ))}

      <h4>Total: ₹{cart.reduce((sum, i) => sum + i.price, 0)}</h4>

      {/* PAYMENT */}
      {cart.length > 0 && (
        <>
          <button onClick={() => setShowPayment(true)}>Proceed to Payment</button>

          {showPayment && (
            <div>
              <h3>Payment Page</h3>
              <p>Total: ₹{cart.reduce((sum, i) => sum + i.price, 0)}</p>

              <button onClick={() => {
                alert("Payment Done ✅");

                fetch(`${BASE_URL}/orders/checkout/${user.id}`, {
                  method: "POST"
                }).then(() => {
                  setCart([]);
                  setShowPayment(false);
                });
              }}>
                Pay Now
              </button>
            </div>
          )}
        </>
      )}

      {/* ORDERS */}
      <h3>Orders</h3>
      {orders.map(o => (
        <div key={o.id}>
          {o.productName} - ₹{o.price}
        </div>
      ))}
    </div>
  );
}

export default App;
