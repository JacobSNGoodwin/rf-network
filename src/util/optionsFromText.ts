import { Options } from '../interfaces'

export default function optionsFromText(optionsLine: string): Options {
  const options: Options = {
    freqUnit: 'GHZ',
    paramType: 'S',
    importFormat: 'MA',
    z0: 50
  }

  // split tokens and trim whitespace
  const optionsArray = optionsLine
    .trim()
    .toUpperCase()
    .split(/\s+/)

  while (optionsArray.length > 0) {
    // shift elements out of array as they're found
    const option = optionsArray[0]
    if (option === '#') {
      optionsArray.shift()
    } else if (
      option === 'GHZ' ||
      option === 'MHZ' ||
      option === 'KHZ' ||
      option === 'HZ'
    ) {
      options.freqUnit = <string>optionsArray.shift()
    } else if (
      option === 'S' ||
      option === 'Y' ||
      option === 'Z' ||
      option === 'H' ||
      option === 'G'
    ) {
      options.paramType = <string>optionsArray.shift()
      // if (options.paramType !== 'S') {
      //   throw new Error('Currently only S-parameters are supported')
      // }
    } else if (option === 'DB' || option === 'MA' || option === 'RI') {
      options.importFormat = <string>optionsArray.shift()
    } else if (option === 'R') {
      optionsArray.shift()
      options.z0 = +(<string>optionsArray.shift())
    } else {
      optionsArray.shift()
    }
  }

  return options
}
