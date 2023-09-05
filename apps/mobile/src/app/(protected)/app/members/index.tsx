import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { useAuthContext } from "../../../../context/AuthContext";
import NewMember from "../../../../components/NewMember";
import { useGetProjectQuery } from "../../../../hooks/useGetProjectQuery";
import { Ionicons } from "@expo/vector-icons";

export default function Members() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (user == null) return null;

	const { project, isLoading, isError } = useGetProjectQuery(
		user,
		id as string
	);

	if (project == undefined) return null;

	const handleLeaveProject = () => {};

	return (
		<View>
			<Text>MemberList</Text>
			{!isLoading && !isError && project.userId === user.uid && (
				<NewMember user={user} id={id as string} />
			)}
			<FlatList
				data={[]}
				renderItem={({ item: member, index }) => (
					<View>
						<Ionicons
							name="person-circle-outline"
							size={24}
							color="black"
						/>
						<Text>THis is a member</Text>
					</View>
				)}
			/>
			{!isLoading && !isError && project.userId === user.uid && (
				<Button title="Leave project" onPress={handleLeaveProject} />
			)}
		</View>
	);
}
