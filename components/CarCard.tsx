import { FC } from "react";

interface CarCardProps {
	car: {
		id: number;
		name: string;
		image: string;
	};
	onSelect: (id: number) => void;
	isSelected: boolean;
}

const CarCard: FC<CarCardProps> = ({ car, onSelect, isSelected }) => {
	return (
		<div
			className={`border p-4 rounded-md ${
				isSelected ? "border-blue-500" : "border-gray-300"
			}`}
			onClick={() => onSelect(car.id)}
		>
			<img
				src={car.image}
				alt={car.name}
				className="w-full h-40 object-cover rounded-md"
			/>
			<h3 className="mt-2 text-lg font-medium">{car.name}</h3>
		</div>
	);
};

export default CarCard;
