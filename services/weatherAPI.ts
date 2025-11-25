import axios, { AxiosError } from 'axios';

const API_KEY = 'f13f231ab0576250bb73fa8a1a8f0f17'; 
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';


export const fetchWeather = async (city: string) => {
  if (!city || city.trim() === '') {
    throw new Error("Please enter a valid city name."); 
  }

  try {
    const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    
    return response.data;
  } catch (error) { 

    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError; 

        if (axiosError.response && axiosError.response.status === 404) {
          throw new Error(`Weather data not found for "${city}". Please check the spelling.`);
        }
    }
    
    throw new Error("Could not connect to the weather service. Check your internet connection or API key.");
  }
};