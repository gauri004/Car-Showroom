"use client";

import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { CiSearch } from "react-icons/ci";
import { useDebounce } from "@/hooks/useDebounce";
import { mockCarsData } from "@/mocks/cars";
import { Car } from "@/lib/types";

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchValue = useDebounce(searchTerm);

  const [searchResults, setSearchResults] = useState<Car[]>([]);

  useEffect(() => {
    if (debouncedSearchValue) {
      const filteredCars = mockCarsData.filter((car) =>
        car.name.toLowerCase().startsWith(debouncedSearchValue.toLowerCase())
      );

      setSearchResults(filteredCars);
    }
  }, [debouncedSearchValue]);

  return (
    <header className="bg-muted py-4 px-6 shadow">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Car Showroom
        </Link>
        <div className="flex gap-5 items-center">
          <Link href="/cars/compare-cars">Compare Cars</Link>
          <div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 rounded-lg bg-background border border-muted focus:border-primary focus:ring-primary"
              />
              <CiSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            {/* Dropdown */}
            {searchTerm && (
              <div className="mt-4 max-h-[300px] right-5 overflow-auto absolute rounded-lg border">
                <SearchDropdown searchResults={searchResults} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const SearchDropdown: FC<{
  searchResults: Car[];
}> = ({ searchResults }) => {
  return (
    <div className="grid gap-2 p-2 relative shadow-md z-[1000]  bg-white">
      {searchResults.map((car) => (
        <SearchDropdownCard
          description={car.description}
          imageSrc={car.image}
          name={car.name}
          key={car.id}
          slug={car.slug}
        />
      ))}
    </div>
  );
};

const SearchDropdownCard: FC<{
  name: string;
  imageSrc: string;
  description: string;
  slug: string;
}> = ({ name, imageSrc, description, slug }) => {
  return (
    <Link href={`/cars/${slug}`}>
      <div className="flex items-center gap-4 rounded-md bg-muted/50 p-2 hover:bg-muted">
        <img
          src={imageSrc}
          alt={imageSrc}
          width={64}
          height={64}
          className="aspect-square rounded-md object-cover"
        />
        <div>
          <h3 className="text-base font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default NavBar;
