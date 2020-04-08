import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from './types'
import xhr from './xhr'
import { bulidURL } from './helpers/url'
import { transformRequest, transformReponse } from './helpers/data'
import { processHeaders } from './helpers/header'

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then((res: any) => {
    return transformResponseData(res)
  })
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformReponse(res.data)
  return res
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return bulidURL(url, params)
}

export default axios
