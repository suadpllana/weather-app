import { useState } from 'react';

function Weather(){

    const [weatherData , setWeatherData] = useState()

    async function displayWeather(){
        const APIKEY = `eb3c88cf69e595751d0eae9e1cefd0b9`
        const cityName = document.getElementById("cityName").value;

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKEY}`;
        const response = await fetch(url);
        const data  = await response.json();
        console.log(data);
        setWeatherData(data)
    }

    return(
        <>
        <div className="container">
            <h1>Weather App</h1>
            <input type="text"  id="cityName" />
            <button onClick={displayWeather}>Search</button>
            {weatherData && (
                <>
                     <p>City: {weatherData.name}</p>
                     <p>Temperature: {(weatherData.main.temp - 273).toFixed(2)}°C</p>
                     <p>Humidity: {weatherData.main.humidity}%</p>
                     <p>{weatherData.weather[0].description}</p>
                </>

            )}
          
        </div>
        </>
    )
}

export default Weather