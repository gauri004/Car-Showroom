import { render, screen, fireEvent } from "@testing-library/react";
import { mockCarsData } from "@/mocks/cars";
import { COMPARISON_MODULE_LIMIT } from "@/lib/constants";
import CarComparisonPage from "../page";

describe("CarComparisonPage", () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	test("renders correctly with no selected cars", () => {
		render(<CarComparisonPage />);

		expect(screen.getByText("Compare up to 3 cars")).toBeInTheDocument(); // Adjust number if COMPARISON_MODULE_LIMIT changes
		expect(screen.getByText("Show Differences")).toBeInTheDocument();
	});

	test("allows adding a car to the comparison", () => {
		render(<CarComparisonPage />);

		fireEvent.click(screen.getByText("Add car"));

		const carToAdd = mockCarsData[0];
		fireEvent.click(screen.getByText(`${carToAdd.name} ${carToAdd.category}`));

		expect(screen.getByText(carToAdd.name)).toBeInTheDocument();
	});

	test("prevents adding more than the comparison limit", () => {
		render(<CarComparisonPage />);

		const carsToAdd = mockCarsData.slice(0, COMPARISON_MODULE_LIMIT);

		carsToAdd.forEach((car) => {
			fireEvent.click(screen.getByText("Add car"));
			fireEvent.click(screen.getByText(`${car.name} ${car.category}`));
		});

		// Try to add one more car
		const extraCar = mockCarsData[COMPARISON_MODULE_LIMIT];
		fireEvent.click(screen.getByText("Add car"));
		fireEvent.click(screen.getByText(`${extraCar.name} ${extraCar.category}`));

		// Ensure the extra car was not added
		expect(screen.queryByText(extraCar.name)).not.toBeInTheDocument();
	});

	test("removes a car from the comparison", () => {
		render(<CarComparisonPage />);

		const carToAdd = mockCarsData[0];
		fireEvent.click(screen.getByText("Add car"));
		fireEvent.click(screen.getByText(`${carToAdd.name} ${carToAdd.category}`));

		expect(screen.getByText(carToAdd.name)).toBeInTheDocument();

		// Remove the car
		fireEvent.click(screen.getByLabelText("Remove car"));

		expect(screen.queryByText(carToAdd.name)).not.toBeInTheDocument();
	});

	test("toggles between showing all features and only differences", () => {
		render(<CarComparisonPage />);

		fireEvent.click(screen.getByText("Add car"));
		fireEvent.click(
			screen.getByText(`${mockCarsData[0].name} ${mockCarsData[0].category}`)
		);
		fireEvent.click(screen.getByText("Add car"));
		fireEvent.click(
			screen.getByText(`${mockCarsData[1].name} ${mockCarsData[1].category}`)
		);

		const toggleButton = screen.getByText("Show Differences");
		fireEvent.click(toggleButton);

		expect(screen.getByText("Show All Features")).toBeInTheDocument();
	});

	test("displays the comparison table correctly", () => {
		render(<CarComparisonPage />);

		const car1 = mockCarsData[0];
		const car2 = mockCarsData[1];

		// Add two cars to comparison
		fireEvent.click(screen.getByText("Add car"));
		fireEvent.click(screen.getByText(`${car1.name} ${car1.category}`));
		fireEvent.click(screen.getByText("Add car"));
		fireEvent.click(screen.getByText(`${car2.name} ${car2.category}`));

		// Check that table headers are rendered correctly
		expect(screen.getByText(car1.name)).toBeInTheDocument();
		expect(screen.getByText(car2.name)).toBeInTheDocument();

		// Check that table rows are rendered correctly
		expect(screen.getByText("Engine")).toBeInTheDocument();
		expect(screen.getByText("Horsepower")).toBeInTheDocument();
	});
});
