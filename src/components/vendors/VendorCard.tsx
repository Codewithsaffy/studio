'use client';

import Image from 'next/image';
import { Heart, Tag, MapPin, Star, CheckCircle, Sparkles, Phone, MessageSquare } from 'lucide-react';
import type { Vendor } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface VendorCardProps {
  vendor: Vendor;
  onViewDetails: () => void;
  selectedDate?: Date;
}

export default function VendorCard({ vendor, onViewDetails, selectedDate }: VendorCardProps) {
  const isAvailable = selectedDate
    ? !vendor.bookedDates.includes(selectedDate.toISOString().split('T')[0])
    : true;
  
  const isTopRated = vendor.rating >= 4.5;

  return (
    <Card 
      className="overflow-hidden group cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-secondary"
      onClick={onViewDetails}
    >
      <div className="relative">
        <Image
          src={vendor.image}
          alt={vendor.name}
          width={400}
          height={225}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
          {selectedDate && isAvailable && (
             <Badge variant="secondary" className="bg-green-500 text-white gap-1 text-xs">
              Available
            </Badge>
          )}
          {isTopRated && (
            <Badge variant="secondary" className="bg-gold-500 text-gold-foreground gap-1 text-xs">
              <Sparkles className="h-3 w-3" />
              Top Rated
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" className="absolute top-2 left-2 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-rose-500 h-8 w-8">
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="text-lg font-bold truncate">{vendor.name}</h3>
        
        <div className="flex items-center text-sm text-muted-foreground gap-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{vendor.city}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="h-4 w-4" />
            <span className="capitalize">{vendor.category}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("h-4 w-4", i < Math.floor(vendor.rating) ? 'fill-current' : 'fill-transparent stroke-current')} />
            ))}
             <span className="text-muted-foreground ml-1">({vendor.rating})</span>
          </div>
          <div className="font-semibold text-base">
            {vendor.pricePerHead ? `PKR ${vendor.pricePerHead.toLocaleString()}/head` : `PKR ${vendor.packagePrice?.toLocaleString()} Pkg`}
          </div>
        </div>

         <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Features:</p>
          <div className="flex flex-wrap gap-2">
            {vendor.features.slice(0, 3).map(feature => (
              <Badge key={feature} variant="outline" className="text-xs">{feature}</Badge>
            ))}
            {vendor.features.length > 3 && <Badge variant="outline" className="text-xs">+{vendor.features.length - 3} more</Badge>}
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-border">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">View Details</Button>
          <Button variant="outline" className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" /> Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
