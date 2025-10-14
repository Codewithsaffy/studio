
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpenCheck, ServerCrash } from 'lucide-react';
import type { IBooking } from '@/lib/database/models/Booking';
import { format } from 'date-fns';
import Link from 'next/link';

function BookingCard({ booking }: { booking: IBooking }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{booking.vendorName}</CardTitle>
        <CardDescription className="capitalize">{booking.vendorCategory}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p><strong>Booking Date:</strong> {format(new Date(booking.bookingDate), 'PPP')}</p>
        <p><strong>Total Price:</strong> PKR {booking.totalPrice.toLocaleString()}</p>
        <p><strong>Status:</strong> <span className="capitalize font-medium text-primary">{booking.status}</span></p>
        {booking.guests && <p><strong>Guests:</strong> {booking.guests}</p>}
         <p className="text-xs text-muted-foreground pt-2 border-t">Booked on: {format(new Date(booking.createdAt), 'PPP')}</p>
      </CardContent>
    </Card>
  );
}


export default function BookingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        if (status === 'authenticated') {
            const fetchBookings = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await fetch('/api/bookings');
                    const data = await response.json();
                    if (data.success) {
                        setBookings(data.bookings);
                    } else {
                        throw new Error(data.message || 'Failed to fetch bookings.');
                    }
                } catch (e: any) {
                    setError(e.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchBookings();
        }
    }, [status, router]);

    const renderContent = () => {
        if (isLoading || status === 'loading') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            );
        }

        if (error) {
            return (
                 <Alert variant="destructive">
                    <ServerCrash className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }
        
        if (bookings.length === 0) {
            return (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <BookOpenCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Bookings Yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        You haven't made any bookings. Start planning your event!
                    </p>
                    <div className="mt-6">
                        <Link href="/vendors">
                            <Button>Explore Vendors</Button>
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map(booking => (
                    <BookingCard key={booking._id as string} booking={booking} />
                ))}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            {renderContent()}
        </div>
    );
}

