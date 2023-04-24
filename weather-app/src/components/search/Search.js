import React, { useState, useEffect } from 'react';
import './Search.css';
import { Button, TextField } from '@mui/material'
import { CardMedia, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Search = () => {

  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState('');
  const [weather, setWeather] = useState(null);
  const [expanded, setExpanded] = useState(false);

  // const IMG_URL = `https://openweathermap.org/img/wn/`;

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
  };

  const handleExpandClick = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const WeatherCard = ({ day }) => {

    const date = new Date(day.dt * 1000);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const ICON_URL = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`

    return (
      <Accordion className='accordion' sx={{background: 'dodgerblue'}} >
        <AccordionSummary>
          <div className='weather-accordion'>
            <Typography variant='h5' sx={{marginLeft: 0, marginRight: 'auto'}}>{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Typography>
            <CardMedia
              component="img"
              sx={{height: '50px', width: '50px', alignSelf: 'flex-end', marginLeft: 'auto', marginRight: 0}}
              image={ICON_URL}
              alt={day.weather[0].description}
            />
          </div>         
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            <b>Description:</b> {day.weather[0].description} <br />
            <b>Low:</b> {day.temp.min}°F <br />
            <b>High:</b> {day.temp.max}°F <br />
            <b>Feels like:</b> {day.feels_like.day}°F <br />
            <b>Wind:</b> {day.wind_speed} mph <br />
            <b>Humidity:</b> {day.humidity}%
          </Typography>
        </AccordionDetails>
      </Accordion>
    );

  };

  return (
    <div className='search-container'>
      <Typography variant='h1'>Weather App</Typography>
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Enter city"
          variant="outlined"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button className='submit-weather-btn' variant="contained" color="primary" type="submit">
          Get Weather
        </Button>
      </form>

      {weather && weather.current && (
        <div className='forecast'>
          <Typography variant="h2">{cityName}</Typography>

          {weather.daily.map((day, index) => (

            <WeatherCard key={index} day={day} />
            
          ))}
          
        </div> 
      )}
      
    </div>
  );
};


export default Search;