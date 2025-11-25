import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../services/api';
import { formatCurrency } from '../../utils/format';
import type { Product } from '../../types';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: 1,
          limit: 20,
        };
        if (filters.category) params.category = filters.category;
        if (filters.search) params.search = filters.search;
        if (filters.minPrice) params.minPrice = parseFloat(filters.minPrice);
        if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
        if (filters.brand) params.brand = filters.brand;
        params.sortBy = filters.sortBy;
        params.sortOrder = filters.sortOrder;

        const response = await productsApi.getAll(params);
        if (response.success && response.products) {
          setProducts(response.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Sports & Outdoors',
    'Beauty & Health',
    'Books & Media',
    'Toys & Games',
    'Groceries',
  ];

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64">
          <div className="card p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-6 text-neutral-text-primary">Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-text-primary">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search products..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    placeholder="Min"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    placeholder="Max"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters({ ...filters, sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({
                  category: '',
                  search: '',
                  minPrice: '',
                  maxPrice: '',
                  brand: '',
                  sortBy: 'createdAt',
                  sortOrder: 'desc',
                })}
                className="w-full text-primary hover:text-primary-dark text-sm font-semibold mt-4"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-8 text-neutral-text-primary">Shop</h1>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-text-secondary text-lg mb-4">No products found</p>
              <p className="text-neutral-text-muted">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-square bg-neutral-surface overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="product-card-image"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-text-muted">
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors duration-200 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    {product.brand && (
                      <p className="text-sm text-neutral-text-secondary mb-3">{product.brand}</p>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-extrabold text-primary">
                        {formatCurrency(product.price)}
                      </span>
                      {product.comparePrice && (
                        <span className="text-neutral-text-muted line-through text-sm">
                          {formatCurrency(product.comparePrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addItem(product)}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} strokeWidth={2.5} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

