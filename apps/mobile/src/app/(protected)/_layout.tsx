import { Stack } from "expo-router";

export default function ProtectedLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="dashboard"
				options={{ headerShown: false }}
			></Stack.Screen>
			<Stack.Screen
				name="projects/[id]"
				options={{ headerShown: false }}
			></Stack.Screen>
			<Stack.Screen
				name="projects/delete"
				options={{ presentation: "modal", headerShown: false }}
			></Stack.Screen>
			<Stack.Screen
				name="newProject"
				options={{ headerShown: false }}
			></Stack.Screen>
		</Stack>
	);
}
