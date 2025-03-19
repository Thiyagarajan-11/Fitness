import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, DateData } from "react-native-calendars";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";
import { format, parseISO } from "date-fns";

interface Workout {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  date: string;
}

const WorkoutHistoryScreen: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd")); // Initialize with today's date
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedSets, setUpdatedSets] = useState("");
  const [updatedReps, setUpdatedReps] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseSets, setNewExerciseSets] = useState("");
  const [newExerciseReps, setNewExerciseReps] = useState("");

  useEffect(() => {
    fetchWorkouts().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Filter workouts for the selected date whenever workouts or selectedDate changes
    const filtered = workouts.filter((workout) => {
      const workoutDate = format(parseISO(workout.date), "yyyy-MM-dd");
      return workoutDate === selectedDate;
    });
    setFilteredWorkouts(filtered);
  }, [workouts, selectedDate]);

  const fetchWorkouts = async () => {
    if (auth.currentUser) {
      const workoutsSnapshot = await getDocs(collection(db, "workouts"));
      const data = workoutsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Workout));
      setWorkouts(data);
    }
  };

  // Create marked dates for the calendar
  const markedDates = workouts.reduce((acc, workout) => {
    const date = format(parseISO(workout.date), "yyyy-MM-dd");
    acc[date] = { marked: true, dotColor: "#008080" }; // Add a dot for dates with workouts
    return acc;
  }, {} as { [key: string]: { marked: boolean; dotColor: string } });

  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleEditWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setUpdatedSets(workout.sets.toString());
    setUpdatedReps(workout.reps.toString());
    setShowEditModal(true);
  };

  const updateWorkout = async () => {
    if (selectedWorkout && !isNaN(parseInt(updatedSets)) && !isNaN(parseInt(updatedReps))) {
      await updateDoc(doc(db, "workouts", selectedWorkout.id), {
        sets: parseInt(updatedSets),
        reps: parseInt(updatedReps),
      });
      fetchWorkouts(); // Refresh the data
      setShowEditModal(false);
    } else {
      alert("Please enter valid numbers for sets and reps.");
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      await deleteDoc(doc(db, "workouts", id));
      console.log("Workout deleted successfully!"); // Debugging

      // Refresh the workouts list
      const updatedWorkouts = workouts.filter((workout) => workout.id !== id);
      setWorkouts(updatedWorkouts);

      // Refresh the filtered workouts list if a date is selected
      if (selectedDate) {
        const updatedFilteredWorkouts = filteredWorkouts.filter((workout) => workout.id !== id);
        setFilteredWorkouts(updatedFilteredWorkouts);
      }
    } catch (error) {
      console.error("Error deleting workout:", error); // Debugging
    }
  };

  const addExerciseForDate = async () => {
    if (auth.currentUser && selectedDate) {
      try {
        await setDoc(doc(db, "workouts", `${auth.currentUser.uid}_${Date.now()}`), {
          exercise: newExerciseName,
          sets: parseInt(newExerciseSets),
          reps: parseInt(newExerciseReps),
          date: new Date(selectedDate).toISOString(), // Use the selected date
        });

        // Refresh the workouts list
        await fetchWorkouts();

        // Close the modal and clear input fields
        setShowAddExerciseModal(false);
        setNewExerciseName("");
        setNewExerciseSets("");
        setNewExerciseReps("");
      } catch (error) {
        console.error("Error adding exercise:", error);
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#008080" />;
  }

  return (
    <LinearGradient colors={["#f5f5f5", "#008080"]} style={styles.container}>
      <Text style={styles.title}>Workout History</Text>

      {/* Calendar */}
      <Calendar
        onDayPress={handleDateSelect}
        markedDates={{
          ...markedDates, // Add marked dates
          [selectedDate]: { selected: true, selectedColor: "#008080" }, // Highlight selected date
        }}
        theme={{
          selectedDayBackgroundColor: "#008080",
          todayTextColor: "#008080",
          arrowColor: "#008080",
        }}
        minDate={"2023-01-01"} // Set a minimum date (adjust as needed)
        maxDate={new Date().toISOString().split("T")[0]} // Set the maximum date to today
      />

      {/* Add Exercise Button */}
      {selectedDate && (
        <TouchableOpacity style={styles.addExerciseButton} onPress={() => setShowAddExerciseModal(true)}>
          <Text style={styles.addExerciseButtonText}>Add Exercise for {selectedDate}</Text>
        </TouchableOpacity>
      )}

      {/* Workout List for Selected Date */}
      {filteredWorkouts.length === 0 ? (
        <Text style={styles.noWorkoutsText}>No workouts found for this date.</Text>
      ) : (
        <FlatList
          data={filteredWorkouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.workoutCard}>
              <Text style={styles.workoutText}>{item.exercise}</Text>
              <Text style={styles.workoutDetails}>
                {item.sets} sets x {item.reps} reps
              </Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditWorkout(item)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteWorkout(item.id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={showEditModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Workout</Text>
            <TextInput
              style={styles.input}
              placeholder="Sets"
              keyboardType="numeric"
              value={updatedSets}
              onChangeText={setUpdatedSets}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps"
              keyboardType="numeric"
              value={updatedReps}
              onChangeText={setUpdatedReps}
            />
            <TouchableOpacity style={styles.saveButton} onPress={updateWorkout}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditModal(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Exercise Modal */}
      <Modal visible={showAddExerciseModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Exercise for {selectedDate}</Text>
            <TextInput
              style={styles.input}
              placeholder="Exercise Name"
              value={newExerciseName}
              onChangeText={setNewExerciseName}
            />
            <TextInput
              style={styles.input}
              placeholder="Sets"
              keyboardType="numeric"
              value={newExerciseSets}
              onChangeText={setNewExerciseSets}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps"
              keyboardType="numeric"
              value={newExerciseReps}
              onChangeText={setNewExerciseReps}
            />
            <TouchableOpacity style={styles.saveButton} onPress={addExerciseForDate}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddExerciseModal(false)}>
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
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#008080" },
  workoutCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  workoutText: { fontSize: 18, fontWeight: "bold", color: "#008080" },
  workoutDetails: { fontSize: 14, color: "#555" },
  actionsContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  editButton: { backgroundColor: "#008080", padding: 8, borderRadius: 5, flex: 1, marginRight: 5 },
  deleteButton: { backgroundColor: "#ff6347", padding: 8, borderRadius: 5, flex: 1, marginLeft: 5 },
  buttonText: { color: "#ffffff", fontSize: 14, fontWeight: "bold", textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { backgroundColor: "#ffffff", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#008080", borderRadius: 5, padding: 10, marginBottom: 10 },
  saveButton: { backgroundColor: "#008080", padding: 10, borderRadius: 5, alignItems: "center", marginBottom: 10 },
  cancelButton: { backgroundColor: "#ff6347", padding: 10, borderRadius: 5, alignItems: "center" },
  noWorkoutsText: { textAlign: "center", marginTop: 20, color: "#555" },
  addExerciseButton: {
    backgroundColor: "#008080",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addExerciseButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WorkoutHistoryScreen;