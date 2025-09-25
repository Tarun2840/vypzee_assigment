import React, { useState } from 'react';

export default function AddItemForm({ onAdd }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), quantity: quantity.trim(), category: category.trim() });
    setName(''); setQuantity(''); setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} style={{display:'grid', gap:8}}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Item name" />
      <div style={{display:'flex', gap:8}}>
        <input value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="Quantity (optional)" />
        <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category (optional)" />
        <button type="submit">Add</button>
      </div>
    </form>
  );
}
