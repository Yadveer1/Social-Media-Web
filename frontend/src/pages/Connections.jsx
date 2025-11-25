import { useEffect } from 'react';

import { useConnectionStore } from '@/stores/connectionStore';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import ConnectionRequestCard from '@/components/connections/ConnectionRequestCard';

const Connections = () => {
  const { 
    sentRequests, 
    receivedRequests, 
    fetchSentRequests, 
    fetchReceivedRequests,
    loading 
  } = useConnectionStore();

  useEffect(() => {
    fetchSentRequests();
    fetchReceivedRequests();
  }, []);

  const pendingReceived = receivedRequests.filter(r => r.status === null);
  const acceptedConnections = receivedRequests.filter(r => r.status === true);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">My Network</h1>
        <p className="text-muted-foreground">Manage your connections and requests</p>
      </div>
      
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="received">
            Received {pendingReceived.length > 0 && `(${pendingReceived.length})`}
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent {sentRequests.length > 0 && `(${sentRequests.length})`}
          </TabsTrigger>
          <TabsTrigger value="connections">
            Connections {acceptedConnections.length > 0 && `(${acceptedConnections.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : pendingReceived.length > 0 ? (
            pendingReceived.map(request => (
              <ConnectionRequestCard 
                key={request._id} 
                request={request}
                type="received"
              />
            ))
          ) : (
            <div className="bg-white p-12 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
              <p className="text-muted-foreground">
                You don't have any connection requests at the moment
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sent" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : sentRequests.length > 0 ? (
            sentRequests.map(request => (
              <ConnectionRequestCard 
                key={request._id} 
                request={request}
                type="sent"
              />
            ))
          ) : (
            <div className="bg-white p-12 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">No sent requests</h3>
              <p className="text-muted-foreground">
                You haven't sent any connection requests yet
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="connections" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : acceptedConnections.length > 0 ? (
            acceptedConnections.map(request => (
              <ConnectionRequestCard 
                key={request._id} 
                request={request}
                type="received"
              />
            ))
          ) : (
            <div className="bg-white p-12 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
              <p className="text-muted-foreground">
                Start building your network by connecting with people
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Connections;
