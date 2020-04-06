import axios from '../../src/index'

axios({
  method: 'get',
  url: '/simple/get',
  params:{
    a:1
  }
})
