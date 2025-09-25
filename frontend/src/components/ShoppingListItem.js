import React, { useState } from 'react';

export default function ShoppingListItem({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity || '');
  const [category, setCategory] = useState(item.category || '');

  const save = () => {
    if (!name.trim()) return;
    onUpdate(item.id, { name, quantity, category });
    setEditing(false);
  };

  return (
    <div className="shopping-item">
      <div>
        {!editing ? (
          <>
            <div className="item-name" style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
              {item.name}
            </div>
            <div className="item-details">
              {quantity || '—'} {category ? ` · ${category}` : ''}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 6 }}>
            <input value={name} onChange={e => setName(e.target.value)} />
            <input value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="qty" />
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="category" />
          </div>
        )}
      </div>
      <div>
        {!editing ? (
          <>
            <button className="action-btn" onClick={() => setEditing(true)}>Edit</button>
            <button className="action-btn delete-btn" onClick={() => onDelete(item.id)}>Delete</button>
          </>
        ) : (
          <>
            <button className="action-btn" onClick={save}>Save</button>
            <button className="action-btn" onClick={() => setEditing(false)}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}
