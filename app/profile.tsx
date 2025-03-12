import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../src/context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userData, logout, fetchUserData } = useContext(AuthContext)!;

  useEffect(() => {
    if (user) {
      fetchUserData(); // Fetch user data when the profile screen loads
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/LoginScreen");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#f5f5f5",  "#008080"]}
      style={styles.container}
    >
      <View style={styles.profileContainer}>
        
        {/* App Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/fit1.png")} // Add your logo image in the assets folder
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <MaterialIcons name="person" size={24} color="#fff" />
            <Text style={styles.detailText}>Name: {userData?.name || "N/A"}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="cake" size={24} color="#fff" />
            <Text style={styles.detailText}>Age: {userData?.age || "N/A"}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="straighten" size={24} color="#fff" />
            <Text style={styles.detailText}>Height: {userData?.height || "N/A"} cm</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="fitness-center" size={24} color="#fff" />
            <Text style={styles.detailText}>Weight: {userData?.weight || "N/A"} kg</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="email" size={24} color="#fff" />
            <Text style={styles.detailText}>Email: {userData?.email || "N/A"}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Clean white background for a modern look
  },
  profileContainer: {
    width: '90%',
    backgroundColor: '#f8f8f8', // Light grey for subtle contrast
    borderRadius: 20, // Slightly rounded corners
    padding: 30,
    alignItems: 'center',
    shadowColor: '#cccccc', // Lighter shadow for a soft effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6, // Consistent elevation for Android
    borderWidth: 1,
    borderColor: '#e0e0e0', // Subtle border color
  },
  logoContainer: {
    width: 120, // Moderate size for logo container
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 60, // Circular logo container
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#008080', // A fresh blue color
  },
  logoImage: {
    width: 110, // Adjusted size for logo image
    height: 110,
    borderRadius: 55, // Circular logo image
  },
  detailsContainer: {
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15, // Consistent padding
    backgroundColor: '#ffffff', // White background for detail items
    borderRadius: 10, // Rounded corners
    shadowColor: '#aaaaaa', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#008080",
    borderWidth: 1 // Consistent elevation for Android
  },
  detailText: {
    color: '#333333', // Dark text for readability
    fontSize: 16, // Slightly increased font size for visibility
    marginLeft: 10,
  },
  logoutButton: {
    borderRadius: 25, // More rounded corners
    overflow: "visible",
    elevation: 0,
    marginTop: 20, // Spacing above button
  },
  logoutButtonBackground: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderRadius: 25, // Match button border radius
    backgroundColor: '#007bff', // Solid blue background for the button
  },
  logoutButtonText: {
    color: '#ff6347',
    fontSize: 25, // Increased font size for button text
    fontWeight: '700', // Semi-bold font weight for emphasis
    textAlign: 'center',
  },
});
