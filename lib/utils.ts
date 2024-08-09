import { mockCarsData } from "@/mocks/cars";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getCarDetailsByCarNameSlug = (slug: string) =>
	mockCarsData.find((car) => slug === car.slug);

export const getSimilarCars = (
	category: string,
	id: number,
	limit: number = 10
) =>
	mockCarsData
		.filter((car) => car.id !== id && car.category === category)
		.slice(0, limit);
