import React from "react";
import {
	View,
	Text,
	KeyboardAvoidingView,
	Alert,
	Button,
	Dimensions,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../../context/AuthContext";
import { createTask } from "../../api/task";
import { Task } from "../../types/task";
import { errorStyles } from "../styles/error";
import Input from "../UI/input";
import DatePicker from "../UI/datePicker";
import { router } from "expo-router";
import { MultipleSelectList } from "react-native-dropdown-select-list";

type Props = {
	projectId: string;
	categories: string[];
};

const defaultValues = {
	title: "",
	description: "",
	dueDate: new Date(),
	labels: [],
};

export default function NewTaskForm({ projectId, categories }: Props) {
	const user = useAuthContext();
	if (!user) return null;

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (newTask: Task) => createTask(user, newTask, projectId),
		onSuccess: () => queryClient.invalidateQueries(["project", projectId]),
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
	} = useForm({ defaultValues });

	const handleCreateTask = handleSubmit((data: Partial<Task>) => {
		mutation.mutate(data as Task);
		router.back();
	});

	return (
		<>
			<View style={errorStyles.errorContainer}>
				{errors.title && (
					<Text style={errorStyles.error}>{errors.title.message}</Text>
				)}
				{errors.description && (
					<Text style={errorStyles.error}>
						{errors.description.message}
					</Text>
				)}
			</View>
			<KeyboardAvoidingView>
				<Input
					name="title"
					control={control}
					rules={{
						required: "Title is required",
						minLength: {
							value: 3,
							message: "Title should at least be 3 characters long",
						},
						maxLength: {
							value: 25,
							message: "Title should be less than 25 characters",
						},
					}}
					placeholder="Task Title"
					error={errors.title != null}
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
						maxLength: {
							value: 100,
							message: "Description should be less than 100 characters",
						},
					}}
					placeholder="Task Description"
					error={errors.description != null}
				/>
				<DatePicker control={control} />
				{categories.length !== 0 && (
					<Controller
						name="labels"
						control={control}
						render={({ field: { onChange } }) => (
							<MultipleSelectList
								setSelected={onChange}
								data={categories}
								placeholder="Select label"
								label="Label"
								maxHeight={Dimensions.get("window").height * 0.4}
								boxStyles={{
									width: "90%",
									justifyContent: "center",
									alignSelf: "center",
								}}
							/>
						)}
					/>
				)}
				<Button title="Submit" onPress={handleCreateTask} />
			</KeyboardAvoidingView>
		</>
	);
}
