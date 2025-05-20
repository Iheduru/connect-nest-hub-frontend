
import { useState } from 'react';
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          View, search and manage all registered users
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex flex-wrap gap-4 md:gap-6 mb-6">
          {/* Search */}
          <div className="flex-grow md:flex-grow-0 md:min-w-72">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-9 w-full form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-2 items-center">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="form-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="client">Clients</option>
              <option value="host">Hosts</option>
              <option value="admin">Admins</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Username</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">KYC Status</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="text-center">
                <td colSpan={7} className="px-4 py-6 text-muted-foreground">
                  No users found
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing 0 of 0 users
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-500">Page 1 of 1</span>
            <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals could be added here */}
    </div>
  );
};

export default AdminUsersPage;
