interface CarSpecs {
	[key: string]: string;
}

const getDifferingColumns = (arr: CarSpecs[]): CarSpecs[] => {
	if (arr.length === 0) return [];

	const columnValueMap: Map<string, Set<string>> = new Map();

	// Build the map with column keys and sets of their unique values
	arr.forEach((car) => {
		Object.keys(car).forEach((key) => {
			if (!columnValueMap.has(key)) {
				columnValueMap.set(key, new Set());
			}
			columnValueMap.get(key)!.add(car[key]);
		});
	});

	// Identify columns with differing values
	const differingColumns = Array.from(columnValueMap.entries())
		.filter(([_, valueSet]) => valueSet.size > 1)
		.map(([key, _]) => key);

	// Filter rows to only include differing columns
	return arr.map((car) => {
		const filteredCar: CarSpecs = {};
		differingColumns.forEach((key) => {
			filteredCar[key] = car[key];
		});
		return filteredCar;
	});
};

// Example usage
const arr = [
	{
		Engine: "Hatchback",
		Horsepower: "262 HP",
		Transmission: "998KHV9YHLX833872",
		Drivetrain: "AWD",
		"0-60 mph": "7.57 sec",
		"Top Speed": "244 mph",
		Range: "228 miles",
	},
	{
		Engine: "Sedan",
		Horsepower: "262 HP",
		Transmission: "05VPF2AXD2HR33596",
		Drivetrain: "RWD",
		"0-60 mph": "8.48 sec",
		"Top Speed": "219 mph",
		Range: "228 miles",
	},
	{
		Engine: "Minivan",
		Horsepower: "262 HP",
		Transmission: "125YZFB2ZVTD90647",
		Drivetrain: "AWD",
		"0-60 mph": "4.51 sec",
		"Top Speed": "152 mph",
		Range: "228 miles",
	},
	{
		Engine: "Crew Cab Pickup",
		Horsepower: "262 HP",
		Transmission: "ARMVD6S7RUT513837",
		Drivetrain: "RWD",
		"0-60 mph": "7.57 sec",
		"Top Speed": "171 mph",
		Range: "228 miles",
	},
];

const differingData = getDifferingColumns(arr);
console.log(differingData);
