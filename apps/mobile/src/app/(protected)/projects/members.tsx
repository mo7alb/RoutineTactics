import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { getProject } from "../../../api/project";
import FetchError from "../../../components/UI/FetchError";
import Loading from "../../../components/UI/Loading";
import ModalContainer from "../../../components/UI/ModalContainer";
import NewMember from "../../../components/newMember";
import { useAuthContext } from "../../../context/authContext";
import { leaveProject, getMembers, removeMember } from "../../../api/members";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

/**
 * A react native modal to render project member related operations
 * It renders a list of members adds a new member as well and allows member to leave a project
 *
 * @component
 */
export default function ProjectMembers() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	const queryClient = useQueryClient();

	const results = useQueries({
		queries: [
			{
				queryFn: () => getProject(user!, id as string),
				queryKey: ["project", id],
			},
			{
				queryFn: () => getMembers(user!, id as string),
				queryKey: ["members", id],
			},
		],
	});

	const { mutate } = useMutation({
		mutationFn: () => leaveProject(user!, id as string),
		onSuccess: () => queryClient.invalidateQueries(["projects"]),
	});

	const removeMemberMutation = useMutation({
		mutationFn: (userId: string) => removeMember(user!, id as string, userId),
		onSuccess: () => queryClient.invalidateQueries(["members", id]),
	});

	const admin = user?.uid === results[0].data?.userId;

	const project = results[0];
	const members = results[1];

	if (project.isLoading || members.isLoading)
		return <Loading title="Project Members" message="Loading Project" />;
	else if (project.isError || members.isError)
		return (
			<FetchError
				title="Project Members"
				error={project.isError ? project.error : members.error}
			/>
		);

	if (!user) return null;

	const handleLeaveProject = () => {
		mutate();
		router.replace("/(protected)/dashboard");
	};

	return (
		<ModalContainer title="Project Members">
			{admin && <NewMember projectId={id as string} />}
			<View style={admin ? styles.userList : styles.increasedHeight}>
				<FlatList
					data={members.data.users}
					renderItem={({ item }) => (
						<View
							style={[
								styles.member,
								admin && item.uid !== user.uid
									? {}
									: styles.adminMember,
							]}
						>
							<Ionicons
								name="person-outline"
								size={24}
								color="black"
								style={styles.memberIcon}
							/>
							<Text style={styles.memberEmail}>{item.email}</Text>
							{admin && item.uid !== user.uid && (
								<Pressable
									onPress={() => removeMemberMutation.mutate(item.uid)}
								>
									<FontAwesome name="trash-o" size={24} color="red" />
								</Pressable>
							)}
						</View>
					)}
				/>
			</View>
			{!admin && (
				<Pressable onPress={handleLeaveProject} style={styles.btn}>
					<Text style={styles.btnText}>Leave project</Text>
				</Pressable>
			)}
		</ModalContainer>
	);
}

const styles = StyleSheet.create({
	userList: { marginTop: 10, height: "60%", padding: 10 },
	increasedHeight: {
		height: "70%",
	},
	btn: {
		marginVertical: 5,
		borderRadius: 20,
		paddingVertical: 15,
		width: "90%",
		alignSelf: "center",
		backgroundColor: "#DF6653",
	},
	btnText: {
		color: "white",
		textAlign: "center",
		fontSize: 18,
	},
	member: {
		borderBottomWidth: 1,
		borderBottomColor: "black",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 5,
		padding: 5,
		overflow: "visible",
	},
	memberIcon: {
		marginLeft: 10,
	},
	memberEmail: {
		fontSize: 18,
		marginLeft: 10,
	},
	adminMember: {
		justifyContent: "flex-start",
	},
});
