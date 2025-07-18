import React, { useState } from "react";
import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Text,
	Pressable,
	ScrollView,
	Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView2 } from "@/components/ThemedView2";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useSession } from "../ctx";
import { router } from "expo-router";
import { baseUrl, showAlert } from "../../utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const width = Dimensions.get("window").width;
export default function LoginScreen() {
	const { signIn } = useSession();
	const [username, onChangeUsername] = useState("");
	const [password, onChangePassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const colorScheme = useColorScheme();
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const onPress = async () => {
		setLoading(true);
		axios
			.post(baseUrl() + "auth/login", {
				username: username,
				password: password,
			})
			.then(async function (response) {
				if (response.data.success == true) {
					signIn(username, response.data.role, response.data.token);
					router.replace("/");
				} else {
					showAlert("Failed", response.data.message);
				}

				setLoading(false);
			})
			.catch(function (error) {
				setLoading(false);
				if (error.response) {
					let msg = error.response.data.message;
					showAlert("Failed", msg);
					if (error.response.data.message == "unverified") {
						router.replace(`./verify/${error.response.data.email}`);
					}
				}
			});
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<ThemedView2 style={styles.imageLogoContainer}>
					<Pressable onPress={() => router.replace("./index")}>
						<Image
							style={styles.imageLogo}
							source={require("@/assets/images/logo.svg")}
							contentFit="contain"
						/>
					</Pressable>
				</ThemedView2>

				<ThemedView2 style={styles.mainContainer}>
					<ThemedText>Username</ThemedText>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={onChangeUsername}
						value={username}
						placeholderTextColor="#777"
					/>

					<ThemedText>Password</ThemedText>
					<View style={styles.container}>
						<TextInput
							style={[styles.inputPass, themeTextInput]}
							onChangeText={onChangePassword}
							value={password}
							placeholderTextColor="#777"
							secureTextEntry={!showPassword}
						/>

						<Ionicons
							size={24}
							name={showPassword ? "eye-off" : "eye"}
							color="#aaa"
							style={styles.icon}
							onPress={toggleShowPassword}
						/>
					</View>
					<TouchableOpacity
						disabled={loading}
						style={styles.button}
						onPress={onPress}
					>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>

					<ThemedText
						onPress={() => router.replace("/register")}
						type="link"
						style={{ paddingTop: 10, textAlign: "center" }}
					>
						Don't have account? Join here
					</ThemedText>
				</ThemedView2>
				<Image
					style={[
						{
							marginTop: 60,
							width: width,
							height: width * (361 / 400),
						},
					]}
					source={require("@/assets/images/hello.svg")}
					contentFit="cover"
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	imageLogoContainer: {
		flex: 1,
		alignItems: "center",
		height: 80,
		paddingTop: 10,
		marginBottom: 0,
	},
	imageLogo: {
		width: 80,
		height: 80 * (144 / 165),
	},

	saveContainer: {
		flex: 1,
	},

	imageContainer: {
		height: 80,
	},
	mainContainer: {
		padding: 30,
		flex: 1,
		flexDirection: "column",
		paddingBottom: 0,
	},

	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		borderWidth: 1,
		borderColor: "#CBD5E1",
		backgroundColor: "#F8FAFC",
		borderRadius: 5,
		marginTop: 5,
		marginBottom: 15,
		paddingRight: 10,
	},

	input: {
		height: 40,
		marginBottom: 20,
		padding: 10,
		borderWidth: 1,
		borderColor: "#CBD5E1",
		borderRadius: 5,
		marginTop: 5,
	},

	inputPass: {
		height: 40,
		margin: 0,
		padding: 10,
		flex: 1,
	},

	inputLight: {
		color: Colors.light.text2,
		backgroundColor: Colors.light.background,
	},
	inputDark: {
		color: Colors.dark.text2,
		backgroundColor: Colors.dark.background,
	},

	icon: {
		marginLeft: 10,
	},
	button: {
		marginTop: 20,
		padding: 14,
		shadowColor: "rgba(0,0,0, .4)", // IOS
		shadowOffset: { height: 1, width: 1 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		backgroundColor: "#374982",
		elevation: 2, // Android
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		borderRadius: 20,
	},
	buttonText: {
		color: "white",
	},
});
