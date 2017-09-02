const express = require('express')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')

const data = [
  {
    id: 0,
    title: 'tkfktkfk',
    body: 'rkfkskdf'
  }
]
const review = [
  {
    id: data.length-1,
    review: 'review'
  }
]
const authMiddleware = basicAuth({
  users: { 'admin': 'admin' },
  challenge: true,
  realm: 'Imb4T3st4pp'
})
const bodyParsermiddleware = bodyParser.urlencoded({ extended: false })
const app = express()
app.use('/static', express.static('public'))

app.set('view engine', 'ejs')

app.get('/',(req,res) => {
  res.render('index.ejs', {data})
})
app.get('/input', (req,res) => {
  res.render('input.ejs')
})
app.get('/open/:id', (req,res) => {
  const match = data.find(item => item.id === req.params.id*1)
  if(match){
    res.render('open.ejs', {match, review: review})
  }else{
    res.status(404)
    res.send('404 Notfound')
  }
})
app.post('/input', bodyParsermiddleware,(req,res) => {
  const title = req.body.title
  const body = req.body.body 
  let arr = []
  for(var i = 0; i<data.length; i++){
    arr = data.pop()
  }
  data.push(arr)
  if(title){
    const n = {
      id: data.length,
      title,
      body
    }
    data.push(n)
    res.redirect('/')
  }else{
    res.status(404)
    res.send('404 input No')
  }
})
app.post('/open/:id/review', bodyParsermiddleware,(req,res) => {
  const match = data.find(item => item.id === req.params.id*1)
  const rep = req.body.review
  const re = {
    id: data.length - 1,
    review: rep
  }
  console.log(rep)
  if(rep){
    review.push(re)
    console.log(review)
  }else{
    res.status(404)
    res.send('input review')
  }
  res.redirect('/open/' + `${match.id}`)
})
app.get('/delete', authMiddleware,(req,res) => {
  res.render('delete.ejs', {data})
})
app.post('/delete/:id',bodyParsermiddleware ,(req,res) => {
  const match = data.findIndex(item => item.id === req.params.id*1)
  console.log(match)
  if(match!== -1){
    data.splice(match, 1)
    res.redirect('/')
  }else{
    res.status(400)
    res.send('400 bad request')
  }
})

app.listen(3000, () => {
  console.log('listening...')
})
