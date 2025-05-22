
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { KycFormData } from '@/types/forms';
import { RootState } from '@/store';
import { getKycStatus, submitKyc, resubmitKyc } from '@/store/slices/kycSlice';
import { Upload, FilePenLine, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const maxFileSize = 2 * 1024 * 1024; // 2MB

const schema = yup.object({
  kyc_document: yup
    .mixed()
    .test('fileSize', 'The file is too large. Max size is 2MB', (value: any) => {
      if (!value || !value[0]) return true;
      return value[0].size <= maxFileSize;
    })
    .test('fileType', 'Only JPEG, PNG, and PDF files are allowed', (value: any) => {
      if (!value || !value[0]) return true;
      return allowedFileTypes.includes(value[0].type);
    })
    .required('Document file is required'),
  document_type: yup.string().required('Document type is required'),
}).required();

const KycVerificationPage = () => {
  const dispatch = useDispatch();
  const { status, documentType, submittedAt, rejectionReason, loading } = useSelector((state: RootState) => state.kyc);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<KycFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      document_type: '',
    }
  });

  useEffect(() => {
    dispatch(getKycStatus() as any);
  }, [dispatch]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('kyc_document', file as any);
      setFileName(file.name);
      
      // Create preview if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };
  
  const onSubmit = async (data: KycFormData) => {
    try {
      if (status === 'rejected') {
        await dispatch(resubmitKyc(data) as any);
      } else {
        await dispatch(submitKyc(data) as any);
      }
      
      // Reset form after submission
      form.reset();
      setFileName(null);
      setPreviewUrl(null);
      
      // Refresh KYC status
      dispatch(getKycStatus() as any);
    } catch (error) {
      console.error("KYC submission error:", error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
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
      {status !== 'not_submitted' && (
        <div className={`mb-8 p-4 rounded-md animate-fade-in ${
          status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
          status === 'approved' ? 'bg-green-50 border border-green-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start">
            <div className={`rounded-full p-2 mr-3 ${
              status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
              status === 'approved' ? 'bg-green-100 text-green-600' :
              'bg-red-100 text-red-600'
            }`}>
              {status === 'pending' ? <Clock className="h-5 w-5" /> :
              status === 'approved' ? <CheckCircle className="h-5 w-5" /> :
              <AlertTriangle className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-bold mb-1">
                {status === 'pending' ? 'Verification Pending' :
                status === 'approved' ? 'Verification Approved' :
                'Verification Rejected'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {status === 'pending' ? 'Your document is being reviewed by our team. This usually takes 1-2 business days.' :
                status === 'approved' ? 'Your identity has been verified. You now have full access to all features.' :
                'Your document was rejected. Please check the reasons below and resubmit.'}
              </p>
              
              {submittedAt && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Submitted: {formatDate(submittedAt)}
                </p>
              )}
              
              {documentType && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Document type: {documentType}
                </p>
              )}
              
              {status === 'rejected' && rejectionReason && (
                <div className="mt-2 p-3 bg-white rounded border border-red-100">
                  <h4 className="text-sm font-bold mb-1">Rejection Reason:</h4>
                  <p className="text-sm">{rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Submission/Resubmission form */}
      {(status === 'not_submitted' || status === 'rejected') && (
        <div className="bg-white p-6 rounded-lg border animate-fade-in">
          <h2 className="text-xl font-bold mb-4">
            {status === 'rejected' ? 'Resubmit Verification Document' : 'Submit Verification Document'}
          </h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="document_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="national_id">National ID Card</SelectItem>
                        <SelectItem value="drivers_license">Driver's License</SelectItem>
                        <SelectItem value="residence_permit">Residence Permit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="kyc_document"
                render={({ field: { onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Upload Document</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <input
                          type="file"
                          className="hidden"
                          id="kyc_document"
                          onChange={(e) => {
                            onFileChange(e);
                            onChange(e.target.files?.[0]);
                          }}
                          {...rest}
                        />
                        <label 
                          htmlFor="kyc_document" 
                          className="cursor-pointer text-brand-primary hover:text-brand-primary/80 block"
                        >
                          {fileName ? (
                            <div className="space-y-2">
                              <div className="mx-auto h-12 w-12 text-primary">
                                <FilePenLine className="h-12 w-12 mx-auto" />
                              </div>
                              <span className="block text-sm font-medium">
                                {fileName}
                              </span>
                              <span className="block text-xs text-primary">
                                Click to change file
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="mx-auto h-12 w-12 text-gray-400">
                                <Upload className="h-12 w-12 mx-auto" />
                              </div>
                              <span className="block text-sm font-medium">
                                Click to upload or drag and drop
                              </span>
                              <span className="block text-xs text-gray-500">
                                JPEG, PNG or PDF (max 2MB)
                              </span>
                            </div>
                          )}
                        </label>
                        
                        {previewUrl && (
                          <div className="mt-4">
                            <img 
                              src={previewUrl} 
                              alt="Document preview" 
                              className="max-h-40 mx-auto object-contain rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Submitting...' : status === 'rejected' ? 'Resubmit Document' : 'Submit Document'}
                </Button>
              </div>
            </form>
          </Form>
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
