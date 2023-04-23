import React, { useState, useEffect } from 'react';
import './Search.css';
import { TextField, Typography, Button, Card, CardHeader, CardContent } from '@mui/material';

const Search = () => {

  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState('');
  const [weather, setWeather] = useState(null);
  // const [expanded, setExpanded] = useState(false);

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
  }

  const WeatherCard = ({ day }) => {

    const date = new Date(day.dt * 1000);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const ICON_URL = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`

    return (
      <Card classname='weather-card' variant='outlined' sx={{ width: 300, height: 200 }}>
        <CardHeader 
                title={dayOfWeek}
                subheader={date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}
                avatar={<img src={ICON_URL} alt={day.weather[0].description} />}
              />
              <CardContent>
                <Typography variant='body1'>
                  {/* <img src={`${IMG_URL}${day.weather[0].icon}.png`} alt= 'Weather icon: {day.weather[0].description}' /> <br></br> */}
                  {day.weather[0].main} <br></br>
                  {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(day.sunrise * 1000)}
                  -
                  {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(day.sunset * 1000)}
                  : <b>Low</b> {day.temp.min}°F <b>High</b> {day.temp.max}°F 
                </Typography>
              </CardContent>
      </Card>
    )

  };

  

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

          {weather.daily.map((day, index) => (
            // <Card key={index}>
            //   {/* <CardHeader 
            //     title={new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long'})}
            //     subheader={new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
            //     avatar={<img src={`${IMG_URL}${day.weather[0].icon}.png`} alt={day.weather[0].description} />}
            //   /> */}
            //   <Typography variant="body1">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</Typography>           
            //   <CardContent>
            //     <Typography variant='body1'>
            //       <img src={`${IMG_URL}${day.weather[0].icon}.png`} alt= 'Weather icon: {day.weather[0].description}' /> <br></br>
            //       {day.weather[0].main} <br></br>
            //       {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(day.sunrise * 1000)}
            //       -
            //       {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(day.sunset * 1000)}
            //       : <b>Low</b> {day.temp.min}°F <b>High</b> {day.temp.max}°F 
            //     </Typography>
            //   </CardContent>
            // </Card>

            <WeatherCard key={index} day={day} />
            
          ))}
          
        </div> 
      )}
      
    </div>
  );
};


export default Search;