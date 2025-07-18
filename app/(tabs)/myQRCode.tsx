import React, { useState, useEffect } from "react";

import { StyleSheet, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { baseUrl, showAlert, getToken } from "../../utils";
import { useSession } from "../ctx";
import { useNavigation } from "expo-router";

export default function VerifyScreen() {
	const { session } = useSession();

	const [loading, setLoading] = useState(false);
	const [imgUrl, setImgUrl] = useState(
		"https://tempdev2.roomie.id/images/blank-qr.png"
	);

	const navigation = useNavigation();
	const focused = navigation.isFocused();

	useEffect(() => {
		if (focused) {
			sendCode();
		}
	}, [focused]);

	const sendCode = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "transactions/my-qrcode", {
				params: {
					username: session,
				},
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					setImgUrl(response.data.data);
				} else {
					showAlert("Failed", response.data.message);
				}
			})
			.catch(function (error) {
				if (error.response) {
					showAlert("Failed", error.response.data.message);
				}
			})
			.finally(function () {
				setLoading(false);
			});
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ThemedView style={styles.mainContainer}>
				<ThemedText type="title" style={styles.title}>
					My QR Code
				</ThemedText>

				<Image
					style={styles.imageQR}
					source={imgUrl}
					contentFit="contain"
					transition={1000}
				/>
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	saveContainer: {
		flex: 1,
	},

	imageContainer: {
		flex: 1,
		flexDirection: "row",
		maxHeight: 200,
	},
	mainContainer: {
		padding: 30,
		flex: 1,

		flexDirection: "column",
	},
	title: {
		textAlign: "center",
		paddingTop: 20,
	},

	imageQR: {
		flex: 1,
	},
});
