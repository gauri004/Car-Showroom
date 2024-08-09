import "@testing-library/jest-dom";
import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

jest.useFakeTimers();

describe("useDebounce", () => {
	test("should return the initial value immediately", () => {
		const { result } = renderHook(() => useDebounce("initial", 500));
		expect(result.current).toBe("initial");
	});

	test("should update the debounced value after the delay", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: { value: "initial", delay: 500 },
			}
		);

		expect(result.current).toBe("initial");

		rerender({ value: "updated", delay: 500 });

		act(() => {
			jest.advanceTimersByTime(500);
		});

		expect(result.current).toBe("updated");
	});

	test("should not update the debounced value before the delay", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: { value: "initial", delay: 500 },
			}
		);

		expect(result.current).toBe("initial");

		rerender({ value: "updated", delay: 500 });

		act(() => {
			jest.advanceTimersByTime(200);
		});
	});

	test("should clear the previous timeout if value changes within the delay", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: { value: "initial", delay: 500 },
			}
		);

		expect(result.current).toBe("initial");

		rerender({ value: "updated-1", delay: 500 });

		act(() => {
			jest.advanceTimersByTime(200);
		});

		rerender({ value: "updated-2", delay: 500 });

		act(() => {
			jest.advanceTimersByTime(500);
		});

		expect(result.current).toBe("updated-2");
	});

	test("should update the debounced value if delay changes", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: { value: "initial", delay: 500 },
			}
		);

		expect(result.current).toBe("initial");

		rerender({ value: "updated", delay: 300 });

		// Fast-forward time to pass the new delay
		act(() => {
			jest.advanceTimersByTime(300);
		});

		expect(result.current).toBe("updated");
	});
});
