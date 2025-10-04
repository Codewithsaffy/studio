"use client";

import { useEffect, useState } from "react";
import { dummyVendors } from "@/lib/data";
import type { Vendor } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { use } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Star,
  MapPin,
  Tag,
  Phone,
  MessageSquare,
  Briefcase,
  Images,
  Calendar as CalendarIcon,
  Info,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { addDays, format, isBefore, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { LeftSidebar } from "@/components/grok/LeftSidebar";
import { Header } from "@/components/grok/Header";
import { type CSSProperties } from "react";
import Link from "next/link";

interface VendorDetailPageProps {
  params: Promise<{
    vendorId: string;
  }>;
}

export default function VendorDetailPage({ params }: VendorDetailPageProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(200);
  const [loading, setLoading] = useState(true);
  const { vendorId } = use(params);

  useEffect(() => {
    const foundVendor = dummyVendors.find((v) => v.id === vendorId);
    if (foundVendor) {
      setVendor(foundVendor);
      // Set initial guests value based on vendor capacity if available
      if (foundVendor.capacity) {
        const capacityNumbers = foundVendor.capacity.match(/\d+/g);
        if (capacityNumbers && capacityNumbers.length > 0) {
          setGuests(parseInt(capacityNumbers[0]) || 200);
        }
      }
    }
    setLoading(false);
  }, [vendorId]);

  if (loading) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "260px",
            "--sidebar-width-icon": "80px",
          } as CSSProperties
        }
      >
        <LeftSidebar />
        <SidebarInset className="overflow-hidden">
          <Header />
          <div className="bg-background min-h-screen flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!vendor) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "260px",
            "--sidebar-width-icon": "80px",
          } as CSSProperties
        }
      >
        <LeftSidebar />
        <SidebarInset className="overflow-hidden">
          <Header />
          <div className="bg-background min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Vendor Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The vendor you're looking for doesn't exist.
              </p>
              <Link href="/vendors">
                <Button>Back to Vendors</Button>
              </Link>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const isDateBooked = (date: Date) => {
    return vendor.bookedDates.includes(format(date, "yyyy-MM-dd"));
  };

  const isDatePast = (date: Date) => {
    return isBefore(date, startOfToday());
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isDatePast(date)) {
      setSelectedDate(date);
    }
  };

  const images = [
    vendor.image,
    "https://picsum.photos/seed/vendor2/800/600",
    "https://picsum.photos/seed/vendor3/800/600",
    "https://picsum.photos/seed/vendor4/800/600",
    "https://picsum.photos/seed/vendor5/800/600",
  ];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "260px",
          "--sidebar-width-icon": "80px",
        } as CSSProperties
      }
    >
      <LeftSidebar />
      <SidebarInset className="overflow-hidden">
        <Header />
        <div className="bg-background min-h-screen">
          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={img}
                    alt={`${vendor.name} image ${index + 1}`}
                    width={1200}
                    height={600}
                    className="w-full h-96 sm:h-[500px] object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>

          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold">{vendor.name}</h1>
                <div className="flex items-center text-sm text-muted-foreground mt-2 gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span className="capitalize">{vendor.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-lg font-bold text-foreground">
                      {vendor.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Phone className="mr-2 h-4 w-4" /> Call
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
                </Button>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Book Now
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">
                  <Info className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="packages">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Packages
                </TabsTrigger>
                <TabsTrigger value="portfolio">
                  <Images className="mr-2 h-4 w-4" />
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <Star className="mr-2 h-4 w-4" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="availability">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Availability
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold mb-4">
                      About {vendor.name}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Detailed vendor description for {vendor.name}. This is
                      where you would find comprehensive information about their
                      services, experience, and what makes them unique in the
                      market. For now, enjoy the key features and contact
                      information.
                    </p>

                    <h4 className="font-semibold mb-3">Features & Services</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {vendor.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h4 className="font-semibold mb-3">Vendor Details</h4>
                      <div className="space-y-3 text-sm">
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">
                            Category:
                          </span>
                          <span className="capitalize">{vendor.category}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">
                            Location:
                          </span>
                          <span>{vendor.location}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">
                            Capacity:
                          </span>
                          <span>{vendor.capacity}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Rating:</span>
                          <span className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < Math.floor(vendor.rating)
                                    ? "fill-amber-500 text-amber-500"
                                    : "fill-transparent stroke-amber-500"
                                )}
                              />
                            ))}
                            {vendor.rating}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span>{vendor.phone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h4 className="font-semibold mb-3">Pricing</h4>
                      <div className="text-lg font-bold">
                        {vendor.pricePerHead
                          ? `PKR ${vendor.pricePerHead.toLocaleString()} per head`
                          : `PKR ${vendor.packagePrice?.toLocaleString()} package`}
                      </div>
                      {vendor.pricePerHead && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on {vendor.capacity} capacity
                        </p>
                      )}
                    </div>

                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h4 className="font-semibold mb-3">Status</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="default"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                        {vendor.rating >= 4.5 && (
                          <Badge
                            variant="secondary"
                            className="bg-gold-500 text-gold-foreground gap-1 text-xs"
                          >
                            Top Rated
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="packages" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    {vendor.pricePerHead ? (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Per Head Package
                        </h3>
                        <p>
                          Price:{" "}
                          <span className="font-bold text-lg">
                            PKR {vendor.pricePerHead.toLocaleString()}
                          </span>{" "}
                          per person
                        </p>
                        <div className="mt-6">
                          <label
                            htmlFor="guests"
                            className="block text-sm font-medium mb-2"
                          >
                            Number of Guests: {guests}
                          </label>
                          <Slider
                            defaultValue={[guests]}
                            max={1000}
                            min={100}
                            step={10}
                            onValueChange={(value) => setGuests(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Min: 100</span>
                            <span>Max: 1000</span>
                          </div>
                        </div>
                        <p className="text-xl font-bold mt-4">
                          Total Estimated Cost:{" "}
                          <span className="text-primary">
                            PKR{" "}
                            {(guests * vendor.pricePerHead).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Package Deal
                        </h3>
                        <p>
                          Package Price:{" "}
                          <span className="font-bold text-lg">
                            PKR {vendor.packagePrice?.toLocaleString()}
                          </span>
                        </p>
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">
                            What's Included:
                          </h4>
                          <ul className="space-y-2">
                            {vendor.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Package Options
                    </h3>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <h4 className="font-medium mb-2">Standard Package</h4>
                      <ul className="text-sm space-y-1 mb-3">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Basic {vendor.category} service
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Standard equipment
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Basic support
                        </li>
                      </ul>
                      {vendor.pricePerHead ? (
                        <p className="font-semibold">
                          PKR{" "}
                          {Math.round(
                            vendor.pricePerHead * 0.8
                          ).toLocaleString()}{" "}
                          per head
                        </p>
                      ) : (
                        <p className="font-semibold">
                          PKR{" "}
                          {Math.round(
                            (vendor.packagePrice || 0) * 0.8
                          ).toLocaleString()}{" "}
                          total
                        </p>
                      )}
                    </div>

                    <div className="border rounded-lg p-4 bg-primary/10 mt-4">
                      <h4 className="font-medium mb-2">Premium Package</h4>
                      <ul className="text-sm space-y-1 mb-3">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Premium {vendor.category} service
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Advanced equipment
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          Priority support
                        </li>
                      </ul>
                      {vendor.pricePerHead ? (
                        <p className="font-semibold">
                          PKR{" "}
                          {Math.round(
                            vendor.pricePerHead * 1.2
                          ).toLocaleString()}{" "}
                          per head
                        </p>
                      ) : (
                        <p className="font-semibold">
                          PKR{" "}
                          {Math.round(
                            (vendor.packagePrice || 0) * 1.2
                          ).toLocaleString()}{" "}
                          total
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="portfolio" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-video rounded-lg overflow-hidden"
                    >
                      <Image
                        src={img}
                        alt={`Portfolio item ${index + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-center text-muted-foreground mt-4">
                  Additional portfolio items would be displayed here to showcase
                  the vendor's previous work.
                </p>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-500 text-amber-500"
                          />
                        ))}
                      </div>
                      <span className="font-medium">Sarah Khan</span>
                    </div>
                    <p className="text-muted-foreground">
                      "Excellent service! The team was professional and
                      delivered beyond our expectations. Highly recommend!"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      October 15, 2024
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-500 text-amber-500"
                          />
                        ))}
                      </div>
                      <span className="font-medium">Ahmed Ali</span>
                    </div>
                    <p className="text-muted-foreground">
                      "Great quality and reasonable prices. The{" "}
                      {vendor.category} was exactly what we were looking for."
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      September 20, 2024
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(4)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-500 text-amber-500"
                          />
                        ))}
                        <Star className="h-4 w-4 fill-transparent stroke-amber-500" />
                      </div>
                      <span className="font-medium">Fatima Hassan</span>
                    </div>
                    <p className="text-muted-foreground">
                      "Service was good overall. Minor issues but they were
                      resolved quickly. Would use again."
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      August 5, 2024
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="availability" className="mt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="rounded-md border mx-auto"
                      modifiers={{
                        booked: (date) => isDateBooked(date),
                        past: (date) => isDatePast(date),
                      }}
                      modifiersClassNames={{
                        booked: "bg-destructive/80 text-destructive-foreground",
                        past: "opacity-50 line-through",
                      }}
                      disabled={(date) => isDatePast(date)}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Availability Check</h4>
                    {selectedDate ? (
                      <div>
                        <p>Selected date: {format(selectedDate, "PPP")}</p>
                        {isDateBooked(selectedDate) ? (
                          <div className="mt-4 p-4 rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
                            <XCircle className="h-5 w-5" /> Status: Already
                            Booked
                          </div>
                        ) : (
                          <div className="mt-4 p-4 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" /> Status:
                            Available!
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="p-4">
                        Select a date to check availability.
                      </p>
                    )}
                    <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                      <h5 className="font-medium text-foreground mb-2">
                        Legend
                      </h5>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-destructive/80 border border-destructive"></div>
                        <span>Booked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-muted border"></div>
                        <span>Past</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
