const Persons = ({ filteredPersons, deletePerson }) => {
    return (
        <div>
            {filteredPersons.map(person =>
                <Person key={person.id} person={person} deletePerson={deletePerson} />
            )}
        </div>
    )
}


const Person = ({ person, deletePerson }) => {
    return (
        <p>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id)}>delete</button>
        </p>
    )
}



export default Persons