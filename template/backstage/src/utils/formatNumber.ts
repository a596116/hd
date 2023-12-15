export const formatNumber = (originNumber: number, prefix = 'NTD') => {
  const options: Intl.NumberFormatOptions =
    { minimumFractionDigits: 1, maximumFractionDigits: 4 }
  if (!!prefix) {
    options.style = 'currency'
    options.currency = prefix === 'NTD' ? 'TWD' : prefix
  }
  const result =
    !!originNumber || typeof originNumber === 'number'
      ? Number(originNumber).toLocaleString('zh-TW', options)
      : ''
  return result.split('.')[0].replace("$", "$ ")
}

export const toNumber = (originNumber: string) => {
  const result = Number(parseFloat(originNumber.replace(/[^0-9.-]+/g, "")))
  return result
}