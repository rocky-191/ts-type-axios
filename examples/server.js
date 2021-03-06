const path=require('path')
const express=require('express')
const router=express.Router()
const bodyParser=require('body-parser')
const webpack=require('webpack')
const webpackDevMiddleware=require('webpack-dev-middleware')
const webpackHotMiddleware=require('webpack-hot-middleware')
const WebpackConfig=require('./webpack.config')
const atob=require('atob')
const multipart=require('connect-multiparty')

const app=express()
const compiler=webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler,{
  publicPath: '/__build__/',
  stats:{
    colors:true,
    chunks:false
  }
}))

app.use(express.static(__dirname, {
  setHeaders (res) {
    res.cookie('XSRF-TOKEN-D', '1234abc')
  }
}))

app.use(multipart({
  uploadDir: path.resolve(__dirname, 'upload-file')
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

router.get('/simple/get',function(req,res){
  res.json({
    msg:'hello world'
  })
})

router.get('/base/get',function(req,res){
  res.json(req.query)
})

router.post('/base/post',function(req,res){
  res.json(req.body)
})

router.post('/base/buffer',function(req,res){
  let msg=[]
  req.on('data',chunk=>{
    if(chunk){
      msg.push(chunk)
    }
  })
  req.on('end',()=>{
    let buf=Buffer.concat(msg);
    res.json(buf.toJSON())
  })
})

router.get('/error/get',function(req,res){
  if(Math.random()>0.5){
    res.json('hello world')
  }else{
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout',function(req,res){
  setTimeout(()=>{
    res.json('hello world')
  },3000)
})

router.post('/extend/post',function(req,res){
  setTimeout(()=>{
    res.json('success')
  },3000)
})

router.get('/extend/get',function(req,res){
  res.json('extend get success')
})

router.delete('/extend/delete',function(req,res){
  res.json('extend delete success')
})

router.put('/extend/put',function(req,res){
  res.json('extend put success')
})

router.get('/interceptor/get',function(req,res){
  res.json(res.data)
})

router.post('/config/post',function(req,res){
  res.json(req.headers)
})

router.get('/cancel/get',function(req,res){
  res.json('cancel get')
})

router.post('/cancel/post',function(req,res){
  res.json('cancel post')
})

router.post('/more/post',function(req,res){
  const auth=req.headers.authorization
  const [type,credentials]=auth.split(' ')
  console.log(atob(credentials))
  const [username,password]=atob(credentials).split(':')
  if (type === 'Basic' && username === 'Yee' && password === '123456') {
    res.json(req.body)
  } else {
    res.end('UnAuthorization')
  }
})

router.get('/more/get',function(req,res){
  res.json('success')
})

router.get('/more/A',function(req,res){
  res.json('more a success')
})

router.get('/more/B',function(req,res){
  res.json('more b success')
})

router.post('/more/upload', function(req, res) {
  console.log(req.body, req.files)
  res.end('upload success!')
})

router.get('/more/304', function(req, res) {
  res.status(304)
  res.end()
})

router.get('http://127.0.0.1:8088/more/server2',function(req,res){
  res.end('跨域')
})

app.use(router)

const port=process.env.PORT || 8080
module.exports=app.listen(port,()=>{
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
