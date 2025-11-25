import { useEffect, useState } from 'react';
import { usersApi } from '../../services/api';
import { formatCurrency } from '../../utils/format';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await usersApi.getDashboardStats();
        if (response.success && response.stats) {
          setStats(response);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats?.stats?.totalRevenue ? formatCurrency(stats.stats.totalRevenue) : 'R0.00',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats?.stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: stats?.stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Users',
      value: stats?.stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your e-commerce platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order #</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.slice(0, 10).map((order: any) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2">{order.orderNumber}</td>
                    <td className="p-2">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="p-2">{formatCurrency(order.total)}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No recent orders</p>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Top Products</h2>
        {stats?.topProducts && stats.topProducts.length > 0 ? (
          <div className="space-y-4">
            {stats.topProducts.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{item.product?.name || 'Unknown Product'}</p>
                  <p className="text-sm text-gray-600">
                    {item.totalSold} units sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {item.product?.price ? formatCurrency(item.product.price) : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No product data available</p>
        )}
      </div>
    </div>
  );
}


