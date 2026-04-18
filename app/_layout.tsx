import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F7F7F5" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="campaign/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="submit/[campaignId]" options={{ presentation: "modal" }} />
      </Stack>
    </>
  );
}
