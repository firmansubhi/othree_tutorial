import React from "react";
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
export default function ProductFormcreen() {
	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<ThemedView style={styles.mainContainer}>
					<ThemedText type="title">1st Text</ThemedText>
					<ThemedText type="title">2nd Text</ThemedText>
					<ThemedText type="title">3th Text</ThemedText>
				</ThemedView>
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
	},
});
