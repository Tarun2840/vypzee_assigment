import React from 'react';
import ShoppingListItem from './ShoppingListItem';

export default function ShoppingList({ items, onUpdate, onDelete }) {
  if (!items || items.length === 0) {
    return <div style={{marginTop:20}}>No items yet! Add one above.</div>;
  }
  return (
    <ul style={{listStyle:'none', padding:0, marginTop:20}}>
      {items.map(item => (
        <li key={item.id} style={{marginBottom:8}}>
          <ShoppingListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
