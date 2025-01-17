import React from 'react'
import {useState , useEffect} from "react"
const Forecast = ({location , emoji}) => {
    const [forecastedDays , setForcastedDays] = useState([])
    const [accordion , setAccordion] = useState(-1)
    useEffect(() => {
        async function getForecast() {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=eb3c88cf69e595751d0eae9e1cefd0b9`;
            const response = await fetch(url);
            const data = await response.json();
    
          
            const dailyForecasts = data.list.reduce((acc, forecast) => {
                const date = forecast.dt_txt.split(' ')[0]; 
                if (!acc[date]) {
                    acc[date] = forecast; 
                }
                return acc;
            }, {});
    
            
            const filteredData = Object.values(dailyForecasts);
            setForcastedDays(filteredData); 
            
        }
        getForecast();
    }, [location]);
    function formatDate(dateString) {
        const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        
        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        
        return `${day} of ${month}`;
      }
   
    const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(2);
  return (
    <div className="forecast-container">
        <h1>Forecasted Weather</h1>
     {forecastedDays && forecastedDays.map((day , index) => (
        <div className="forecast" key={index}>
            <div className="forecast-title" onClick={() => setAccordion(index)} onDoubleClick={() => setAccordion(-1)}>
                <div>
                <p className="date">{emoji(kelvinToCelsius(day.main.temp))} {formatDate(day.dt_txt.slice(0,10))}</p>
                </div>
                <div>
                <p className="desc">{day.weather[0].description}</p>
                <p className="desc">{kelvinToCelsius(day.main.temp_min)}°C / {kelvinToCelsius(day.main.temp_max)}°C</p>
                </div>
          
            
            </div>
            
            {accordion === index && 
             <div className="forecast-data">
             <div>
             <p>Pressure: <span>{day.main.pressure} hPa</span></p>
         <p>Clouds: <span>{day.clouds.all}%</span></p>
         <p>Sea level :  <span>{day.main.sea_level}m</span></p>
             </div>
             <div>
             <p>Humidity: <span>{day.main.humidity}%</span></p>
         <p>Wind Speed: <span>{day.wind.speed} m/s</span></p>
         <p>Feels Like : <span>{kelvinToCelsius(day.main.feels_like)}</span></p>
             </div>
         </div>
            }
           
          
            
        
        </div>
     ))}
    </div>
  )
}

export default Forecast
