import { useState } from 'react';

function Weather() {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    async function displayWeather() {
        const APIKEY = 'eb3c88cf69e595751d0eae9e1cefd0b9'; 
        const cityName = document.getElementById('cityName').value;

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKEY}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('City not found');
            }
            
            const data = await response.json();
            setWeatherData(data);
            setError(null); 
        } catch (err) {
            setWeatherData(null);
            setError(err.message);
        }
    }

    const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(2);

    return (
        <div className="container">
            <h1>Weather App</h1>
            <input type="text" id="cityName" />
            <button onClick={displayWeather}>Search</button>
            {error && <p>Error: {error}</p>}
            {weatherData && !error && (
                <>
                    <p>City: {weatherData.name}</p>
                    <p>Temperature: {kelvinToCelsius(weatherData.main.temp)}°C</p>
                    <p>Humidity: {weatherData.main.humidity}%</p>
                    <p>{weatherData.weather[0].description}</p>
                </>
            )}
        </div>
    );
}

export default Weather;
