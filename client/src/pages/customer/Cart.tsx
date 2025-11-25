import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/format';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = getTotal();
  const shipping = subtotal >= 500 ? 0 : 50;
  const tax = subtotal * 0.15; // 15% VAT
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
          <Link
            to="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-lg shadow-md p-4 flex gap-4"
            >
              <Link to={`/product/${item.product.id}`}>
                <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  {item.product.images[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="flex-1">
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="font-semibold text-lg hover:text-blue-600 mb-1">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-2">{item.product.brand}</p>
                <p className="text-lg font-bold text-blue-600 mb-4">
                  {formatCurrency(item.product.price)}
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 min-w-[60px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                      disabled={item.quantity >= item.product.stockQuantity}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
          
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (VAT)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {subtotal < 500 && (
              <p className="text-sm text-gray-600 mb-4">
                Add {formatCurrency(500 - subtotal)} more for free shipping!
              </p>
            )}

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </button>
            
            <Link
              to="/shop"
              className="block text-center text-blue-600 hover:text-blue-700 mt-4 text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

