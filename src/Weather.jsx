import { useState, useRef, useEffect } from 'react';

function Weather() {
    const [weatherData, setWeatherData] = useState();
    const [error, setError] = useState();
    const inputRef = useRef(null);

    async function fetchWeatherByLocation(lat, lon) {
        const APIKEY = import.meta.env.VITE_API_KEY;
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Unable to fetch weather for your location");
            }

            const data = await response.json();
            setWeatherData(data);
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
            return <p>☀️</p>;
        } else if (temp <= 28 && temp >= 18) {
            return <p>⛅</p>;
        } else if (temp < 18 && temp >= 12) {
            return <p>☁️</p>;
        } else if (temp < 12 && temp >= 8) {
            return <p>⛈️</p>;
        } else if (temp < 8) {
            return <p>❄️</p>;
        }
        return null;
    }

 
    useEffect(() => {
        getLocation();
    }, []);

    return (
        <div className="container">
            <h1>Weather App</h1>
            <input onKeyDown={(e) => enter(e)} type="text" ref={inputRef} />
            <button onClick={displayWeather}>Search</button>
            {error && <p>Error: {error}</p>}
            {weatherData && !error && (
                <>
                    <p>City: {weatherData.name}</p>
                    <p>Temperature: {kelvinToCelsius(weatherData.main.temp)}°C</p>
                    <p>Humidity: {weatherData.main.humidity}%</p>
                    <p>{weatherData.weather[0].description}</p>
                    <h1 className="emoji">{emoji(kelvinToCelsius(weatherData.main.temp))}</h1>
                </>
            )}
        </div>
    );
}

export default Weather;
