import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EditProfileDialog = ({ isOpen, onClose }) => {
  const { profile, updateUser, updateProfile } = useUserStore();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: ''
  });
  
  const [profileData, setProfileData] = useState({
    bio: '',
    currentPosition: '',
    pastWork: [],
    education: []
  });

  useEffect(() => {
    if (profile) {
      setUserData({
        name: profile.userId?.name || '',
        username: profile.userId?.username || '',
        email: profile.userId?.email || ''
      });
      
      setProfileData({
        bio: profile.bio || '',
        currentPosition: profile.currentPosition || '',
        pastWork: profile.pastWork || [],
        education: profile.education || []
      });
    } else if (user) {
      setUserData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [profile, user]);

  const handleUserDataChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleProfileDataChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const addWorkExperience = () => {
    setProfileData({
      ...profileData,
      pastWork: [...profileData.pastWork, { company: '', position: '', years: '' }]
    });
  };

  const updateWorkExperience = (index, field, value) => {
    const newPastWork = [...profileData.pastWork];
    newPastWork[index][field] = value;
    setProfileData({ ...profileData, pastWork: newPastWork });
  };

  const removeWorkExperience = (index) => {
    const newPastWork = profileData.pastWork.filter((_, i) => i !== index);
    setProfileData({ ...profileData, pastWork: newPastWork });
  };

  const addEducation = () => {
    setProfileData({
      ...profileData,
      education: [...profileData.education, { school: '', degree: '', fieldOfStudy: '' }]
    });
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...profileData.education];
    newEducation[index][field] = value;
    setProfileData({ ...profileData, education: newEducation });
  };

  const removeEducation = (index) => {
    const newEducation = profileData.education.filter((_, i) => i !== index);
    setProfileData({ ...profileData, education: newEducation });
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Update user info
      const userResult = await updateUser(userData);
      if (!userResult.success) {
        toast.error(userResult.message);
        setLoading(false);
        return;
      }
      
      // Update profile data
      const profileResult = await updateProfile(profileData);
      if (profileResult.success) {
        toast.success('Profile updated successfully');
        onClose();
      } else {
        toast.error(profileResult.message);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={userData.name}
                onChange={handleUserDataChange}
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={userData.username}
                onChange={handleUserDataChange}
                placeholder="Your username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleUserDataChange}
                placeholder="your@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleProfileDataChange}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentPosition">Current Position</Label>
              <Input
                id="currentPosition"
                name="currentPosition"
                value={profileData.currentPosition}
                onChange={handleProfileDataChange}
                placeholder="e.g., Software Engineer at Tech Corp"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="work" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Work Experience</Label>
              <Button type="button" size="sm" onClick={addWorkExperience}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            
            {profileData.pastWork.map((work, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <h4 className="font-medium">Experience {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWorkExperience(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={work.company}
                    onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={work.position}
                    onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                    placeholder="Your position"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Years</Label>
                  <Input
                    value={work.years}
                    onChange={(e) => updateWorkExperience(index, 'years', e.target.value)}
                    placeholder="e.g., 2020-2023"
                  />
                </div>
              </div>
            ))}
            
            {profileData.pastWork.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No work experience added yet
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="education" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Education</Label>
              <Button type="button" size="sm" onClick={addEducation}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            
            {profileData.education.map((edu, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <h4 className="font-medium">Education {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>School</Label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(index, 'school', e.target.value)}
                    placeholder="School name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="e.g., Bachelor of Science"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                    placeholder="e.g., Computer Science"
                  />
                </div>
              </div>
            ))}
            
            {profileData.education.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No education added yet
              </p>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
