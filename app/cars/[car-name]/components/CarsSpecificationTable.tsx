import { FC } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Car } from "@/lib/types";
import { carSpecificationKeys } from "@/lib/constants";

interface CarsSpecificationTableProps {
	specification: Car;
}

const CarsSpecificationTable: FC<CarsSpecificationTableProps> = ({
	specification,
}) => {
	return (
		<Table className="border w-full">
			<TableHeader className="bg-gray-100">
				<TableRow>
					<TableHead className="font-bold">Specifications</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{carSpecificationKeys.map((spec, index) => (
					<TableRow key={index}>
						<TableCell className="capitalize">{spec}</TableCell>
						<TableCell>{specification[spec as keyof Car]}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default CarsSpecificationTable;
