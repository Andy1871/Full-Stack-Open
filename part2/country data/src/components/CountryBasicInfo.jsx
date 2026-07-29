const CountryBasicInfo = ({ country }) => {
    return (
        <>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area}</p>
            <h3>Languages</h3>
            <ul>
                {Object.values(country.languages).map(language =>
                <li key={language}>{language}</li>
                )}
            </ul>
        </>
  )
}

export default CountryBasicInfo