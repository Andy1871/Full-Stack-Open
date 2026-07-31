const express = require('express')
const morgan = require('morgan')

const app = express()


morgan.token('body', (req) => JSON.stringify(req.body))

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]



app.get('/', (request, response) => {
    response.send('<h1>Persons</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.statusMessage = 'Person not found'
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const noOfPersons = persons.length
    const date = new Date()

    response.send(`
        <p>Phonebook has info for ${noOfPersons} people</p>
        <p>${date}</p>
    `)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const existingName = persons.find(person => person.name.toLocaleLowerCase() === body.name.toLocaleLowerCase())

    if (existingName) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const randomId = String(Math.floor(Math.random() * 50000))

    const person = {
        id: randomId,
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