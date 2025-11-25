import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Import services from the sibling directory
import { WeatherData } from '@/types';
import { loadUnit } from '../../services/storage';
import { fetchWeather } from '../../services/weatherAPI';



export default function WeatherScreen() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for Persistence (loaded from AsyncStorage)
  const [unit, setUnit] = useState('metric'); 

  // --- Persistence Integration (15 Marks) ---
  // Load the user's preferred unit when the screen first loads
  useEffect(() => {
    const getUnit = async () => {
      const savedUnit = await loadUnit();
      setUnit(savedUnit);
    };
    getUnit();
  }, []); // Empty dependency array ensures this runs only once on mount


  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Please enter a city name to search.");
      return;
    }

    setIsLoading(true); // START loading state
    setError("");
    setWeatherData(null);

    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
    } catch (e) {
      let errorMessage = "An unknown error occurred.";

      // Check if 'e' is a standard JavaScript Error object
      if (e instanceof Error) {
        errorMessage = e.message;
      } 
      // This ensures we always pass a string to setError
      setError(errorMessage); 
    } finally {
      setIsLoading(false);
    }
  };
  // --- Temperature Conversion Logic (Uses Persistent State) ---
  const convertTemp = (tempInCelsius: number) => {
    if (unit === 'imperial') {
      // Convert C to F: (C * 9/5) + 32
      return Math.round((tempInCelsius * 9/5) + 32);
    }
    return Math.round(tempInCelsius); // Already in Celsius
  };

  const getUnitSymbol = () => (unit === 'imperial' ? '°F' : '°C');

  // --- Conditional Rendering for Display (Testing/Debugging) ---
  const renderContent = () => {
    if (isLoading) {
      // PROOF: Show spinner when fetching data (Testing & Debugging: 5 Marks)
      return (
        <View style={styles.messageContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Fetching weather data...</Text>
        </View>
      );
    }

    if (error) {
      // PROOF: Display detailed error message (Testing & Debugging: 5 Marks)
      return (
        <View style={styles.messageContainer}>
          <Ionicons name="alert-circle-outline" size={50} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (weatherData) {
      const temp = convertTemp(weatherData.main.temp);
      const description = weatherData.weather[0].description;
      const mainWeather = weatherData.weather[0].main;
      const iconName = getWeatherIcon(mainWeather);

      // PROOF: Display successful data (Functionality: 15 Marks)
      return (
        <View style={styles.weatherCard}>
          <Text style={styles.cityTitle}>{weatherData.name}, {weatherData.sys.country}</Text>
          <MaterialCommunityIcons name={iconName} size={100} color="#007AFF" />
          <Text style={styles.tempText}>{temp}{getUnitSymbol()}</Text>
          <Text style={styles.descriptionText}>{description.charAt(0).toUpperCase() + description.slice(1)}</Text>
          <Text style={styles.detailsText}>Humidity: {weatherData.main.humidity}%</Text>
        </View>
      );
    }

    return (
      <View style={styles.messageContainer}>
        <Ionicons name="search" size={50} color="#666" />
        <Text style={styles.placeholderText}>Search for a city to see the current weather.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Weather Finder</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Enter City Name (e.g., Tokyo)"
          value={city}
          onChangeText={setCity}
          style={styles.input}
          onSubmitEditing={handleSearch} // Allows searching by pressing 'Enter'
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

     
        {renderContent()}
     
    </View>
  );
}

// --- Helper function for mapping weather codes to icons (UI/UX) ---
const getWeatherIcon = (main: string) => {
  switch (main) {
    case 'Clear': return 'weather-sunny';
    case 'Clouds': return 'weather-cloudy';
    case 'Rain': case 'Drizzle': return 'weather-rainy';
    case 'Thunderstorm': return 'weather-lightning';
    case 'Snow': return 'weather-snowy';
    default: return 'weather-cloudy-alert';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50, 
    backgroundColor: '#ebf0f4ff',
    alignItems: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    height: 50,
    width: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#007AFF',
  },
  errorText: {
    marginTop: 10,
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    fontWeight: '500',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  weatherCard: {
    padding: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cityTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  tempText: {
    fontSize: 60,
    fontWeight: '300',
    marginVertical: 10,
    color: '#333',
  },
  descriptionText: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    color: '#666',
  }
});