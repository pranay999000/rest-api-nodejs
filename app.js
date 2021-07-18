

//----------------------------------------------------route------------------------------------------------

// const express = require('express')
// const mustache = require('mustache-express')

// const app = express()

// app.use('/', express.static(__dirname + '/public'))
// app.engine('html', mustache())
// app.set('view engine', 'html')
// app.set('views', __dirname + '/views')

// app.get('/', function(req, res) {
//     res.render('index')
// })


// const fs = require('fs')
// const bodyParser = require('body-parser')

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// app.use(express.static(__dirname + '/views'))

// app.get('/', function(req, res) {
//     fs.readFile(__dirname + '/views/index.html', function(err, data) {
//         if (!err) {
//             res.write(data)
//         }
//         res.end()
//     })
// })

// app.get('/status', function(req, res) {
//     fs.readFile(__dirname + '/views/post.json', function(err, data) {
//         if (!err) {
//             res.send(JSON.parse(data))
//         } else {
//             res.send(JSON.parse(err))
//         }
//     })
// })

// app.post('/status/new', function(req, res) {
//     let status = JSON.stringify({
//         'name': req.body.name,
//         'status': req.body.status
//     })

//     fs.writeFile(
//         __dirname + '/views/post.json',
//         status,
//         function(error) {
//             if (error) console.log(error)
//             res.redirect('/')
//         }
//     )
// })

// const port = process.env.PORT || 3000
// app.listen(port, () => console.log(`listening to post ${port}`))


//---------------------------------------------http------------------------------------------------------------------

// const http = require('http')

// const fs = require('file-system')

// http.createServer(function(req, res) {
//     try {
//         let file = fs.readFileSync('./exports' + req['url'] + '.txt', 'utf-8')
//         res.write(file)
//     } catch(error) {
//         if (error) res.write('404! not found')
//     }
//     res.end()
// }).listen(4000)

//----------------------------------------------basic----------------------------------------------------------------

// const Joi = require('joi')

// app.use(express.json())

// const restAPI = [
//     { id: 1, api: 'api1' },
//     { id: 2, api: 'api2' },
//     { id: 3, api: 'api3' },
//     { id: 4, api: 'api4' }
// ]

// const exportMessage = require('./exports/exportBasic')
// console.log(exportMessage.message)

// function validate(api) {
//     const validate_scheme = Joi.object({
//         api: Joi.string().min(2).required()
//     }).options({ abortEarly: false })

//     return validate_scheme.validate(api)
// }

// app.get('/api/number/:id', (req, res) => {
//     const result = restAPI.find(c => c.id === parseInt(req.params.id))
//     if (!result) {
//         res.status(404).send('404! Not found!')
//     } else {
//         res.send(result)
//     }
// })

// app.post('/api/number', (req, res) => {
//     const { error } = validate(req.body)
//     if (error) {
//         res.status(400).send(error.details[0].message)
//         return
//     }

//     const newAPI = {
//         id: restAPI.length + 1,
//         api: req.body.api
//     }

//     restAPI.push(newAPI)
//     res.send(newAPI)
// })

// app.put('/api/number/:id', (req, res) => {
//     const found = restAPI.find(api => api.id === parseInt(req.params.id))
//     if (!found) {
//         res.status(404).send({
//             error: "404! not found"
//         })
//         return
//     }

//     const { error } = validate(req.body)
//     if (error) {
//         res.status(400).send(error.details[0].message)
//         return
//     }

//     found.api = req.body.api
//     res.send(found)
// })

// app.delete('/api/number/:id', (req, res) => {
//     const found = restAPI.find(api => api.id === parseInt(req.params.id))
//     if (!found) {
//         res.status(404).send({
//             error: '404! not found'
//         })
//         return
//     }

//     const toDelete = restAPI.indexOf(found)
//     restAPI.splice(toDelete, 1)

//     res.send(found)
// })

// app.get('/api/number', (req, res) => {
//     const query = req.query.api
//     const found = restAPI.find(api => api.api === query)
    
//     if (!found) {
//         res.send({
//             response: 'api not found!'
//         })
//         return
//     }

//     res.json(found)
// })

// const port = process.env.PORT || 5000
// app.listen(port, () => console.log(`listening to port ${port}`))

//---------------------------------------------------mongodb---------------------------------------------------------

// const mongodb = require('mongodb')
// const mongoClient = mongodb.MongoClient
// const express = require('express')

// const url = 'mongodb://127.0.0.1:27017/'

// mongoClient.connect(url, function(err, client) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log('connected to mongodb://127.0.0.1:27017/\n')
//         init(client)        
//     }
// })

// function init(client) {
//     let api = client.db('restAPI')
//     let collection = api.collection('APIs')

//     // collection.insertOne({ 'name': 'PUT', 'does': 'updating data' })

//     // collection.deleteOne({ 'name': 'POST' })
    
//     collection.find({}).toArray(function(err, result) {
//         console.log(result)
//     })
// }

//-------------------------------------------release--------------------------------------------------------


const express = require('express')
const mustache = require('mustache-express')
// const bodyParser = require('body-parser')
const mongo = require('mongodb')
const fs = require('file-system')
const objectId = require('mongodb').ObjectId
const { func } = require('joi')

const app = express()
const mongoClient = mongo.MongoClient
const url = 'mongodb://127.0.0.1:27017/'

app.use('/', express.static(__dirname + '/public'))
app.engine('html', mustache())
app.set('view engine', 'html')
app.set('views', __dirname + '/views')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.render('index')
})

app.post('/task/new', function(req, res) {
    mongoClient.connect(url, function(error, client) {
        if (!error) {
            newStatus(client, req, res);
        }
    })
})

app.get('/status', function(req, res) {
    mongoClient.connect(url, function(error, client) {
        if (!error) {
            fillStatus(client, req, res)
        }
    })
})

app.put('/status/update/:id', function(req, res) {
    mongoClient.connect(url, function(error, client) {
        if (!error) {
            updateStatus(client, req, res)
        }
    })
})

function newStatus(client, req, res) {
    let api = client.db('restAPI')
    let collection = api.collection('APIs')

    collection.insertOne({
        timeStamp: new Date(),
        name: req.body.name,
        status: req.body.status
    }, function(error, result) {
        if (!error) {
            res.redirect('/')
            res.end()
        }
    })

}

function fillStatus(client, req, res) {
    let api = client.db('restAPI')
    let collection = api.collection('APIs')

    collection.find({}).toArray(function(error, result) {
        if (!error) {
            res.send(result)
            res.end()
        }
    })
}

function updateStatus(client, req, res) {
    let api = client.db('restAPI')
    let collection = api.collection('APIs')

    collection.updateOne(
        { _id: new objectId(req.params.id) }, 
        { $set: { status: req.body.status } },
        function(error, result) {
            if (!error) {
                console.log('error-update')
                res.redirect('/')
                res.end()
            }
        }
    )
    
}

app.listen(8000, () => console.log('listening to post 8000'))
