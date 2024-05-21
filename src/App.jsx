import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { REACT_APP_WEATHER_API_KEY } from "./api";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const App = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [forecast, setForecast] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  // Update the state to pass all required information to the weather application
  const [weatherDetails, setWeatherDetails] = useState({
    city: "",
    state: "",
    country: "",
    description: "",
    icon: "",
    temp: "",
    temp_max: "",
    temp_min: "",
    feels_like: "",
    wind_speed: "",
    humidity: "",
    pressure: "",
  });

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${REACT_APP_WEATHER_API_KEY}&units=imperial`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${REACT_APP_WEATHER_API_KEY}&units=imperial`;

  // Use useEffect hook to request location permission when the app loads.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
        fetchForecastByCoordinates(latitude, longitude);
      });
    }
  }, []);

  // Create a function to fetch and set the weather by coordinates using the Open Weather API
  const fetchWeatherByCoordinates = async (lat, lon) => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${REACT_APP_WEATHER_API_KEY}&units=imperial`;
      const weatherResponse = await axios.get(weatherUrl);
      const weatherData = weatherResponse.data;

      const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${REACT_APP_WEATHER_API_KEY}`;
      const geoResponse = await axios.get(geoUrl);
      const geoData = geoResponse.data[0];

      // pass all information that the weather details should receive when weather is fetched
      setWeatherDetails({
        city: weatherData.name,
        state: geoData.state || "",
        country: weatherData.sys.country,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        temp: weatherData.main.temp,
        temp_max: weatherData.main.temp_max,
        temp_min: weatherData.main.temp_min,
        feels_like: weatherData.main.feels_like,
        wind_speed: weatherData.wind.speed,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
      });
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  // Create a function to fetch and set the forecast by coordinates using the Open Weather API
  const fetchForecastByCoordinates = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${REACT_APP_WEATHER_API_KEY}&units=imperial`;
    axios.get(url).then((response) => {
      setForecast(response.data);
    });
  };

  // Create a function for searchbar events. Get weather and forcast for the searcged location
  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(weatherUrl).then((response) => {
        setWeatherDetails(response.data);
      });

      axios.get(forecastUrl).then((response) => {
        setForecast(response.data);
      });
    }
  };

  // Create async function to fetch the weather and forecast based on location
  // Use lat and lon to fetch weather and forecast data accurately
  const fetchWeatherAndForecast = async (lat, lon) => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${REACT_APP_WEATHER_API_KEY}&units=imperial`;
      const weatherResponse = await axios.get(weatherUrl);
      const weatherData = weatherResponse.data;

      const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${REACT_APP_WEATHER_API_KEY}`;
      const geoResponse = await axios.get(geoUrl);
      const geoData = geoResponse.data[0];

      // Pass all information that the weather details should receive upon execution
      setWeatherDetails({
        city: weatherData.name,
        state: geoData.state || "",
        country: weatherData.sys.country,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        temp: weatherData.main.temp,
        temp_max: weatherData.main.temp_max,
        temp_min: weatherData.main.temp_min,
        feels_like: weatherData.main.feels_like,
        wind_speed: weatherData.wind.speed,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
      });
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${REACT_APP_WEATHER_API_KEY}&units=imperial`;
      const forecastResponse = await axios.get(forecastUrl);
      setForecast(forecastResponse.data);

    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length > 2) {
      // Fetch suggestions only if the query is longer than 2 characters
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${REACT_APP_WEATHER_API_KEY}`;
      try {
        const response = await axios.get(geoUrl);
        setSuggestions(response.data.slice(0, 5)); //Limits to 5 suggestions;
      } catch (error) {
        console.error("Error fetching suggestions: ", error);
      }
    } else {
      setSuggestions([]); // Clear suggestions if query is too short
    }
  };

  // Create a function to handle a location change event
  const handleLocationChange = (event) => {
    const query = event.target.value;
    setLocation(query);
    fetchSuggestions(query);
  };

  // Create a function to handle the event to when someone clicks on a suggestion
  const handleSuggestionClick = (suggestion) => {
    const location = `${suggestion.name}, ${
      suggestion.state ? suggestion.state + ", " : ""
    }${suggestion.country}`;
    setLocation(location);
    setSuggestions([]);
    fetchWeatherAndForecast(suggestion.lat, suggestion.lon); // Get weather data from fetchWeatherAndForcast function when suggestion is clicked
  };

  // Splice the days of the week from the WEEK_Days array
  const d = new Date().getDay();
  const forecastDays = WEEK_DAYS.slice(d, WEEK_DAYS.length).concat(
    WEEK_DAYS.slice(0, d)
  );

  return (
    <div className="app">
      <div className="container">
        <div className="search">
          <input
            value={location}
            onChange={handleLocationChange}
            onKeyDown={(event) =>
              event.key === "Enter" && fetchWeatherAndForecast(location)
            }
            placeholder="Search for location..."
            type="text"
          />
          {/*Create conditional rendering so that suggestions do not display if query is empty or less than 2
        characters required by the function */}
          {location && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion"
                  onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.name},{" "}
                  {suggestion.state ? `${suggestion.state}, ` : ""}{" "}
                  {suggestion.country}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="weather">
          <div className="top">
            <div>
              <p className="city">
                {weatherDetails.city} {weatherDetails.state}{" "}
                {weatherDetails.country}
              </p>
              <p className="weather-description">
                {weatherDetails.description}
              </p>
            </div>
            <img
              src={`icons/${weatherDetails.icon}.png`}
              alt="weather"
              className="weather-icon"
            />
          </div>
          <div className="bottom">
            <p className="temperature">{Math.round(weatherDetails.temp)}°F</p>
            <div className="range">
              <div className="high-low">
                <span className="max-label">H:</span>
                <span className="max-value">
                  {Math.round(weatherDetails.temp_max)}°F
                </span>
              </div>
              <div className="high-low">
                <span className="min-label">L:</span>
                <span className="min-value">
                  {Math.round(weatherDetails.temp_min)}°F
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="details-container">
          <div className="details">
            <div className="parameter-row">
              <span className="parameter-label top">Details</span>
            </div>
            <div className="parameter-row">
              <span className="parameter-label">Feels like</span>
              <span className="parameter-value">
                {Math.round(weatherDetails.feels_like)}°F
              </span>
            </div>
            <div className="parameter-row">
              <span className="parameter-label">Wind</span>
              <span className="parameter-value">
                {Math.round(weatherDetails.wind_speed)} mph
              </span>
            </div>
            <div className="parameter-row">
              <span className="parameter-label">Humidity</span>
              <span className="parameter-value">
                {weatherDetails.humidity}%
              </span>
            </div>
            <div className="parameter-row">
              <span className="parameter-label">Pressure</span>
              <span className="parameter-value">{weatherDetails.pressure}</span>
            </div>
          </div>
        </div>
        <div className="forecast-container">
          <div className="info-container">
            <h1 className="title">Weekly Forecast</h1>
            {forecast ? (
              <Accordion allowZeroExpanded>
                {forecast.list.slice(0, 7).map((item, idx) => (
                  <AccordionItem key={idx}>
                    <AccordionItemHeading>
                      <AccordionItemButton>
                        <div className="daily-item">
                          <img
                            alt="weather"
                            className="icon-small"
                            src={`icons/${item.weather[0].icon}.png`}
                          />
                          <label className="day">{forecastDays[idx]}</label>
                          <label className="description">
                            {item.weather[0].description}
                          </label>
                          <label className="min">
                            {Math.round(item.main.temp_min)}°F
                          </label>
                          <label className="max">
                            {Math.round(item.main.temp_max)}°F
                          </label>
                        </div>
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <div className="daily-details-grid">
                        <div className="daily-details-grid-item">
                          <label>Pressure</label>
                          <label>{item.main.pressure}</label>
                        </div>
                        <div className="daily-details-grid-item">
                          <label>Humidity</label>
                          <label>{item.main.humidity}%</label>
                        </div>
                        <div className="daily-details-grid-item">
                          <label>Clouds</label>
                          <label>{item.clouds.all}%</label>
                        </div>
                        <div className="daily-details-grid-item">
                          <label>Wind</label>
                          <label>{item.wind.speed} mph</label>
                        </div>
                        <div className="daily-details-grid-item">
                          <label>Sea level</label>
                          <label>{item.main.sea_level} ft</label>
                        </div>
                        <div className="daily-details-grid-item">
                          <label>Feels like</label>
                          <label>{Math.round(item.main.feels_like)}°F</label>
                        </div>
                      </div>
                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
