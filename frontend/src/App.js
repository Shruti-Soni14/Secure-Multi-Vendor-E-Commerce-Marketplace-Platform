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

  // SEARCH + FILTER
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // ADMIN ADD PRODUCT
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // LOGIN
  const login = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      setUser(data);

    } catch (err) {
      alert("Login error");
    }
  };

  // FETCH DATA
  useEffect(() => {
    if (user) {

      fetch(`${BASE_URL}/api/products`)
        .then(res => res.json())
        .then(data => setProducts(data));

      fetch(`${BASE_URL}/api/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCart(data));

      fetch(`${BASE_URL}/api/orders/${user.id}`)
        .then(res => res.json())
        .then(data => setOrders(data));

      if (user.role === "ADMIN") {
        fetch(`${BASE_URL}/api/orders/all`)
          .then(res => res.json())
          .then(data => setAllOrders(data));
      }
    }
  }, [user]);

  // REMOVE DUPLICATES
  const uniqueProducts = [...new Map(products.map(p => [p.id, p])).values()];

  // FILTER LOGIC
  const filteredProducts = uniqueProducts.filter(p => {
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (minPrice === "" || p.price >= Number(minPrice)) &&
      (maxPrice === "" || p.price <= Number(maxPrice))
    );
  });

  // ADD TO CART
  const addToCart = (p) => {
    fetch(`${BASE_URL}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        productId: p.id,
        productName: p.name,
        price: p.price
      })
    }).then(() => {
      fetch(`${BASE_URL}/api/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCart(data));
    });
  };

  // REMOVE FROM CART
  const removeFromCart = (id) => {
    fetch(`${BASE_URL}/api/cart/${id}`, {
      method: "DELETE"
    }).then(() => {
      fetch(`${BASE_URL}/api/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCart(data));
    });
  };

  // PAYMENT
  const handlePayment = () => {
    fetch(`${BASE_URL}/api/orders/checkout/${user.id}`, {
      method: "POST"
    }).then(() => {
      alert("Payment Successful ");
      setCart([]);
      setShowPayment(false);

      fetch(`${BASE_URL}/api/orders/${user.id}`)
        .then(res => res.json())
        .then(data => setOrders(data));
    });
  };

  // ADMIN ADD PRODUCT
  const addProduct = () => {
    fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: newName,
        price: Number(newPrice)
      })
    })
    .then(res => res.json())
    .then(() => {
      alert("Product Added ");
      setNewName("");
      setNewPrice("");

      fetch(`${BASE_URL}/api/products`)
        .then(res => res.json())
        .then(data => setProducts(data));
    });
  };

  // LOGIN UI
  if (!user) {
    return (
      <div className="container mt-5">
        <h2>Login</h2>

        <input
          className="form-control mb-2"
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />

        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button className="btn btn-primary" onClick={login}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <h2>Welcome {user.username}</h2>

      {/* SEARCH + FILTER */}
      <div className="card p-3 mb-3">
        <h5>🔍 Search & Filter</h5>

        <div className="row">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Search product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Min Price"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Max Price"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <h4>Products</h4>
      {filteredProducts.map(p => (
        <div key={p.id} className="card p-2 mb-2">
          {p.name} - ₹{p.price}

          {user.role === "USER" && (
            <button
              className="btn btn-success mt-2"
              onClick={() => addToCart(p)}
            >
              Add to Cart
            </button>
          )}
        </div>
      ))}

      {/* USER CART */}
      {user.role === "USER" && (
        <>
          <h4>Cart</h4>

          {cart.map(c => (
            <div key={c.id} className="card p-2 mb-2">
              {c.productName} - ₹{c.price}

              <button
                className="btn btn-danger mt-2"
                onClick={() => removeFromCart(c.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <h5>Total: ₹{cart.reduce((sum, i) => sum + i.price, 0)}</h5>

          {cart.length > 0 && (
            <button
              className="btn btn-warning"
              onClick={() => setShowPayment(true)}
            >
              Payment
            </button>
          )}

          {showPayment && (
            <button className="btn btn-success mt-2" onClick={handlePayment}>
              Pay Now
            </button>
          )}

          <h4>Orders</h4>
          {orders.map(o => (
            <div key={o.id}>{o.productName} - ₹{o.price}</div>
          ))}
        </>
      )}

      {/* ADMIN PANEL */}
      {user.role === "ADMIN" && (
        <>
          <h4>Admin Panel</h4>

          <input
            className="form-control mb-2"
            placeholder="Product Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />

          <input
            className="form-control mb-2"
            type="number"
            placeholder="Price"
            value={newPrice}
            onChange={e => setNewPrice(e.target.value)}
          />

          <button className="btn btn-primary" onClick={addProduct}>
            Add Product
          </button>

          <h4 className="mt-3">All Orders</h4>
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
