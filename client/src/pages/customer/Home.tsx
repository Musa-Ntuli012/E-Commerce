import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../services/api';
import { formatCurrency } from '../../utils/format';
import type { Product } from '../../types';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productsApi.getFeatured();
        if (response.success && response.products) {
          setFeaturedProducts(response.products);
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Electronics', image: '/categories/electronics.jpg', link: '/shop?category=Electronics' },
    { name: 'Fashion', image: '/categories/fashion.jpg', link: '/shop?category=Fashion' },
    { name: 'Home & Living', image: '/categories/home.jpg', link: '/shop?category=Home%20%26%20Living' },
    { name: 'Sports & Outdoors', image: '/categories/sports.jpg', link: '/shop?category=Sports%20%26%20Outdoors' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative z-10">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Welcome to SA Shop
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
              Your trusted South African e-commerce platform. Discover amazing products with fast, reliable delivery across South Africa.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary-light transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-neutral-surface">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-16 text-neutral-text-primary">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={category.link}
                className="group relative overflow-hidden rounded-2xl card card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>
                  <span className="text-2xl font-bold text-neutral-text-primary group-hover:text-white relative z-10 transition-colors duration-300">
                    {category.name}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-primary font-semibold text-lg">
                    Shop {category.name} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-neutral-text-primary">Featured Products</h2>
            <p className="text-neutral-text-secondary text-lg">Handpicked favorites just for you</p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {product.isFeatured && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="badge badge-primary">Featured</span>
                    </div>
                  )}
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
                      <span className="text-2xl font-extrabold text-primary">
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
      </section>
    </div>
  );
}

