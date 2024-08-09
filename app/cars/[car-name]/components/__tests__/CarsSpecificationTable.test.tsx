import React from "react";
import { render, screen } from "@testing-library/react";
import { Car } from "@/lib/types";
import { carSpecificationKeys } from "@/lib/constants";
import CarsSpecificationTable from "../CarsSpecificationTable";

// Mock data for the car specifications
const mockCar: Car = {
	id: 1,
	name: "Tesla Model S",
	image: "https://example.com/tesla.jpg",
	engine: "Electric",
	horsepower: "1020 HP",
	"top-speed": "200 mph",
	category: "Electric",
	price: "79999",
	year: 2023,
	description: "The fastest electric car.",
	slug: "tesla-model-s",
};

describe("CarsSpecificationTable", () => {
	test("renders the table with correct headers", () => {
		render(<CarsSpecificationTable specification={mockCar} />);

		expect(screen.getByText("Specifications")).toBeInTheDocument();
	});

	test("renders all car specifications provided in carSpecificationKeys", () => {
		render(<CarsSpecificationTable specification={mockCar} />);

		carSpecificationKeys.forEach((spec) => {
			expect(screen.getByText(spec)).toBeInTheDocument();
			expect(
				screen.getByText(mockCar[spec as keyof Car].toString())
			).toBeInTheDocument();
		});
	});

	test("renders empty cells if a specification is missing from the car object", () => {
		const incompleteCar: Partial<Car> = {
			id: 2,
			name: "Tesla Model 3",
			engine: "Electric",
			horsepower: "480 HP",
		};

		render(<CarsSpecificationTable specification={incompleteCar as Car} />);

		carSpecificationKeys.forEach((spec) => {
			if (incompleteCar[spec as keyof Car]) {
				expect(
					screen.getByText(incompleteCar[spec as keyof Car] as string)
				).toBeInTheDocument();
			} else {
				expect(
					screen.getAllByRole("cell")[carSpecificationKeys.indexOf(spec) + 1]
				).toHaveTextContent("");
			}
		});
	});
});
