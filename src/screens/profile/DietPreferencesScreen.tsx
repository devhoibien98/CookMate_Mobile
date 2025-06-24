import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckBox } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import CombineLayout from "@/components/Component";
import { useRouter } from "expo-router"; 

const dietOptions = [
  "Vegetarian",
  "Vegan",
  "Keto",
  "Eat Clean",
  "Low Carb",
  "High Protein",
  "Gluten-Free",
  "None",
];

const UserProfileDietPreferences = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const router = useRouter();

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <CombineLayout>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fe8300" />
            </TouchableOpacity>
            <Text style={styles.title}>Diet Preferences</Text>
            <TouchableOpacity>
              <Text style={styles.save}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Diet Type */}
          <Text style={styles.label}>Diet Type</Text>
          <View style={styles.card}>
            <View style={styles.checkboxGrid}>
              {dietOptions.map((option) => (
                <CheckBox
                  key={option}
                  title={option}
                  checked={selectedOptions.includes(option)}
                  onPress={() => toggleOption(option)}
                  containerStyle={styles.checkbox}
                  textStyle={styles.checkboxText}
                />
              ))}
            </View>
          </View>

          {/* Allergies */}
          <Text style={styles.label}>Allergies / Disliked Ingredients</Text>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="gray" />
            <TextInput
              style={styles.searchInput}
              placeholder="Find"
              placeholderTextColor="gray"
            />
          </View>

          <View style={styles.card}></View>
        </ScrollView>
      </CombineLayout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 24 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "600", color: "#fe8300" },
  save: { fontSize: 15, fontWeight: "600", color: "#ffa03c" },
  label: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  card: {
    marginTop: 12,
    padding: 12,
    borderRadius: 3,
    backgroundColor: "#fff",
    elevation: 3,
  },
  checkboxGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  checkbox: {
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 0,
    paddingVertical: 6,
    margin: 0,
  },
  checkboxText: {
    fontSize: 14,
    color: "#000",
  },
  searchBar: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 3,
    backgroundColor: "#fff",
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 12,
    color: "#000",
  },
});

export default UserProfileDietPreferences;
