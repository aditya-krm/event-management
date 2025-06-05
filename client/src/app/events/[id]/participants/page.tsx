'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProtectedRoute } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { Event, Participant } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, Users, Mail, UserX, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function ParticipantsPage() {
  const isAuthenticated = useProtectedRoute();
  const { user } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const eventId = params.id as string;

  useEffect(() => {
    if (eventId && isAuthenticated) {
      fetchEventAndParticipants();
    }
  }, [eventId, isAuthenticated]);

  const fetchEventAndParticipants = async () => {
    try {
      setLoading(true);
      const [eventResponse, participantsResponse] = await Promise.all([
        api.get(`/events/${eventId}`),
        api.get(`/events/${eventId}/participants`)
      ]);

      const eventData = eventResponse.data.data.event;
      
      // Check if user is the owner
      if (eventData.created_by !== user?.id) {
        toast.error('You are not authorized to view participants for this event');
        router.push(`/events/${eventId}`);
        return;
      }

      setEvent(eventData);
      setParticipants(participantsResponse.data.data.participants || []);
    } catch (error: any) {
      toast.error('Failed to fetch event details or participants');
      router.push('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
    try {
      setCancellingId(registrationId);
      await api.delete(`/registrations/${registrationId}`);
      toast.success('Registration cancelled successfully');
      // Remove the participant from the list
      setParticipants(prev => prev.filter(p => p.registration_id.toString() !== registrationId));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return null; // Protected route will redirect
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button asChild>
          <Link href="/events">Back to Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/events/${eventId}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6" />
            Participants for {event.name}
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-4">
              <span>Total participants: {participants.length}</span>
              <Badge variant="secondary">
                Event Date: {format(new Date(event.date), 'PPP')}
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {participants.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No participants yet</h3>
              <p className="text-muted-foreground">
                Participants will appear here once they register for your event.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {participants.map((participant) => (
                <div 
                  key={participant.registration_id} 
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{participant.name}</h4>
                      <Badge variant="outline">
                        <Mail className="h-3 w-3 mr-1" />
                        {participant.email}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      <strong>Reason:</strong> {participant.reason}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Registered: {format(new Date(participant.registration_date), 'PPP')}
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelRegistration(participant.registration_id.toString())}
                    disabled={cancellingId === participant.registration_id.toString()}
                    className="flex items-center gap-2"
                  >
                    <UserX className="h-4 w-4" />
                    {cancellingId === participant.registration_id.toString() ? 'Cancelling...' : 'Cancel'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
