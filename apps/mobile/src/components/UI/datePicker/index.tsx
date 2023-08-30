import { Button } from "react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function DatePicker({ control }) {
	const [showDatePicker, setShowDatePicker] = useState(false);

	return (
		<>
			<Button title="Due Date" onPress={() => setShowDatePicker(true)} />
			<Controller
				name="dueDate"
				control={control}
				render={({ field: { onChange, value } }) => (
					<DateTimePickerModal
						isVisible={showDatePicker}
						onChange={onChange}
						onConfirm={() => setShowDatePicker(false)}
						onCancel={() => setShowDatePicker(false)}
						date={new Date(value)}
					/>
				)}
			/>
		</>
	);
}
