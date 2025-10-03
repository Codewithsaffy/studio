'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import Image from 'next/image';
import { Star, MapPin, Tag, Phone, MessageSquare, Briefcase, Images, Star as StarIcon, Calendar as CalendarIcon, Info, Users, CheckCircle, XCircle } from 'lucide-react';
import type { Vendor } from '@/lib/data';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';
import { addDays, format, isBefore } from 'date-fns';

interface VendorDetailModalProps {
  vendor: Vendor;
  isOpen: boolean;
  onClose: () => void;
}

export default function VendorDetailModal({ vendor, isOpen, onClose }: VendorDetailModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState(vendor.capacity ? parseInt(vendor.capacity.split('-')[0]) || 200 : 200);

  const isDateBooked = (date: Date) => {
    return vendor.bookedDates.includes(format(date, 'yyyy-MM-dd'));
  }
  
  const isDatePast = (date: Date) => {
    return isBefore(date, new Date());
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isDatePast(date)) {
      setSelectedDate(date);
    }
  };

  const images = [vendor.image, "https://picsum.photos/seed/2/800/600", "https://picsum.photos/seed/3/800/600", "https://picsum.photos/seed/4/800/600", "https://picsum.photos/seed/5/800/600"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="sr-only">{vendor.name}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <Image src={img} alt={`${vendor.name} image ${index + 1}`} width={800} height={450} className="w-full h-64 object-cover" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
          
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{vendor.name}</h2>
                <div className="flex items-center text-sm text-muted-foreground mt-1 gap-4">
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{vendor.city}</span>
                  <span className="flex items-center gap-1.5"><Tag className="h-4 w-4" />{vendor.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-lg font-bold text-foreground">{vendor.rating}</span>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview"><Info className="mr-2 h-4 w-4"/>Overview</TabsTrigger>
                <TabsTrigger value="packages"><Briefcase className="mr-2 h-4 w-4"/>Packages</TabsTrigger>
                <TabsTrigger value="portfolio"><Images className="mr-2 h-4 w-4"/>Portfolio</TabsTrigger>
                <TabsTrigger value="reviews"><StarIcon className="mr-2 h-4 w-4"/>Reviews</TabsTrigger>
                <TabsTrigger value="availability"><CalendarIcon className="mr-2 h-4 w-4"/>Availability</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4">
                <p className="text-muted-foreground mb-4">Detailed vendor description coming soon. For now, enjoy the key features and contact information.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Features</h4>
                    <ul className="space-y-2 text-sm">
                      {vendor.features.map(f => (
                        <li key={f} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500"/>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold mb-2">Details</h4>
                    <p className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground"/>Capacity: {vendor.capacity}</p>
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground"/>Contact: {vendor.phone}</p>
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground"/>Location: {vendor.location}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="packages" className="mt-4">
                 {vendor.pricePerHead ? (
                  <div>
                    <p>Per Head: <span className="font-bold text-lg">PKR {vendor.pricePerHead.toLocaleString()}</span></p>
                    <div className="mt-4">
                      <label htmlFor="guests" className="block text-sm font-medium mb-2">Number of Guests: {guests}</label>
                      <Slider defaultValue={[guests]} max={1000} step={10} onValueChange={(value) => setGuests(value[0])} />
                      <p className="text-right text-sm text-muted-foreground mt-1">Min: 200, Max: 1000</p>
                    </div>
                     <p className="text-xl font-bold mt-4">Total Estimated Cost: <span className="text-primary">PKR {(guests * vendor.pricePerHead).toLocaleString()}</span></p>
                  </div>
                ) : (
                  <div>
                    <p>Package Price: <span className="font-bold text-lg">PKR {vendor.packagePrice?.toLocaleString()}</span></p>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Includes:</h4>
                       <ul className="space-y-2 text-sm">
                        {vendor.features.map(f => (
                          <li key={f} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500"/>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="portfolio" className="mt-4">
                <p>Portfolio images coming soon. For now, please refer to the main image carousel.</p>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                 <p>No reviews yet. Be the first to share your experience!</p>
              </TabsContent>

              <TabsContent value="availability" className="mt-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                    modifiers={{ 
                      booked: (date) => isDateBooked(date),
                      past: (date) => isDatePast(date)
                    }}
                    modifiersClassNames={{
                      booked: 'bg-destructive/80 text-destructive-foreground',
                      past: 'opacity-50'
                    }}
                    disabled={(date) => isDatePast(date)}
                    numberOfMonths={2}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Availability Check</h4>
                    {selectedDate ? (
                      <div>
                        <p>Selected date: {format(selectedDate, 'PPP')}</p>
                        {isDateBooked(selectedDate) ? (
                          <div className="mt-2 p-3 rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
                            <XCircle className="h-5 w-5"/> Status: Already Booked
                          </div>
                        ) : (
                           <div className="mt-2 p-3 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center gap-2">
                             <CheckCircle className="h-5 w-5"/> Status: Available!
                          </div>
                        )}
                      </div>
                    ) : (
                      <p>Select a date to check availability.</p>
                    )}
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-emerald-500"></span>Available</p>
                      <p className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-destructive"></span>Booked</p>
                      <p className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-muted"></span>Past</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="p-6 border-t bg-background sticky bottom-0">
          <div className="flex justify-end gap-3">
             <Button variant="outline" size="lg"><Phone className="mr-2 h-4 w-4"/> Call</Button>
             <Button variant="outline" size="lg"><MessageSquare className="mr-2 h-4 w-4"/> WhatsApp</Button>
             <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">Book Now</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
