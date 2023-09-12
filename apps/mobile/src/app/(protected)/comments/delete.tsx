import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { deleteComment, getComment } from "../../../api/comments";
import ModalContainer from "../../../components/UI/ModalContainer";
import { useAuthContext } from "../../../context/authContext";
import Loading from "../../../components/UI/Loading";
import FetchError from "../../../components/UI/FetchError";

/**
 * A react native modal which displays a warning to the user about deleting a comment
 * @component
 */
export default function DeleteComment() {
	const { id } = useLocalSearchParams();
	const queryClient = useQueryClient();

	const user = useAuthContext();

	const { isLoading, data, isError, error } = useQuery({
		queryKey: ["comment", id],
		queryFn: () => getComment(user!, id as string),
	});
	const { mutate } = useMutation({
		mutationFn: () => deleteComment(user!, id as string),
		mutationKey: ["delete", "comment", id],
		onSuccess: () => queryClient.invalidateQueries(["task", data.task.id]),
	});

	if (isLoading)
		return <Loading title="Delete Comment" message="Loading Project" />;
	else if (isError) return <FetchError title="Delete Comment" error={error} />;

	const handleDeleteComment = () => {
		mutate();
		router.back();
	};

	return (
		<ModalContainer title="Delete Comment">
			<View style={styles.container}>
				<Text style={styles.warning}>
					Are you sure you want to delete this comment?
				</Text>
				<Pressable style={styles.btn} onPress={handleDeleteComment}>
					<Text style={styles.btnText}>Delete Comment</Text>
				</Pressable>
			</View>
		</ModalContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	warning: {
		fontSize: 18,
	},
	btn: {
		width: "90%",
		backgroundColor: "#DF6653",
		paddingVertical: 10,
		marginVertical: 10,
		borderRadius: 20,
	},
	btnText: {
		color: "white",
		textAlign: "center",
		fontSize: 18,
	},
});
