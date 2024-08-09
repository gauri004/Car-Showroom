import { mockCarsData } from "@/mocks/cars";

export const COMPARISON_MODULE_LIMIT = 3;

export enum LS_KEY {
	SELECTED_CARS = "SELECTED_CARS",
}

export const exclusionGroup = new Set(["id", "name", "description", "image"]);

export const carSpecificationKeys = Object.keys(mockCarsData[0]).filter(
	(key) => !exclusionGroup.has(key)
);
