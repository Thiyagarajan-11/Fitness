import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface CartItem {
    name: string;
    calories: number;
    protein: number;
    fat: number;
    count: number;
}

const CalorieCartScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const cartItems: CartItem[] = params.cart ? JSON.parse(params.cart as string) : [];

    // Calculate totals for all items
    const totalCalories = cartItems.reduce((sum, item) => sum + item.calories * item.count, 0);
    const totalProtein = cartItems.reduce((sum, item) => sum + item.protein * item.count, 0);
    const totalFat = cartItems.reduce((sum, item) => sum + item.fat * item.count, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Selected Foods</Text>
            <FlatList
                data={cartItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemName}>{item.name} (x{item.count})</Text>
                        <Text style={styles.itemDetails}>Calories: {item.calories.toFixed(2)} kcal</Text>
                        <Text style={styles.itemDetails}>Protein: {item.protein.toFixed(2)} g</Text>
                        <Text style={styles.itemDetails}>Fat: {item.fat.toFixed(2)} g</Text>
                    </View>
                )}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total Calories: {totalCalories.toFixed(2)} kcal</Text>
                <Text style={styles.totalText}>Total Protein: {totalProtein.toFixed(2)} g</Text>
                <Text style={styles.totalText}>Total Fat: {totalFat.toFixed(2)} g</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f5f5f5', // Soft light background
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#008080', 
      textAlign: 'center',
    },
    itemContainer: {
      backgroundColor: '#ffffff', 
      padding: 12,
      marginVertical: 6,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#dcdfe1',
    },
    itemName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 4,
    },
    itemDetails: {
      fontSize: 14,
      color: '#7f8c8d',
      marginBottom: 2,
    },
    totalContainer: {
      marginTop: 16,
      padding: 12,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 2,
    },
    totalText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 4,
    },
});

export default CalorieCartScreen;
