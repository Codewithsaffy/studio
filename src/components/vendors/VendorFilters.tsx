'use client';

import { useState } from 'react';
import { Tag, MapPin, DollarSign, Calendar as CalendarIcon, Star, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import type { Filters } from '@/app/vendors/page';
import { dummyVendors } from '@/lib/data';

interface VendorFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  resultsCount: number;
  isCategoryPage?: boolean;
}

const categories = [
  { id: 'hall', name: 'Wedding Halls' },
  { id: 'catering', name: 'Catering' },
  { id: 'photography', name: 'Photography' },
  { id: 'car', name: 'Cars' },
  { id: 'bus', name: 'Buses' },
];

const locations = [...new Set(dummyVendors.map(v => v.city))];

export default function VendorFilters({ filters, setFilters, resultsCount, isCategoryPage = false }: VendorFiltersProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  const handleBudgetChange = (value: number[]) => {
    setFilters(prev => ({...prev, budgetMin: value[0], budgetMax: value[1]}));
  };

  const isPackageCategory = filters.categories.some(cat => ['photography', 'car', 'bus'].includes(cat));
  const budgetMax = isPackageCategory ? 300000 : 5000;
  const budgetStep = isPackageCategory ? 10000 : 100;

  const filterContent = (
    <>
      {!isCategoryPage && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-shrink-0"><Tag className="mr-2 h-4 w-4"/>Category ({filters.categories.length || 'All'})</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
              {categories.map(cat => (
                <DropdownMenuCheckboxItem
                  key={cat.id}
                  checked={filters.categories.includes(cat.id)}
                  onCheckedChange={() => handleCategoryChange(cat.id)}
                >
                  {cat.name}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({...prev, location: value}))}>
        <SelectTrigger className="w-full md:w-auto flex-shrink-0">
          <MapPin className="mr-2 h-4 w-4"/><SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {locations.map(loc => (
            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto flex-shrink-0">
            <DollarSign className="mr-2 h-4 w-4" /> 
            Budget: {filters.budgetMin.toLocaleString()} - {filters.budgetMax === budgetMax ? 'Any' : filters.budgetMax.toLocaleString()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-4 w-64">
          <label className="text-sm font-medium">Price Range</label>
          <Slider
            min={0}
            max={budgetMax}
            step={budgetStep}
            value={[filters.budgetMin, filters.budgetMax]}
            onValueChange={handleBudgetChange}
            className="my-4"
          />
          <div className="flex justify-between text-xs">
            <span>PKR {filters.budgetMin.toLocaleString()}</span>
            <span>PKR {filters.budgetMax.toLocaleString()}</span>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant={'outline'} className="w-full md:w-auto flex-shrink-0">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.weddingDate ? filters.weddingDate.toLocaleDateString() : 'Select Date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={filters.weddingDate}
            onSelect={(date) => setFilters(prev => ({...prev, weddingDate: date as Date}))}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto flex-shrink-0"><Star className="mr-2 h-4 w-4"/>Rating: {filters.minRating > 0 ? `${filters.minRating}+ Stars` : 'All'}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={String(filters.minRating)} onValueChange={(val) => setFilters(f => ({...f, minRating: Number(val)}))}>
            <DropdownMenuRadioItem value="0">All Ratings</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="5">★★★★★ (5)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="4">★★★★☆ (4+)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="3">★★★☆☆ (3+)</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({...prev, sortBy: value}))}>
        <SelectTrigger className="w-full md:w-auto flex-shrink-0">
          <ArrowUpDown className="mr-2 h-4 w-4"/><SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recommended">Recommended</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="rating">Rating: Highest</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="bg-card border-b border-border p-4 sticky top-0 z-50">
      {/* Desktop Filters */}
      <div className="hidden lg:flex items-center gap-4">
        <span className="font-semibold text-sm">Filters:</span>
        {filterContent}
        <Button className="ml-auto bg-gradient-to-r from-secondary to-amber-600 text-secondary-foreground font-bold">Apply Filters ({resultsCount})</Button>
      </div>
      
      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full"><SlidersHorizontal className="mr-2 h-4 w-4"/> Filters ({resultsCount})</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-lg">
            <SheetHeader>
              <SheetTitle>Filter Vendors</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-4">
              {filterContent}
            </div>
            <SheetFooter>
              <Button onClick={() => setIsSheetOpen(false)} className="w-full bg-gradient-to-r from-secondary to-amber-600 text-secondary-foreground font-bold">Apply Filters ({resultsCount})</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}