'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Event } from '@/types';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Calendar, MapPin, User, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reason, setReason] = useState('');
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  const eventId = params.id as string;

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${eventId}`);
      setEvent(response.data.data.event);
    } catch (error: any) {
      toast.error('Failed to fetch event details');
      router.push('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      setShowRegisterDialog(true);
      return;
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason for registration');
      return;
    }

    try {
      setRegistering(true);
      await api.post(`/events/${eventId}/register`, { reason });
      toast.success('Successfully registered for the event!');
      setReason('');
      setShowRegisterDialog(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleDeleteEvent = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted successfully');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
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

  const isOwner = user?.id === event.created_by;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link href="/events" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        
        {isOwner && (
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/events/${event.id}/edit`} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Event
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEvent}
              disabled={deleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? 'Deleting...' : 'Delete Event'}
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{event.name}</CardTitle>
          <CardDescription className="text-lg">
            {event.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">
                    {format(new Date(event.date), 'PPP')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Organizer</p>
                  <p className="text-muted-foreground">Created by: {event.creator_name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm">
                Created: {format(new Date(event.created_at), 'PPP')}
              </Badge>

              {!isOwner && (
                <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full">
                      Register for Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Register for {event.name}</DialogTitle>
                      <DialogDescription>
                        {isAuthenticated 
                          ? "Please provide a reason for your registration."
                          : "Please login to register for this event."
                        }
                      </DialogDescription>
                    </DialogHeader>
                    
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="reason" className="text-sm font-medium">
                            Reason for Registration
                          </label>
                          <Input
                            id="reason"
                            placeholder="Why do you want to attend this event?"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleRegister} 
                            disabled={registering}
                            className="flex-1"
                          >
                            {registering ? 'Registering...' : 'Register'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowRegisterDialog(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          You need to be logged in to register for events.
                        </p>
                        <div className="flex gap-2">
                          <Button onClick={handleLoginRedirect} className="flex-1">
                            Login
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowRegisterDialog(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              )}

              {isOwner && (
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/events/${event.id}/participants`}>
                      View Participants
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    You are the organizer of this event
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
