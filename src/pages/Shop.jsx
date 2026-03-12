import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiFilter, FiGrid, FiList } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSideBar";
import { getAllProducts } from "../services/productService";
import "../styles/shop.css";
import { MdInbox } from "react-icons/md";

const Shop = () => {

    const [searchParams]  = useSearchParams()
    const [products, setProducts] = useState([])
    const [filtered, setFiltered] = useState([])
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('default')
    const [gridView, setGridView] = useState(true)

    const [filters, setFilters] = useState({
      category: searchParams.get('category') || '',
      size:'',
      color:'',
      priceLabel:'',
      minPrice:0,
      maxPrice:999999
    })

    useEffect(()=>{
      const fetchProducts = async () =>{
        try{
          setLoading(true)
          const data = await getAllProducts()
          setProducts(data)
        }catch(error){
          console.log('Error fetching products:', error)
        }finally{
          setLoading(false)
        }
      }
      fetchProducts()
    },[])

    useEffect(()=>{
      let result = [...products]

      if(search.trim()){
        result = result.filter(p=>
          p.name.toLowerCase()
          .includes(search.toLowerCase()) ||
          p.brand.toLowerCase()
          .includes(search.toLowerCase())
        )
      }

      if(filters.category){
        result = result.filter(p=>p.category===filters.category)
      }

      if(filters.color){
        result = result.filter(p=>p.color===filters.color)
      }

      result=result.filter(p=>
        p.price>=filters.minPrice &&
        p.price<=filters.maxPrice
      )

      if(sortBy==='price-low'){
        result.sort((a,b)=>a.price-b.price)
      }else if(sortBy==='price-high'){
        result.sort((a,b)=>b.price-a.price)
      }else if(sortBy==='name'){
        result.sort((a,b)=>a.name.localeCompare(b.name))
      }

      setFiltered(result)

    
    },[products,search, filters, sortBy])

    const handleFilterChange = (type, value)=>{
      if(type==='price'){
        setFilters(prev=>({
          ...prev,
          priceLabel:value.label,
          minPrice:value.min,
          maxPrice:value.max
        }))
      } else {
        setFilters(prev=>({
          ...prev,
          [type]:prev[type]===value ? '' : value
        }))
      }
    }

    const clearFilters = () => {
        setFilters({
            category   : '',
            size       : '',
            color      : '',
            priceLabel : '',
            minPrice   : 0,
            maxPrice   : 999999
        })
        setSearch('')
        setSortBy('default')
    }

  
  return (
    <div className="shop-page">
      <div className="container">
        {/* ── SHOP HEADER ── */}
        <div className="shop-header">
          <div className="shop-header-left">
            <h1 className="shop-title">All Products</h1>
            <p className="shop-count">{filtered.length} products found</p>
          </div>

          {/* Search + Sort + View */}
          <div className="shop-header-right">
            {/* Search */}
            <div className="shop-search">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="shop-search-input"
              />
            </div>

            {/* Sort */}
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            {/* Grid/List Toggle */}
            <div className="view-toggle">
              <button
                className={`view-btn
                                    ${gridView ? "active" : ""}`}
                onClick={() => setGridView(true)}
              >
                <FiGrid />
              </button>
              <button
                className={`view-btn
                                    ${!gridView ? "active" : ""}`}
                onClick={() => setGridView(false)}
              >
                <FiList />
              </button>
            </div>

            {/* Filter button — mobile */}
            <button
              className="filter-toggle-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <FiFilter />
              Filters
            </button>
          </div>
        </div>

        {/* ── SHOP BODY ── */}
        <div className="shop-body">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Products */}
          <div className="shop-products">
            {loading ? (
              <div className="loading-container">
                <div className="spinner" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try different filters</p>
                <button className="btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={gridView ? "products-grid-shop" : "products-list"}
              >
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
