import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { usePostStore } from '@/stores/postStore';
import { useUserStore } from '@/stores/userStore';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PostCard from '@/components/posts/PostCard';
import CreatePostDialog from '@/components/posts/CreatePostDialog';
import ProfileCard from '@/components/profile/ProfileCard';

const Dashboard = () => {
  const { posts, fetchAllPosts, loading } = usePostStore();
  const { fetchProfile } = useUserStore();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    fetchAllPosts();
    fetchProfile();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar - Profile Card */}
      <aside className="lg:col-span-3 hidden lg:block">
        <div className="sticky top-20">
          <ProfileCard isOwnProfile={true} />
        </div>
      </aside>
      
      {/* Main Feed */}
      <main className="lg:col-span-6 space-y-4">
        {/* Create Post Button */}
        <div className="bg-white p-4 rounded-lg shadow">
          <Button 
            className="w-full" 
            onClick={() => setIsCreatePostOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
        
        {/* Posts Feed */}
        <div className="space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="bg-white p-12 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share something with your network
              </p>
              <Button onClick={() => setIsCreatePostOpen(true)}>
                Create Your First Post
              </Button>
            </div>
          )}
        </div>
      </main>
      
      {/* Right Sidebar - Suggestions/Info */}
      <aside className="lg:col-span-3 hidden lg:block">
        <div className="sticky top-20 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Network Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posts</span>
                <span className="font-medium">{posts.length}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <CreatePostDialog 
        isOpen={isCreatePostOpen} 
        onClose={() => setIsCreatePostOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;

