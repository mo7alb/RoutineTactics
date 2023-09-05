import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function invitations() {
	const { invitations } = useLocalSearchParams();

	return (
		<View>
			<Text>invitations</Text>
			<Text>{JSON.stringify(invitations)}</Text>
		</View>
	);
}
