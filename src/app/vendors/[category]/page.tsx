
'use client';

import { useState, useMemo, useEffect } from 'react';
import { dummyVendors } from '@/lib/data';
import type { Vendor } from '@/lib/data';
import VendorCard from '@/components/vendors/VendorCard';
import VendorDetailModal from '@/components/vendors/VendorDetailModal';
import VendorFilters from '@/components/vendors/VendorFilters';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from '@/components/ui/pagination';


export type Filters = {
  categories: string[];
  location: string;
  budgetMin: number;
  budgetMax: number;
  weddingDate: Date | undefined;
  minRating: number;
  sortBy: string;
};

const VENDORS_PER_PAGE = 9;
const VALID_CATEGORIES = ['halls', 'catering', 'photography', 'cars', 'buses'];

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  const [filters, setFilters] = useState<Filters>({
    categories: [category === 'halls' ? 'hall' : category.slice(0, -1)],
    location: 'all',
    budgetMin: 0,
    budgetMax: 300000,
    weddingDate: undefined,
    minRating: 0,
    sortBy: 'recommended',
  });
  
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setIsMounted(true);
    const cat = category === 'halls' ? 'hall' : category.slice(0, -1);
    setFilters(f => ({ ...f, categories: [cat] }));
    setCurrentPage(1);
  }, [category]);


  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const initialVendors = useMemo(() => {
    const cat = category === 'halls' ? 'hall' : category.slice(0, -1);
    return dummyVendors.filter(v => v.category === cat);
  }, [category]);

  const filteredVendors = useMemo(() => {
    if(!isMounted) return [];

    let vendors = [...initialVendors];

    // Location filter
    if (filters.location && filters.location !== 'all') {
      vendors = vendors.filter((v) => v.city === filters.location);
    }

    // Budget filter
    const isPackageCategory = filters.categories.some(cat => ['photography', 'car', 'bus'].includes(cat));
    const budgetMax = isPackageCategory ? 300000 : 5000;

    vendors = vendors.filter((v) => {
      const price = v.pricePerHead ?? v.packagePrice ?? 0;
      const min = filters.budgetMin;
      const max = filters.budgetMax === (isPackageCategory ? 300000 : 5000) ? Infinity : filters.budgetMax;
      return price >= min && price <= max;
    });

    // Availability filter
    if (filters.weddingDate) {
      const dateString = filters.weddingDate.toISOString().split('T')[0];
      vendors = vendors.filter((v) => !v.bookedDates.includes(dateString));
    }

    // Rating filter
    if (filters.minRating > 0) {
      vendors = vendors.filter((v) => v.rating >= filters.minRating);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        vendors.sort(
          (a, b) =>
            (a.pricePerHead ?? a.packagePrice ?? 0) -
            (b.pricePerHead ?? b.packagePrice ?? 0)
        );
        break;
      case 'price-high':
        vendors.sort(
          (a, b) =>
            (b.pricePerHead ?? b.packagePrice ?? 0) -
            (a.pricePerHead ?? a.packagePrice ?? 0)
        );
        break;
      case 'rating':
        vendors.sort((a, b) => b.rating - a.rating);
        break;
      default:
        vendors.sort((a, b) => b.rating - a.rating);
        break;
    }
    return vendors;
  }, [filters, initialVendors, isMounted]);

  const totalPages = Math.ceil(filteredVendors.length / VENDORS_PER_PAGE);

  const paginatedVendors = useMemo(() => {
    const startIndex = (currentPage - 1) * VENDORS_PER_PAGE;
    const endIndex = startIndex + VENDORS_PER_PAGE;
    return filteredVendors.slice(startIndex, endIndex);
  }, [filteredVendors, currentPage]);


  const clearFilters = () => {
    const cat = category === 'halls' ? 'hall' : category.slice(0, -1);
    setFilters({
      categories: [cat],
      location: 'all',
      budgetMin: 0,
      budgetMax: 300000,
      weddingDate: undefined,
      minRating: 0,
      sortBy: 'recommended',
    });
    setCurrentPage(1);
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  }

  const pageTitle = `${category.charAt(0).toUpperCase() + category.slice(1)} in Pakistan - ShaadiSaathi`;

  return (
    <div className="bg-background min-h-screen">
      <title>{pageTitle}</title>
      <VendorFilters filters={filters} setFilters={setFilters} resultsCount={filteredVendors.length} isCategoryPage />
      
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
           <h2 className="text-lg font-medium text-foreground">
            Showing {filteredVendors.length} of {initialVendors.length} {category}
            {filters.location !== 'all' && ` in ${filters.location}`}
          </h2>
          <Button variant="link" onClick={clearFilters} className="text-primary">
            Clear All Filters
          </Button>
        </div>
        
        {paginatedVendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onViewDetails={() => setSelectedVendor(vendor)}
                selectedDate={filters.weddingDate}
              />
            ))}
          </div>
        ) : (
           <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-2">🔍 No vendors found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters to find the perfect match.</p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    onClick={() => handlePageChange(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>

      {selectedVendor && (
        <VendorDetailModal
          vendor={selectedVendor}
          isOpen={!!selectedVendor}
          onClose={() => setSelectedVendor(null)}
        />
      )}
    </div>
  );
}
