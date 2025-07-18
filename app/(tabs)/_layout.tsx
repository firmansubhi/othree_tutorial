import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { allowGroup } from "../../utils";
import { useSession } from "../ctx";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	const { session, role } = useSession();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: "absolute",
					},
					default: {},
				}),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="house.fill" color={color} />
					),
				}}
			/>

			{session ? (
				<Tabs.Screen
					name="transactions"
					options={{
						title: "Transaction",
						tabBarIcon: ({ color }) => (
							<Ionicons
								size={28}
								name="list-outline"
								color={color}
							/>
						),
					}}
				/>
			) : (
				<Tabs.Screen
					name="transactions"
					options={{
						href: null,
					}}
				/>
			)}

			{allowGroup(["administrator", "seller"]) ? (
				<Tabs.Screen
					name="myQRCode"
					options={{
						title: "QRCode",
						tabBarIcon: ({ color }) => (
							<Image
								style={[
									{
										width: 64,
										height: 64,
										position: "absolute",
										bottom: 0,
									},
								]}
								source={require("@/assets/images/qr-icon.svg")}
								contentFit="cover"
							/>
						),
					}}
				/>
			) : (
				<Tabs.Screen
					name="myQRCode"
					options={{
						href: null,
					}}
				/>
			)}

			{session ? (
				<Tabs.Screen
					name="profile"
					options={{
						title: "Profile",
						tabBarIcon: ({ color }) => (
							<Ionicons
								size={28}
								name="person-circle-outline"
								color={color}
							/>
						),
					}}
				/>
			) : (
				<Tabs.Screen
					name="profile"
					options={{
						href: null,
					}}
				/>
			)}

			{session ? (
				<Tabs.Screen
					name="logout"
					options={{
						title: "Sign Out",
						tabBarIcon: ({ color }) => (
							<Ionicons
								size={28}
								name="power-outline"
								color={color}
							/>
						),
					}}
				/>
			) : (
				<Tabs.Screen
					name="logout"
					options={{
						href: null,
					}}
				/>
			)}

			{!session ? (
				<Tabs.Screen
					name="login"
					options={{
						title: "Login",
						tabBarIcon: ({ color }) => (
							<Ionicons
								size={28}
								name="person-circle"
								color={color}
							/>
						),
					}}
				/>
			) : (
				<Tabs.Screen
					name="login"
					options={{
						href: null,
					}}
				/>
			)}
			{!session ? (
				<Tabs.Screen
					name="register"
					options={{
						title: "Join",
						tabBarIcon: ({ color }) => (
							<Ionicons
								size={28}
								name="person-add"
								color={color}
							/>
						),
					}}
				/>
			) : (
				<Tabs.Screen
					name="register"
					options={{
						href: null,
					}}
				/>
			)}
			<Tabs.Screen
				name="verify/[email]"
				options={{
					href: null,
				}}
			/>
			<Tabs.Screen
				name="scan"
				options={{
					href: null,
				}}
			/>
			<Tabs.Screen
				name="transaction/[id]"
				options={{
					href: null,
				}}
			/>
		</Tabs>
	);
}
