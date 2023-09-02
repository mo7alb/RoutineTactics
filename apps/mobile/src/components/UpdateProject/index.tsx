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

export default function UpdateProjectForm({ user, project }: Props) {
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
			editProject(user, project.id!, { ...editedProject, categories }),
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
		mutation.mutate(data as Project);
		router.back();
	});

	const inputs = [
		{
			name: "name",
			rules: {
				required: "Name is required",
				minLength: {
					value: 3,
					message: "Name should at least be 3 characters long",
				},
				maxLength: {
					value: 25,
					message: "Name should be less than 25 characters",
				},
			},
			placeholder: "Project Name",
		},
		{
			name: "description",
			rules: {
				minLength: {
					value: 5,
					message: "Description should at least be 5 characters long",
				},
				maxLength: {
					value: 100,
					message: "Description should be less than 100 characters",
				},
			},
			placeholder: "Project Description",
		},
	];

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
				{inputs.map(input => (
					<Input
						key={input.name}
						name={input.name}
						control={control}
						rules={input.rules}
						placeholder={input.placeholder}
						error={errors[input.name] != null}
					/>
				))}
				{/* add date time picker here */}
				<DatePicker control={control} />
				<Categories categories={categories} setCategories={setCategories} />
				<Button title="Submit" onPress={submitProjectChanges} />
			</KeyboardAvoidingView>
		</>
	);
}
