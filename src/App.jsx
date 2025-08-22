import React, { useState } from "react";
import "./App.css";
//This is the main file
const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherClass, setWeatherClass] = useState("default");

  const getWeatherClass = (temp, conditionText) => {
    const condition = conditionText.toLowerCase();

    if (condition.includes("cloud") || condition.includes("fog")) {
      return "cloudy";
    } else if (temp < 10) {
      return "cold";
    } else if (temp < 20) {
      return "mild";
    } else if (temp < 30) {
      return "warm";
    } else {
      return "hot";
    }
  };

  const handleSearch = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=15b1705de83c4a81b8d115809250808&q=${city}&aqi=yes`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      setWeatherData(data);

      const temp = data.current.temp_c;
      const condition = data.current.condition.text;

      const bgClass = getWeatherClass(temp, condition);
      setWeatherClass(bgClass);
    } catch (err) {
      setError("City not found or API error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app ${weatherClass}`}>
      <div className="content">
        <h1>VETERO</h1>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={handleSearch}>Get Weather</button>
        </div>

        {loading && <p className="info">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weatherData && (
          <div className="card">
            <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
            <p>{weatherData.current.condition.text}</p>
            <img src={weatherData.current.condition.icon} alt="icon" />
            <p><strong>Temperature:</strong> {weatherData.current.temp_c}°C</p>
            <p><strong>Humidity:</strong> {weatherData.current.humidity}%</p>
            <p><strong>Feels Like:</strong> {weatherData.current.feelslike_c}°C</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;