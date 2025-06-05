'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProtectedRoute } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { Event } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, Edit } from 'lucide-react';
import { format } from 'date-fns';

export default function EditEventPage() {
  const isAuthenticated = useProtectedRoute();
  const { user } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
  });

  const eventId = params.id as string;

  useEffect(() => {
    if (eventId && isAuthenticated) {
      fetchEvent();
    }
  }, [eventId, isAuthenticated]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${eventId}`);
      const eventData = response.data.data.event;
      
      // Check if user is the owner
      if (eventData.created_by !== user?.id) {
        toast.error('You are not authorized to edit this event');
        router.push(`/events/${eventId}`);
        return;
      }

      setEvent(eventData);
      setFormData({
        name: eventData.name,
        description: eventData.description,
        date: format(new Date(eventData.date), "yyyy-MM-dd'T'HH:mm"),
        location: eventData.location,
      });
    } catch (error: any) {
      toast.error('Failed to fetch event details');
      router.push('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.date || !formData.location) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check if date is in the future
    const eventDate = new Date(formData.date);
    const now = new Date();
    if (eventDate <= now) {
      toast.error('Event date must be in the future');
      return;
    }

    try {
      setSaving(true);
      await api.put(`/events/${eventId}`, formData);
      toast.success('Event updated successfully!');
      router.push(`/events/${eventId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Protected route will redirect
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <div className="grid md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
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

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Edit className="h-6 w-6" />
            Edit Event
          </CardTitle>
          <CardDescription>
            Update the event details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Event Name *
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Enter event name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your event..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={4}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Event Date *
                </label>
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location *
                </label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Event location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/events/${eventId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
