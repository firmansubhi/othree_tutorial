import React, { useState, useEffect } from "react";

import {
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	SafeAreaView,
	ScrollView,
	Dimensions,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView2 } from "@/components/ThemedView2";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { baseUrl, showAlert } from "../../../utils";
import { useColorScheme } from "@/hooks/useColorScheme";

const height = Dimensions.get("window").height;
export default function VerifyScreen() {
	const [mailkey, setMailkey] = useState("");
	const [message, setMessage] = useState("Please wait... sending email");
	const [loading, setLoading] = useState(false);

	const local = useLocalSearchParams();
	const colorScheme = useColorScheme();
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;

	useEffect(() => {
		sendCode();
	}, []);

	const sendCode = () => {
		setLoading(true);
		setMessage("Please wait... sending email");
		axios
			.post(baseUrl() + "auth/send-verification", {
				email: local.email,
			})
			.then(async function (response) {
				if (response.data.success == true) {
					showAlert("Code Sent", response.data.message);
				} else {
					showAlert("Failed", response.data.message);
				}

				setMessage(response.data.message);

				setLoading(false);
			})
			.catch(function (error) {
				setLoading(false);
				if (error.response) {
					showAlert("Failed", error.response.data.message);
				}
			});
	};

	const onPress = async () => {
		setLoading(true);
		axios
			.post(baseUrl() + "auth/verify-code", {
				email: local.email,
				code: mailkey,
			})
			.then(async function (response) {
				if (response.data.success == true) {
					showAlert("Success", response.data.message);
					router.replace("/login");
				} else {
					showAlert("Failed", response.data.message);
				}

				setLoading(false);
			})
			.catch(function (error) {
				setLoading(false);
				if (error.response) {
					showAlert("Failed", error.response.data.message);
				}
			});
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<ThemedView2 style={styles.mainContainer}>
					<ThemedText
						type="title"
						style={{
							fontSize: 28,
							textAlign: "center",
							paddingTop: 50,
							paddingBottom: 20,
						}}
					>
						Enter authentication code
					</ThemedText>
					<ThemedText
						style={{ textAlign: "center", paddingBottom: 50 }}
					>
						{message}
					</ThemedText>

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setMailkey}
						value={mailkey}
						placeholder="Type 6 digit code here"
						placeholderTextColor="#777"
						keyboardType="numeric"
						maxLength={6}
					/>

					<TouchableOpacity
						disabled={loading}
						style={[styles.button, { marginTop: 50 }]}
						onPress={onPress}
					>
						<Text style={styles.buttonText}>Continue</Text>
					</TouchableOpacity>

					{!loading && (
						<ThemedText
							style={{
								textAlign: "center",
								paddingTop: 10,
								fontWeight: "bold",
							}}
							onPress={() => sendCode()}
							type="link"
						>
							Resend Code
						</ThemedText>
					)}
				</ThemedView2>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	saveContainer: {
		flex: 1,
	},

	mainContainer: {
		padding: 30,
		flex: 1,
		flexDirection: "column",
		paddingBottom: 0,
		minHeight: height,
	},

	input: {
		height: 40,
		margin: 5,
		padding: 10,
		borderBottomWidth: 1,
		borderColor: "#ccc",
	},

	inputLight: {
		color: "#000",
	},
	inputDark: {
		color: "#fff",
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
