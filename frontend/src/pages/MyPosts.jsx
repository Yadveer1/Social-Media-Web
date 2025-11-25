import { useEffect } from 'react';

import { usePostStore } from '@/stores/postStore';

import { Skeleton } from '@/components/ui/skeleton';
import PostCard from '@/components/posts/PostCard';

const MyPosts = () => {
  const { myPosts, fetchMyPosts, loading } = usePostStore();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <p className="text-muted-foreground">{myPosts.length} posts</p>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : myPosts.length > 0 ? (
        <div className="space-y-4">
          {myPosts.map(post => (
            <PostCard key={post._id} post={post} showActions={true} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground">
            You haven't created any posts. Share your thoughts with your network!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
