import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "../screens/Dashboard";
import ProjectDetails from "../screens/ProjectDetails";

const Stack = createStackNavigator();

export default function AppStack() {
	const options = { headerShown: false };

	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Dashboard"
				component={Dashboard}
				options={options}
			/>
			<Stack.Screen
				name="Project Details"
				component={ProjectDetails}
				options={options}
			/>
		</Stack.Navigator>
	);
}
