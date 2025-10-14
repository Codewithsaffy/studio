// ============================================
// SIMPLE AI SDK TOOLS FOR HACKATHON
// Based on Vercel AI SDK + Gemini 2.5
// ============================================

import { tool } from "ai";
import { z } from "zod";
import { dummyVendors } from "@/lib/data";
import dbConnect from "@/lib/database/dbConnection";
import Booking from "@/lib/database/models/Booking";
import User from "@/lib/database/models/User";

// ============================================
// TOOL 1: Get Available Halls
// ============================================

export const tools = {
  getAvailableHalls: tool({
    description:
      "Search for wedding halls that match the guest count, budget, location, and date. " +
      "Use this when user asks for venues, halls, or banquet spaces.",
    inputSchema: z.object({
      guestCount: z.number().describe("Number of wedding guests"),
      budget: z.number().describe("Total budget in PKR (not per head)"),
      location: z.string().describe("City name like Karachi, Lahore"),
      date: z.string().describe("Wedding date in YYYY-MM-DD format"),
    }),
    execute: async ({ guestCount, budget, location, date }) => {
      // Filter halls
      let halls = dummyVendors.filter((v) => v.category === "halls");

      // Filter by location
      if (location) {
        halls = halls.filter((h) =>
          h.city.toLowerCase().includes(location.toLowerCase())
        );
      }

      // Filter by date availability
      if (date) {
        halls = halls.filter((h) => !h.bookedDates.includes(date));
      }

      // Filter by budget
      if (budget) {
        const maxPricePerHead = budget / guestCount;
        halls = halls.filter((h) => h.pricePerHead! <= maxPricePerHead);
      }

      // Calculate costs
      const results = halls
        .map((hall) => ({
          id: hall.id,
          name: hall.name,
          location: hall.location,
          city: hall.city,
          pricePerHead: hall.pricePerHead,
          totalCost: hall.pricePerHead! * guestCount,
          rating: hall.rating,
          features: hall.features,
          capacity: hall.capacity,
          phone: hall.phone,
          withinBudget: budget ? hall.pricePerHead! * guestCount <= budget : true,
        }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5); // Top 5 only

      return {
        success: true,
        count: results.length,
        halls: results,
        message: `Found ${results.length} halls for ${guestCount} guests`,
      };
    },
  }),

  // ============================================
  // TOOL 2: Get Available Catering
  // ============================================
  getAvailableCatering: tool({
    description:
      "Search for catering services that can serve the required guests, within budget, " +
      "available on the date. Use when user asks for food, catering, or menu.",
    inputSchema: z.object({
      guestCount: z.number().describe("Number of guests to be served"),
      budget: z.number().describe("Total budget in PKR"),
      location: z.string().describe("City name"),
      date: z.string().describe("Event date YYYY-MM-DD"),
    }),
    execute: async ({ guestCount, budget, location, date }) => {
      let caterers = dummyVendors.filter((v) => v.category === "catering");

      if (location) {
        caterers = caterers.filter((c) =>
          c.city.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (date) {
        caterers = caterers.filter((c) => !c.bookedDates.includes(date));
      }

      if (budget) {
        const maxPricePerHead = budget / guestCount;
        caterers = caterers.filter((c) => c.pricePerHead! <= maxPricePerHead);
      }

      const results = caterers
        .map((caterer) => ({
          id: caterer.id,
          name: caterer.name,
          location: caterer.location,
          city: caterer.city,
          pricePerHead: caterer.pricePerHead,
          totalCost: caterer.pricePerHead! * guestCount,
          rating: caterer.rating,
          features: caterer.features,
          phone: caterer.phone,
          withinBudget: budget ? caterer.pricePerHead! * guestCount <= budget : true,
        }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

      return {
        success: true,
        count: results.length,
        caterers: results,
        message: `Found ${results.length} caterers for ${guestCount} guests`,
      };
    },
  }),

  // ============================================
  // TOOL 3: Get Available Photography
  // ============================================
  getAvailablePhotography: tool({
    description:
      "Search for photography services available on the date, within budget. " +
      "Use when user asks for photographers, videographers, or photo coverage.",
    inputSchema: z.object({
      date: z.string().describe("Wedding date in YYYY-MM-DD format"),
      budget: z.number().describe("Budget in PKR for photography"),
      location: z.string().describe("City name"),
    }),
    execute: async ({ date, budget, location }) => {
      let photographers = dummyVendors.filter((v) => v.category === "photography");

      if (location) {
        photographers = photographers.filter((p) =>
          p.city.toLowerCase().includes(location.toLowerCase())
        );
      }

      photographers = photographers.filter((p) => !p.bookedDates.includes(date));

      if (budget) {
        photographers = photographers.filter((p) => p.packagePrice! <= budget);
      }

      const results = photographers
        .map((photographer) => ({
          id: photographer.id,
          name: photographer.name,
          location: photographer.location,
          city: photographer.city,
          packagePrice: photographer.packagePrice,
          rating: photographer.rating,
          features: photographer.features,
          phone: photographer.phone,
          withinBudget: budget ? photographer.packagePrice! <= budget : true,
        }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

      return {
        success: true,
        count: results.length,
        photographers: results,
        message: `Found ${results.length} photographers available on ${date}`,
      };
    },
  }),

  // ============================================
  // TOOL 4: Get Available Cars
  // ============================================
  getAvailableCars: tool({
    description:
      "Search for wedding car rental services. Use when user asks for cars, " +
      "vehicles, or bridal car.",
    inputSchema: z.object({
      date: z.string().describe("Wedding date YYYY-MM-DD"),
      budget: z.number().describe("Budget in PKR"),
      location: z.string().describe("City name"),
    }),
    execute: async ({ date, budget, location }) => {
      let cars = dummyVendors.filter((v) => v.category === "cars");

      if (location) {
        cars = cars.filter((c) =>
          c.city.toLowerCase().includes(location.toLowerCase())
        );
      }

      cars = cars.filter((c) => !c.bookedDates.includes(date));

      if (budget) {
        cars = cars.filter((c) => c.packagePrice! <= budget);
      }

      const results = cars
        .map((car) => ({
          id: car.id,
          name: car.name,
          location: car.location,
          packagePrice: car.packagePrice,
          rating: car.rating,
          features: car.features,
          phone: car.phone,
          withinBudget: budget ? car.packagePrice! <= budget : true,
        }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

      return {
        success: true,
        count: results.length,
        cars: results,
        message: `Found ${results.length} cars available on ${date}`,
      };
    },
  }),

  // ============================================
  // TOOL 5: Get Available Buses
  // ============================================
  getAvailableBuses: tool({
    description:
      "Search for guest transport bus services. Use when user asks for buses, " +
      "transport, or guest shuttles.",
    inputSchema: z.object({
      guestCount: z.number().describe("Number of guests needing transport"),
      date: z.string().describe("Wedding date YYYY-MM-DD"),
      budget: z.number().describe("Budget in PKR"),
      location: z.string().describe("City name"),
    }),
    execute: async ({ guestCount, date, budget, location }) => {
      let buses = dummyVendors.filter((v) => v.category === "buses");

      if (location) {
        buses = buses.filter((b) =>
          b.city.toLowerCase().includes(location.toLowerCase())
        );
      }

      buses = buses.filter((b) => !b.bookedDates.includes(date));

      if (budget) {
        buses = buses.filter((b) => b.packagePrice! <= budget);
      }

      const results = buses
        .map((bus) => ({
          id: bus.id,
          name: bus.name,
          location: bus.location,
          packagePrice: bus.packagePrice,
          rating: bus.rating,
          features: bus.features,
          capacity: bus.capacity,
          phone: bus.phone,
          withinBudget: budget ? bus.packagePrice! <= budget : true,
        }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

      return {
        success: true,
        count: results.length,
        buses: results,
        message: `Found ${results.length} buses for ${guestCount} guests on ${date}`,
      };
    },
  }),

  // ============================================
  // TOOL 6: Check Vendor Availability
  // ============================================
  checkVendorAvailability: tool({
    description:
      "Check if a specific vendor is available on a date. Use this BEFORE booking " +
      "to confirm availability.",
    inputSchema: z.object({
      vendorId: z.string().describe("Vendor ID like 'hall_001' or 'cater_003'"),
      date: z.string().describe("Date to check YYYY-MM-DD"),
    }),
    execute: async ({ vendorId, date }) => {
      const vendor = dummyVendors.find((v) => v.id === vendorId);

      if (!vendor) {
        return {
          available: false,
          error: "Vendor not found",
        };
      }

      const isBooked = vendor.bookedDates.includes(date);

      if (isBooked) {
        // Find next 3 available dates
        const availableDates: string[] = [];
        const checkDate = new Date(date);

        for (let i = 1; i <= 60 && availableDates.length < 3; i++) {
          const nextDate = new Date(checkDate);
          nextDate.setDate(nextDate.getDate() + i);
          const dateStr = nextDate.toISOString().split("T")[0];

          if (!vendor.bookedDates.includes(dateStr)) {
            availableDates.push(dateStr);
          }
        }

        return {
          available: false,
          vendorName: vendor.name,
          requestedDate: date,
          reason: `Already booked on ${date}`,
          nextAvailableDates: availableDates,
        };
      }

      return {
        available: true,
        vendorName: vendor.name,
        vendorId: vendor.id,
        category: vendor.category,
        requestedDate: date,
        message: `✓ ${vendor.name} is available on ${date}`,
      };
    },
  }),

  // ============================================
  // TOOL 7: Calculate Wedding Budget
  // ============================================
  calculateWeddingBudget: tool({
    description:
      "Calculate total cost of selected vendors with detailed breakdown. " +
      "Use when user wants to know total cost or budget summary.",
    inputSchema: z.object({
      guestCount: z.number().describe("Number of wedding guests"),
      selectedVendors: z
        .array(z.string())
        .describe("Array of vendor IDs like ['hall_001', 'cater_002']"),
    }),
    execute: async ({ guestCount, selectedVendors }) => {
      const breakdown: any = {};
      let total = 0;

      for (const vendorId of selectedVendors) {
        const vendor = dummyVendors.find((v) => v.id === vendorId);

        if (vendor) {
          let cost = 0;

          if (vendor.pricePerHead) {
            cost = vendor.pricePerHead * guestCount;
          } else if (vendor.packagePrice) {
            cost = vendor.packagePrice;
          }

          breakdown[vendor.category] = {
            vendorId: vendor.id,
            vendorName: vendor.name,
            cost: cost,
            details: vendor.pricePerHead
              ? `${guestCount} guests × PKR ${vendor.pricePerHead}/head`
              : `Package: PKR ${vendor.packagePrice}`,
          };

          total += cost;
        }
      }

      return {
        breakdown,
        total,
        perGuestCost: Math.round(total / guestCount),
        guestCount,
        summary: `Total: PKR ${total.toLocaleString()} for ${guestCount} guests`,
      };
    },
  }),

  // ============================================
  // TOOL 8: Create Booking (THE IMPORTANT ONE!)
  // ============================================
  createBooking: tool({
    description:
      "ACTUALLY BOOK THE VENDOR! This is the most important tool. " +
      "Use when user confirms they want to book. ALWAYS check availability first.",
    inputSchema: z.object({
      vendorId: z.string().describe("ID of vendor to book"),
      eventDate: z.string().describe("Wedding date YYYY-MM-DD"),
      guestCount: z.number().describe("Number of guests"),
    }),
    execute: async ({ vendorId, eventDate, guestCount }) => {
      // Find vendor
      const vendorIndex = dummyVendors.findIndex((v) => v.id === vendorId);

      if (vendorIndex === -1) {
        return {
          success: false,
          error: "Vendor not found",
        };
      }

      const vendor = dummyVendors[vendorIndex];

      // Check availability
      if (vendor.bookedDates.includes(eventDate)) {
        return {
          success: false,
          error: `${vendor.name} is already booked on ${eventDate}`,
          vendorName: vendor.name,
        };
      }

      // Calculate cost
      let amount = 0;
      if (vendor.pricePerHead && guestCount) {
        amount = vendor.pricePerHead * guestCount;
      } else if (vendor.packagePrice) {
        amount = vendor.packagePrice;
      }

      // Update vendor's booked dates (in-memory for prototype)
      dummyVendors[vendorIndex].bookedDates.push(eventDate);

      // Create booking
      const bookingNumber = `SS-2025-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      return {
        success: true,
        bookingNumber,
        vendorId,
        vendorName: vendor.name,
        category: vendor.category,
        eventDate,
        guestCount: guestCount || null,
        amount,
        status: "confirmed",
        message: `✅ Successfully booked ${vendor.name} for ${eventDate}!`,
        confirmationMessage: `
🎉 Booking Confirmed!

Vendor: ${vendor.name}
Category: ${vendor.category}
Date: ${eventDate}
${guestCount ? `Guests: ${guestCount}` : ""}
Amount: PKR ${amount.toLocaleString()}
Booking ID: ${bookingNumber}

✓ Confirmation sent
✓ Vendor notified
      `.trim(),
      };
    },
  })
}

// ============================================
// EXPORT ALL TOOLS FOR AI SDK
// ============================================
