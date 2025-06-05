'use client';

import { useState, useEffect } from 'react';
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
import { Calendar, Users, BarChart3, Plus, Edit, Eye, UserCheck, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalEvents: number;
  totalRegistrations: number;
  recentParticipants: Participant[];
}

export default function DashboardPage() {
  const isAuthenticated = useProtectedRoute();
  const { user } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalRegistrations: 0,
    recentParticipants: []
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all events
      const eventsResponse = await api.get('/events');
      const allEvents = eventsResponse.data.data.events || [];
      
      // Filter events created by the current user
      const userEvents = allEvents.filter((event: Event) => event.user_id === user?.id);
      setEvents(userEvents);

      // Fetch participants for each user event and calculate stats
      let totalRegistrations = 0;
      let allParticipants: Participant[] = [];
      const eventRegistrations: any[] = [];

      for (const event of userEvents) {
        try {
          const participantsResponse = await api.get(`/events/${event.id}/participants`);
          const participants = participantsResponse.data.data.participants || [];
          totalRegistrations += participants.length;
          allParticipants = [...allParticipants, ...participants];
          
          eventRegistrations.push({
            name: event.name.length > 15 ? event.name.substring(0, 15) + '...' : event.name,
            registrations: participants.length
          });
        } catch (error) {
          // If error fetching participants for an event, continue with others
          eventRegistrations.push({
            name: event.name.length > 15 ? event.name.substring(0, 15) + '...' : event.name,
            registrations: 0
          });
        }
      }

      // Sort participants by registration date and get recent ones
      const recentParticipants = allParticipants
        .sort((a, b) => new Date(b.registration_date).getTime() - new Date(a.registration_date).getTime())
        .slice(0, 5);

      setStats({
        totalEvents: userEvents.length,
        totalRegistrations,
        recentParticipants
      });

      setChartData(eventRegistrations);
    } catch (error: any) {
      toast.error('Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: number, eventName: string) => {
    if (!confirm(`Are you sure you want to delete "${eventName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(eventId);
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted successfully');
      
      // Remove the event from the list and refresh dashboard data
      setEvents(prev => prev.filter(e => e.id !== eventId));
      await fetchDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return null; // Protected route will redirect
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
        <Button asChild>
          <Link href="/events/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Events you've created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              Across all your events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Participants</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentParticipants.length}</div>
            <p className="text-xs text-muted-foreground">
              In the last 5 registrations
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Registrations per Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="registrations" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No events to display
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Participants */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Participants</CardTitle>
            <CardDescription>Latest registrations across your events</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentParticipants.length > 0 ? (
              <div className="space-y-4">
                {stats.recentParticipants.map((participant) => (
                  <div key={participant.registration_id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-muted-foreground">{participant.email}</p>
                    </div>
                    <Badge variant="secondary">
                      {format(new Date(participant.registration_date), 'MMM dd')}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No participants yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Events */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>My Events</CardTitle>
          <CardDescription>Events you've created</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(event.date), 'PPP')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/events/${event.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/events/${event.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/events/${event.id}/participants`}>
                        <Users className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id, event.name)}
                      disabled={deletingId === event.id}
                    >
                      {deletingId === event.id ? (
                        <svg
                          className="animate-spin h-4 w-4 text-muted-foreground"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"
                          />
                        </svg>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first event to get started!
              </p>
              <Button asChild>
                <Link href="/events/new">Create Event</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
