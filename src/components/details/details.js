import "./details.css";

const CurrentWeather = ({ data }) => {
  return (
    <div className="details-container">
      <div className="details">
        <div className="parameter-row">
          <span className="parameter-label top">Details</span>
        </div>
        <div className="parameter-row">
          <span className="parameter-label">Feels like</span>
          <span className="parameter-value">
            {Math.round(data.main.feels_like)}°F
          </span>
        </div>
        <div className="parameter-row">
          <span className="parameter-label">Wind</span>
          <span className="parameter-value">
            {Math.round(data.wind.speed)} mph
          </span>
        </div>
        <div className="parameter-row">
          <span className="parameter-label">Humidity</span>
          <span className="parameter-value">{data.main.humidity}%</span>
        </div>
        <div className="parameter-row">
          <span className="parameter-label">Pressure</span>
          <span className="parameter-value">{data.main.pressure}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
