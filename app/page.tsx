"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { mockCarsData } from "@/mocks/cars";

export default function Component() {
	return (
		<div className="bg-background text-foreground">
			<main className="container mx-auto py-12">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
					{mockCarsData.map((car) => (
						<Card key={car.id} className="rounded-lg shadow-lg overflow-hidden">
							<Link href={`/cars/${car.slug}`} className="block">
								<img
									src={car.image}
									alt={`${car.name}`}
									width={400}
									height={225}
									className="w-full h-48 object-cover"
									style={{ aspectRatio: "400/225", objectFit: "cover" }}
								/>
							</Link>
							<CardContent className="p-4">
								<div className="flex items-center justify-between mb-2">
									<div className="text-lg font-bold">
										{car.name} {car.category}
									</div>
									<div className="text-primary font-bold">
										{car.price.toLocaleString()}
									</div>
								</div>
								<div className="text-muted-foreground text-sm mb-4">
									{car.year}
								</div>
								<p className="text-muted-foreground text-sm line-clamp-3">
									{car.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</main>
		</div>
	);
}
