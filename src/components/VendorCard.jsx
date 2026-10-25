function VendorCard({ vendor, isSelected, onSelect }) {
  return (
    <article className="card vendor-card" aria-label={vendor.name}>
      <div className="thumb" aria-hidden="true">
        {vendor.name.charAt(0)}
      </div>

      <div>
        <h2>{vendor.name}</h2>

        <p className="muted">{vendor.location}</p>

        <p className="muted">Open: {vendor.openHours}</p>

        <span className={vendor.isOpen ? "status open" : "status closed"}>
          {vendor.isOpen ? "Open now" : "Closed"}
        </span>

        <button
          type="button"
          className="btn"
          style={{ marginTop: "0.75rem" }}
          aria-pressed={isSelected}
          onClick={() => onSelect(vendor.id)}
        >
          {isSelected ? "Selected" : "View menu"}
        </button>
      </div>
    </article>
  );
}

export default VendorCard;
