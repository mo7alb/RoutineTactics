import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { getProject } from "../../../api/project";
import { editTask, getTask } from "../../../api/tasks";
import { errorStyles } from "../../../components/UI/AuthFormErrors";
import DatePicker from "../../../components/UI/DatePicker";
import FetchError from "../../../components/UI/FetchError";
import Form from "../../../components/UI/Form";
import Loading from "../../../components/UI/Loading";
import ModalContainer from "../../../components/UI/ModalContainer";
import MultiSelectDropDown from "../../../components/UI/MultiSelectDropDown";
import { useAuthContext } from "../../../context/authContext";
import { Task } from "../../../types/task";
import { Octicons, MaterialIcons } from "@expo/vector-icons";

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
		secure: false,
		Icon: <Octicons name="tasklist" size={24} color="black" />,
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
		secure: false,
		Icon: <MaterialIcons name="description" size={24} color="black" />,
	},
];

function useData(id: string, projectId: string) {
	const [labels, setLabels] = useState<string[]>([]);
	const queryClient = useQueryClient();
	const user = useAuthContext();

	const results = useQueries({
		queries: [
			{
				queryFn: () => getTask(user!, id as string),
				queryKey: ["task", id],
			},
			{
				queryFn: () => getProject(user!, projectId as string),
				queryKey: ["project", id],
			},
		],
	});

	const changeTask = useMutation({
		mutationFn: (changedTask: Task) =>
			editTask(user!, id as string, changedTask),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["task", id] });
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: results[0].data?.title,
			description: results[0].data?.description,
			dueDate: new Date(results[0].data?.dueDate!),
			labels: results[0].data?.labels,
		},
	});

	const handleUpdateTask = handleSubmit((data: Partial<Task>) => {
		changeTask.mutate({ ...data, labels } as Task);
		router.back();
	});

	return { results, control, errors, handleUpdateTask, labels, setLabels };
}

export default function EditTask() {
	const { id, projectId } = useLocalSearchParams();

	const { results, control, errors, handleUpdateTask, labels, setLabels } =
		useData(id as string, projectId as string);

	if (results[0].isLoading || results[1].isLoading)
		return <Loading title="New Task" message="Loading" />;
	if (results[0].isError || results[1].isError)
		return (
			<FetchError
				title="New Task"
				error={results[0].isError ? results[0].error : results[1].error}
			/>
		);

	return (
		<ModalContainer title="Edit Task">
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
			<Form
				inputs={inputs}
				control={control}
				errors={errors}
				action={handleUpdateTask}
				label="Update task"
			>
				<DatePicker control={control} name="dueDate" />
				<MultiSelectDropDown
					options={results[1].data.categories}
					label="Select label"
					selected={labels}
					setSelected={setLabels}
				/>
			</Form>
		</ModalContainer>
	);
}
