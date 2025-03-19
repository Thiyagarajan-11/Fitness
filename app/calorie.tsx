import 'react-native-get-random-values'; // Required for uuid
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

const API_KEY = "hDlwIJxXcKtU/yKRueH+cA==n8mfwlSMDtulU2WC";
const BASE_URL = "https://api.calorieninjas.com/v1/nutrition";

interface FoodItem {
    id: string;
    name: string;
    calories: number;
    protein: number;
    fat: number;
}

interface CartItem extends FoodItem {
    count: number;
}

const CalorieScreen: React.FC = () => {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [foodQuery, setFoodQuery] = useState("");
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchCalories = async () => {
        if (!foodQuery.trim()) return;
        setErrorMessage(null); // Clear previous error
        try {
            const response = await axios.get(`${BASE_URL}?query=${encodeURIComponent(foodQuery)}`, {
                headers: { "X-Api-Key": API_KEY },
            });

            if (!response.data.items || response.data.items.length === 0) {
                setErrorMessage(`No results found for "${foodQuery}". Try another item.`);
                setFoodItems([]);
                return;
            }

            const fetchedItems = response.data.items.map((item: any) => ({
                id: uuidv4(),
                name: item.name,
                calories: item.calories,
                protein: item.protein_g,
                fat: item.fat_total_g,
            }));

            setFoodItems(fetchedItems);
        } catch (error) {
            setErrorMessage("Error fetching calorie data. Please try again.");
            console.error("Error fetching calorie data:", error);
        }
    };

    const addToCart = (food: FoodItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.name === food.name);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.name === food.name ? { ...item, count: item.count + 1 } : item
                );
            } else {
                return [...prevCart, { ...food, count: 1 }];
            }
        });
    };

    const removeFromCart = (foodId: string) => {
        setCart((prevCart) => prevCart
            .map((item) =>
                item.id === foodId ? { ...item, count: item.count - 1 } : item
            )
            .filter((item) => item.count > 0) // Remove items with count <= 0
        );
    };

    return (
        <LinearGradient colors={["#f5f5f5", "#008080"]} style={styles.container}>
            <Text style={styles.title}>Calorie Tracker</Text>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter food item (e.g., rice, apple)"
                    placeholderTextColor="#999"
                    value={foodQuery}
                    onChangeText={setFoodQuery}
                />
                <TouchableOpacity style={styles.searchButton} onPress={fetchCalories}>
                    <Ionicons name="search" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            {/* Display Food Items */}
            <FlatList
                data={foodItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.foodCard}>
                        <Text style={styles.foodTitle}>{item.name.toUpperCase()}</Text>
                        <View style={styles.nutritionInfo}>
                            <Text style={styles.nutritionText}>Calories: {item.calories} kcal</Text>
                            <Text style={styles.nutritionText}>Protein: {item.protein} g</Text>
                            <Text style={styles.nutritionText}>Fat: {item.fat} g</Text>
                        </View>
                        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                            <Text style={styles.addButtonText}>Add to Basket</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Display Cart Items */}
            <Text style={styles.cartTitle}>Your Basket</Text>
            <FlatList
                data={cart}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Text style={styles.cartItemName}>{item.name} (x{item.count})</Text>
                        <Text style={styles.cartItemDetails}>Calories: {item.calories * item.count} kcal</Text>
                        <Text style={styles.cartItemDetails}>Protein: {item.protein * item.count} g</Text>
                        <Text style={styles.cartItemDetails}>Fat: {item.fat * item.count} g</Text>
                        <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* View Cart Button */}
            <TouchableOpacity style={styles.viewCartButton} onPress={() => router.push(`/calorieCart?cart=${encodeURIComponent(JSON.stringify(cart))}`)}>
                <Text style={styles.viewCartText}>Add To Plate</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#008080',
        marginBottom: 16,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        borderColor: "#008080",
        borderWidth: 1,
        fontSize: 14,
        color: '#2d3436',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    searchButton: {
        height: 40,
        borderRadius: 20,
        backgroundColor: '#008080',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginLeft: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    foodCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginVertical: 6,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    foodTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3436',
        marginBottom: 4,
    },
    nutritionInfo: {
        marginBottom: 6,
    },
    nutritionText: {
        fontSize: 12,
        color: '#636e72',
        marginBottom: 2,
    },
    addButton: {
        backgroundColor: '#00b894',
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    cartTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#008080',
        marginTop: 16,
        marginBottom: 8,
    },
    cartItem: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginVertical: 6,
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cartItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 4,
    },
    cartItemDetails: {
        fontSize: 12,
        color: '#636e72',
        marginBottom: 2,
    },
    removeButton: {
        backgroundColor: '#ff6347',
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 8,
    },
    removeButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    viewCartButton: {
        backgroundColor: '#008080',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    viewCartText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CalorieScreen;