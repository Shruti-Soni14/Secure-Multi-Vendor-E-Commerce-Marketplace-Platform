import { useState, useEffect } from "react";

const BASE_URL = "https://ecommerce-backend-g1wa.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  const [showPayment, setShowPayment] = useState(false);

  // LOGIN
  const login = async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!data) {
      alert("Login failed ❌");
      return;
    }

    setUser(data);
  };

  // FETCH DATA
  useEffect(() => {
    if (user) {
      fetch(`${BASE_URL}/api/products`)
        .then(res => res.json())
        .then(data => setProducts(data));

      fetch(`${BASE_URL}/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCart(data));

      fetch(`${BASE_URL}/orders/${user.id}`)
        .then(res => res.json())
        .then(data => setOrders(data));

      if (user.role === "ADMIN") {
        fetch(`${BASE_URL}/orders/all`)
          .then(res => res.json())
          .then(data => setAllOrders(data));
      }
    }
  }, [user]);

  // ADD TO CART
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
        .then(data => setCart(data));
    });
  };

  // REMOVE FROM CART
  const removeFromCart = (id) => {
    fetch(`${BASE_URL}/cart/${id}`, {
      method: "DELETE"
    }).then(() => {
      fetch(`${BASE_URL}/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCart(data));
    });
  };

  // LOGIN UI
  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Login</h1>

        <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br /><br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br /><br />

        <button onClick={login}>Login</button>
      </div>
    );
  }

  const uniqueProducts = [...new Map(products.map(p => [p.name, p])).values()];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome {user.username} 👋</h1>

      {/* PRODUCTS */}
      <h2>Products</h2>

      {uniqueProducts.map(p => (
        <div key={p.id}>
          {p.name} - ₹{p.price}

          {user.role === "USER" && (
            <button onClick={() => addToCart(p)}>
              Add to Cart
            </button>
          )}
        </div>
      ))}

      {/* USER CART */}
      {user.role === "USER" && (
        <>
          <h2>Your Cart 🛒</h2>

          {cart.map(c => (
            <div key={c.id}>
              {c.productName} - ₹{c.price}

              <button onClick={() => removeFromCart(c.id)}>
                Remove ❌
              </button>
            </div>
          ))}

          <h3>
            Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}
          </h3>

          {cart.length > 0 && (
            <button onClick={() => setShowPayment(true)}>
              Payment 💳
            </button>
          )}

          {/* PAYMENT */}
          {showPayment && (
            <div>
              <h2>Payment</h2>

              <button onClick={() => {
                alert("Payment Successful ✅");

                fetch(`${BASE_URL}/orders/checkout/${user.id}`, {
                  method: "POST"
                }).then(() => {
                  setCart([]);
                  setShowPayment(false);

                  fetch(`${BASE_URL}/orders/${user.id}`)
                    .then(res => res.json())
                    .then(data => setOrders(data));
                });
              }}>
                Pay Now
              </button>
            </div>
          )}

          {/* ORDER HISTORY */}
          <h2>Orders</h2>

          {orders.map(o => (
            <div key={o.id}>
              {o.productName} - ₹{o.price}
            </div>
          ))}
        </>
      )}

      {/* ADMIN */}
      {user.role === "ADMIN" && (
        <>
          <h2>All Orders</h2>

          {allOrders.map(o => (
            <div key={o.id}>
              User: {o.userId} | {o.productName} - ₹{o.price}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
