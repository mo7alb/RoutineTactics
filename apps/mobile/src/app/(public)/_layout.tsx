import { Stack } from "expo-router";

export default function PublicLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="register"
				options={{ headerShown: false }}
			></Stack.Screen>
			<Stack.Screen
				name="login"
				options={{ headerShown: false }}
			></Stack.Screen>
		</Stack>
	);
}
