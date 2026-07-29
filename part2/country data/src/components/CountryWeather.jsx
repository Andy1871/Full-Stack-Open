const CountryWeather = ({ country, weather, error }) => {
    return (
        <>
            <h3>Weather in {country.capital}</h3>
            {error ? (
                <p>Failed to find weather for this capital</p>
            ) : weather ? (
                <>
                    <p>Temparature: {weather.main.temp} Celsius</p>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
                    <p>Wind: {weather.wind.speed} m/s</p>
                </>
            ) : (
                <p>Loading weather...</p>
            )}          
        </>
    )
}

export default CountryWeather