import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'

function ProductList({ onAdd }) {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    const endpoint = query ? `/api/products/search?q=${encodeURIComponent(query)}` : '/api/products'
    fetch(endpoint)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error)
  }, [query])

  return (
    <div className="products-wrapper">
      <input
        className="search"
        placeholder="Search"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div className="products">
        {products.map(p => (
          <div className="product" key={p.id}>
            <img src={p.imageUrl} alt={p.name} />
            <div className="info">
              <h3>{p.name}</h3>
              <p>Rs.{p.price}</p>
              <button onClick={() => onAdd(p.id)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Cart({ items, onRemove, onCheckout }) {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
  }, [])
  const getProduct = id => products.find(p => p.id === id) || {}
  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <ul>
        {items.map(i => {
          const p = getProduct(i.productId)
          return (
            <li key={i.productId}>
              {p.name} ({i.quantity})
              <button onClick={() => onRemove(i.productId)}>Remove</button>
            </li>
          )
        })}
      </ul>
      {items.length > 0 && (
        <button className="checkout" onClick={onCheckout}>Checkout</button>
      )}
    </div>
  )
}

function Orders() {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(setOrders)
  }, [])
  return (
    <div className="orders">
      <h2>Orders</h2>
      <ul>
        {orders.map(o => (
          <li key={o.id}>Order #{o.id} - Rs.{o.totalPrice}</li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(setCart)
  }, [])

  const addToCart = productId => {
    fetch(`/api/cart/${productId}`, { method: 'POST' })
      .then(res => res.json())
      .then(setCart)
  }

  const removeFromCart = productId => {
    fetch(`/api/cart/${productId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(setCart)
  }

  const checkout = () => {
    fetch('/api/orders', { method: 'POST' })
      .then(res => res.json())
      .then(order => {
        setCart([])
        alert(`Order #${order.id} placed`)
      })
  }

  return (
    <BrowserRouter>
      <header className="nav">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cart.length})</Link>
        <Link to="/orders">Orders</Link>
      </header>
      <Routes>
        <Route path="/" element={<ProductList onAdd={addToCart} />} />
        <Route path="/cart" element={<Cart items={cart} onRemove={removeFromCart} onCheckout={checkout} />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
