const express = require('express')
const hbs = require('hbs')
const fs = require('fs')

const port = process.env.PORT || 3000
var app = express()

// Express middleware:
// app.set takes key value pairs. here we set the view engine to hbs for rendering below
// __dirname will access the absolute directory of this module
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')
// app.use is how you register middleware
// below middleware will create a log of server requests and save them to the file server.log in this directory
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}:  ${req.method}  ${req.url}\n   ***   `
  console.log(log)
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.')
    }
  })
  next()
})
// uncommenting the middleware below will activate maintenance.hbs
// app.use((req, res, next) => {
//   res.render('maintenance.hbs')
// })

app.use(express.static(__dirname + '/public'))

// helper calls a function defined here from inside the .hbs
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
})
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase()
})

// http handler to specify a route ('/' specifies root), request or respond data
app.get('/', (req, res) => {
  // res.send('<h1>Hello Express!</h1>')
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to our site',
  })
})

// res.render will render dynamic elements from the specified file using the
// view engine set above
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  })
})

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Portfolio',
  })
})

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Error handling request'
  })
})

// Host the server and listen for requests at the address (3000)
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
