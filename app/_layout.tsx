import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { SessionProvider } from "./ctx";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;

	//  return (
	//    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
	//      <Stack>
	//        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
	//        <Stack.Screen name="+not-found" />
	//      </Stack>
	//      <StatusBar style="auto" />
	//    </ThemeProvider>
	//  );
}

import { Slot } from "expo-router";

function RootLayoutNav() {
	const colorScheme = useColorScheme();
	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<SessionProvider>
				<Slot />
			</SessionProvider>
		</ThemeProvider>
	);
}
