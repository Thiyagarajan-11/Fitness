import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../src/context/AuthContext";
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message'; // ✅ Import the toast package

export default function LoginScreen() {
  const router = useRouter();
  const auth = useContext(AuthContext);

  if (!auth) {
    return <Text>Loading...</Text>; 
  }

  const { login } = auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
  
    try {
      await login(email, password);

      // ✅ Show success toast instead of alert
      Toast.show({
        type: "success",
        text1: "Login Successful!",
        text2: "Welcome back to the Fitness App 💪",
        position: "top",
        visibilityTime: 9000,
        autoHide: true,
        topOffset: 50,
      });

      setTimeout(() => {
        router.push("/");
      }, 1500); // Redirect to home screen
    } catch (err:any) {
      setError("Invalid credentials. Please try again.");
    
      // ✅ Show error toast
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Invalid credentials. Please try again.",
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
    <LinearGradient colors={["#f5f5f5", "#008080"]} style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Sign In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/RegisterScreen")}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      {/* ✅ Add Toast Component at the bottom */}
      <Toast />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#008080",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#008080",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    backgroundColor: "#008080",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  error: {
    color: "#ff6347",
    marginBottom: 12,
    fontSize: 14,
  },
  linkText: {
    marginTop: 12,
    color: "#c0c0c0",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
