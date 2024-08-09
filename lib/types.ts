import { type mockCarsData } from "@/mocks/cars";

export type Car = (typeof mockCarsData)[number];
