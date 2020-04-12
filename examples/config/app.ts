import axios, {AxiosTransformer} from '../../src/index'
import qs from 'qs'

const instance = axios.create({
  transformRequest: [
    (function (data) {
      return qs.stringify(data);
    }),
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    function (data) {
      if (typeof data === 'object') {
        data.b = 2;
      }
      return data;
    }
  ],
});

// tslint:disable-next-line: no-floating-promises
instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then(response => {
  console.log(response.data);
});
