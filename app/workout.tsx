import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator,Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { db, auth } from "../src/firebaseConfig";
import { doc, setDoc,getDoc, collection } from "firebase/firestore";

interface Exercise {
  id: string;
  name: string;
  target: string;
  equipment: string;
  gifUrl: string;
}

const muscleGroups = [
  { name: "Chest", target: "pectorals" },
  { name: "Shoulders", target: "delts" },
  { name: "Arms", target: "biceps" },
  { name: "Legs", target: "quads" },
  { name: "Back", target: "lats" },
  { name: "Abs", target: "abs" },
];

const WorkoutScreen: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get("https://exercisedb.p.rapidapi.com/exercises?limit=200", {
          headers: {
            "X-RapidAPI-Key": "e485ea6b8dmshba6d54f6bd5b07ep19d008jsn48b7ff4aa455",
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        });
        setExercises(response.data as Exercise[]);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const handleMuscleGroupPress = (target: string) => {
    setSelectedMuscleGroup(target);
  };

  const handleExercisePress = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowModal(true);
  };

  const logWorkout = async () => {
    if (auth.currentUser && selectedExercise) {
      try {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const userData = userDoc.data();
        const userWeight = userData?.weight || 70; // Use user's weight or default to 70 kg
  
        const MET = 3.5; // MET value for strength training
        const duration = parseInt(sets) * parseInt(reps) * 0.1; // Example: 0.1 minutes per rep
        const caloriesBurned = (MET * userWeight * duration) / 200;
  
        console.log("Calories Burned:", caloriesBurned); // Debugging
  
        await setDoc(doc(db, "workouts", `${auth.currentUser.uid}_${Date.now()}`), {
          exercise: selectedExercise.name,
          sets: parseInt(sets),
          reps: parseInt(reps),
          calories: caloriesBurned, // Store calories burned
          date: new Date().toISOString(),
        });
        setShowModal(false);
        setSets("");
        setReps("");
      } catch (error) {
        console.error("Error logging workout:", error);
      }
    }
  };

  const filteredExercises = selectedMuscleGroup
    ? exercises.filter((ex) => ex.target.toLowerCase().includes(selectedMuscleGroup.toLowerCase()))
    : [];

  return (
    <LinearGradient colors={["#f5f5f5", "#008080"]} style={styles.container}>
      <Text style={styles.title}>View Workouts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {!selectedMuscleGroup ? (
            <FlatList
              data={muscleGroups}
              keyExtractor={(item) => item.target}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.muscleButton} onPress={() => handleMuscleGroupPress(item.target)}>
                  <Text style={styles.muscleText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <>
              <TouchableOpacity style={styles.backButton} onPress={() => setSelectedMuscleGroup(null)}>
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.subtitle}>Exercises for {selectedMuscleGroup}</Text>
              <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.exerciseCard} onPress={() => handleExercisePress(item)}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <Image source={{ uri: item.gifUrl }} style={styles.image} resizeMode="contain" />
                  </TouchableOpacity>
                )}
              />
            </>
          )}
        </>
      )}

      {/* Modal to Log Sets and Reps */}
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Workout for {selectedExercise?.name}</Text>
            <TextInput
              style={styles.input}
              placeholder="Sets"
              keyboardType="numeric"
              value={sets}
              onChangeText={setSets}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps"
              keyboardType="numeric"
              value={reps}
              onChangeText={setReps}
            />
            <TouchableOpacity style={styles.button} onPress={logWorkout}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setShowModal(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 75, color: "#008080" },
  muscleButton: {
    backgroundColor: "#008080",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  muscleText: { fontSize: 20, fontWeight: "bold", color: "white" },
  backButton: { padding: 10, backgroundColor: "#008080", borderRadius: 8, alignSelf: "flex-start", marginBottom: 10 },
  backButtonText: { fontSize: 16, fontWeight: "bold", color: "white" },
  subtitle: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 10, marginBottom: 10, color: "#555" },
  exerciseCard: { padding: 15, backgroundColor: "#fff", marginVertical: 8, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, alignItems: "center" },
  exerciseName: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  image: { width: 200, height: 200, borderRadius: 10 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#008080", borderRadius: 5, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#008080", padding: 10, borderRadius: 5, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default WorkoutScreen;