const Persons = ({persons, searchTerm, deletePerson}) => {
    const filterPeopleByName = persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))
    console.log(filterPeopleByName)

    return (
        <div>
            {filterPeopleByName.map(person => <li key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></li>)}
        </div>
    )
}

export default Persons 
