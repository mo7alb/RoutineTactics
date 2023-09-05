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
				name="projects/update"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="projects/new"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen name="tasks/details" options={{ headerShown: false }} />
			<Stack.Screen
				name="tasks/new"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="tasks/delete"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="tasks/update"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="members/index"
				options={{ presentation: "modal", headerShown: false }}
			/>
		</Stack>
	);
}
