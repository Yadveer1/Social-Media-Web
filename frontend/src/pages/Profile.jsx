import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { usePostStore } from '@/stores/postStore';

import ProfileCard from '@/components/profile/ProfileCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/posts/PostCard';

const Profile = () => {
  const { profile, fetchProfile, loading } = useUserStore();
  const { myPosts, fetchMyPosts, loading: postsLoading } = usePostStore();

  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileCard isOwnProfile={true} />
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">My Posts</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-4">
          {postsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : myPosts.length > 0 ? (
            myPosts.map(post => (
              <PostCard key={post._id} post={post} showActions={true} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't posted anything yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="about" className="space-y-4">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">About</h3>
            {profile?.bio ? (
              <p className="text-gray-700">{profile.bio}</p>
            ) : (
              <p className="text-muted-foreground">No bio added yet</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
