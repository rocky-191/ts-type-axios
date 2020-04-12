import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types'
import { parseHeaders } from '../helpers/header'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout, cancelToken } = config
    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url, true)
    processCancle()

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }

      if (request.status === 0) {
        return
      }
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      // const responseHeaders=request.getAllResponseHeaders()
      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    function processCancle(): void {
      if (cancelToken) {
        // tslint:disable-next-line: no-floating-promises
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status <= 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }

    if (responseType) {
      request.responseType = responseType
    }

    request.onerror = function handleError() {
      reject(createError('Network error', config, null, request))
    }

    if (timeout) {
      request.timeout = timeout
    }
    request.ontimeout = function handletimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    Object.keys(headers).forEach(name => {
      // 当我们传入的 data 为空的时候，请求 header 配置 Content-Type 是没有意义的
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}
