import { useEffect, useState } from 'react'
import countriesService from './services/countries'
import Filter from './components/Filter'
import CountriesList from './components/CountriesList'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => setCountries(initialCountries)) 
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <CountriesList 
        countries={countries} 
        filter={filter} 
        selectedCountry={selectedCountry} 
        setSelectedCountry={setSelectedCountry}
      />
    </div>
    
  )
}

export default App

