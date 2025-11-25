import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../../services/api';
import { formatCurrency } from '../../utils/format';
import type { Product } from '../../types';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await productsApi.getById(id);
        if (response.success && response.product) {
          setProduct(response.product);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-200 rounded overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          {product.brand && <p className="text-gray-600 mb-4">{product.brand}</p>}
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-blue-600">
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">SKU:</span> {product.sku}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Stock:</span>{' '}
              {product.stockQuantity > 0 ? (
                <span className="text-green-600">{product.stockQuantity} available</span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <label className="font-semibold">Quantity:</label>
            <div className="flex items-center gap-2 border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="p-2 hover:bg-gray-100"
                disabled={quantity >= product.stockQuantity}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stockQuantity === 0}
                      className="btn-primary w-full flex items-center justify-center gap-2 disabled:bg-neutral-text-muted disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      <ShoppingCart size={20} strokeWidth={2.5} />
                      {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
        </div>
      </div>
    </div>
  );
}

