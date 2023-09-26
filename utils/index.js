// 替换url指定参数 如a=100替换为a=dsfsd
export function replaceQueryString(url, name, value) {
  const reg = new RegExp(name + '=[^&]*', 'gi')
  return url.replace(reg, name + '=' + value)
}

// 删除url指定参数
export function removeParam(key, sourceUrl) {
  const url = new URL(sourceUrl)
  url.searchParams.delete(key)
  return url.toString()
}

// 添加url指定参数
export function addParam(key, value, sourceUrl) {
  const url = new URL(sourceUrl)
  url.searchParams.append(key, value)
  return url.toString()
}