const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.use(express.json())

app.use(morgan(':method :url :response-time ms :body')) // custom token formats

morgan.token('body', function getBody(req, res) {
    return JSON.stringify(req.body)
})

app.get('/', (request, response) => {
    response.send('Hello persons')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
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


const generateId = () => {
    const randomId = Math.floor(Math.random() * 1000000)
    return String(randomId)
}

app.post('/api/persons', (request, response) => {
    const body = request.body 

    if(!body.name || !body.number){
        return response.status(400).json({error: 'name or number missing'})
    }

    const nameExists = persons.find(person => person.name === body.name)
    if(nameExists){
        return response.status(400).json({error: 'name must be unique'})
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id 
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
