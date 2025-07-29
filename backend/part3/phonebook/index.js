require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const Person = require('./modules/person')

const app = express()

app.use(express.static('dist'))

app.use(express.json())

app.use(morgan(':method :url :response-time ms :body')) // custom token formats

morgan.token('body', function getBody(req, res) {
    return JSON.stringify(req.body)
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

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
    Person.estimatedDocumentCount().then(count => {
        response.send(`<p>Phonebook has info for ${count} people</p>
        ${date}`)
    })
    
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body 

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
    .then((savedPerson) => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body 

    Person.findById(request.params.id)
        .then(person => {
            if(!person){
                return response.status(404).end()
            }

            person.name = name
            person.number = number
            
            return person.save().then((updatedPerson) => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
