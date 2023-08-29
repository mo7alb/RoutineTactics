import { SafeAreaView, Text, StyleSheet, View } from "react-native";

import React from "react";

type Props = {
	title?: string;
	children: React.ReactNode;
};

export default function Container({ title, children }: Props) {
	return (
		<SafeAreaView style={styles.container}>
			{title != null && <Text style={styles.title}>{title}</Text>}
			<View style={styles.wrapper}>{children}</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		textAlign: "center",
		fontSize: 30,
		fontWeight: "600",
	},
	wrapper: {
		flex: 1,
		padding: 5,
	},
});
