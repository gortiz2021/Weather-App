import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, CardMedia } from '@mui/material';
import { ICON_API_URL } from '../../config/config';

// A function used to display a 8-day forecast
// THe day is determined in the component return section.
const Weather = ({ day }) => {

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

export default Weather;