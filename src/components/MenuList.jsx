function MenuList({ items, onAdd }) {
  if (!items || items.length === 0) {
    return <p className="muted">No menu items available.</p>;
  }

  return (
    <div className="grid">
      {items.map((item) => (
        <article className="card" key={item.id}>
          <h3>{item.name}</h3>

          <p className="muted">Category: {item.category}</p>

          <p className="price">RM {item.price.toFixed(2)}</p>

          {item.popular && <p className="muted">Popular item</p>}

          <button type="button" className="btn" onClick={() => onAdd(item)}>
            Add to cart
          </button>
        </article>
      ))}
    </div>
  );
}

export default MenuList;
