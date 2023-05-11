import React, { useState, useEffect } from 'react';
import './Search.css';
import { Button, TextField, Autocomplete } from '@mui/material'
import { CardMedia, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';

// Retrieve any API keys or endpoints from another file.
// This imporves security by keeping sensitive information separate from the main codebase.
import { API_KEY, LOCATION_API_URL, WEATHER_API_URL, ICON_API_URL } from '../../config/config'

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Weather from '../weather/Weather';

const Search = () => {

  // Define an array of city names
  // const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];

  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState('');
  const [weather, setWeather] = useState(null);

  // Fetch the weather data from a city based off its longitude and latitude coordinates.
  // useEffect() will perform a side effect by fetching weather from OpenWeather API.
  // The weather data is fetched using the OpenWeather API by combining the latitude, longitude, API key, and WEATHER_API_URL.
  // The useEffect() is called whenever the value of longitude and latitude change (dependencies array).
  useEffect(() => {
    const WEATHER_URL = `${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&units=imperial&&appid=${API_KEY}`;
    fetchWeather(WEATHER_URL);
  }, [latitude, longitude]);


  // Used to submit the data taken in from a form.
  // In this case, it is taking in a city name from the user and submitted using the "Get Weather" button.
  // OpenWeather API using the city name, API_KEY and LOCATION_API_URL to get longitude and latitude coordinates of the given city.
  // 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const LOCATION_URL = `${LOCATION_API_URL}?q=${city}&limit=1&appid=${API_KEY}`
    
    try {
      // Make the API call and convert the returned object in json format. 
      const response = await fetch(LOCATION_URL);
      const data  = await response.json();

      // Handle the case where data is undefined or the array is empty
      if (!data || !data[0]) { 
        console.error(`No data returned for ${city}`);
        return;
      }

      // console.log(data);
      setCityName(data[0].local_names.en);

      // useEffect() is invoked here since the latitude and longitude values are changed.
      setLatitude(data[0].lat);
      setLongitude(data[0].lon);
    }
    // Error case
    catch (e) { 
      console.log(`Error fetching data: ${e}`);
    }  
  }

  // Fetches the weather of a given URL, in this case it is WEATHER_URL.
  // OpenWeather API will return the detailed data of a city.
  // The state of weather is updated using this data.
  const fetchWeather = async (url) => {
    try {
      const response = await fetch(url);
      const weatherData = await response.json();
      //console.log(weatherData);
      setWeather(weatherData);
    }
    // Error case
    catch (e){
      console.log(`Error fetching data: ${e}`);
    }
  };

  // A function used to display a 8-day forecast
  // THe day is determined in the component return section.
  const WeatherCard = ({ day }) => {

    // Convert the UNIX time into a human readable date.
    const date = new Date(day.dt * 1000);

    // OpenWeather API provides icons of the weather
    const ICON_URL = `${ICON_API_URL}/${day.weather[0].icon}.png`

    // Use an accordion from Material UI to display data from the "day" object.
    return (
      <Accordion className='accordion' sx={{background: 'rgb(171,219,227)', margin: '20px', borderRadius: '20px', border: '1px solid black',
      '&:first-of-type': {
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
      },
      '&:last-of-type': {
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
      },}} >
        <AccordionSummary>
          <div className='weather-accordion'>
            <Typography variant='h5' >{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Typography>
            <CardMedia
              component="img"
              sx={{height: '50px', width: '50px'}}
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

  // Search component return
  return (
    <div className='search-container'>
      <Typography variant='h1'>Weather App</Typography>
      {/* Form used to submit city name */}
      <form 
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* <Autocomplete
          freeSolo
          disableClearable
          value={city}        
          onChange={(e) => setCity(e.target.value)}
          options={cities}
          getOptionLabel={getOptionLabel}
          renderInput={(params) => ( */}
            <TextField 
            // {...params}
            placeholder='Enter City'
            variant="outlined"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            InputProps={{
              // ...params.InputProps,
              // type: 'search',
              style: {
                borderRadius: '20px'
              }
            }}           
          />
        {/* )}
        />  */}
        
        <Button className='submit-weather-btn' 
                variant="contained" 
                color="primary" 
                type="submit"
                sx={{
                  borderRadius: '20px',
                  margin: '20px'
                }}
        >
          Get Weather
        </Button>
      </form>

      {/* JSX if-statement to check if the weather variable has data in it.
          It will only render if the statement is true.                    */}
      {weather && weather.current && (
        <div className='forecast'>
          <Typography 
            variant="h2"
            sx={{
              display: 'flex',
              justifyContent:'center'
            }}
          >
            {cityName}
          </Typography>

          {/* JSX statement is used to map each indiviual day to its own Accordion component.
              The key is used by React to make this process as effecient as possible.
              The length of the array is 7 so an 8-day forcast will be returned.            */}
          {weather.daily.map((day, index) => (

            <WeatherCard key={index} day={day} />
            // <Weather />
            
          ))}
          
        </div> 
      )}
      
    </div>
  );
};

export default Search;