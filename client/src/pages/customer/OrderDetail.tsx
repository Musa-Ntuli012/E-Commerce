import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersApi } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/format';
import type { Order } from '../../types';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const response = await ordersApi.getById(id);
        if (response.success && response.order) {
          setOrder(response.order);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p>Order not found</p>
        <Link to="/orders" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
        ← Back to Orders
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Order #{order.orderNumber}</h1>
            <p className="text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                order.status === 'DELIVERED'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'SHIPPED'
                  ? 'bg-blue-100 text-blue-800'
                  : order.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
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
                  <div className="flex-1">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="font-semibold hover:text-blue-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">
                      Price: {formatCurrency(item.priceAtPurchase)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(item.priceAtPurchase * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {order.shippingCost === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatCurrency(order.shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (VAT)</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.streetAddress}</p>
              <p>
                {order.shippingAddress.suburb}, {order.shippingAddress.city}
              </p>
              <p>
                {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


