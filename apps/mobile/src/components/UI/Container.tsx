import React from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

type Props = {
	title?: string;
	settings: boolean;
	children: React.ReactNode;
};

/**
 * A react component that makes sure all the content of the screen are within
 * the visible area of the screen
 * @component
 * @example
 * return (
 *		<Container title="Dashboard" settings={true}>
 *			<View>
 *				<Text>This is within a container</Text>
 *			</View>
 *    </Container>
 * );
 */
export default function Container({ title, children, settings }: Props) {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.titleWrapper}>
				{title != null && <Text style={styles.title}>{title}</Text>}
				{settings && (
					<Link href="/(protected)/settings" style={styles.settingsIcon}>
						<AntDesign name="setting" size={24} color="black" />
					</Link>
				)}
			</View>
			<View style={styles.wrapper}>{children}</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 5,
	},
	title: {
		marginTop: 10,
		textAlign: "center",
		fontSize: 30,
		fontWeight: "600",
		flex: 1,
	},
	wrapper: {
		flex: 1,
		padding: 5,
	},
	titleWrapper: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	settingsIcon: {
		paddingRight: 15,
		paddingTop: 2,
	},
});
