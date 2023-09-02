import { View, Text, Alert, Button, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { updateTask } from "../../api/task";
import { Task } from "../../types/task";
import DatePicker from "../UI/datePicker";
import Input from "../UI/input";
import { errorStyles } from "../styles/error";
import Loading from "../UI/loading";
import Error from "../UI/error";
import { useAuthContext } from "../../context/AuthContext";
import { useGetProjectQuery } from "../../hooks/useGetProjectQuery";
import MultiSelectDropDown from "../MultiSelectDropDown";

type Props = {
	task: Task;
};
export default function UpdateTask({ task }: Props) {
	const [labels, setLabels] = useState<string[]>(task.labels);
	const inputs = [
		{
			name: "title",
			rules: {
				required: "Title is required",
				minLength: {
					value: 3,
					message: "Title should at least be 3 characters long",
				},
				maxLength: {
					value: 25,
					message: "Title should be less than 25 characters",
				},
			},
			placeholder: "Task Title",
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
			placeholder: "Task Description",
		},
	];
	const user = useAuthContext();
	if (!user) return;

	const { project, isError, error, isLoading } = useGetProjectQuery(
		user,
		task.projectId
	);

	if (project == null) return null;

	if (isLoading) {
		return <Loading title="Edit task" />;
	}

	if (isError) {
		return <Error title="Edit task" error={error} />;
	}

	const queryClient = useQueryClient();

	const taskId = task.id;

	const mutation = useMutation({
		mutationFn: (task: Task) => updateTask(user, taskId!, task),
		onSuccess: () => queryClient.invalidateQueries(["task", task.id]),
		onError: error =>
			Alert.alert(
				"Error",
				error instanceof Error
					? // @ts-ignore
					  error.message
					: "An unknown error occured, try again later"
			),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: task.title,
			description: task.description,
			dueDate: new Date(task.dueDate!),
			labels: task.labels,
		},
	});

	const handleCreateTask = handleSubmit((data: Partial<Task>) => {
		mutation.mutate({ ...data, labels } as Task);
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

				<DatePicker control={control} />
				{project.categories.length !== 0 && (
					<MultiSelectDropDown
						options={project.categories}
						selected={labels}
						setSelected={setLabels}
						label="Select Category"
					/>
				)}
				<Button title="Submit" onPress={handleCreateTask} />
			</KeyboardAvoidingView>
		</>
	);
}
