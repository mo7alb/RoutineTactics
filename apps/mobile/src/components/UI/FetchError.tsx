import { Text } from "react-native";
import React from "react";
import Container from "./Container";

type Prop = {
	title?: string;
	error: any;
};

/**
 * A react component that displays any errors occured when fetching data
 * @component
 * @example
 * const { isLoading, error, isError, data } = useQuery({
 *   queryKey: ['repoData'],
 *   queryFn: () =>
 *     fetch('/api/url').then(
 *       (res) => res.json(),
 *     ),
 * })
 * if (isError) {
 * 	return <FetchError title="Page title" error={error} />
 * }
 */
export default function FetchError({ error, title }: Prop) {
	const isError = (error: any) => error instanceof Error;
	return (
		<Container title={title} settings={true}>
			<Text>
				{isError(error)
					? error.message
					: "An error occured, try again later"}
			</Text>
		</Container>
	);
}
