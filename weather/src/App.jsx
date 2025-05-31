import { useState, useEffect, useRef, use } from 'react'
import './App.css'

function App() {
  const inputRef = useRef(null);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Tokyo'); //Later implemetn location tracking
  const [inputValue, SetInputValue] = useState(city);

  const getWeatherMood = (weatherData) => {
  if (!weatherData) return "Waiting for weather data...";
  
  const { main, description } = weatherData.weather[0];
  const { temp } = weatherData.main;

  const moods = {
    Rain: "Better grab an umbrella ☔",
    Clouds: "Gloomy skies ahead, just like your poor life ☁️",
    Clear: "Perfect sunglasses weather 😎",
    Snow: "Winter wonderland! ❄️",
    Thunderstorm: "Thor is angry today ⚡",
    default: `Currently ${Math.round(temp)}°C with ${description}`
  };

  return moods[main] || moods.default;
  };

  useEffect(() => {
  fetch(`/api/weather?city=${city}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(
          res.status === 404 
            ? `"${city}" not found - try another location` 
            : 'Weather service unavailable'
        );
      }
      return res.json();
    })
    .then(data => {
      setWeather(data);
      setError(null); // Clear any previous errors
    })
    .catch(err => {
      setError(err.message); // Display user-friendly error
      setWeather(null); // Clear stale weather data
      console.error("API Error:", err);
    });
  }, [city]);

  useEffect(() => {
    if (inputRef.current) {
      const estimatedWidth = Math.max(inputValue.length * 12 + 10, 50);
      inputRef.current.style.width = `${estimatedWidth}px`;
    }
  }, [inputValue]);

  const handleInputChange = (e) => {
  SetInputValue(e.target.value);
  };

  const handleSubmit = () => {
      setCity(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className='wrapper'>
      <div className='intro-container'>
        <h3>Bad Weather App</h3>
        <span>Your Mom API -- I'm debugging, ✨fuck aesthetic✨</span>
      </div>
       <div className='weather-info'>
          <h3>Currently, You are in</h3>
          <input value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} ref={inputRef} maxLength={20}/>
          {weather && <h3>It's {weather.weather[0].description}</h3>}
        </div>
      <div className='weather-container'>
        <div className='wrap-me'>
          <div className='weather-main'>
            <div className='mitem'>
              {weather && (
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}/>
              )}
            </div>
            <div className='mitem'>
              {weather && <p>{Math.round(weather.main.temp)}°C</p>}
            </div>
          </div>
          {weather && (
          <div className='weather-right'>
            <div className='ritem'>
             <p>Wind: {Math.round(weather.wind.speed)} mph</p>
            </div>
            <div className='ritem'>
             <p>Wind Degree: {weather.wind.deg}°</p>
            </div>
            <div className='ritem'>
             <p>Humidity: {weather.main.humidity}%</p>
            </div>
            <div className='ritem'>
             <p>Pressure: {weather.main.pressure} hPa</p>
            </div>
          </div>
          )}
        </div>
        <div className='weather-state'>
          <p>{weather && getWeatherMood(weather)}</p>
        </div>
      </div>
      <div className='footer'>
        <p>this is footer, u hab foot fetish?  ̶m̶e̶e̶ ̶t̶o̶o̶ | @asymmetry1</p>
      </div>
    </div>
  )
}

export default App
