import "@testing-library/jest-dom";
import { act, renderHook } from "@testing-library/react";

import useLocalStorage from "../useLocalStorage";

enum LS_KEY {
	USER = "user",
	THEME = "theme",
}

describe("useLocalStorage", () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	test("should return the initial value if local storage is empty", () => {
		const { result } = renderHook(() =>
			useLocalStorage<string>(LS_KEY.USER, "Guest")
		);

		expect(result.current[0]).toBe("Guest");
	});

	test("should return the stored value from local storage", () => {
		window.localStorage.setItem(LS_KEY.USER, JSON.stringify("John Doe"));

		const { result } = renderHook(() =>
			useLocalStorage<string>(LS_KEY.USER, "Guest")
		);

		expect(result.current[0]).toBe("John Doe");
	});

	test("should update the stored value in local storage", () => {
		const { result } = renderHook(() =>
			useLocalStorage<string>(LS_KEY.USER, "Guest")
		);

		act(() => {
			result.current[1]("John Doe");
		});

		expect(result.current[0]).toBe("John Doe");
		expect(window.localStorage.getItem(LS_KEY.USER)).toBe(
			JSON.stringify("John Doe")
		);
	});

	test("should update the stored value using a function", () => {
		const { result } = renderHook(() =>
			useLocalStorage<number>(LS_KEY.THEME, 1)
		);

		act(() => {
			result.current[1]((prevValue) => prevValue + 1);
		});

		expect(result.current[0]).toBe(2);
		expect(window.localStorage.getItem(LS_KEY.THEME)).toBe("2");
	});

	test("should handle errors when reading from local storage", () => {
		const spy = jest.spyOn(console, "warn").mockImplementation(() => {});

		window.localStorage.setItem(LS_KEY.USER, "{invalid json");

		const { result } = renderHook(() =>
			useLocalStorage<string>(LS_KEY.USER, "Guest")
		);

		expect(result.current[0]).toBe("Guest");
		expect(spy).toHaveBeenCalledWith(
			"Error reading local storage",
			expect.any(SyntaxError)
		);

		spy.mockRestore();
	});

	test("should handle errors when setting to local storage", () => {
		const spy = jest.spyOn(console, "warn").mockImplementation(() => {});

		jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
			throw new Error("Failed to set item");
		});

		const { result } = renderHook(() =>
			useLocalStorage<string>(LS_KEY.USER, "Guest")
		);

		act(() => {
			result.current[1]("John Doe");
		});

		expect(result.current[0]).toBe("John Doe");
		expect(spy).toHaveBeenCalledWith(
			"Error setting local storage",
			expect.any(Error)
		);

		spy.mockRestore();
	});
});
