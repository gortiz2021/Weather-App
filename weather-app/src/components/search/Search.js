import React from 'react';
import './Search.css';
import { TextField } from '@mui/material';

const Search = () => {
  return (
    <div className='search-container'>
        <TextField 
            id='search-bar'
            label='search'
            varient='standard'
        />
    </div>
  )
}

export default Search;