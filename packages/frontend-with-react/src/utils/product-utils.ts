export const buildUrlWithParams = (params: any, path = '/search') => {
  const paramsAsString = Object.keys(params)
    .map((key) => {
      return `${key}=${params[key]}`
    }, '')
    .join('&')
  return path + '?' + paramsAsString
}
