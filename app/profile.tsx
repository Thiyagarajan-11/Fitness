import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../src/context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userData, logout, fetchUserData } = useContext(AuthContext)!;

  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedAge, setUpdatedAge] = useState("");
  const [updatedHeight, setUpdatedHeight] = useState("");
  const [updatedWeight, setUpdatedWeight] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserData(); // Fetch user data when the profile screen loads
    }
  }, [user]);

  useEffect(() => {
    if (showEditModal && userData) {
      setUpdatedName(userData.name || "");
      setUpdatedAge(userData.age?.toString() || "");
      setUpdatedHeight(userData.height?.toString() || "");
      setUpdatedWeight(userData.weight?.toString() || "");
      setUpdatedEmail(userData.email || "");
    }
  }, [showEditModal, userData]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/LoginScreen");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const updateProfile = async () => {
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          name: updatedName,
          age: parseInt(updatedAge),
          height: parseFloat(updatedHeight),
          weight: parseFloat(updatedWeight),
          email: updatedEmail,
        });

        // Refresh user data
        await fetchUserData();

        // Close the modal
        setShowEditModal(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <LinearGradient colors={["#f5f5f5", "#008080"]} style={styles.container}>
      <View style={styles.profileContainer}>
        {/* App Logo Section */}
        <View style={styles.logoContainer}>
          <Image source={require("../assets/fit1.png")} style={styles.logoImage} resizeMode="contain" />
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

        {/* Small Round Edit Button */}
        <TouchableOpacity style={styles.editButton} onPress={() => setShowEditModal(true)}>
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>

        {/* View Workout History Button */}
        <TouchableOpacity style={styles.workoutHistoryButton} onPress={() => router.push("/workoutHistory")}>
          <Text style={styles.workoutHistoryButtonText}>View Workout History</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            {/* Name */}
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={updatedName}
              onChangeText={setUpdatedName}
            />

            {/* Age */}
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Age"
              keyboardType="numeric"
              value={updatedAge}
              onChangeText={setUpdatedAge}
            />

            {/* Height */}
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Height"
              keyboardType="numeric"
              value={updatedHeight}
              onChangeText={setUpdatedHeight}
            />

            {/* Weight */}
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Weight"
              keyboardType="numeric"
              value={updatedWeight}
              onChangeText={setUpdatedWeight}
            />

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={updatedEmail}
              onChangeText={setUpdatedEmail}
            />

            {/* Save and Cancel Buttons */}
            <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditModal(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    width: "90%",
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#cccccc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#008080",
  },
  logoImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  detailsContainer: {
    width: "100%",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#aaaaaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#008080",
    borderWidth: 1,
  },
  detailText: {
    color: "#333333",
    fontSize: 16,
    marginLeft: 10,
  },
  editButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#008080",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 20,
  },
  workoutHistoryButton: {
    backgroundColor: "#008080",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  workoutHistoryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#008080",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#008080",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});