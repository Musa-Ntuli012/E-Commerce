import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { ordersApi, paymentApi } from '../../services/api';
import { formatCurrency } from '../../utils/format';
import { SA_PROVINCES } from '../../types';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    suburb: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    suburb: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
  });

  const subtotal = getTotal();
  const shipping = subtotal >= 500 ? 0 : 50;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      // Create order
      const orderResponse = await ordersApi.create({
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress,
        billingAddress: useSameAddress ? shippingAddress : billingAddress,
        paymentMethod: 'PayFast',
      });

      if (orderResponse.success && orderResponse.order) {
        // Initiate payment
        const paymentResponse = await paymentApi.initiate();
        
        if (paymentResponse.success && paymentResponse.payfastUrl && paymentResponse.payfastData) {
          // Create form and submit to PayFast
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = paymentResponse.payfastUrl;
          
          Object.keys(paymentResponse.payfastData).forEach((key) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentResponse.payfastData[key];
            form.appendChild(input);
          });
          
          document.body.appendChild(form);
          form.submit();
          
          // Clear cart after successful order creation
          clearCart();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/shop')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-text-primary">First Name *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.firstName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.lastName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.streetAddress}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Suburb *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.suburb}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, suburb: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-text-primary">Province *</label>
                <select
                  required
                  value={shippingAddress.province}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, province: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">Select Province</option>
                  {SA_PROVINCES.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="sameAddress"
                checked={useSameAddress}
                onChange={(e) => setUseSameAddress(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="sameAddress" className="text-sm font-medium">
                Use same address for billing
              </label>
            </div>

            {!useSameAddress && (
              <div>
                <h2 className="text-xl font-bold mb-4">Billing Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name *</label>
                    <input
                      type="text"
                      required={!useSameAddress}
                      value={billingAddress.firstName}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name *</label>
                    <input
                      type="text"
                      required={!useSameAddress}
                      value={billingAddress.lastName}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Street Address *</label>
                    <input
                      type="text"
                      required={!useSameAddress}
                      value={billingAddress.streetAddress}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, streetAddress: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Suburb *</label>
                    <input
                      type="text"
                      required={!useSameAddress}
                      value={billingAddress.suburb}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, suburb: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input
                      type="text"
                      required={!useSameAddress}
                      value={billingAddress.city}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, city: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Province *</label>
                    <select
                      required={!useSameAddress}
                      value={billingAddress.province}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, province: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Select Province</option>
                      {SA_PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required={!useSameAddress}
                      value={billingAddress.postalCode}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, postalCode: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone *</label>
                    <input
                      type="tel"
                      required={!useSameAddress}
                      value={billingAddress.phone}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

