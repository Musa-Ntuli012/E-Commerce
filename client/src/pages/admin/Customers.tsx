import { useEffect, useState } from 'react';
import { usersApi } from '../../services/api';
import { formatDate } from '../../utils/format';
import type { User } from '../../types';

export default function AdminCustomers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersApi.getAll({ limit: 100 });
      if (response.success && response.users) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-gray-600 mt-2">Manage customer accounts</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Phone</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="p-4">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.phone || 'N/A'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Name:</span> {selectedUser.firstName}{' '}
                {selectedUser.lastName}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {selectedUser.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {selectedUser.phone || 'N/A'}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {selectedUser.role}
              </p>
              {selectedUser.createdAt && (
                <p>
                  <span className="font-semibold">Joined:</span>{' '}
                  {formatDate(selectedUser.createdAt)}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


