import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [favoriteLocations, setFavoriteLocations] = useState([]);

  const API_KEY = '52c1f71d6c9c8cd11b597974bcf6b333';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${API_KEY}`;

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      if (location) {
        axios.get(url).then((response) => {
          setData(response.data);
          console.log(response.data);
         } )
      }
    }
  };

  useEffect(() => {
    const success = (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
      axios.get(url).then((response) => {
        setData(response.data);
      });
    };

    const error = () => {
      console.log('Unable to retrieve location.');
      
    };

    if (!location) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log('Geolocation is not supported by this browser.');
      }
    }
  }, [location, API_KEY]);

  useEffect(() => {
    const storedLocations = localStorage.getItem('favoriteLocations');
    if (storedLocations) {
      setFavoriteLocations(JSON.parse(storedLocations));
    }
  }, []);

  const handleAddToFavorites = () => {
    if (data.name && !favoriteLocations.includes(data.name)) {
      setFavoriteLocations([...favoriteLocations, data.name]);
      localStorage.setItem(
        'favoriteLocations',
        JSON.stringify([...favoriteLocations, data.name])
      );
    }
  };

  const handleRemoveFromFavorites = (location) => {
    setFavoriteLocations(favoriteLocations.filter((l) => l !== location));
    localStorage.setItem(
      'favoriteLocations',
      JSON.stringify(favoriteLocations.filter((l) => l !== location))
    );
  };

  const handleFavLocationClick = (location) => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${API_KEY}`).then((response) => {
      setData(response.data);
    });
    setLocation(location);
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />

        {data.name && (
            <button id='addToFav' onClick={handleAddToFavorites}>&#10084;</button>
        )}
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{((data.main.temp -32)*5/9).toFixed()}°C</h1> : null}
          </div>
          <div>
          {/* <img
              className="city-icon"
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt={data.weather[0].description}
            /> */}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        <div className="favorites">
        <h2>Favorites</h2>
          <ul>
            {favoriteLocations.map((location) => (
              <li key={location} id='fav-item' onClick={() => handleFavLocationClick(location)} >
                {location}{' '}
                <button id='remove' onClick={() => handleRemoveFromFavorites(location)}>X
                </button>
              </li>
            ))}
          </ul>
        </div>

        {data.name !== undefined && (
          <div className="bottom">
            <div className="feels">
              {data.main ? (
                <h2 className="bold">{data.main.feels_like.toFixed()}°F</h2>
              ) : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? (
                <h2 className="bold">{data.main.humidity}%</h2>
              ) : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? (
                <h2 className="bold">{data.wind.speed.toFixed()} MPH</h2>
              ) : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
