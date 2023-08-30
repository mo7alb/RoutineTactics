import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, Button, Alert } from "react-native";
import { useForm } from "react-hook-form";
import Input from "../UI/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../context/AuthContext";
import { createProject } from "../../api/project";
import { Project } from "../../types/project";
import { router } from "expo-router";
import DatePicker from "../UI/datePicker";
import { errorStyles } from "../styles/error";
import Categories from "../Categories";

export default function NewProjectForm() {
	const [categories, setCategories] = useState<string[]>([]);

	const user = useAuthContext();
	if (!user) return null;

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (newProject: Project) =>
			createProject(user, { ...newProject, categories }),
		onSuccess: () => queryClient.invalidateQueries(["projects"]),
		onError: error =>
			Alert.alert(
				"Error",
				error instanceof Error
					? error.message
					: "An unknown error occured, try again later"
			),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: "",
			description: "",
			dueDate: new Date(),
		},
	});

	const handleProjectSubmission = handleSubmit(data => {
		mutation.mutateAsync(data);
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
						minLength: {
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
						minLength: {
							value: 5,
							message:
								"Description should at least be 5 characters long",
						},
					}}
					placeholder="Project Description"
					error={errors.description != null}
				/>
				<DatePicker control={control} />
				<Categories categories={categories} setCategories={setCategories} />
				<Button title="Submit" onPress={handleProjectSubmission} />
			</KeyboardAvoidingView>
		</>
	);
}
