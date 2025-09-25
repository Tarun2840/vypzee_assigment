import React, { useEffect, useState } from 'react';
import './App.css';  // <-- Import CSS
import AddItemForm from './components/AddItemForm';
import ShoppingList from './components/ShoppingList';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/items`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError('Could not load items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Shopping List</h1>
        <p>Add, edit, and remove items easily.</p>
      </header>

      <AddItemForm onAdd={async (newItem) => {
        try {
          const res = await fetch(`${API_BASE}/api/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
          });
          if (!res.ok) throw new Error('Add failed');
          const created = await res.json();
          setItems(prev => [created, ...prev]);
        } catch (err) {
          setError('Add failed');
        }
      }} />

      {error && <div style={{color: 'red', marginTop: 10}}>{error}</div>}
      {loading ? <div>Loading...</div> : <ShoppingList items={items} onUpdate={(id, updates) => {
        fetch(`${API_BASE}/api/items/${id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(updates)
        })
        .then(res => res.json())
        .then(updated => setItems(prev => prev.map(i => i.id === id ? updated : i)));
      }} onDelete={(id) => {
        fetch(`${API_BASE}/api/items/${id}`, { method: 'DELETE' })
        .then(() => setItems(prev => prev.filter(i => i.id !== id)));
      }} />}
    </div>
  );
}

export default App;
