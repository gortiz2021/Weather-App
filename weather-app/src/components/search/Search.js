import React, { useState, useEffect } from 'react';
import './Search.css';
import { TextField, Typography, Button } from '@mui/material';

const Search = () => {

  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState('');
  const [weather, setWeather] = useState(null);
  
  const API_KEY = '';

  useEffect(() => {
    const WEATHER_URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=imperial&&appid=${API_KEY}`;
    fetchWeather(WEATHER_URL);
  }, [latitude, longitude]);

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
    }
    catch (e) { 
      console.log(`Error fetching data: ${e}`);
    }  
  }

  const fetchWeather = async (url) => {
    try {
      const response = await fetch(url);
      const weatherData = await response.json();
      console.log(weatherData);
      setWeather(weatherData);
    }
    catch (e){
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

      {weather && weather.current && (
        <div>
          <Typography variant="h2">{cityName}</Typography>

          <Typography variant="body1">{new Date(weather.current.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</Typography>

          <Typography varient='body1'>{weather.current.weather[0].description}</Typography>
          <img src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}.png`} alt="weather icon" />

          {/* Sunday */}
          {/* <Typography variant="body1">{new Date(weather.daily.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</Typography> */}
          <Typography varient='body1'>Sunday: <b>Low</b> {weather.daily[0].temp.min}°F <b>High</b> {weather.daily[0].temp.max}°F</Typography>

          {/* Monday */}
          <Typography varient='body1'>Monday: {weather.daily[1].temp.day}°F</Typography>

          {/* Tuesday */}
          <Typography varient='body1'>Tuesday: {weather.daily[2].temp.day}°F</Typography>

          {/* Wednesday */}
          <Typography varient='body1'>Wednesday: {weather.daily[3].temp.day}°F</Typography>

          {/* Thursday */}
          <Typography varient='body1'>Thursday: {weather.daily[4].temp.day}°F</Typography>

          {/* Friday */}
          <Typography varient='body1'>Friday: {weather.daily[5].temp.day}°F</Typography>

          {/* Saturday */}
          <Typography varient='body1'>Saturday: {weather.daily[6].temp.day}°F</Typography>
        </div> 
      )}
      
    </div>
  );
};


export default Search;