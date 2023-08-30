import { Stack, Tabs } from "expo-router";

export default function ProtectedLayout() {
	return (
		<Stack>
			<Stack.Screen name="dashboard" options={{ headerShown: false }} />
			<Stack.Screen name="projects/[id]" options={{ headerShown: false }} />
			<Stack.Screen
				name="projects/delete"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="projects/edit"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="newProject"
				options={{ presentation: "modal", headerShown: false }}
			/>
		</Stack>
	);
}
