
import { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

type KycStatus = 'pending' | 'approved' | 'rejected';

const AdminKycPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Mocked empty state for now
  const kycSubmissions: any[] = [];

  const handleApprove = (userId: number) => {
    toast.success(`KYC approved for user ID: ${userId}`);
  };

  const handleReject = (userId: number) => {
    toast.success(`KYC rejected for user ID: ${userId}`);
  };

  const getStatusBadge = (status: KycStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">KYC Management</h1>
        <p className="text-muted-foreground">
          Review and verify user identification documents
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
                placeholder="Search by username or email..."
                className="pl-9 w-full form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex space-x-2 items-center">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Submissions</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* KYC Submissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">User</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Document Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Submitted</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {kycSubmissions.length > 0 ? (
                kycSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-4 py-3">{submission.user}</td>
                    <td className="px-4 py-3">{submission.email}</td>
                    <td className="px-4 py-3">{submission.document_type}</td>
                    <td className="px-4 py-3">{submission.submitted_at}</td>
                    <td className="px-4 py-3">{getStatusBadge(submission.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center space-x-2">
                        <button className="p-2 rounded-md hover:bg-gray-100">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button 
                          className="p-2 rounded-md hover:bg-green-100"
                          onClick={() => handleApprove(submission.user_id)}
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </button>
                        <button 
                          className="p-2 rounded-md hover:bg-red-100"
                          onClick={() => handleReject(submission.user_id)}
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center">
                  <td colSpan={6} className="px-4 py-6 text-muted-foreground">
                    No KYC submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing 0 of 0 submissions
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

      {/* View KYC Document Modal would be added here */}
      {/* Reject Reason Modal would be added here */}
    </div>
  );
};

export default AdminKycPage;
