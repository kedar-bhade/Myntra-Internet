import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'

function ProductList({ onAdd, categoryId, search }) {
  const [products, setProducts] = useState([])
  useEffect(() => {
    const url = categoryId
      ? `/api/categories/${categoryId}/products`
      : '/api/products'
    fetch(url)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error)
  }, [categoryId])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="products">
      {filtered.map(p => (
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
  )
}

function Cart({ items, onRemove }) {
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
    </div>
  )
}

function App() {
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [search, setSearch] = useState('')

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

  return (
    <BrowserRouter>
      <header className="nav">
        <Link to="/" className="brand">Myntra</Link>
        <nav className="menu">
          {categories.map(c => (
            <button
              key={c.id}
              className={selectedCategory === c.id ? 'active' : ''}
              onClick={() => setSelectedCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </nav>
        <input
          type="text"
          className="search"
          placeholder="Search for products, brands and more"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Link to="/cart" className="cart-link">Cart ({cart.length})</Link>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <ProductList
              onAdd={addToCart}
              categoryId={selectedCategory}
              search={search}
            />
          }
        />
        <Route
          path="/cart"
          element={<Cart items={cart} onRemove={removeFromCart} />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
