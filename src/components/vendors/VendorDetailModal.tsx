'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import Image from 'next/image';
import { Star, MapPin, Phone, MessageSquare, Briefcase, Images, Star as StarIcon, Calendar as CalendarIcon, Info, Users, CheckCircle, XCircle } from 'lucide-react';
import type { Vendor } from '@/lib/data';
import { Slider } from '../ui/slider';
import { addDays, format, isBefore, startOfToday } from 'date-fns';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

interface VendorDetailModalProps {
  vendor: Vendor;
  isOpen: boolean;
  onClose: () => void;
}

const dummyReviews = [
    {
        id: 1,
        author: 'Ali & Fatima',
        date: 'November 20, 2025',
        rating: 5,
        text: 'Absolutely stunning venue! The staff was incredibly helpful and made our day perfect. Highly recommended for anyone looking for a grand and elegant wedding.'
    },
    {
        id: 2,
        author: 'Usman Ahmed',
        date: 'October 5, 2025',
        rating: 4,
        text: 'Great food and service. The BBQ was a highlight. The team was professional and handled our 500+ guests with ease. A little pricey but worth it.'
    },
    {
        id: 3,
        author: 'Sana Khan',
        date: 'September 12, 2025',
        rating: 5,
        text: 'The photographers were amazing! They captured every moment so beautifully. The cinematic video was like a movie. We are so happy with the results.'
    },
];


