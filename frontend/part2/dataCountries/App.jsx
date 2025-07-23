import {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {
    const [name, setName] = useState('')
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null) // null is falsy, so the country details will show only after selection of a country
    const [weather, setWeather] = useState([])

    const GET_COUNTRIES = `https://studies.cs.helsinki.fi/restcountries/api/all`

    useEffect(() => {
        console.log('effect for countries')
        axios.get(GET_COUNTRIES).then(response => {
            setCountries(response.data)
        })
        .catch(() => {
            console.log("couldn't fetch countries")
        })
    }, [])

    
    const api_key = import.meta.env.VITE_SOME_KEY
    console.log("api key:", api_key)

    useEffect(() => {
        console.log('effect for weathers')
        
        if (!selectedCountry || selectedCountry.capitalInfo.latlng.length < 2){
            console.log('Selected Country does not exist', selectedCountry)
            return;
        } 

        const GET_WEATHER = `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCountry.capitalInfo.latlng[0]}&lon=${selectedCountry.capitalInfo.latlng[1]}&appid=${api_key}`

        axios.get(GET_WEATHER).then(response => {
            setWeather(response.data)
            console.log(response.data)
        })
        .catch(() => {
            console.log('Could not fetch weather')
        })  
    }, [selectedCountry])
    
    const handleChange = (event) => {
        setName(event.target.value)
    }

    const dataCountry = (cca3) => {
        const foundCountry = countries.find(country => country.cca3 === cca3) 
        console.log("found country", foundCountry)
        setSelectedCountry(foundCountry)
    }

    const filterCountries = countries.filter(c => c.name.common.toLowerCase().includes(name.toLowerCase()))

    return (
        <div>
            <p>find countries <input value={name} onChange={handleChange}/></p>
            {filterCountries.length  >  10 ? <p>Too many matches, specify another filter</p> 
                                            : filterCountries.map(country => <p key={country.cca3}>{country.name.common} <button onClick={() => dataCountry(country.cca3)}>show</button></p>)}

            {selectedCountry && (
                    <div>
                        <h1>{selectedCountry.name.common}</h1> 
                        <p>Capital {selectedCountry.capital}</p>
                        <p>Area {selectedCountry.area}</p>
                        <h2>Languages</h2>
                        <ul>
                            {Object.values(selectedCountry.languages).map((lang, index) => <li key={index}>{lang}</li>)} 
                        </ul> 
                        <img src={selectedCountry.flags.png} alt={`flag of ${selectedCountry.name.common}`}/>
                        <h2>Weather in {selectedCountry.capital}</h2>
                        {weather && (
                            <div> 
                                {weather?.main
                                    ? <p>Temperature {(weather.main.temp - 273.15).toFixed(2)} Celsius</p> // Celsius = Kelvin - 273.15 //
                                    : <p>Loading temperature...</p>
                                }
                                {weather.weather?.[0].icon 
                                    ? <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
                                    : <p>Loading icon...</p>
                                }
                                {weather?.wind?.speed
                                    ? <p>Wind {weather.wind.speed} m/s</p> // gust does not appear much, so it's better to show the wind speed
                                    : <p>Loading wind...</p>
                                }
                            </div>
                        )}
                    </div>)}
        </div>
    )
}

export default App