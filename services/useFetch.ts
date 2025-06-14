import { useEffect, useState } from "react";

export const useFetch = <T>(
	fetchFunction: () => Promise<T>,
	autoFetch = true
) => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			const result = await fetchFunction();
			setData(result);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("An Error occured"));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (autoFetch) {
			fetchData();
		}
	}, []);

	const reset = () => {
		setLoading(false);
		setData(null);
		setError(null);
	};

	return { loading, error, data, refetch: fetchData, reset };
};
