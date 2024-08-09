"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCarDetailsByCarNameSlug, getSimilarCars } from "@/lib/utils";
import { notFound } from "next/navigation";
import CarsSpecificationTable from "./components/CarsSpecificationTable";
import useLocalStorage from "@/hooks/useLocalStorage";
import { COMPARISON_MODULE_LIMIT, LS_KEY } from "@/lib/constants";
import { Car } from "@/lib/types";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function IndividualCar({
	params,
}: {
	params: { "car-name": string };
}) {
	const carName = params["car-name"];

	const carDetails = getCarDetailsByCarNameSlug(carName);

	if (!carDetails) {
		notFound();
	}

	const similarCars = getSimilarCars(carDetails.category, carDetails.id);

	const { toast } = useToast();

	const [selectedCars, setSelectedCars] = useLocalStorage<Car[]>(
		LS_KEY.SELECTED_CARS,
		[]
	);

	const isCarAddedInComparisonModule = useMemo(
		() => selectedCars.some((car) => car.id === carDetails.id),
		[selectedCars]
	);

	const addCarToComparisonModule = () => {
		if (selectedCars.length === COMPARISON_MODULE_LIMIT) {
			toast({
				title: `Uh-Oh! You can add maximum of ${COMPARISON_MODULE_LIMIT} cars to the comparison module.`,
			});

			return;
		}

		setSelectedCars((prev) => [...prev, carDetails]);

		toast({
			title: "Car added to the comparison module successfully!",
		});
	};

	return (
		<div className="p-4 ">
			<main className="container mx-auto mt-8 space-y-8 p-6 rounded-lg">
				<div className="grid md:grid-cols-4">
					<img
						src={carDetails.image}
						alt="Car Image"
						className="rounded-lg md:col-span-2 w-full"
						width="600"
						height="400"
						style={{ aspectRatio: "600/400", objectFit: "cover" }}
					/>
					<div className="flex flex-col justify-between p-4 md:col-span-2 md:ml-6">
						<div>
							<div className="flex justify-between">
								<h2 className="text-3xl font-bold">{carDetails.name}</h2>
								<p className="text-xl text-gray-600">{carDetails.price}</p>
							</div>
							<div className="flex gap-3">
								<p className="mt-2 text-gray-500">{carDetails.year}</p>
								<Badge className="mt-2">{carDetails.category}</Badge>
							</div>
							<p className="mt-4 text-gray-700">{carDetails.description}</p>
							<div className="w-full my-4 flex flex-row-reverse">
								<Button
									onClick={addCarToComparisonModule}
									disabled={isCarAddedInComparisonModule}
								>
									Add to Comparison
								</Button>
							</div>
							<div className="mt-5">
								<CarsSpecificationTable specification={carDetails} />
							</div>
						</div>
					</div>
				</div>
				<div>
					<h3 className="text-2xl font-bold mb-4">Similar Cars</h3>
					<div className="flex space-x-4 overflow-x-auto">
						{similarCars.map((car, index) => (
							<Card key={index} className="w-64 shrink-0">
								<Link href={`/cars/${car.slug}`} key={index}>
									<img
										src={carDetails.image}
										alt={car.name}
										className="w-full h-32 object-cover rounded-t-lg"
										width="250"
										height="150"
										style={{ aspectRatio: "250/150", objectFit: "cover" }}
									/>
								</Link>
								<div className="p-4">
									<h4 className="text-lg font-bold">{car.name}</h4>
									<p className="text-gray-600">{car.price}</p>
									<p className="text-gray-500">{car.year}</p>
									<p className="mt-2 text-gray-700">{car.description}</p>
								</div>
							</Card>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
