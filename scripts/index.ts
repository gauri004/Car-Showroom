import { faker } from "@faker-js/faker";
import fs from "fs";

interface Car {
	id: number;
	name: string;
	image: string;
	engine: string;
	horsepower: string;
	"top-speed": string;
	category: string;
	price: string;
	year: number;
	description: string;
}

const categories = ["Electric", "Sedan", "SUV", "Luxury"];

const generateCar = (id: number): Car => {
	return {
		id,
		name: faker.vehicle.vehicle(),
		image: faker.image.transport(),
		horsepower: `${faker.datatype.number({ min: 100, max: 1500 })} HP`,
		"top-speed": `${faker.datatype.number({ min: 100, max: 300 })} mph`,
		category: faker.helpers.arrayElement(categories),
		price: `$${faker.datatype
			.number({ min: 20000, max: 200000 })
			.toLocaleString()}`,
		year: faker.datatype.number({ min: 2000, max: 2024 }),
		description: faker.lorem.sentence(),
		engine: faker.vehicle.type(),
	};
};

const generateCars = (count: number): Car[] => {
	const cars: Car[] = [];
	for (let i = 1; i <= count; i++) {
		cars.push(generateCar(i));
	}
	return cars;
};

const saveToFile = (data: Car[], fileName: string) => {
	fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
};

const main = () => {
	const numberOfCars = 50; // Change this to generate any number of cars
	const cars = generateCars(numberOfCars);
	saveToFile(cars, "mockData.json");
	console.log(`Generated ${numberOfCars} cars and saved to mockData.json`);
};

main();
