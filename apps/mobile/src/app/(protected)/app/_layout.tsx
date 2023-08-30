import { Stack, Tabs } from "expo-router";

export default function AppLayout() {
	return (
		<Stack>
			<Stack.Screen name="dashboard" options={{ headerShown: false }} />
			<Stack.Screen
				name="projects/details"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="projects/delete"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="projects/edit"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="projects/new"
				options={{ presentation: "modal", headerShown: false }}
			/>
		</Stack>
	);
}
