import { useState, useEffect  } from "react"
import weatherService from '../services/weather'
import CountryWeather from "./CountryWeather"
import CountryBasicInfo from "./CountryBasicInfo.jsx"


const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    weatherService
      .getWeather(country.capital[0])
      .then(data => setWeather(data))
      .catch((err) => {
        setError(true)
        console.log('Capital not found on OpenWeatherMap api', err)
      }
    )
  }, [country])

  return (
    <>
      <h2>{country.name.common}</h2>
      <CountryBasicInfo country={country} />
      <CountryWeather country={country} weather={weather} error={error} />
    </>
  )
}

export default CountryDetails
