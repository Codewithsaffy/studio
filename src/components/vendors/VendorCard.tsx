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
      className="overflow-hidden group cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 hover:border-secondary"
      onClick={onViewDetails}
    >
      <div className="relative">
        <Image
          src={vendor.image}
          alt={vendor.name}
          width={320}
          height={180}
          className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-[10px] px-2 py-0.5">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
          {selectedDate && isAvailable && (
             <Badge variant="secondary" className="bg-green-500 text-white gap-1 text-[10px] px-2 py-0.5">
              Available
            </Badge>
          )}
          {isTopRated && (
            <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 gap-1 text-[10px] px-2 py-0.5">
              <Sparkles className="h-3 w-3" />
              Top Rated
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" className="absolute top-2 left-2 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-rose-500 h-7 w-7">
          <Heart className="h-3.5 w-3.5" />
        </Button>
      </div>

      <CardContent className="p-3 space-y-2">
        <h3 className="text-sm font-semibold truncate">{vendor.name}</h3>
        
        <div className="flex items-center text-xs text-muted-foreground gap-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{vendor.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-3.5 w-3.5" />
            <span className="capitalize">{vendor.category}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("h-3 w-3", i < Math.floor(vendor.rating) ? 'fill-current' : 'fill-transparent stroke-current')} />
            ))}
             <span className="text-muted-foreground ml-1 text-[11px]">({vendor.rating})</span>
          </div>
          <div className="font-medium text-sm truncate">
            {vendor.pricePerHead ? `PKR ${vendor.pricePerHead.toLocaleString()}/head` : `PKR ${vendor.packagePrice?.toLocaleString()} Pkg`}
          </div>
        </div>

         <div className="pt-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground mb-1">Features:</p>
          <div className="flex flex-wrap gap-1">
            {vendor.features.slice(0, 3).map(feature => (
              <Badge key={feature} variant="outline" className="text-[10px] px-2 py-0.5">{feature}</Badge>
            ))}
            {vendor.features.length > 3 && <Badge variant="outline" className="text-[10px] px-2 py-0.5">+{vendor.features.length - 3} more</Badge>}
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-border">
          <Button className="w-1/2 text-sm py-1 px-2 bg-primary text-primary-foreground hover:bg-primary/90">View</Button>
          <Button variant="outline" className="w-1/2 text-sm py-1 px-2">
            <MessageSquare className="mr-2 h-3.5 w-3.5" /> Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
