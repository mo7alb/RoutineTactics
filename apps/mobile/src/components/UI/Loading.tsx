import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import React from "react";
import Container from "./Container";

type Prop = {
	title?: string;
	message?: string;
};

/**
 * A react component to indicate that some data is being loaded
 * @component
 * @example
 * const [isLoading, setIsLoading] = useState(false)
 * const [data, setData] = useState<string[]>([]);
 *
 * useEffect(() => {
 * 		setIsLoading(true)
 * 		fetch("/api/url")
 * 		 .then(data => data.json())
 *		 .then(strings => setData(strings))
 *		 .catch(error => console.error(error))
 *		 .finally(() => setIsLoading(false))
 * }, [])
 * if (isLoading) return <Loading title="Page Title" message="Loading strings" />
 */
export default function Loading({ title, message }: Prop) {
	return (
		<Container title={title ? title : ""} settings={true}>
			<View style={styles.centerItems}>
				<View>
					<Text>{message}</Text>
				</View>
				<ActivityIndicator size="large" />
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	centerItems: {
		flex: 1,
		display: "flex",
		justifyContent: "center",
	},
});