export default function VendorDetailModal({ vendor, isOpen, onClose }: VendorDetailModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(vendor.capacity ? parseInt(vendor.capacity.split('-')[0]) || 200 : 200);

  const isDateBooked = (date: Date) => {
    return vendor.bookedDates.includes(format(date, 'yyyy-MM-dd'));
  }
  
  const isDatePast = (date: Date) => {
    return isBefore(date, startOfToday());
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isDatePast(date)) {
      setSelectedDate(date);
    }
  };

  const portfolioImages = [
    "https://picsum.photos/seed/p1/800/600",
    "https://picsum.photos/seed/p2/800/600",
    "https://picsum.photos/seed/p3/800/600",
    "https://picsum.photos/seed/p4/800/600",
    "https://picsum.photos/seed/p5/800/600",
    "https://picsum.photos/seed/p6/800/600",
  ];
  
  const allImages = [vendor.image, ...portfolioImages.slice(0,4)];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0 max-h-[95vh] flex flex-col bg-card">
        <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-1 h-80">
                <div className="col-span-2 sm:col-span-1 h-80">
                    <Image src={vendor.image} alt={vendor.name} width={800} height={600} className="w-full h-full object-cover rounded-tl-lg" />
                </div>
                <div className="hidden sm:grid grid-cols-2 grid-rows-2 gap-1 h-80">
                    <Image src={portfolioImages[0]} alt="Portfolio image 1" width={400} height={300} className="w-full h-full object-cover" />
                    <Image src={portfolioImages[1]} alt="Portfolio image 2" width={400} height={300} className="w-full h-full object-cover rounded-tr-lg" />
                    <Image src={portfolioImages[2]} alt="Portfolio image 3" width={400} height={300} className="w-full h-full object-cover" />
                    <Image src={portfolioImages[3]} alt="Portfolio image 4" width={400} height={300} className="w-full h-full object-cover" />
                </div>
            </div>
          
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold font-headline">{vendor.name}</h2>
                <div className="flex items-center text-muted-foreground mt-2 gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium hover:underline cursor-pointer">{vendor.location}, {vendor.city}</span>
                </div>
              </div>
              <div className="text-right">
                 <div className="flex items-center gap-2 text-amber-500">
                    <Star className="h-6 w-6 fill-current" />
                    <span className="text-2xl font-bold text-foreground">{vendor.rating}</span>
                </div>
                <p className="text-sm text-muted-foreground">({dummyReviews.length} reviews)</p>
              </div>
            </div>

            <Separator/>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-12">
                <TabsTrigger value="overview" className="h-full"><Info className="mr-2 h-4 w-4"/>Overview</TabsTrigger>
                <TabsTrigger value="packages" className="h-full"><Briefcase className="mr-2 h-4 w-4"/>Packages</TabsTrigger>
                <TabsTrigger value="portfolio" className="h-full"><Images className="mr-2 h-4 w-4"/>Portfolio</TabsTrigger>
                <TabsTrigger value="reviews" className="h-full"><StarIcon className="mr-2 h-4 w-4"/>Reviews</TabsTrigger>
                <TabsTrigger value="availability" className="h-full"><CalendarIcon className="mr-2 h-4 w-4"/>Availability</TabsTrigger>
              </TabsList>
              
              <div className="py-6">
                <TabsContent value="overview">
                    <h3 className="text-xl font-semibold mb-4">About {vendor.name}</h3>
                    <p className="text-muted-foreground mb-6">
                      An esteemed {vendor.category} provider in {vendor.city}, offering exceptional services for your special day. We are committed to making your wedding memorable with our professional team and top-notch facilities.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-3">Key Features</h4>
                            <ul className="space-y-2 text-sm">
                            {vendor.features.map(f => (
                                <li key={f} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500"/>{f}</li>
                            ))}
                            </ul>
                        </div>
                        <div className="space-y-3 text-sm">
                            <h4 className="font-semibold mb-3">Vendor Details</h4>
                            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground"/><span className="font-medium">Capacity:</span> {vendor.capacity}</div>
                            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground"/><span className="font-medium">Contact:</span> {vendor.phone}</div>
                            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground"/><span className="font-medium">Address:</span> {vendor.location}</div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="packages">
                    <Card>
                        <CardContent className="p-6">
                            {vendor.pricePerHead ? (
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Per Head Package</h3>
                                <p className="text-3xl font-bold text-primary mb-4">PKR {vendor.pricePerHead.toLocaleString()}<span className="text-lg text-muted-foreground font-normal">/head</span></p>
                                <div className="mt-6">
                                <label htmlFor="guests" className="block text-sm font-medium mb-2">Number of Guests: <span className="font-bold">{guests}</span></label>
                                <Slider defaultValue={[guests]} max={1000} min={100} step={10} onValueChange={(value) => setGuests(value[0])} />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>Min: 100</span>
                                    <span>Max: 1000</span>
                                </div>
                                </div>
                                <Separator className="my-6"/>
                                <p className="text-xl font-bold">Total Estimated Cost: <span className="text-primary">PKR {(guests * vendor.pricePerHead).toLocaleString()}</span></p>
                            </div>
                            ) : (
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Complete Package</h3>
                                <p className="text-3xl font-bold text-primary mb-4">PKR {vendor.packagePrice?.toLocaleString()}</p>
                                <div className="mt-6">
                                <h4 className="font-semibold mb-2">What's Included:</h4>
                                <ul className="space-y-2 text-sm grid grid-cols-2 gap-x-4">
                                    {vendor.features.map(f => (
                                    <li key={f} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500"/>{f}</li>
                                    ))}
                                </ul>
                                </div>
                            </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="portfolio">
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {portfolioImages.map((img, index) => (
                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                                <Image src={img} alt={`Portfolio ${index + 1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-110"/>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="reviews">
                    <div className="space-y-6">
                        {dummyReviews.map(review => (
                            <div key={review.id} className="flex gap-4">
                                <Avatar>
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${review.author}`} />
                                    <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold">{review.author}</h4>
                                        <span className="text-xs text-muted-foreground">&bull; {review.date}</span>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-amber-500 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`}/>
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{review.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="availability">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            className="rounded-md border mx-auto"
                            modifiers={{ 
                            booked: (date) => isDateBooked(date),
                            past: (date) => isDatePast(date)
                            }}
                            modifiersClassNames={{
                            booked: 'bg-destructive/80 text-destructive-foreground',
                            past: 'opacity-50'
                            }}
                            disabled={(date) => isDatePast(date)}
                        />
                        <div className="flex-1 w-full">
                            <h4 className="font-semibold mb-3">Availability Status</h4>
                            {selectedDate ? (
                            <div className="space-y-2">
                                <p className="font-medium">Selected date: {format(selectedDate, 'PPP')}</p>
                                {isDateBooked(selectedDate) ? (
                                <div className="p-3 rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
                                    <XCircle className="h-5 w-5"/> Status: Not Available
                                </div>
                                ) : (
                                <div className="p-3 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5"/> Status: Available!
                                </div>
                                )}
                            </div>
                            ) : (
                                <Card className="bg-secondary/10 border-secondary/20 text-center p-6">
                                    <p className="font-medium">Select a date on the calendar to check availability.</p>
                                </Card>
                            )}
                            <Separator className="my-4"/>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <h5 className="font-medium text-foreground mb-2">Legend</h5>
                                <div className="flex items-center gap-4">
                                  <p className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-background border-2 border-emerald-500"></span>Available</p>
                                  <p className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-destructive/80 border border-destructive"></span>Booked</p>
                                  <p className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-muted border"></span>Past</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
        <div className="p-4 border-t bg-background bottom-0">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
                <Button variant="outline" size="lg"><Phone className="mr-2 h-4 w-4"/> Call</Button>
                <Button variant="outline" size="lg"><MessageSquare className="mr-2 h-4 w-4"/> WhatsApp</Button>
            </div>
             <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">Book Now</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
