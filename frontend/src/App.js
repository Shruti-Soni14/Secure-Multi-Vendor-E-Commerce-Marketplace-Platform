import { useState, useEffect } from "react";

const BASE_URL = "https://ecommerce-backend-g1wa.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState([]);
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
      fetch(`${BASE_URL}/api/products`).then(res => res.json()).then(setProducts);
      fetch(`${BASE_URL}/api/cart/${user.id}`).then(res => res.json()).then(setCart);
      fetch(`${BASE_URL}/api/orders/${user.id}`).then(res => res.json()).then(setOrders);
    }
  }, [user]);

  // ADD
  const addToCart = (p) => {
    fetch(`${BASE_URL}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        productName: p.name,
        price: p.price
      })
    }).then(() => {
      fetch(`${BASE_URL}/api/cart/${user.id}`)
        .then(res => res.json())
        .then(setCart);
    });
  };

  // REMOVE
  const removeFromCart = (id) => {
    fetch(`${BASE_URL}/api/cart/${id}`, { method: "DELETE" })
      .then(() => {
        fetch(`${BASE_URL}/api/cart/${user.id}`)
          .then(res => res.json())
          .then(setCart);
      });
  };

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input onChange={e => setUsername(e.target.value)} placeholder="Username" /><br/><br/>
        <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" /><br/><br/>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome {user.username}</h2>

      <h3>Products</h3>
      {products.map(p => (
        <div key={p.id}>
          {p.name} - ₹{p.price}
          <button onClick={() => addToCart(p)}>Add</button>
        </div>
      ))}

      <h3>Cart</h3>
      {cart.map(c => (
        <div key={c.id}>
          {c.productName} - ₹{c.price}
          <button onClick={() => removeFromCart(c.id)}>Remove</button>
        </div>
      ))}

      <h4>Total: ₹{cart.reduce((s,i)=>s+i.price,0)}</h4>

      {cart.length > 0 && (
        <>
          <button onClick={() => setShowPayment(true)}>Payment</button>

          {showPayment && (
            <div>
              <button onClick={() => {
                fetch(`${BASE_URL}/api/orders/checkout/${user.id}`, { method: "POST" })
                  .then(() => {
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
