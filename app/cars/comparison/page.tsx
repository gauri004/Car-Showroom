"use client";

import { FC, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { FaPlus } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import {
	COMPARISON_MODULE_LIMIT,
	LS_KEY,
	exclusionGroup,
} from "@/lib/constants";
import useLocalStorage from "@/hooks/useLocalStorage";
import { mockCarsData } from "@/mocks/cars";
import { Car } from "@/lib/types";

const getDifferingColumns = (arr: Car[]): Partial<Car>[] => {
	if (arr.length === 0) return [];

	const columnValueMap: Map<string, Set<string>> = new Map();

	// Build the map with column keys and sets of their unique values
	arr.forEach((car) => {
		Object.keys(car).forEach((key) => {
			if (!columnValueMap.has(key)) {
				columnValueMap.set(key, new Set());
			}
			// @ts-expect-error
			columnValueMap.get(key)!.add(car[key]);
		});
	});

	// Identify columns with differing values
	const differingColumns = Array.from(columnValueMap.entries())
		.filter(([_, valueSet]) => valueSet.size > 1)
		.map(([key, _]) => key);

	// Filter rows to only include differing columns
	return arr.map((car) => {
		const filteredCar: Partial<Car> = {};
		differingColumns.forEach((key) => {
			// @ts-expect-error
			filteredCar[key] = car[key];
		});
		return filteredCar;
	});
};

const CarComparisonPage = () => {
	const [selectedCars, setSelectedCars] = useLocalStorage<Car[]>(
		LS_KEY.SELECTED_CARS,
		[]
	);

	const [compareAll, setCompareAll] = useState(true);

	const addCar = (car: Car) => {
		if (selectedCars.length < COMPARISON_MODULE_LIMIT) {
			setSelectedCars([...selectedCars, car]);
		}
	};

	const removeCar = (id: number) => {
		setSelectedCars(selectedCars.filter((car) => car.id !== id));
	};

	const toggleCompareAll = () => {
		setCompareAll(!compareAll);
	};

	const differingColumns = useMemo(
		() => getDifferingColumns(selectedCars),
		[selectedCars]
	);

	const comparisonModuleCars = !compareAll ? differingColumns : selectedCars;

	const displayCars = useMemo(
		() =>
			comparisonModuleCars.reduce((acc, item) => {
				Object.keys(item).forEach((key) => {
					if (exclusionGroup.has(key)) return acc;

					// @ts-expect-error
					if (!acc[key]) {
						// @ts-expect-error
						acc[key] = [];
					}

					// @ts-expect-error
					acc[key].push(item[key]);
				});

				return acc;
			}, {}),
		[selectedCars, compareAll]
	);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{selectedCars.map((car) => (
					<CarCard
						car={car}
						key={car.id}
						removeCarFromComparisonModuleHandler={() => removeCar(car.id)}
					/>
				))}
				{selectedCars.length < COMPARISON_MODULE_LIMIT && (
					<Card className="flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="w-full h-full">
									<FaPlus className="w-8 h-8 text-muted-foreground" />
									<span className="sr-only">Add car</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-64 h-64 overflow-scroll"
							>
								{mockCarsData
									.filter(
										(car) =>
											!selectedCars.some((selected) => selected.id === car.id)
									)
									.map((car) => (
										<DropdownMenuItem
											key={car.id}
											className="flex items-center justify-between "
											onClick={() => addCar(car)}
										>
											<div className="flex items-center gap-2">
												<img
													src={car.image}
													alt={`${car.name}`}
													width={40}
													height={30}
													className="rounded-md object-cover"
													style={{ aspectRatio: "40/30", objectFit: "cover" }}
												/>
												<div>
													<div className="font-medium">
														{car.name} {car.category}
													</div>
													<div className="text-sm text-muted-foreground">
														{car.year}
													</div>
												</div>
											</div>
											<Button size="icon" variant="ghost">
												<FaPlus className="w-4 h-4" />
												<span className="sr-only">Add car</span>
											</Button>
										</DropdownMenuItem>
									))}
							</DropdownMenuContent>
						</DropdownMenu>
					</Card>
				)}
			</div>
			<div className="mt-8 flex justify-between items-center">
				<Button
					variant={compareAll ? "default" : "outline"}
					onClick={toggleCompareAll}
				>
					{compareAll ? "Show Differences" : "Show All Features"}
				</Button>
				<div className="flex items-center gap-2">
					<span className="text-muted-foreground">
						Compare up to {COMPARISON_MODULE_LIMIT} cars
					</span>
					<Badge
						variant={
							selectedCars.length === COMPARISON_MODULE_LIMIT
								? "secondary"
								: "default"
						}
					>
						{selectedCars.length}
					</Badge>
				</div>
			</div>
			<div className="mt-8 overflow-x-auto">
				<Table className="border">
					<TableHeader>
						<TableRow>
							<TableHead className="w-[200px]">Feature</TableHead>
							{selectedCars.map((car) => (
								<TableHead key={car.id} className="text-center">
									{car.name} {car.year}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{Object.keys(displayCars).map((key) => (
							<TableRow key={key}>
								<TableCell className="capitalize">{key}</TableCell>
								{
									// @ts-expect-error
									displayCars[key].map((item, index) => (
										<TableCell key={index} className="text-center">
											{item}
										</TableCell>
									))
								}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

const CarCard: FC<{
	car: Car;
	removeCarFromComparisonModuleHandler: () => void;
}> = ({ car, removeCarFromComparisonModuleHandler }) => {
	return (
		<Card key={car.id} className="relative">
			<img
				src={car.image}
				alt={`${car.name}`}
				width={400}
				height={300}
				className="rounded-t-lg object-cover w-full aspect-video"
			/>
			<CardContent className="p-4">
				<div className="flex justify-between items-center mb-2">
					<div className="font-medium flex gap-4 items-center">
						<div>{car.name}</div>
						<Badge>{car.category}</Badge>
					</div>
					<Button
						size="icon"
						variant="ghost"
						onClick={removeCarFromComparisonModuleHandler}
					>
						<RxCross1 className="w-5 h-5" />
						<span className="sr-only">Remove car</span>
					</Button>
				</div>

				<div className="text-sm text-muted-foreground">
					{car.year} | {car.price.toLocaleString()}
				</div>
			</CardContent>
		</Card>
	);
};

export default CarComparisonPage;
