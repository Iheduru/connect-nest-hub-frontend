
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Camera, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

const profileSchema = yup.object({
  phone_number: yup.string().nullable(),
  alternative_email: yup.string().email('Please enter a valid email').nullable(),
  middle_name: yup.string().nullable(),
  bio: yup.string().nullable(),
  gender: yup.string().nullable(),
  address: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  country: yup.string().nullable(),
});

type ProfileFormData = {
  phone_number: string | null;
  alternative_email: string | null;
  middle_name: string | null;
  bio: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
};

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      phone_number: null,
      alternative_email: null,
      middle_name: null,
      bio: null,
      gender: null,
      address: null,
      city: null,
      state: null,
      country: null,
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock image upload
    setUploadingImage(true);
    // Simulating upload delay
    setTimeout(() => {
      setProfileImage(URL.createObjectURL(file));
      setUploadingImage(false);
      toast.success('Profile image uploaded successfully');
    }, 1500);
  };

  const onSubmit = (data: ProfileFormData) => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      console.log('Profile data:', data);
      toast.success('Profile updated successfully');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg border shadow-sm">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-gray-500" />
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-brand-primary text-white p-1 rounded-full cursor-pointer">
                <Camera className="h-4 w-4" />
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </label>
            </div>
            <div className="text-center">
              <h3 className="font-medium">{user?.first_name} {user?.last_name}</h3>
              <p className="text-sm text-muted-foreground">@{user?.username}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-3 bg-white p-6 rounded-lg border shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-input-group">
                  <label htmlFor="middle_name" className="form-label">
                    Middle Name
                  </label>
                  <input
                    id="middle_name"
                    type="text"
                    {...register('middle_name')}
                    className="form-input"
                    placeholder="Enter your middle name (optional)"
                    disabled={loading}
                  />
                  {errors.middle_name && (
                    <p className="form-error">{errors.middle_name.message}</p>
                  )}
                </div>

                <div className="form-input-group">
                  <label htmlFor="phone_number" className="form-label">
                    Phone Number
                  </label>
                  <input
                    id="phone_number"
                    type="tel"
                    {...register('phone_number')}
                    className="form-input"
                    placeholder="Enter your phone number"
                    disabled={loading}
                  />
                  {errors.phone_number && (
                    <p className="form-error">{errors.phone_number.message}</p>
                  )}
                </div>
              </div>

              <div className="form-input-group">
                <label htmlFor="alternative_email" className="form-label">
                  Alternative Email
                </label>
                <input
                  id="alternative_email"
                  type="email"
                  {...register('alternative_email')}
                  className={`form-input ${errors.alternative_email ? 'border-red-500' : ''}`}
                  placeholder="Enter an alternative email (optional)"
                  disabled={loading}
                />
                {errors.alternative_email && (
                  <p className="form-error">{errors.alternative_email.message}</p>
                )}
              </div>

              <div className="form-input-group">
                <label htmlFor="gender" className="form-label">
                  Gender
                </label>
                <select
                  id="gender"
                  {...register('gender')}
                  className="form-input"
                  disabled={loading}
                >
                  <option value="">Select gender (optional)</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-input-group">
                <label htmlFor="bio" className="form-label">
                  Bio
                </label>
                <textarea
                  id="bio"
                  {...register('bio')}
                  className="form-input min-h-[100px]"
                  placeholder="Tell us about yourself (optional)"
                  disabled={loading}
                ></textarea>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address Information</h3>
              
              <div className="form-input-group">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  {...register('address')}
                  className="form-input"
                  placeholder="Enter your street address (optional)"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="form-input-group">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    {...register('city')}
                    className="form-input"
                    placeholder="City"
                    disabled={loading}
                  />
                </div>

                <div className="form-input-group">
                  <label htmlFor="state" className="form-label">
                    State/Province
                  </label>
                  <input
                    id="state"
                    type="text"
                    {...register('state')}
                    className="form-input"
                    placeholder="State/Province"
                    disabled={loading}
                  />
                </div>

                <div className="form-input-group">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    {...register('country')}
                    className="form-input"
                    placeholder="Country"
                    disabled={loading}
                  />
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
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
