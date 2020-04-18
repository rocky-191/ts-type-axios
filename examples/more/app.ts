import axios from '../../src/axios'

// tslint:disable-next-line: no-floating-promises
axios.post('/more/post',{
  a:1
},{
  auth:{
    username:'tom',
    password:'1'
  }
}).then(res=>{
  console.log(res)
})
