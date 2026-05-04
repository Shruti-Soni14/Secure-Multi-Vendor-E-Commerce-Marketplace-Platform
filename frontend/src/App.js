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

  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);

  // LOGIN
  const login = async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({username,password})
    });
    const data = await res.json();
    setUser(data);
  };

  // FETCH
  useEffect(() => {
    if(user){
      fetch(`${BASE_URL}/api/products`)
        .then(r=>r.json()).then(setProducts);

      fetch(`${BASE_URL}/api/cart/${user.id}`)
        .then(r=>r.json()).then(setCart);

      fetch(`${BASE_URL}/api/orders/${user.id}`)
        .then(r=>r.json()).then(setOrders);
    }
  },[user]);

  // FILTER
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // CART
  const addToCart = (p) => {
    fetch(`${BASE_URL}/api/cart`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        userId:user.id,
        productId:p.id,
        productName:p.name,
        price:p.price
      })
    }).then(()=>{
      fetch(`${BASE_URL}/api/cart/${user.id}`)
        .then(r=>r.json()).then(setCart);
    });
  };

  const removeFromCart = (id) => {
    fetch(`${BASE_URL}/api/cart/${id}`,{method:"DELETE"})
      .then(()=>{
        fetch(`${BASE_URL}/api/cart/${user.id}`)
          .then(r=>r.json()).then(setCart);
      });
  };

  // PAYMENT
  const checkout = () => {
    fetch(`${BASE_URL}/api/orders/checkout/${user.id}`,{method:"POST"})
      .then(()=>{
        alert("Order Placed ");
        setCart([]);
      });
  };

  // LOGIN UI
  if(!user){
    return(
      <div className="container mt-5 text-center">
        <h2> Multi Vendor E-Commerce Login </h2>
        <input className="form-control my-2" placeholder="Username"
          onChange={e=>setUsername(e.target.value)} />
        <input className="form-control my-2" type="password"
          placeholder="Password"
          onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-dark" onClick={login}>Login</button>
      </div>
    );
  }

  return(
    <div>

      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-dark px-3">
        <span className="navbar-brand">🛒 MyStore</span>

        <input
          className="form-control w-50"
          placeholder="Search E-Commerce..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <button className="btn btn-warning"
          onClick={()=>setShowCart(!showCart)}>
          🛒 Cart ({cart.length})
        </button>
      </nav>

      <div className="container mt-4">

        {/* PRODUCTS GRID */}
        <div className="row">
          {filteredProducts.map(p=>(
            <div className="col-md-3" key={p.id}>
              <div className="card shadow mb-4">
                <div className="card-body text-center">
                  <h5>{p.name}</h5>
                  <p>₹{p.price}</p>

                  {user.role==="USER" && (
                    <button className="btn btn-primary"
                      onClick={()=>addToCart(p)}>
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CART PANEL */}
        {showCart && (
          <div className="card p-3">
            <h4>🛒 Your Cart</h4>

            {cart.map(c=>(
              <div key={c.id} className="d-flex justify-content-between">
                <span>{c.productName} ₹{c.price}</span>
                <button className="btn btn-danger btn-sm"
                  onClick={()=>removeFromCart(c.id)}>
                  X
                </button>
              </div>
            ))}

            <hr/>
            <h5>Total: ₹{cart.reduce((s,i)=>s+i.price,0)}</h5>

            {cart.length>0 && (
              <button className="btn btn-success" onClick={checkout}>
                Checkout
              </button>
            )}
          </div>
        )}

        {/* ORDERS */}
        <h4 className="mt-4"> Orders</h4>
        {orders.map(o=>(
          <div key={o.id}>{o.productName} - ₹{o.price}</div>
        ))}

      </div>
    </div>
  );
}

export default App;
