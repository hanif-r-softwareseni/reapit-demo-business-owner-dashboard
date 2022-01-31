import currency from 'currency.js'

export const pound = (num: number): string => {
  const formattedNumber = currency(num, {
    symbol: '£', 
    separator: ',', 
    decimal: '.', 
    precision: 2
  }).format()

  return formattedNumber
}