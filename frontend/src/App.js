import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

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

  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

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
      fetch(`${BASE_URL}/api/products`).then(r => r.json()).then(setProducts);
      fetch(`${BASE_URL}/api/cart/${user.id}`).then(r => r.json()).then(setCart);
      fetch(`${BASE_URL}/api/orders/${user.id}`).then(r => r.json()).then(setOrders);

      if (user.role === "ADMIN") {
        fetch(`${BASE_URL}/api/orders/all`).then(r => r.json()).then(setAllOrders);
      }
    }
  }, [user]);

  // ADD PRODUCT (ADMIN)
  const addProduct = () => {
    fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: newProduct.name,
        price: Number(newProduct.price)
      })
    }).then(() => {
      alert("Product Added ");
      setNewProduct({ name: "", price: "" });
      fetch(`${BASE_URL}/api/products`).then(r => r.json()).then(setProducts);
    });
  };

  // ADD TO CART
  const addToCart = (p) => {
    fetch(`${BASE_URL}/api/cart`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        userId: user.id,
        productName: p.name,
        price: p.price
      })
    }).then(() => {
      fetch(`${BASE_URL}/api/cart/${user.id}`).then(r => r.json()).then(setCart);
    });
  };

  const removeFromCart = (id) => {
    fetch(`${BASE_URL}/api/cart/${id}`, { method: "DELETE" })
      .then(() => {
        fetch(`${BASE_URL}/api/cart/${user.id}`).then(r => r.json()).then(setCart);
      });
  };

  // LOGIN UI
  if (!user) {
    return (
      <div className="container mt-5">
        <div className="card p-4 shadow">
          <h3 className="text-center mb-3">Login</h3>

          <input className="form-control mb-2"
            placeholder="Username"
            onChange={e => setUsername(e.target.value)} />

          <input className="form-control mb-3"
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)} />

          <button className="btn btn-primary w-100" onClick={login}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Welcome {user.username} 👋</h2>

      {/* ADMIN PANEL */}
      {user.role === "ADMIN" && (
        <div className="card p-3 mb-4 shadow">
          <h4>Admin Panel 🛠️</h4>

          <div className="row">
            <div className="col-md-4">
              <input className="form-control mb-2"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            </div>

            <div className="col-md-4">
              <input className="form-control mb-2"
                placeholder="Price"
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
            </div>

            <div className="col-md-4">
              <button className="btn btn-success w-100" onClick={addProduct}>
                Add Product
              </button>
            </div>
          </div>

          <h5 className="mt-4">All Orders 📦</h5>
          {allOrders.map(o => (
            <div className="border p-2 mb-2 rounded">
              User: {o.userId} | {o.productName} - ₹{o.price}
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS */}
      <h4>Products</h4>
      <div className="row">
        {products.map(p => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="card p-3 shadow-sm">
              <h5>{p.name}</h5>
              <p>₹{p.price}</p>
              <button className="btn btn-success"
                onClick={() => addToCart(p)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CART */}
      <h4>Cart 🛒</h4>
      {cart.map(c => (
        <div className="card p-2 mb-2">
          {c.productName} - ₹{c.price}
          <button className="btn btn-danger btn-sm float-end"
            onClick={() => removeFromCart(c.id)}>
            Remove
          </button>
        </div>
      ))}

      <h5>Total: ₹{cart.reduce((s,i)=>s+i.price,0)}</h5>

      {cart.length > 0 && (
        <>
          <button className="btn btn-primary mt-2"
            onClick={() => setShowPayment(true)}>
            Proceed to Payment 💳
          </button>

          {showPayment && (
            <div className="card p-3 mt-3 shadow">
              <h5>Payment</h5>
              <button className="btn btn-success"
                onClick={() => {
                  fetch(`${BASE_URL}/api/orders/checkout/${user.id}`, {method:"POST"})
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

      {/* ORDERS */}
      <h4 className="mt-4">Orders</h4>
      {orders.map(o => (
        <div className="card p-2 mb-2">
          {o.productName} - ₹{o.price}
        </div>
      ))}

    </div>
  );
}

export default App;
