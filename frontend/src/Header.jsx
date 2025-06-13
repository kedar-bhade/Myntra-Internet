import { Link } from 'react-router-dom'
import { useState } from 'react'

function Header({ categories, cartCount, onSearch, onCategory }) {
  const [query, setQuery] = useState('')
  const handleSearch = e => {
    const val = e.target.value
    setQuery(val)
    onSearch(val)
  }
  return (
    <header className="header">
      <div className="logo">Myntra Demo</div>
      <nav className="menu">
        <a onClick={() => onCategory(null)}>HOME</a>
        {categories.map(c => (
          <a key={c.id} onClick={() => onCategory(c.id)}>{c.name.toUpperCase()}</a>
        ))}
      </nav>
      <input
        className="search-bar"
        placeholder="Search for products"
        value={query}
        onChange={handleSearch}
      />
      <div className="actions">
        <Link to="/cart">Bag ({cartCount})</Link>
        <Link to="/orders">Orders</Link>
      </div>
    </header>
  )
}

export default Header
