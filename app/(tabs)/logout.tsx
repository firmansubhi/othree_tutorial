import { useEffect } from "react";
import { Alert } from "react-native";
import { useSession } from "../ctx";
import { router, useNavigation, usePathname } from "expo-router";

export default function LogoutScreen() {
	const { signOut } = useSession();

	const navigation = useNavigation();
	const focused = navigation.isFocused();
	const path = usePathname();

	useEffect(() => {
		if (path == "/logout" && focused == true) {
			Alert.alert("Hold on!", "Are you sure you want to go sign out?", [
				{
					text: "Cancel",
					onPress: () => router.replace("/"),
					style: "cancel",
				},
				{ text: "Yes", onPress: () => signOut() },
			]);
		}
	}, [focused]);
}
