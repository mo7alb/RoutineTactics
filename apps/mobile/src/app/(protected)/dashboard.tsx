import { View, Text, SafeAreaView, Button } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { Auth } from "../../config/firebase";

export default function Dashboard() {
	return (
		<SafeAreaView>
			<View>
				<Text>Dashboard</Text>
				<Button title="logout" onPress={() => signOut(Auth)} />
			</View>
		</SafeAreaView>
	);
}
