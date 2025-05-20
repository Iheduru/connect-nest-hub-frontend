
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Upload, CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const kycSchema = yup.object({
  document_type: yup.string().required('Document type is required'),
  kyc_document: yup.mixed()
    .test('required', 'Document is required', (value) => value && value.length > 0)
    .test('fileSize', 'File size must be less than 2MB', (value) => {
      if (!value || !value[0]) return true;
      return value[0].size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'File must be JPEG, PNG, JPG, GIF, SVG, or PDF', (value) => {
      if (!value || !value[0]) return true;
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml', 'application/pdf'];
      return acceptedTypes.includes(value[0].type);
    }),
});

type KycFormData = {
  document_type: string;
  kyc_document: FileList;
};

// Mock KYC statuses
type KycStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

const KycVerificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState<KycStatus>('not_submitted');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KycFormData>({
    resolver: yupResolver(kycSchema),
  });

  const onSubmit = (data: KycFormData) => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      console.log('KYC data:', data);
      toast.success('KYC document submitted successfully');
      setKycStatus('pending');
      setLoading(false);
    }, 1500);
  };

  const handleResubmit = () => {
    setKycStatus('not_submitted');
    setRejectionReason(null);
  };

  const renderKycStatus = () => {
    switch (kycStatus) {
      case 'pending':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <Loader2 className="h-6 w-6 text-yellow-600 animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Verification in Progress</h3>
            <p className="text-yellow-700 mb-4">
              Your KYC document has been submitted and is currently under review. This process may take up to 24-48 hours.
            </p>
          </div>
        );
      case 'approved':
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-2">Verification Approved</h3>
            <p className="text-green-700 mb-4">
              Congratulations! Your identity has been verified successfully. You now have full access to all platform features.
            </p>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Verification Rejected</h3>
            <p className="text-red-700 mb-4">
              Unfortunately, your verification was not approved. Reason: {rejectionReason || 'Document quality issues'}
            </p>
            <button 
              onClick={handleResubmit} 
              className="btn-primary"
            >
              Resubmit Documents
            </button>
          </div>
        );
      default:
        return renderKycForm();
    }
  };

  const renderKycForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-input-group">
          <label htmlFor="document_type" className="form-label">
            Document Type
          </label>
          <select
            id="document_type"
            {...register('document_type')}
            className={`form-input ${errors.document_type ? 'border-red-500' : ''}`}
            disabled={loading}
          >
            <option value="">Select document type</option>
            <option value="passport">Passport</option>
            <option value="drivers_license">Driver's License</option>
            <option value="national_id">National ID Card</option>
            <option value="residence_permit">Residence Permit</option>
          </select>
          {errors.document_type && (
            <p className="form-error">{errors.document_type.message}</p>
          )}
        </div>

        <div className="form-input-group">
          <label htmlFor="kyc_document" className="form-label">
            Upload Document
          </label>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.kyc_document ? 'border-red-500' : 'border-gray-300'}`}>
            <label htmlFor="kyc_document" className="cursor-pointer">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary bg-opacity-10 mb-4">
                <Upload className="h-6 w-6 text-brand-primary" />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, JPG, GIF, SVG, PDF (max. 2MB)
              </p>
              <input
                id="kyc_document"
                type="file"
                {...register('kyc_document')}
                className="hidden"
                disabled={loading}
                accept=".jpeg,.jpg,.png,.gif,.svg,.pdf"
              />
            </label>
          </div>
          {errors.kyc_document && (
            <p className="form-error">{errors.kyc_document.message as string}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Please ensure your document is clear, unedited, and shows all corners. Blurry or incomplete documents will be rejected.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </span>
            ) : (
              'Submit for Verification'
            )}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">KYC Verification</h1>
        <p className="text-muted-foreground">
          Complete your identity verification process to access all platform features
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        {renderKycStatus()}
      </div>
    </div>
  );
};

export default KycVerificationPage;
