import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { errorStyles } from "../../../components/UI/AuthFormErrors";
import DatePicker from "../../../components/UI/DatePicker";
import FetchError from "../../../components/UI/FetchError";
import Form from "../../../components/UI/Form";
import Loading from "../../../components/UI/Loading";
import ModalContainer from "../../../components/UI/ModalContainer";
import MultiSelectDropDown from "../../../components/UI/MultiSelectDropDown";
import { useAuthContext } from "../../../context/authContext";
import { useProjects } from "../../../hooks/useProjects";
import { useTasks } from "../../../hooks/useTasks";
import { Task } from "../../../types/task";

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

const defaultValues = {
	title: "",
	description: "",
	dueDate: "",
	labels: [],
};

export default function NewTask() {
	const [labels, setLabels] = useState<string[]>([]);
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (user == null) return;

	const { project } = useProjects(user);

	const { data, isProjectError, loadingProject, projectError } = project(
		id as string
	);

	if (loadingProject) return <Loading title="New Task" message="Loading" />;
	else if (isProjectError)
		return <FetchError title="New Task" error={projectError} />;

	if (data == null) return null;

	const { newTask } = useTasks(user);
	const { mutate } = newTask(data.id as string);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues });

	const handleCreateTask = handleSubmit((data: Partial<Task>) => {
		mutate({ ...data, labels } as Task);
		router.back();
	});

	return (
		<ModalContainer title="New Task">
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
				action={handleCreateTask}
				label="Create new task"
			>
				<DatePicker control={control} name="dueDate" />
				<MultiSelectDropDown
					options={data.categories}
					label="Select label"
					selected={labels}
					setSelected={setLabels}
				/>
			</Form>
		</ModalContainer>
	);
}
