import { useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Upload, Briefcase, GraduationCap } from 'lucide-react';

import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { API_BASE_URL, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils/constants';
import { getInitials, validateFile, getProfilePictureUrl } from '@/utils/formatters';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import EditProfileDialog from './EditProfileDialog';

const ProfileCard = ({ isOwnProfile = false }) => {
  const { profile, uploadProfilePicture } = useUserStore();
  const { user } = useAuthStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const currentUser = profile?.userId || user;

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setUploading(true);
    try {
      const result = await uploadProfilePicture(file);
      if (result.success) {
        toast.success('Profile picture updated successfully');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="relative pb-0">
          <div className="h-32 bg-linear-to-r from-blue-600 to-purple-600 rounded-t-lg" />
          <div className="absolute top-20 left-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage
                  src={getProfilePictureUrl(currentUser?.profilePicture, API_BASE_URL)}
                  alt={currentUser?.name || 'User'}
                />
                <AvatarFallback className="text-2xl">
                  {currentUser?.name ? getInitials(currentUser.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <label
                  htmlFor="profile-picture-upload"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100"
                >
                  <Upload className="w-4 h-4" />
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-16 space-y-4">
          <div className="flex flex-col justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{currentUser?.name || 'User'}</h2>
              <p className="text-sm text-muted-foreground">@{currentUser?.username || 'username'}</p>
            </div>
            {isOwnProfile && (
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {profile?.bio && (
            <p className="text-sm text-gray-700">{profile.bio}</p>
          )}

          {profile?.currentPosition && (
            <div className="flex items-start gap-2">
              <Briefcase className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">{profile.currentPosition}</p>
              </div>
            </div>
          )}

          <Separator />

          {profile?.pastWork && profile.pastWork.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Work Experience
              </h3>
              <div className="space-y-2">
                {profile.pastWork.map((work, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{work.position}</p>
                    <p className="text-muted-foreground">{work.company}</p>
                    {work.years && (
                      <p className="text-xs text-muted-foreground">{work.years}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile?.education && profile.education.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Education
              </h3>
              <div className="space-y-2">
                {profile.education.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{edu.school}</p>
                    <p className="text-muted-foreground">
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isOwnProfile && (
        <EditProfileDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
    </>
  );
};

export default ProfileCard;
