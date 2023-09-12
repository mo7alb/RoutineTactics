import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ModalContainer from "../../../components/UI/ModalContainer";
import { router, useLocalSearchParams } from "expo-router";
import { useAuthContext } from "../../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getComment, updateComment } from "../../../api/comments";
import FetchError from "../../../components/UI/FetchError";
import Loading from "../../../components/UI/Loading";
import { errorStyles } from "../../../components/UI/AuthFormErrors";
import { useForm } from "react-hook-form";
import Form from "../../../components/UI/Form";
import { EvilIcons } from "@expo/vector-icons";

/**
 * A react native modal to render a form for edit a particular comment
 * @component
 */
export default function EditComment() {
	const { id } = useLocalSearchParams();
	const queryClient = useQueryClient();

	const user = useAuthContext();

	const { isLoading, data, isError, error } = useQuery({
		queryKey: ["comment", id],
		queryFn: () => getComment(user!, id as string),
	});

	const { mutate } = useMutation({
		mutationFn: (comment: string) =>
			updateComment(user!, id as string, comment),
		mutationKey: ["edit", "comment", id],
		onSuccess: () => queryClient.invalidateQueries(["task", data.task.id]),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: { comment: data?.comment } });

	if (isLoading)
		return <Loading title="Edit Comment" message="Loading Comment" />;
	else if (isError) return <FetchError title="Edit Comment" error={error} />;

	const handleUpdateComment = handleSubmit(data => {
		mutate(data.comment);
		router.back();
	});

	return (
		<ModalContainer title="Edit comment">
			<View style={styles.wrapper}>
				<View style={styles.textWrapper}>
					<Text style={styles.text}>Current Comment: </Text>
					<Text style={[styles.text, styles.comment]}>{data.comment}</Text>
				</View>

				<View style={errorStyles.errorContainer}>
					{errors.comment && (
						<Text style={errorStyles.error}>
							{errors.comment.message as string}
						</Text>
					)}
				</View>
				<Form
					control={control}
					label="Update Comment"
					errors={errors}
					action={handleUpdateComment}
					inputs={[
						{
							name: "comment",
							secure: false,
							placeholder: "Comment",
							rules: {
								required: "Comment is required",
								minLength: {
									value: 5,
									message: "Comment should be at least 5 characters",
								},
								maxLenght: {
									value: 100,
									message:
										"Comment should be less than 100 characters",
								},
							},
							Icon: <EvilIcons name="comment" size={24} color="black" />,
						},
					]}
				/>
			</View>
		</ModalContainer>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		justifyContent: "center",
	},
	textWrapper: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
	},
	text: {
		textAlign: "center",
		fontSize: 16,
	},
	comment: {
		fontWeight: "bold",
	},
});
