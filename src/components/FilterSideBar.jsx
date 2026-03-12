import { FiX } from "react-icons/fi";
import "../styles/shop.css";

const FilterSidebar = ({
  filters,
  onFilterChange,
  onClearFilters,
  isOpen,
  onClose,
}) => {
  const categories = ["Running", "Casual", "Sports", "Formal"];

  const sizes = ["38", "39", "40", "41", "42", "43", "44", "45"];

  const colors = ["Black", "White", "Blue", "Red", "Green", "Brown"];

  const priceRanges = [
    { label: "Under ₹2000", min: 0, max: 2000 },
    { label: "₹2000 - ₹4000", min: 2000, max: 4000 },
    { label: "₹4000 - ₹6000", min: 4000, max: 6000 },
    { label: "Above ₹6000", min: 6000, max: 999999 },
  ];

  return (
    <>
      {/* Overlay — mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside
        className={`filter-sidebar
                ${isOpen ? "open" : ""}`}
      >
        {/* ── HEADER ── */}
        <div className="sidebar-header">
          <h3 className="sidebar-title">Filters</h3>
          <div className="sidebar-header-right">
            <button className="clear-filters-btn" onClick={onClearFilters}>
              Clear All
            </button>
            <button className="sidebar-close" onClick={onClose}>
              <FiX />
            </button>
          </div>
        </div>

        {/* ── CATEGORY ── */}
        <div className="filter-group">
          <h4 className="filter-group-title">Category</h4>
          <div className="filter-options">
            {categories.map((cat) => (
              <label key={cat} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={filters.category === cat}
                  onChange={(e) => onFilterChange("category", e.target.value)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── SIZE ── */}
        <div className="filter-group">
          <h4 className="filter-group-title">Size</h4>
          <div className="size-options">
            {sizes.map((size) => (
              <button
                key={size}
                className={`size-btn
                                    ${filters.size === size ? "active" : ""}`}
                onClick={() =>
                  onFilterChange("size", filters.size === size ? "" : size)
                }
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* ── COLOR ── */}
        <div className="filter-group">
          <h4 className="filter-group-title">Color</h4>
          <div className="filter-options">
            {colors.map((color) => (
              <label key={color} className="filter-option">
                <input
                  type="radio"
                  name="color"
                  value={color}
                  checked={filters.color === color}
                  onChange={(e) => onFilterChange("color", e.target.value)}
                />
                <span>{color}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── PRICE RANGE ── */}
        <div className="filter-group">
          <h4 className="filter-group-title">Price Range</h4>
          <div className="filter-options">
            {priceRanges.map((range) => (
              <label key={range.label} className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value={range.label}
                  checked={filters.priceLabel === range.label}
                  onChange={() => onFilterChange("price", range)}
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
