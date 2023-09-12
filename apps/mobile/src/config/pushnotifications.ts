import { isDevice } from "expo-device";
import {
	setNotificationChannelAsync,
	AndroidImportance,
	getPermissionsAsync,
	requestPermissionsAsync,
	getExpoPushTokenAsync,
} from "expo-notifications";
import { Platform } from "react-native";

/**
 * a function to create a push notification token for a device
 * @returns {string | undefined} a token string or undefined for simulators
 */
async function registerPushNotifications() {
	let token;

	if (Platform.OS === "android") {
		await setNotificationChannelAsync("default", {
			name: "default",
			importance: AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
		});
	}

	if (isDevice) {
		const { status: existingStatus } = await getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			alert("Failed to get push token for push notification!");
			return;
		}

		token = (
			await getExpoPushTokenAsync({
				projectId: "6d4f8679-34b6-4f95-9301-8562bed25cce",
			})
		).data;
	}

	return token;
}

export { registerPushNotifications };
