import { useEffect, useState } from 'react';
import { ordersApi } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/format';
import type { Order } from '../../types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const params: any = { limit: 100 };
      if (statusFilter) params.status = statusFilter;

      const response = await ordersApi.getAll(params);
      if (response.success && response.orders) {
        setOrders(response.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Order #</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Payment</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{order.orderNumber}</td>
                    <td className="p-4">
                      {order.user?.firstName} {order.user?.lastName}
                      <br />
                      <span className="text-sm text-gray-600">{order.user?.email}</span>
                    </td>
                    <td className="p-4">{formatCurrency(order.total)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : order.paymentStatus === 'FAILED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">{formatDate(order.createdAt)}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


