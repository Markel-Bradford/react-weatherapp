import "./App.css";
import { useState } from "react";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./components/api";
import Forecast from "./components/forecast/forecast";
import Details from "./components/details/details";
import {BrowserRouter as Router} from "react-router-dom";


function App() {

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast/?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })

      .catch((err) => console.log(err));
  };

  console.log(currentWeather);
  console.log(forecast);

  return (
    <Router basename="/react-weatherapp">
    <div className="background">
      <div className="container">
        <Search
          onSearchChange={
            handleOnSearchChange
          } /*adds event to app.js component*/
        />
          {currentWeather && <CurrentWeather data={currentWeather} />}
          {currentWeather && <Details data={currentWeather} />}
          {forecast && <Forecast data={forecast} />}
      </div>
    </div>
    </Router>
  );
}

export default App;
