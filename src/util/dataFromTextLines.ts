import math from 'mathjs'

import { NetworkData, Options, SData, AllS } from '../interfaces'

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
  }

  // split by any number of white space
  const splitter = new RegExp('\\s+')

  // create a function to get all Sparameter types from a single
  // type described in the touchstone file
  const toAllS = (term1: number, term2: number): AllS => {
    if (options.importFormat === 'MA') {
      const angle = (term2 * Math.PI) / 180
      return {
        sRe: term1 * math.cos(angle),
        sIm: term1 * math.sin(angle),
        sMag: term1,
        sDb: 20 * math.log10(term1),
        sAngle: angle,
        sDeg: term2
      }
    } else if (options.importFormat === 'DB') {
      const linMag = Math.pow(10, term1 / 20)
      const angle = (term2 * Math.PI) / 180
      return {
        sRe: linMag * math.cos(angle),
        sIm: linMag * math.sin(angle),
        sMag: linMag,
        sDb: term1,
        sAngle: angle,
        sDeg: term2
      }
    } else if (options.importFormat === 'RI') {
      const linMag = math.sqrt(term1 * term1 + term2 * term2)
      const angle = math.atan2(term2, term1)
      return {
        sRe: term1,
        sIm: term2,
        sMag: linMag,
        sDb: 20 * math.log10(linMag),
        sAngle: angle,
        sDeg: (angle * 180) / Math.PI
      }
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
      const sAtFreq = toAllS(+singleFreq[0], +singleFreq[1])
      // data.s[0][0].push(toAllS(+singleFreq[0], +singleFreq[1]))
    } else if (nPorts === 2) {
      // data.s[0][0].push(toAllS(+singleFreq[0], +singleFreq[1]))
      // data.s[0][1].push(toAllS(+singleFreq[4], +singleFreq[5]))
      // data.s[1][0].push(toAllS(+singleFreq[2], +singleFreq[3]))
      // data.s[1][1].push(toAlls(+singleFreq[6], +singleFreq[7]))
    } else {
      for (let i = 0; i < nPorts; i++) {
        for (let j = 0; j < nPorts; j++) {
          // data.s[i][j].push(
          //   toAllS(
          //     +singleFreq[2 * (3 * i + j)],
          //     +singleFreq[2 * (3 * i + j) + 1]
          //   )
          // )
        }
      }
    }
  }

  return data
}
