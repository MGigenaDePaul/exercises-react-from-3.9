import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Filter from './components/Filter' 
import PersonForm from './components/PersonForm' 
import Persons from './components/Persons'
import './index.css'


const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [searchTerm, setSearchTerm] = useState('') 
    const [message, setMessage] = useState('a person or an updated number will be added')

    useEffect(() => {
        console.log('effect')
        personService.getAll().then(initialPersons => {
            console.log('promise fulfilled')
            setPersons(initialPersons)
        })
    }, [])
    console.log('render', persons.length, 'persons')

    const deletePerson = (id) => {
        const person = persons.find(person => person.id === id)
        console.log("found person to delete", person)
        if (window.confirm(`Delete ${person.name}?`)) {
            personService.eliminate(id).then(() => {
                setPersons(persons.filter(person => person.id !== id))
            })
            .catch(() => {
                console.log(`${person.name} was already deleted from the server`)
                setPersons(persons.filter(person => person.id !== id))
            })
        }
    }

    const handleNameChange = (event) => {
        console.log(event.target.value)
        setNewName(event.target.value)
    }

    const replaceOldNumber = (id) => {
        const person = persons.find(person => person.id === id)
        const changedPerson = {...person, number: newNumber}
        console.log("found person", person)
        console.log("changed person", changedPerson)

        if(window.confirm((`${newName} is already added to phonebook, replace the old number with a new one?`))) {
            personService.update(id, changedPerson).then(returnedPerson => {
                setPersons(persons.map(person => person.id === id ? returnedPerson : person))
                setMessage(`${person.name} number is changed to ${changedPerson.number}`)
                setTimeout(() => {
                    setMessage(null)
                }, 5000)
            })
            .catch(() => {
                {message}
                console.log("Couldn't update number")
            })
        }
    } 

    const addPerson = (event) => {
        event.preventDefault()
        
        const personExists = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())

        if(personExists){ 
            replaceOldNumber(personExists.id)
            setMessage(`Information of ${personExists.name} has already been removed from server`)
        } else {
            const personObject = {
                name: newName,
                number: newNumber
            }

            personService.create(personObject).then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')
                    setNewNumber('')
                    setMessage(`Added ${personObject.name}`)
                    setTimeout(() => {
                        setMessage(null)
                    }, 5000)
            })
            .catch(error => {
                console.log(error.response.data.error)
                setMessage(`${error.response.data.error}`)
            })
        }
    }

    const handleNumberChange = (event) => {
        console.log(event.target.value)
        setNewNumber(event.target.value)
    }

    const handleSearchTerm = (event) => {
        console.log(event.target.value)
        setSearchTerm(event.target.value)
    }

    return (
        <div>
            <h2>Phonebook</h2>
                <Notification addMessage={message}/>
                <Filter handleSearchTerm={handleSearchTerm}/>
            <h3>add a new</h3>
                <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
            <h3>Numbers</h3>
                <Persons searchTerm={searchTerm} newName={newName} persons={persons} deletePerson={deletePerson} />
        </div>  
    )
}

export default App