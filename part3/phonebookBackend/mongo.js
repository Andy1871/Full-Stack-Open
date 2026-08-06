// const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url = `mongodb+srv://andyherbert1875_db_user:${password}@phonebook.ysvbnhy.mongodb.net/phonebook?appName=phonebook`

// mongoose.set('strictQuery',false)

// mongoose.connect(url, { family: 4 })

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// const Person = mongoose.model('Person', personSchema)

// // Inserted initial persons array to the DB.

// // const persons = [
// //     {
// //       name: "Arto Hellas",
// //       number: "040-123456"
// //     },
// //     {
// //       name: "Ada Lovelace",
// //       number: "39-44-5323523"
// //     },
// //     {
// //       name: "Dan Abramov",
// //       number: "12-43-234345"
// //     },
// //     {
// //       name: "Mary Poppendieck",
// //       number: "39-23-6423122"
// //     }
// // ]

// // Person.insertMany(persons).then(result => {
// //     console.log('persons saved')
// //     mongoose.connection.close()
// // })

// if (process.argv.length === 3) {
//     Person.find({}).then(result => {
//         result.forEach(person => {
//             console.log(`${person.name} ${person.number}`)
//         })
//         mongoose.connection.close()
//     })
// } else if (process.argv.length === 5) {
//     const person = new Person({
//         name: process.argv[3],
//         number: process.argv[4]
//     })

//     person.save().then(() => {
//         console.log(`added ${person.name} number ${person.number} to phonebook`)
//         mongoose.connection.close()
//     })
// } else {
//     console.log('Invalid number of arguments')
//     mongoose.connection.close()
// }



