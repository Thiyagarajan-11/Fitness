import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../src/context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useContext(AuthContext)!;
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      // Step 1: Register the user
      await register(name, age, height, weight, email, password);

      Toast.show({
             type: "success",
             text1: "Register Successful!",
             position: "top",
             visibilityTime: 9000,
             autoHide: true,
             topOffset: 50,
           });
     
           setTimeout(() => {
             router.push("/");
           }, 1500);
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
      Toast.show({
              type: "error",
              text1: "Registration Failed",
              position: "top",
              visibilityTime: 2000,
              autoHide: true,
              topOffset: 50,
            });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#f5f5f5", "#008080",]} style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Registration Form */}
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} />
      <TextInput style={styles.input} placeholder="Height (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />
      <TextInput style={styles.input} placeholder="Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} autoCapitalize="none" />

      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Registering..." : "Sign Up"}</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity onPress={() => router.push("/LoginScreen")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Clean white background
    padding: 20,
  },
  title: {
    fontSize: 32, // Larger font size for a bold title
    fontWeight: "bold", // Strong emphasis on the title
    marginBottom: 20,
    color: "#008080", // Bright yellow for energy
    textAlign: "center", // Centered text for a clean layout
  },
  subtitle: {
    fontSize: 16, // Subtitle for additional context
    color: "#333", // Dark gray for good readability
    marginBottom: 24,
    textAlign: "center", // Centered for a cohesive look
  },
  input: {
    width: "100%", // Full width for inputs
    padding: 14, // Comfortable padding
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#008080", // Yellow border for consistency
    borderRadius: 12, // Rounded corners for a friendly look
    backgroundColor: "#f9f9f9", // Light gray background for inputs
    shadowColor: "#000", // Subtle shadow for depth
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Elevation for Android
  },
  button: {
    backgroundColor: "#008080", // Bright yellow for the button
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 12,
    shadowColor: "#000", // Shadow for depth
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#ffffff", // White text color for contrast
    fontSize: 18, // Readable size for button text
    fontWeight: "700", // Medium font weight for visibility
  },
  error: {
    color: "#ff6347", // Bright red for error messages
    marginBottom: 12,
    fontSize: 14, // Font size for error messages
  },
  linkText: {
    marginTop: 12,
    color: "#fff5ee", // Bright blue for links
    textDecorationLine: "underline",
    fontWeight: "600", // Medium weight for better visibility
  },
  illustration: {
    width: 150, // Placeholder for illustration
    height: 150,
    marginBottom: 20,
  },
});