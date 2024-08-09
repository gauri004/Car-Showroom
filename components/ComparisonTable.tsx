import React from "react";

interface ComparisonTableProps {
	cars: {
		id: number;
		name: string;
		specs: Record<string, string>;
	}[];
	showDifferences: boolean;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
	cars,
	showDifferences,
}) => {
	const allSpecs = cars.flatMap((car) => Object.keys(car.specs));
	const uniqueSpecs = Array.from(new Set(allSpecs));

	const filterSpecs = (spec: string) => {
		if (!showDifferences) return true;
		const values = cars.map((car) => car.specs[spec]);
		return new Set(values).size > 1;
	};

	return (
		<table className="min-w-full bg-white">
			<thead>
				<tr>
					<th className="py-2">Specification</th>
					{cars.map((car) => (
						<th key={car.id} className="py-2">
							{car.name}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{uniqueSpecs.filter(filterSpecs).map((spec) => (
					<tr key={spec}>
						<td className="border px-4 py-2">{spec}</td>
						{cars.map((car) => (
							<td key={car.id} className="border px-4 py-2">
								{car.specs[spec] || "N/A"}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default ComparisonTable;
