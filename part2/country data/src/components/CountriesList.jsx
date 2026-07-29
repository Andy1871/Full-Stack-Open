import CountryDetails from "./CountryDetails"
import CountryListItem from "./CountryListItem"

const CountriesList = ({ countries, filter, selectedCountry, setSelectedCountry }) => {

  const filteredCountries = countries
    .filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a.name.common.localeCompare(b.name.common))

  if (filter === '') return null
  if (filteredCountries.length > 10) return <p>Too many matches, specify another filter</p>
  if (selectedCountry) return <CountryDetails country={selectedCountry} />
  if (filteredCountries.length >= 2) return (
    filteredCountries.map(country =>
        <CountryListItem key={country.name.common} country={country} onShow={() => setSelectedCountry(country)} />
    ))
  if (filteredCountries.length === 1) return <CountryDetails country={filteredCountries[0]} />
  return null
}

export default CountriesList