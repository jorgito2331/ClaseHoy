const express = require('express')
const mongoose = require('mongoose')

const puerto = process.env.PORT
const mongoHost = process.env.HOST
const mongoDataBase = process.env.DATABASE

mongoose.connect(`mongodb://${mongoHost}/${mongoDataBase}`, { useNewUrlParser: true })

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

let personSchema = mongoose.Schema({
  'cedula': {
    type: String
  },
  'nombre': {
    type: String
  },
  'apellido': {
    type: String
  }
})

var Person = mongoose.model('user', personSchema)

app.listen(puerto, () => {
  console.log('CONNECTED')
})

app.get('/', (req, res) => {
  res.send('holis')
})

app.get('/person', (req, res) => {
  new Promise((resolve, reject) => {
    Person.find({}, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  }).then((val) => {
    res.status(200).send(val)
  }).catch((val) => {
    res.status(404).send(val)
  })
})

app.post('/person/create', (req, res) => {
  new Promise((resolve, reject) => {
    Person.create(req.body, (error, okay) => {
      if (error) {
        reject(error)
      } else {
        resolve(okay)
      }
    })
  }).then((val) => {
    res.status(200).send(`Se almaceno el usuario ${val.cedula}`)
  }).catch((val) => {
    res.status(500).send(val)
  })
})

app.delete('/person/delete', (req, res) => {
  new Promise((resolve, reject) => {
    Person.deleteOne(req.body, (err, deleted) => {
      if (err) {
        reject(err)
      } else {
        resolve(200)
      }
    })
  }).then((val) => {
    res.status(val).send('Usuario eliminado')
  }).catch((val) => {
    res.status(500).send(val)
  })
})

app.patch('/person/update', (req, res) => {
  new Promise((resolve, reject) => {
    Person.updateOne(req.body.id, { $set: req.body.changes }, (err, updated) => {
      if (err) {
        reject(err)
      } else {
        resolve(200)
      }
    })
  }).then((val) => {
    res.status(val).send('Usuario actulizado')
  }).catch((val) => {
    res.status(500).send(val)
  })
})
