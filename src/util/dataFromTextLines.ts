import math from 'mathjs'

import { NetworkData, Options } from '../interfaces'

export default function dataFromTextLines(
  dataLines: string[],
  options: Options,
  nPorts: number
): NetworkData {
  // number of data lines per frequency
  let linesPerFreq = 1 // for 1 or two ports

  if (nPorts > 2) {
    // need to make this computation as only data for 4 parameters can be handled per line
    linesPerFreq = nPorts * Math.ceil(nPorts / 4)
  }

  let data: NetworkData = {
    freq: [],
    s: new Array(nPorts)
  }

  // initialize the data array
  for (let i = 0; i < data.s.length; i++) {
    data.s[i] = new Array(nPorts)
    for (let j = 0; j < data.s[i].length; j++) {
      data.s[i][j] = new Array()
    }
  }

  // split by any number of white space
  const splitter = new RegExp('\\s+')

  // create a function to map data to complex dataType of real and imaginary
  const toComplex = (term1: number, term2: number): math.Complex => {
    if (options.importFormat === 'MA') {
      const angle = (term2 * Math.PI) / 180
      return math.complex(<math.PolarCoordinates>{ r: term1, phi: angle })
    } else if (options.importFormat === 'DB') {
      const linMag = Math.pow(10, term1 / 20)
      const angle = (term2 * Math.PI) / 180
      return math.complex(<math.PolarCoordinates>{ r: linMag, phi: angle })
    } else if (options.importFormat === 'RI') {
      return math.complex(<math.Complex>{ re: term1, im: term2 })
    } else {
      throw new Error('Unknown data format type.')
    }
  }

  while (dataLines.length >= linesPerFreq) {
    const singleFreq = dataLines
      .splice(0, linesPerFreq)
      .join(' ')
      .trim()
      .split(splitter)

    if (!singleFreq || singleFreq.length < 2 * nPorts * nPorts) {
      // end parsing if we have any line without full data
      break
    }

    // get the frequencyfrom data line
    const freq = +(<string>singleFreq.shift())
    data.freq.push(freq)

    // let s = <math.Matrix>math.zeros(nPorts, nPorts)
    // remember that for n = 2, the its [[S11, S21], [S12, S22]]
    if (nPorts === 1) {
      data.s[0][0].push(toComplex(+singleFreq[0], +singleFreq[1]))
    } else if (nPorts === 2) {
      data.s[0][0].push(toComplex(+singleFreq[0], +singleFreq[1]))
      data.s[0][1].push(toComplex(+singleFreq[4], +singleFreq[5]))
      data.s[1][0].push(toComplex(+singleFreq[2], +singleFreq[3]))
      data.s[1][1].push(toComplex(+singleFreq[6], +singleFreq[7]))
    } else {
      for (let i = 0; i < nPorts; i++) {
        for (let j = 0; j < nPorts; j++) {
          data.s[i][j].push(
            toComplex(
              +singleFreq[2 * (3 * i + j)],
              +singleFreq[2 * (3 * i + j) + 1]
            )
          )
        }
      }
    }
  }

  return data
}
