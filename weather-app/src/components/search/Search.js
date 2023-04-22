import React, { useState} from 'react';
import './Search.css';
import { TextField, Typography, Button } from '@mui/material';

const Search = () => {

  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState('');
  const [weather, setWeather] = useState(null);
  
  const API_KEY = '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const LOCATION_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    
    try { 
      const response = await fetch(LOCATION_URL);
      const data  = await response.json();

      if (!data || !data[0]) {
        // Handle the case where data is undefined or the array is empty
        console.error(`No data returned for ${city}`);
        return;
      }

      console.log(data);
      setCityName(data[0].local_names.en);
      setLatitude(data[0].lat);
      setLongitude(data[0].lon);

      const WEATHER_URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=imperial&&appid=${API_KEY}`

      const weatherResponse = await fetch(WEATHER_URL);
      const weatherData = await weatherResponse.json();
      console.log(weatherData);
      setWeather(weatherData);
    }
    catch (e) { 
      console.log(`Error fetching data: ${e}`);
    }  
  }

  return (
    <div>
      <Typography variant='h1'>Weather App</Typography>
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Enter city"
          variant="outlined"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Get Weather
        </Button>
      </form>

    {weather && (
      <div>
        <Typography variant="h2">{cityName}</Typography>
        <Typography varient='body1'>{weather.current.temp}°F</Typography>
        <Typography varient='body1'>{weather.current.weather[0].main}</Typography>
      </div> 
    )}


    </div>
  );
};


export default Search;