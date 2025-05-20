
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { KycFormData } from '@/types/forms';

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

const schema = yup.object({
  kyc_document: yup
    .mixed()
    .test('fileSize', 'The file is too large. Max size is 2MB', (value: any) => {
      if (!value || !value[0]) return true;
      return value[0].size <= 2 * 1024 * 1024; // 2MB
    })
    .test('fileType', 'Only JPEG, PNG, and PDF files are allowed', (value: any) => {
      if (!value || !value[0]) return true;
      return allowedFileTypes.includes(value[0].type);
    })
    .required('Document file is required'),
  document_type: yup.string().required('Document type is required'),
}).required();

const KycVerificationPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState<'not_submitted' | 'pending' | 'approved' | 'rejected'>('not_submitted');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<KycFormData>({
    resolver: yupResolver(schema) as any,
  });
  
  const onSubmit = async (data: KycFormData) => {
    setIsSubmitting(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success scenario
      toast({
        title: "KYC Document Submitted",
        description: "Your document has been uploaded and is pending verification.",
      });
      
      // Update status
      setKycStatus('pending');
      
      // Reset form
      reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-4">KYC Verification</h1>
        <p className="text-muted-foreground mb-8">
          To comply with regulations and ensure security, we need to verify your identity. 
          Please upload a valid identification document.
        </p>
      </div>
      
      {/* Status Card */}
      {kycStatus !== 'not_submitted' && (
        <div className={`mb-8 p-4 rounded-md animate-fade-in ${
          kycStatus === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
          kycStatus === 'approved' ? 'bg-green-50 border border-green-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start">
            <div className={`rounded-full p-2 mr-3 ${
              kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-600' :
              kycStatus === 'approved' ? 'bg-green-100 text-green-600' :
              'bg-red-100 text-red-600'
            }`}>
              {kycStatus === 'pending' ? '⏳' :
              kycStatus === 'approved' ? '✅' :
              '❌'}
            </div>
            <div>
              <h3 className="font-bold mb-1">
                {kycStatus === 'pending' ? 'Verification Pending' :
                kycStatus === 'approved' ? 'Verification Approved' :
                'Verification Rejected'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {kycStatus === 'pending' ? 'Your document is being reviewed by our team. This usually takes 1-2 business days.' :
                kycStatus === 'approved' ? 'Your identity has been verified. You now have full access to all features.' :
                'Your document was rejected. Please check the reasons below and resubmit.'}
              </p>
              
              {kycStatus === 'rejected' && (
                <div className="mt-2 p-3 bg-white rounded border border-red-100">
                  <h4 className="text-sm font-bold mb-1">Rejection Reason:</h4>
                  <p className="text-sm">Document image is not clear enough. Please upload a higher quality image.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Resubmission form for rejected status or initial submission */}
      {(kycStatus === 'not_submitted' || kycStatus === 'rejected') && (
        <div className="bg-white p-6 rounded-lg border animate-fade-in">
          <h2 className="text-xl font-bold mb-4">
            {kycStatus === 'rejected' ? 'Resubmit Verification Document' : 'Submit Verification Document'}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Document Type</label>
              <select
                {...register('document_type')}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">Select document type</option>
                <option value="passport">Passport</option>
                <option value="national_id">National ID Card</option>
                <option value="drivers_license">Driver's License</option>
                <option value="residence_permit">Residence Permit</option>
              </select>
              {errors.document_type && (
                <p className="text-red-600 text-sm">{errors.document_type.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Upload Document</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  {...register('kyc_document')}
                  className="hidden"
                  id="kyc_document"
                />
                <label 
                  htmlFor="kyc_document" 
                  className="cursor-pointer text-brand-primary hover:text-brand-primary/80 block"
                >
                  <div className="space-y-2">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="block text-sm font-medium">
                      Click to upload or drag and drop
                    </span>
                    <span className="block text-xs text-gray-500">
                      JPEG, PNG or PDF (max 2MB)
                    </span>
                  </div>
                </label>
              </div>
              {errors.kyc_document && (
                <p className="text-red-600 text-sm">{errors.kyc_document.message}</p>
              )}
            </div>
            
            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Submitting...' : kycStatus === 'rejected' ? 'Resubmit Document' : 'Submit Document'}
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Instructions */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg animate-fade-in [animation-delay:300ms]">
        <h3 className="text-lg font-bold mb-3">Document Guidelines</h3>
        <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
          <li>Documents must be current and not expired</li>
          <li>All four corners of the document must be visible</li>
          <li>Information on the document must be clearly readable</li>
          <li>No glare or shadows should obstruct any part of the document</li>
          <li>Files must be less than 2MB in size</li>
          <li>Supported formats: JPEG, PNG, PDF</li>
        </ul>
        
        <h3 className="text-lg font-bold mt-6 mb-3">What Happens Next?</h3>
        <p className="text-sm text-gray-600 mb-2">
          Our team will review your submission within 1-2 business days. You'll be notified by email once the verification is complete.
        </p>
        <p className="text-sm text-gray-600">
          If your document is rejected, you'll receive specific feedback on why it was rejected and how to correct it for resubmission.
        </p>
      </div>
    </div>
  );
};

export default KycVerificationPage;
