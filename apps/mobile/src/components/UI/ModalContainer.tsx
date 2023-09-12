import { Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import CloseButton from "./CloseButton";

type Props = { title: string; children: React.ReactNode };

/**
 * A container wrapped around content of a modal to make sure they are displayed within the screen
 *
 * @component
 * @example
 * import ModalContainer from "/components/UI/ModalContainer"
 *
 * function Component() {
 * 	return (
 * 		<ModalContainer>
 *		  <View><Text>This is a modal</Text></View>
 *		</ModalContainer>
 *	)
 * }
 */
export default function ModalContainer({ title, children }: Props) {
	return (
		<SafeAreaView style={styles.container}>
			<CloseButton />
			<Text style={styles.title}>{title}</Text>
			{children}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		textAlign: "center",
		marginTop: 10,
		fontSize: 30,
		fontWeight: "600",
	},
});
