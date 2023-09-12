import { EvilIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { createComment } from "../../api/comments";
import { useAuthContext } from "../../context/authContext";
import { errorStyles } from "../UI/AuthFormErrors";
import Form from "../UI/Form";

type Props = { taskId: string };

/**
 * A react component that renders a form to add a new comment
 * @component
 */
export default function NewComment({ taskId }: Props) {
	const queryClient = useQueryClient();
	const user = useAuthContext();

	const { mutate } = useMutation({
		mutationFn: (comment: string) => createComment(user!, taskId, comment),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
	});

	const {
		reset,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: { comment: "" } });

	if (!user) return null;

	const handleCreateComment = handleSubmit((data: { comment: string }) => {
		mutate(data.comment);
		reset();
	});

	return (
		<>
			<View style={errorStyles.errorContainer}>
				{errors.comment !== undefined && (
					<Text style={errorStyles.error}>{errors.comment.message}</Text>
				)}
			</View>
			<Form
				control={control}
				label="Comment"
				errors={errors}
				action={handleCreateComment}
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
								message: "Comment should be less than 100 characters",
							},
						},
						Icon: <EvilIcons name="comment" size={24} color="black" />,
					},
				]}
			/>
		</>
	);
}
