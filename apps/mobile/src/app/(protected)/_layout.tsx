import { Stack } from "expo-router";

/**
 * A react layout component that defines the structure of the protected routes
 * @component
 */
export default function AppLayout() {
	return (
		<Stack>
			<Stack.Screen name="dashboard" options={{ headerShown: false }} />
			<Stack.Screen name="settings" options={{ headerShown: false }} />
			<Stack.Screen name="tasks/details" options={{ headerShown: false }} />
			<Stack.Screen
				name="projects/details"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="projects/members"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="projects/new"
				options={{ presentation: "modal", headerShown: false }}
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
				name="tasks/new"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="tasks/delete"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="tasks/edit"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="comments/delete"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="comments/edit"
				options={{ presentation: "modal", headerShown: false }}
			/>
			<Stack.Screen
				name="projects/invitations"
				options={{ presentation: "modal", headerShown: false }}
			/>
		</Stack>
	);
}
