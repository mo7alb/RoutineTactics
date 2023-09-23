import { Button } from "react-native";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type Props = {
	control: Control<any, any>;
	name: string;
};

/**
 * A datepicker wrapper around the controller from react hook form
 * @component
 * @example
 * const {control}
 */
export default function DatePicker({ control, name }: Props) {
	const [showDatePicker, setShowDatePicker] = useState(false);

	return (
		<>
			<Button title="Due Date" onPress={() => setShowDatePicker(true)} />
			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, value } }) => (
					<DateTimePickerModal
						isVisible={showDatePicker}
						onConfirm={date => {
							onChange(date.toDateString());
							setShowDatePicker(false);
						}}
						onCancel={() => setShowDatePicker(false)}
						date={value == "" ? new Date() : new Date(value)}
					/>
				)}
			/>
		</>
	);
}
