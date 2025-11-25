// types.ts (or at the top of weather.tsx)

// Define the interface for the structure of the OpenWeatherMap API response
export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    // You can add more properties here if you use them (e.g., feels_like)
  };
  weather: Array<{
    description: string;
    main: string; // e.g., "Clear", "Clouds"
  }>;
  sys: {
    country: string;
  };
}