import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Container from "../../components/UI/container";
import { TouchableOpacity } from "react-native-gesture-handler";
import { signOut } from "firebase/auth";
import { Auth } from "../../config/firebase";

export default function Settings() {
	return (
		<Container title="Settings">
			<View>
				<Text>Your account is not verified</Text>
			</View>
			<View style={styles.container}>
				<TouchableOpacity onPress={() => signOut(Auth)} style={styles.btn}>
					<Text style={styles.btnText}>Log out</Text>
				</TouchableOpacity>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "95%",
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	btn: {
		width: 250,
		backgroundColor: "#DF6653",
		marginVertical: 5,
		borderRadius: 20,
		paddingVertical: 10,
	},
	btnText: {
		color: "white",
		textAlign: "center",
	},
});
