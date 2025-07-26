require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const Person = require('./modules/person')

const app = express()

let persons = []

app.use(express.json())

app.use(morgan(':method :url :response-time ms :body')) // custom token formats

app.use(express.static('dist'))

morgan.token('body', function getBody(req, res) {
    return JSON.stringify(req.body)
})

app.get('/', (request, response) => {
    response.send('Hello persons')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then((people) => {
        response.json(people)
    })
})

app.get('/info', (request, response) => {
    const date = new Date().toString()
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id 
    const person = persons.find((person) => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body 

    if(!body.name || !body.number) {
        return response.status(400).json({error: 'name or number missing'})
    }

    const nameExists = persons.find(person => person.name === body.name)
    if(nameExists){
        return response.status(400).json({error: 'name must be unique'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then((savedPerson) => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => console.log(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
