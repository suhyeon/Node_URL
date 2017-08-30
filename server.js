const express = require('express')
const basicAuth = require('express-basic-auth')
const morgan = require('morgan')
const random = require('randomstring')
const bodyParser = require('body-parser')
const data = [
  {longUrl: 'http://google.com', id: random.generate(6)}
]

//http://localhost:3000/id
//302 response

const app = express()

const authMiddleware = basicAuth({
  users: { 'admin': 'admin' },
  challenge: true,
  realm: 'Imb4T3st4pp'
})
const bodyParsermiddleware = bodyParser.urlencoded({ extended: false })

// parse application/x-www-form-urlencoded 

app.use('/static', express.static('public'))
app.use(morgan('tiny'))

app.set('view engine', 'ejs')

app.get('/',authMiddleware, (req,res) => {
  res.render('index.ejs', {data})
})

app.get('/:id', (req,res) => {
  const id = req.params.id
  const match = data.find(item => item.id === id)
  if(match){
    res.redirect(301, match.longUrl)
  }else{
    res.status(404)
    res.send('404 Not found')
  }
})

app.post('/', authMiddleware,bodyParsermiddleware, (req, res) => {
  const longUrl = req.body.longUrl
  let id
  while(true){
    const candidate = random.generate(6)
    const match = data.find(item => item.id === candidate)
    if(!match){
      id = candidate
      break
    }
  }
  data.push({longUrl, id})
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('3000port now Listening!!!!!!')
})