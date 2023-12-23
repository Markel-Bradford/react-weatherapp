import "./current-weather.css";

const CurrentWeather = ({ data }) => {
  return (
    <div className="weather">
      <div className="top">
        <div>
          <p className="weekday">{}</p>
          <p className="city">{data.city}</p>
          <p className="weather-description">{data.weather[0].description}</p>
        </div>
        <img
          src={`icons/${data.weather[0].icon}.png`}
          alt="weather"
          className="weather-icon"
        />
      </div>
      <div className="bottom">
        <p className="temperature">{Math.round(data.main.temp)}°F</p>
        <div className="range">
          <div className="high-low">
            <span className="max-label">H:</span>
            <span className="max-value">{Math.round(data.main.temp_max)}</span>
          </div>
          <div className="high-low">
            <span className="min-label">L:</span>
            <span className="min-value">{Math.round(data.main.temp_min)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
