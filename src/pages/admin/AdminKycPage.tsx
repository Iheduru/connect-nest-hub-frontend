
import { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RootState } from '@/store';
import { listKycSubmissions, verifyKyc, getKycDocument } from '@/store/slices/kycSlice';
import { KycSubmission } from '@/types/user';
import { KycListParams } from '@/types/forms';

const AdminKycPage = () => {
  const dispatch = useDispatch();
  const { submissions, pagination, loading } = useSelector((state: RootState) => state.kyc);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewDocumentUrl, setViewDocumentUrl] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<KycSubmission | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filteredSubmissions, setFilteredSubmissions] = useState<KycSubmission[]>([]);

  // Load KYC submissions on component mount and filter change
  useEffect(() => {
    const params: KycListParams = { page: currentPage };
    
    if (statusFilter !== 'all') {
      params.status = statusFilter as 'pending' | 'approved' | 'rejected';
    }
    
    dispatch(listKycSubmissions(params) as any);
  }, [dispatch, statusFilter, currentPage]);

  // Filter submissions based on search query
  useEffect(() => {
    if (!submissions) {
      setFilteredSubmissions([]);
      return;
    }
    
    if (!searchQuery.trim()) {
      setFilteredSubmissions(submissions);
      return;
    }
    
    const filtered = submissions.filter(submission => 
      submission.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      submission.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredSubmissions(filtered);
  }, [submissions, searchQuery]);

  const handleViewDocument = async (userId: number) => {
    try {
      const resultAction = await dispatch(getKycDocument(userId) as any);
      
      if (getKycDocument.fulfilled.match(resultAction)) {
        setViewDocumentUrl(resultAction.payload.document_url);
        setIsDocumentModalOpen(true);
      }
    } catch (error) {
      toast.error('Failed to retrieve document');
    }
  };

  const handleApprove = async (submission: KycSubmission) => {
    try {
      await dispatch(verifyKyc({
        user_id: submission.user_id,
        status: 'approved'
      }) as any);
      
      // Refresh the list
      dispatch(listKycSubmissions({
        page: currentPage,
        status: statusFilter !== 'all' ? statusFilter as 'pending' | 'approved' | 'rejected' : undefined
      }) as any);
    } catch (error) {
      toast.error('Failed to approve KYC');
    }
  };

  const openRejectModal = (submission: KycSubmission) => {
    setSelectedSubmission(submission);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!selectedSubmission || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    try {
      await dispatch(verifyKyc({
        user_id: selectedSubmission.user_id,
        status: 'rejected',
        rejection_reason: rejectionReason
      }) as any);
      
      setIsRejectModalOpen(false);
      setSelectedSubmission(null);
      setRejectionReason('');
      
      // Refresh the list
      dispatch(listKycSubmissions({
        page: currentPage,
        status: statusFilter !== 'all' ? statusFilter as 'pending' | 'approved' | 'rejected' : undefined
      }) as any);
    } catch (error) {
      toast.error('Failed to reject KYC');
    }
  };

  const getStatusBadge = (status: string) => {
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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.total_pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
              <Input
                type="text"
                placeholder="Search by username or email..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex space-x-2 items-center">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Submissions</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? (
                <tr className="text-center">
                  <td colSpan={6} className="px-4 py-6 text-muted-foreground">
                    Loading KYC submissions...
                  </td>
                </tr>
              ) : filteredSubmissions && filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.user_id}>
                    <td className="px-4 py-3">{submission.username}</td>
                    <td className="px-4 py-3">{submission.email}</td>
                    <td className="px-4 py-3">{submission.document_type}</td>
                    <td className="px-4 py-3">{formatDate(submission.submitted_at)}</td>
                    <td className="px-4 py-3">{getStatusBadge(submission.kyc_status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center space-x-2">
                        <button 
                          className="p-2 rounded-md hover:bg-gray-100"
                          onClick={() => handleViewDocument(submission.user_id)}
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        {submission.kyc_status === 'pending' && (
                          <>
                            <button 
                              className="p-2 rounded-md hover:bg-green-100"
                              onClick={() => handleApprove(submission)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </button>
                            <button 
                              className="p-2 rounded-md hover:bg-red-100"
                              onClick={() => openRejectModal(submission)}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </button>
                          </>
                        )}
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
        {pagination && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {filteredSubmissions.length} of {pagination.total_items} submissions
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handlePrevPage} 
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">Page {currentPage} of {pagination.total_pages}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleNextPage} 
                disabled={currentPage >= pagination.total_pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Document View Modal */}
        <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>View KYC Document</DialogTitle>
              <DialogDescription>
                Review the submitted KYC document
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex justify-center">
              {viewDocumentUrl && (
                viewDocumentUrl.toLowerCase().endsWith('.pdf') ? (
                  <iframe 
                    src={viewDocumentUrl} 
                    className="w-full h-[500px]"
                    title="KYC Document"
                  />
                ) : (
                  <img 
                    src={viewDocumentUrl} 
                    alt="KYC Document"
                    className="max-h-[500px] object-contain" 
                  />
                )
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDocumentModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rejection Reason Modal */}
        <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject KYC Document</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this document. 
                The user will receive this feedback.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter className="flex space-x-2 justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminKycPage;
