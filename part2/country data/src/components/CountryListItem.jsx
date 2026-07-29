const CountryListItem = ({ country, onShow }) => {
  return (
    <p>
      {country.name.common}
      <button onClick={onShow}>show</button>
    </p>
  )
}

export default CountryListItem