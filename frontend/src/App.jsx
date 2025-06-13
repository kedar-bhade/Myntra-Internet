import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from './Header'
import './App.css'

function ProductList({ onAdd, categoryId, query }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    let endpoint = '/api/products'
    if (query) {
      endpoint = `/api/products/search?q=${encodeURIComponent(query)}`
    } else if (categoryId) {
      endpoint = `/api/categories/${categoryId}/products`
    }
    fetch(endpoint)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error)
  }, [query, categoryId])

  return (
    <div className="products-wrapper">
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
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState(null)

  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(setCart)
  }, [])

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories)
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
      <Header
        categories={categories}
        cartCount={cart.length}
        onSearch={setQuery}
        onCategory={setCategoryId}
      />
      <Routes>
        <Route path="/" element={<ProductList onAdd={addToCart} query={query} categoryId={categoryId} />} />
        <Route path="/cart" element={<Cart items={cart} onRemove={removeFromCart} onCheckout={checkout} />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
