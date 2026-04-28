import { useState, useEffect } from "react";

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
  const res = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!data || data === "Invalid username or password") {
    alert("Login failed ❌");
    return;
  }

  setUser(data);
 };

  // FETCH DATA
  useEffect(() => {
    if (user) {
      fetch("http://localhost:8080/api/products")
        .then(res => res.json())
        .then(data => setProducts(data));

      fetch(`http://localhost:8080/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCart(data));

      fetch(`http://localhost:8080/orders/${user.id}`)
        .then(res => res.json())
        .then(data => setOrders(data));

      if (user.role === "ADMIN") {
        fetch("http://localhost:8080/orders/all")
          .then(res => res.json())
          .then(data => setAllOrders(data));
      }
    }
  }, [user]);

  // ADD TO CART
  const addToCart = (p) => {
    fetch("http://localhost:8080/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        productId: p.id,
        productName: p.name,
        price: p.price
      })
    }).then(() => {
      fetch(`http://localhost:8080/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCart(data));
    });
  };

  // REMOVE FROM CART
  const removeFromCart = (id) => {
    fetch(`http://localhost:8080/cart/${id}`, {
      method: "DELETE"
    }).then(() => {
      fetch(`http://localhost:8080/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCart(data));
    });
  };

  // LOGIN UI
  if (!user) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h1>Login</h1>

        <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br /><br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br /><br />

        <button onClick={login}>Login</button>
      </div>
    );
  }

  const uniqueProducts = [...new Map(products.map(p => [p.name, p])).values()];

  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh"
    }}>
      <h1 style={{ color: "#333" }}>Welcome {user.username} 👋</h1>

      {/* PRODUCTS */}
      <h2>Products</h2>

      {uniqueProducts.map(p => (
        <div key={p.id} style={{
          backgroundColor: "white",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
          {p.name} - ₹{p.price}

          {user.role === "USER" && (
            <button
              onClick={() => addToCart(p)}
              style={{
                marginLeft: "10px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      ))}

      {/* USER CART */}
      {user.role === "USER" && (
        <>
          <h2 style={{ marginTop: "20px" }}>Your Cart 🛒</h2>

          {cart.length === 0 && <p style={{ color: "gray" }}>Your cart is empty 😢</p>}

          {cart.map(c => (
            <div key={c.id} style={{
              backgroundColor: "white",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}>
              {c.productName} - ₹{c.price}

              <button
                onClick={() => removeFromCart(c.id)}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Remove ❌
              </button>
            </div>
          ))}

          <h3 style={{ color: "#007bff" }}>
            Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}
          </h3>

          {cart.length > 0 && (
            <button
              onClick={() => setShowPayment(true)}
              style={{
                marginTop: "10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Proceed to Payment 💳
            </button>
          )}

          {/* PAYMENT PAGE */}
          {showPayment && (
            <div style={{
              backgroundColor: "white",
              padding: "20px",
              marginTop: "20px",
              borderRadius: "10px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
              maxWidth: "300px"
            }}>
              <h2>Payment Details 💳</h2>

              <input placeholder="Card Number" style={{ width: "90%", padding: "8px", marginBottom: "10px" }} />
              <input placeholder="Card Holder Name" style={{ width: "90%", padding: "8px", marginBottom: "10px" }} />
              <input placeholder="Expiry Date" style={{ width: "90%", padding: "8px", marginBottom: "10px" }} />
              <input placeholder="CVV" type="password" style={{ width: "90%", padding: "8px", marginBottom: "10px" }} />

              <h3>Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}</h3>

              <button onClick={() => {
                alert("Payment Successful ✅");

                fetch(`http://localhost:8080/orders/checkout/${user.id}`, {
                  method: "POST"
                }).then(() => {
                  setCart([]);
                  setShowPayment(false);

                  fetch(`http://localhost:8080/orders/${user.id}`)
                    .then(res => res.json())
                    .then(data => setOrders(data));
                });
              }}>
                Pay Now 💳
              </button>

              <button onClick={() => setShowPayment(false)} style={{ marginLeft: "10px" }}>
                Cancel ❌
              </button>
            </div>
          )}

          {/* ORDER HISTORY */}
          <h2 style={{ marginTop: "20px" }}>Order History 📦</h2>

          {orders.map(o => (
            <div key={o.id} style={{
              backgroundColor: "white",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: "5px"
            }}>
              {o.productName} - ₹{o.price}
            </div>
          ))}
        </>
      )}

      {/* ADMIN */}
      {user.role === "ADMIN" && (
        <>
          <h2>All Orders 📦</h2>

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
