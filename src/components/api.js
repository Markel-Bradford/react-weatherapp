

export const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";
export const geoApiOptions = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key' : process.env.REACT_APP_RapidAPI_Key,
		'X-RapidAPI-Host' : 'wft-geo-db.p.rapidapi.com'
		}
};

export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
export const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;



try {
	const response = await fetch(GEO_API_URL, geoApiOptions);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}
