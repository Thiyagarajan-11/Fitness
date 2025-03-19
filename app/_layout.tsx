// app/_layout.tsx
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "../src/context/AuthContext";
import { auth } from "../src/firebaseConfig";
import Toast from "react-native-toast-message";
export default function Layout() {
  const router = useRouter();
  

  useEffect(() => {
    const checkLogin = async () => {
      console.log("Firebase Auth:", auth);
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        router.replace("/LoginScreen"); // Redirect to login if not authenticated
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
        <Stack.Screen name="progressChart" options={{ title: "Progress Chart" }} />
        <Stack.Screen name="workoutHistory" options={{ title: "Workout History" }} />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}