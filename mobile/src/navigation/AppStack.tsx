import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import ProjectDetails from "../screens/ProjectDetails";

const Stack = createStackNavigator();

export default function AppStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Home Screen" component={Home} />
			<Stack.Screen name="Project Details" component={ProjectDetails} />
		</Stack.Navigator>
	);
}
