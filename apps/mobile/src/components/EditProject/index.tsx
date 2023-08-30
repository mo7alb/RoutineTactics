import { Alert, Button, KeyboardAvoidingView, View, Text } from "react-native";
import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { editProject } from "../../api/project";
import { Project } from "../../types/project";
import { User } from "firebase/auth";
import { useForm } from "react-hook-form";
import Input from "../UI/input";
import DatePicker from "../UI/datePicker";
import { errorStyles } from "../styles/error";
import Categories from "../Categories";

type Props = {
	user: User;
	project: Project;
};

export default function EditProjectForm({ user, project }: Props) {
	const [categories, setCategories] = useState(project.categories);
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: project.name,
			description: project.description,
			dueDate: project.dueDate,
		},
	});

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (editedProject: Project) =>
			editProject(user, project.id, { ...editedProject, categories }),
		onSuccess: () => {
			queryClient.invalidateQueries(["projects"]);
			queryClient.invalidateQueries(["project", project.id]);
		},
		onError: error =>
			Alert.alert(
				"Error",
				error instanceof Error
					? error.message
					: "An unknown error occured, try again later"
			),
	});

	const submitProjectChanges = handleSubmit(data => {
		mutation.mutate(data);
		router.back();
	});

	return (
		<>
			<View style={errorStyles.errorContainer}>
				{errors.name && (
					<Text style={errorStyles.error}>{errors.name.message}</Text>
				)}
				{errors.description && (
					<Text style={errorStyles.error}>
						{errors.description.message}
					</Text>
				)}
			</View>
			<KeyboardAvoidingView>
				<Input
					name="name"
					control={control}
					rules={{
						required: "Name is required",
						length: {
							value: 3,
							message: "Name should at least be 3 characters long",
						},
					}}
					placeholder="Project Name"
					error={errors.name != null}
				/>
				<Input
					name="description"
					control={control}
					rules={{
						length: {
							value: 5,
							message:
								"Description should at least be 5 characters long",
						},
					}}
					placeholder="Project Description"
					error={errors.description != null}
				/>
				{/* add date time picker here */}
				<DatePicker control={control} />
				<Categories categories={categories} setCategories={setCategories} />
				<Button title="Submit" onPress={submitProjectChanges} />
			</KeyboardAvoidingView>
		</>
	);
}
