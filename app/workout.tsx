import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

interface Exercise {
  id: string;
  name: string;
  target: string;
  equipment: string;
  gifUrl: string;
}

const majorMuscleGroups = [
  { name: "Chest", target: "pectorals" },
  { name: "Shoulders", target: "delts" },
  { name: "Arms", target: "arms" },
  { name: "Legs", target: "glutes" },
  { name: "Back", target: "back" },
  { name: "Abs", target: "abs" },
];

export default function WorkoutScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [equipmentList, setEquipmentList] = useState<string[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get("https://exercise-db-fitness-workout-gym.p.rapidapi.com/list/equipment", {
          headers: {
            "X-RapidAPI-Key": "e485ea6b8dmshba6d54f6bd5b07ep19d008jsn48b7ff4aa455",
            "X-RapidAPI-Host": "exercise-db-fitness-workout-gym.p.rapidapi.com"
          }
        });
        setEquipmentList(response.data);
      } catch (error) {
        console.error("Error fetching equipment list:", error);
      }
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get("https://exercisedb.p.rapidapi.com/exercises?limit=200", {
          headers: {
            "X-RapidAPI-Key": "e485ea6b8dmshba6d54f6bd5b07ep19d008jsn48b7ff4aa455",
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
          }
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

  return (
     <LinearGradient
                  colors={["#f5f5f5",  "#008080"]}
                  style={styles.container}
                >
      <Text style={styles.title}>View Workouts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {!selectedMuscleGroup ? (
            <FlatList
              data={majorMuscleGroups}
              keyExtractor={(item) => item.target}
              renderItem={({ item }) => (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <TouchableOpacity
                    style={styles.muscleButton}
                    onPress={() => setSelectedMuscleGroup(item.target)}
                  >
                    <Text style={styles.muscleText}>{item.name}</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            />
          ) : (
            <>
              <TouchableOpacity style={styles.backButton} onPress={() => setSelectedMuscleGroup(null)}>
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.subtitle}>Exercises for {selectedMuscleGroup}</Text>
              <FlatList
                data={exercises.filter((ex) =>
                  ex.target.toLowerCase().includes(selectedMuscleGroup.toLowerCase())
                )}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <View style={styles.exerciseCard}>
                      <Text style={styles.exerciseName}>{item.name}</Text>
                      <Text>Equipment: {item.equipment}</Text>
                      <View style={styles.imageContainer}>
                        <Image
                          source={{ uri: item.gifUrl }} // Use the default Image component
                          style={styles.image}
                          resizeMode="contain" // Ensure the GIF fits
                        />
                      </View>
                    </View>
                  </Animated.View>
                )}
              />
            </>
          )}
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 75, color: "#008080" },
  subtitle: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 10, marginBottom: 10, color: "#555" },
  muscleButton: {
        backgroundColor: '#008080', // Bright yellow for the LemonPie theme
        paddingVertical: 10, // Reduced vertical padding for a smaller button
        paddingHorizontal: 30, // Horizontal padding for a compact look
        borderRadius: 30, // Increased border radius for a pill shape
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10, // Slight margin for spacing
        width: '100%', // Slightly less than full width for a stylish look
        shadowColor: '#000', // Subtle shadow for depth
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // Elevation for Android
         },
  muscleText: { fontSize: 20, fontWeight: "bold", color: "white" },
  backButton: { padding: 10, backgroundColor: "#008080", borderRadius: 8, alignSelf: "flex-start", marginBottom: 10 },
  backButtonText: { fontSize: 16, fontWeight: "bold",color:"#ffffff" },
  exerciseCard: { padding: 15, backgroundColor: "#fff", marginVertical: 8, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, alignItems: "center" },
  exerciseName: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  imageContainer: { alignItems: "center", marginTop: 10 },
  image: { width: 200, height: 200, borderRadius: 10 }, // Adjust size as needed
});
