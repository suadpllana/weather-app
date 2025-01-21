import { useState, useRef, useEffect } from 'react';
import { FaWater } from "react-icons/fa";
import { TbWind } from "react-icons/tb";
import Forecast from './Forecast';
function Weather() {
    const [weatherData, setWeatherData] = useState();
    const [error, setError] = useState();
    const inputRef = useRef(null);
    const [location , setLocation]  = useState({})

    async function fetchWeatherByLocation(lat, lon) {
        const APIKEY = import.meta.env.VITE_API_KEY;
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`;
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error("Unable to fetch weather for your location");
            }

            const data = await response.json();
            setWeatherData(data);
            setLocation({
                lat: data.coord.lat,
                lon: data.coord.lon
            })
          
            setError(null);
        } catch (err) {
            setWeatherData(null);
            setError(err.message);
        }
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByLocation(latitude, longitude);
                },
                (err) => {
                    setError("Geolocation permission denied or unavailable.");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }

    async function displayWeather() {
        const APIKEY = import.meta.env.VITE_API_KEY;

        try {
            if (!inputRef.current.value) {
                return;
            }

            const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputRef.current.value}&appid=${APIKEY}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("City not found or something went wrong");
            }

            const data = await response.json();
            setWeatherData(data);
            setLocation({
                lat: data.coord.lat,
                lon: data.coord.lon
            })
            setError(null);
            inputRef.current.value = ``;
        } catch (err) {
            setWeatherData(null);
            setError(err.message);
        }
    }

    const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(2);

    function enter(e) {
        if (e.key === "Enter") {
            displayWeather();
        }
    }

    function emoji(temp) {
        if (temp > 28) {
            return <span>☀️</span>;
        } else if (temp <= 28 && temp >= 18) {
            return <span>⛅</span>;
        } else if (temp < 18 && temp >= 12) {
            return <span>☁️</span>;
        } else if (temp < 12 && temp >= 8) {
            return <span>⛈️</span>;
        } else if (temp < 8) {
            return <span>❄️</span>;
        }
        return null;
    }

 
    useEffect(() => {
        getLocation();
    }, []);

    return (
    
    <>
       <h1>Weather App</h1>
       <div className="container">
         
         <input  className="search-input" onKeyDown={(e) => enter(e)} placeholder="Search" type="text" ref={inputRef} />
         <button onClick={displayWeather}>🔍</button>
         {error && <p>Error: {error}</p>}
         {weatherData && !error && (
             <>
             <h1 className="emoji">{emoji(kelvinToCelsius(weatherData.main.temp))}</h1>
             <h2>{kelvinToCelsius(weatherData.main.temp)}°C <br />
             {weatherData.name}</h2>
               
                    <div className="humidity">
                        <div>
                            <p> <FaWater/> {weatherData.main.humidity}% <br /> Humidity </p>
                        </div>
                        <div>
                        <p> <TbWind/> {weatherData.wind.speed} Km/h <br />
                        Wind speed</p>
                        </div>
                    
                    
                    </div>
                 
                 
             </>
         )}


    
     </div>
     {location.lat && location.lon && !error && <Forecast location={location} emoji={emoji}/>}
    </>
       
    );
}

export default Weather;
