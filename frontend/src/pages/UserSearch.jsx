import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

import { useConnectionStore } from '@/stores/connectionStore';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import UserCard from '@/components/connections/UserCard';

const UserSearch = () => {
  const { allUsers, searchUsers, loading, pagination } = useConnectionStore();
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    searchUsers('', 1, 50);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(keyword);
    searchUsers(keyword, 1, 50);
  };

  const handlePageChange = (newPage) => {
    searchUsers(searchTerm, newPage, 50);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Find People</h1>
        <p className="text-muted-foreground">Connect with professionals in your network</p>
      </div>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search by name, username, email, or position..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>
      
      {/* Results Count */}
      {!loading && (
        <p className="text-sm text-muted-foreground">
          Found {pagination.totalCount} users
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      )}
      
      {/* User Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : allUsers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allUsers.map(profile => (
              <UserCard key={profile._id} profile={profile} />
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-12 rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? `No results for "${searchTerm}". Try different keywords.`
              : 'Start searching to find people in your network'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
