import AsyncStorage from '@react-native-async-storage/async-storage';

const TEMP_UNIT_KEY = '@TempUnit'; 


export const saveUnit = async (unit) => {
  try {
    await AsyncStorage.setItem(TEMP_UNIT_KEY, unit);
  } catch (e) {
    console.error("Error saving unit:", e);
  }
};

export const loadUnit = async () => {
  try {
    const value = await AsyncStorage.getItem(TEMP_UNIT_KEY);

    return value !== null ? value : 'metric'; 
  } catch (e) {
    console.error("Error loading unit:", e);
    return 'metric';
  }
};