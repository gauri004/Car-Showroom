import { cn, getCarDetailsByCarNameSlug, getSimilarCars } from "@/lib/utils"; // Adjust the import path as necessary

jest.mock("@/mocks/cars", () => ({
	mockCarsData: [
		{
			id: 1,
			name: "Tesla Model S",
			slug: "tesla-model-s",
			category: "Electric",
			image: "https://example.com/tesla.jpg",
		},
		{
			id: 2,
			name: "Tesla Model 3",
			slug: "tesla-model-3",
			category: "Electric",
			image: "https://example.com/tesla3.jpg",
		},
		{
			id: 3,
			name: "BMW i8",
			slug: "bmw-i8",
			category: "Hybrid",
			image: "https://example.com/bmw-i8.jpg",
		},
		{
			id: 4,
			name: "Audi e-tron",
			slug: "audi-e-tron",
			category: "Electric",
			image: "https://example.com/audi-e-tron.jpg",
		},
	],
}));

describe("cn function", () => {
	test("should combine class names correctly", () => {
		const result = cn("text-center", "bg-blue-500", "text-white");
		expect(result).toBe("text-center bg-blue-500 text-white");
	});

	test("should handle conditional class names", () => {
		const condition = true;
		const result = cn("text-center", condition && "bg-blue-500", "text-white");
		expect(result).toBe("text-center bg-blue-500 text-white");
	});

	test("should handle empty strings and undefined", () => {
		const result = cn("text-center", "", undefined, "text-white");
		expect(result).toBe("text-center text-white");
	});
});

describe("getCarDetailsByCarNameSlug function", () => {
	test("should return the correct car details for a valid slug", () => {
		const result = getCarDetailsByCarNameSlug("tesla-model-s");
		expect(result).toEqual({
			id: 1,
			name: "Tesla Model S",
			slug: "tesla-model-s",
			category: "Electric",
			image: "https://example.com/tesla.jpg",
		});
	});

	test("should return undefined for an invalid slug", () => {
		const result = getCarDetailsByCarNameSlug("invalid-slug");
		expect(result).toBeUndefined();
	});
});

describe("getSimilarCars function", () => {
	test("should return cars of the same category excluding the given car ID", () => {
		const result = getSimilarCars("Electric", 1);
		expect(result).toEqual([
			{
				id: 2,
				name: "Tesla Model 3",
				slug: "tesla-model-3",
				category: "Electric",
				image: "https://example.com/tesla3.jpg",
			},
			{
				id: 4,
				name: "Audi e-tron",
				slug: "audi-e-tron",
				category: "Electric",
				image: "https://example.com/audi-e-tron.jpg",
			},
		]);
	});

	test("should return an empty array if no similar cars are found", () => {
		const result = getSimilarCars("Nonexistent Category", 1);
		expect(result).toEqual([]);
	});

	test("should limit the number of returned cars based on the limit parameter", () => {
		const result = getSimilarCars("Electric", 1, 1);
		expect(result).toEqual([
			{
				id: 2,
				name: "Tesla Model 3",
				slug: "tesla-model-3",
				category: "Electric",
				image: "https://example.com/tesla3.jpg",
			},
		]);
	});
});
