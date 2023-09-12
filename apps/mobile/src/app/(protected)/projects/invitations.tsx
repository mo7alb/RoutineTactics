import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { getInvitations, updateInvitation } from "../../../api/invitations";
import FetchError from "../../../components/UI/FetchError";
import Loading from "../../../components/UI/Loading";
import ModalContainer from "../../../components/UI/ModalContainer";
import { useAuthContext } from "../../../context/authContext";
import { Invitation } from "../../../types/invitation";

/**
 * A react native modal for displaying a list of invitations sent to the user for other projects
 * @component
 */
export default function Invitations() {
	const user = useAuthContext();
	if (!user) return null;

	const {
		isLoading,
		isError,
		error,
		data: invitations,
	} = useQuery({
		queryFn: () => getInvitations(user),
		queryKey: ["invitations"],
	});

	if (isLoading)
		return <Loading title="Invitations" message="Loading invitations" />;

	if (isError) return <FetchError title="Invitations" error={error} />;

	return (
		<ModalContainer title="Invitations">
			{invitations.length === 0 && (
				<View style={{ marginVertical: 15 }}>
					<Text
						style={{
							fontSize: 17,
							fontWeight: "bold",
							textAlign: "center",
						}}
					>
						No Invitations
					</Text>
				</View>
			)}
			{invitations.length > 0 && (
				<FlatList
					data={invitations}
					renderItem={({ item }) => <InvitationRow item={item} />}
				/>
			)}
		</ModalContainer>
	);
}

function InvitationRow({ item }: { item: Invitation }) {
	const user = useAuthContext();
	if (!user) return null;

	const queryClient = useQueryClient();

	const accept = useMutation({
		mutationFn: () => updateInvitation(user, true, item.id),
		onSuccess: () => {
			queryClient.invalidateQueries(["invitations"]);
			queryClient.invalidateQueries(["projects"]);
		},
		onError: () =>
			Alert.alert(
				"Error",
				"An error occured while accepting the invitation, try again later"
			),
	});

	const reject = useMutation({
		mutationFn: () => updateInvitation(user, false, item.id),
		onSuccess: () => queryClient.invalidateQueries(["invitations"]),
		onError: () =>
			Alert.alert(
				"Error",
				"An error occured while rejecting the invitation, try again later"
			),
	});

	return (
		<View style={{ marginVertical: 20 }}>
			<Text style={styles.title}>Project name: {item.project.name}</Text>
			<View style={styles.btnContainer}>
				<Pressable
					style={[styles.btn, styles.acceptBtn]}
					onPress={() => accept.mutate()}
				>
					<Text style={styles.btnText}>Accept</Text>
				</Pressable>
				<Pressable
					style={[styles.btn, styles.rejectBtn]}
					onPress={() => reject.mutate()}
				>
					<Text style={styles.btnText}>Reject</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 18,
		fontWeight: "500",
		paddingLeft: 10,
	},
	btnContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
	},
	btn: {
		paddingVertical: 12,
		marginVertical: 5,
		width: "49%",
	},
	acceptBtn: {
		backgroundColor: "green",
	},
	rejectBtn: {
		backgroundColor: "red",
	},
	btnText: {
		textAlign: "center",
		color: "white",
	},
});
