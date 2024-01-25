import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from "../api";
import "./search.css";

const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);


  const handleOnChange = (searchData) => {
    /*handles data passed into AsyncPaginate component*/
    setSearch(searchData);
    onSearchChange(
      searchData
    ); /*function passed from the parent component to pass data received from input. */
  };

  const loadOptions = (inputValue) => {
    return fetch(
      `${GEO_API_URL}/cities?minPopulation=150000&namePrefix=${inputValue}` /*imported URL to fetch city data and specified for populations of 150,000 or greater*/,
      geoApiOptions
    )
      .then((response) => response.json())
      .then((response) => {
        return {
          options: response.data.map((city) => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.countryCode}`,
            };
          }),
        };
      })
      .catch((err) => console.error(err));
  };

  return (
    <AsyncPaginate
      className="search-bar"
      placeholder="Search for city..."
      debounceTimeout={600} /*prevents multiple requests at one time*/
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  );
};

export default Search;
