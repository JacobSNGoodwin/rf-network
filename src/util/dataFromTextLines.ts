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
    // this if the reason for the horrifying nPorts = 2 block
    if (nPorts === 1) {
      const sAtFreq = toAllS(+singleFreq[0], +singleFreq[1])
      data.s[0][0].sRe.push(sAtFreq.sRe)
      data.s[0][0].sIm.push(sAtFreq.sIm)
      data.s[0][0].sMag.push(sAtFreq.sMag)
      data.s[0][0].sDb.push(sAtFreq.sDb)
      data.s[0][0].sAngle.push(sAtFreq.sAngle)
      data.s[0][0].sDeg.push(sAtFreq.sDeg)

      // set min and max for each type with util function
      data.s[0][0].sReMax = getMax(data.s[0][0].sReMax, sAtFreq.sRe)
      data.s[0][0].sReMin = getMin(data.s[0][0].sReMin, sAtFreq.sRe)

      data.s[0][0].sImMax = getMax(data.s[0][0].sImMax, sAtFreq.sIm)
      data.s[0][0].sImMin = getMin(data.s[0][0].sImMin, sAtFreq.sIm)

      data.s[0][0].sMagMax = getMax(data.s[0][0].sMagMax, sAtFreq.sMag)
      data.s[0][0].sMagMin = getMin(data.s[0][0].sMagMin, sAtFreq.sMag)

      data.s[0][0].sDbMax = getMax(data.s[0][0].sDbMax, sAtFreq.sDb)
      data.s[0][0].sDbMin = getMin(data.s[0][0].sDbMin, sAtFreq.sDb)

      data.s[0][0].sAngleMax = getMax(data.s[0][0].sAngleMax, sAtFreq.sAngle)
      data.s[0][0].sAngleMin = getMin(data.s[0][0].sAngleMin, sAtFreq.sAngle)

      data.s[0][0].sDegMax = getMax(data.s[0][0].sDegMax, sAtFreq.sDeg)
      data.s[0][0].sDegMin = getMin(data.s[0][0].sDegMin, sAtFreq.sDeg)
    } else if (nPorts === 2) {
      const sAtFreq_00 = toAllS(+singleFreq[0], +singleFreq[1])
      const sAtFreq_01 = toAllS(+singleFreq[4], +singleFreq[5])
      const sAtFreq_10 = toAllS(+singleFreq[2], +singleFreq[3])
      const sAtFreq_11 = toAllS(+singleFreq[6], +singleFreq[7])

      // s11/s[0][0]
      data.s[0][0].sRe.push(sAtFreq_00.sRe)
      data.s[0][0].sIm.push(sAtFreq_00.sIm)
      data.s[0][0].sMag.push(sAtFreq_00.sMag)
      data.s[0][0].sDb.push(sAtFreq_00.sDb)
      data.s[0][0].sAngle.push(sAtFreq_00.sAngle)
      data.s[0][0].sDeg.push(sAtFreq_00.sDeg)

      // set min and max for each type with util function
      data.s[0][0].sReMax = getMax(data.s[0][0].sReMax, sAtFreq_00.sRe)
      data.s[0][0].sReMin = getMin(data.s[0][0].sReMin, sAtFreq_00.sRe)
      data.s[0][0].sImMax = getMax(data.s[0][0].sImMax, sAtFreq_00.sIm)
      data.s[0][0].sImMin = getMin(data.s[0][0].sImMin, sAtFreq_00.sIm)
      data.s[0][0].sMagMax = getMax(data.s[0][0].sMagMax, sAtFreq_00.sMag)
      data.s[0][0].sMagMin = getMin(data.s[0][0].sMagMin, sAtFreq_00.sMag)
      data.s[0][0].sDbMax = getMax(data.s[0][0].sDbMax, sAtFreq_00.sDb)
      data.s[0][0].sDbMin = getMin(data.s[0][0].sDbMin, sAtFreq_00.sDb)
      data.s[0][0].sAngleMax = getMax(data.s[0][0].sAngleMax, sAtFreq_00.sAngle)
      data.s[0][0].sAngleMin = getMin(data.s[0][0].sAngleMin, sAtFreq_00.sAngle)
      data.s[0][0].sDegMax = getMax(data.s[0][0].sDegMax, sAtFreq_00.sDeg)
      data.s[0][0].sDegMin = getMin(data.s[0][0].sDegMin, sAtFreq_00.sDeg)

      // s12/s[0][1]
      data.s[0][1].sRe.push(sAtFreq_01.sRe)
      data.s[0][1].sIm.push(sAtFreq_01.sIm)
      data.s[0][1].sMag.push(sAtFreq_01.sMag)
      data.s[0][1].sDb.push(sAtFreq_01.sDb)
      data.s[0][1].sAngle.push(sAtFreq_01.sAngle)
      data.s[0][1].sDeg.push(sAtFreq_01.sDeg)

      // set min and max for each type with util function
      data.s[0][1].sReMax = getMax(data.s[0][1].sReMax, sAtFreq_01.sRe)
      data.s[0][1].sReMin = getMin(data.s[0][1].sReMin, sAtFreq_01.sRe)
      data.s[0][1].sImMax = getMax(data.s[0][1].sImMax, sAtFreq_01.sIm)
      data.s[0][1].sImMin = getMin(data.s[0][1].sImMin, sAtFreq_01.sIm)
      data.s[0][1].sMagMax = getMax(data.s[0][1].sMagMax, sAtFreq_01.sMag)
      data.s[0][1].sMagMin = getMin(data.s[0][1].sMagMin, sAtFreq_01.sMag)
      data.s[0][1].sDbMax = getMax(data.s[0][1].sDbMax, sAtFreq_01.sDb)
      data.s[0][1].sDbMin = getMin(data.s[0][1].sDbMin, sAtFreq_01.sDb)
      data.s[0][1].sAngleMax = getMax(data.s[0][1].sAngleMax, sAtFreq_01.sAngle)
      data.s[0][1].sAngleMin = getMin(data.s[0][1].sAngleMin, sAtFreq_01.sAngle)
      data.s[0][1].sDegMax = getMax(data.s[0][1].sDegMax, sAtFreq_01.sDeg)
      data.s[0][1].sDegMin = getMin(data.s[0][1].sDegMin, sAtFreq_01.sDeg)

      // s21/s[1][0]
      data.s[1][0].sRe.push(sAtFreq_10.sRe)
      data.s[1][0].sIm.push(sAtFreq_10.sIm)
      data.s[1][0].sMag.push(sAtFreq_10.sMag)
      data.s[1][0].sDb.push(sAtFreq_10.sDb)
      data.s[1][0].sAngle.push(sAtFreq_10.sAngle)
      data.s[1][0].sDeg.push(sAtFreq_10.sDeg)

      // set min and max for each type with util function
      data.s[1][0].sReMax = getMax(data.s[1][0].sReMax, sAtFreq_10.sRe)
      data.s[1][0].sReMin = getMin(data.s[1][0].sReMin, sAtFreq_10.sRe)
      data.s[1][0].sImMax = getMax(data.s[1][0].sImMax, sAtFreq_10.sIm)
      data.s[1][0].sImMin = getMin(data.s[1][0].sImMin, sAtFreq_10.sIm)
      data.s[1][0].sMagMax = getMax(data.s[1][0].sMagMax, sAtFreq_10.sMag)
      data.s[1][0].sMagMin = getMin(data.s[1][0].sMagMin, sAtFreq_10.sMag)
      data.s[1][0].sDbMax = getMax(data.s[1][0].sDbMax, sAtFreq_10.sDb)
      data.s[1][0].sDbMin = getMin(data.s[1][0].sDbMin, sAtFreq_10.sDb)
      data.s[1][0].sAngleMax = getMax(data.s[1][0].sAngleMax, sAtFreq_10.sAngle)
      data.s[1][0].sAngleMin = getMin(data.s[1][0].sAngleMin, sAtFreq_10.sAngle)
      data.s[1][0].sDegMax = getMax(data.s[1][0].sDegMax, sAtFreq_10.sDeg)
      data.s[1][0].sDegMin = getMin(data.s[1][0].sDegMin, sAtFreq_10.sDeg)

      // s22/s[1][1]
      data.s[1][1].sRe.push(sAtFreq_11.sRe)
      data.s[1][1].sIm.push(sAtFreq_11.sIm)
      data.s[1][1].sMag.push(sAtFreq_11.sMag)
      data.s[1][1].sDb.push(sAtFreq_11.sDb)
      data.s[1][1].sAngle.push(sAtFreq_11.sAngle)
      data.s[1][1].sDeg.push(sAtFreq_11.sDeg)

      // set min and max for each type with util function
      data.s[1][1].sReMax = getMax(data.s[1][1].sReMax, sAtFreq_11.sRe)
      data.s[1][1].sReMin = getMin(data.s[1][1].sReMin, sAtFreq_11.sRe)
      data.s[1][1].sImMax = getMax(data.s[1][1].sImMax, sAtFreq_11.sIm)
      data.s[1][1].sImMin = getMin(data.s[1][1].sImMin, sAtFreq_11.sIm)
      data.s[1][1].sMagMax = getMax(data.s[1][1].sMagMax, sAtFreq_11.sMag)
      data.s[1][1].sMagMin = getMin(data.s[1][1].sMagMin, sAtFreq_11.sMag)
      data.s[1][1].sDbMax = getMax(data.s[1][1].sDbMax, sAtFreq_11.sDb)
      data.s[1][1].sDbMin = getMin(data.s[1][1].sDbMin, sAtFreq_11.sDb)
      data.s[1][1].sAngleMax = getMax(data.s[1][1].sAngleMax, sAtFreq_11.sAngle)
      data.s[1][1].sAngleMin = getMin(data.s[1][1].sAngleMin, sAtFreq_11.sAngle)
      data.s[1][1].sDegMax = getMax(data.s[1][1].sDegMax, sAtFreq_11.sDeg)
      data.s[1][1].sDegMin = getMin(data.s[1][1].sDegMin, sAtFreq_11.sDeg)
    } else {
      for (let i = 0; i < nPorts; i++) {
        for (let j = 0; j < nPorts; j++) {
          const sAtFreq = toAllS(
            +singleFreq[2 * (3 * i + j)],
            +singleFreq[2 * (3 * i + j) + 1]
          )

          data.s[i][j].sRe.push(sAtFreq.sRe)
          data.s[i][j].sIm.push(sAtFreq.sIm)
          data.s[i][j].sMag.push(sAtFreq.sMag)
          data.s[i][j].sDb.push(sAtFreq.sDb)
          data.s[i][j].sAngle.push(sAtFreq.sAngle)
          data.s[i][j].sDeg.push(sAtFreq.sDeg)

          // set min and max for each type with util function
          data.s[i][j].sReMax = getMax(data.s[i][j].sReMax, sAtFreq.sRe)
          data.s[i][j].sReMin = getMin(data.s[i][j].sReMin, sAtFreq.sRe)

          data.s[i][j].sImMax = getMax(data.s[i][j].sImMax, sAtFreq.sIm)
          data.s[i][j].sImMin = getMin(data.s[i][j].sImMin, sAtFreq.sIm)

          data.s[i][j].sMagMax = getMax(data.s[i][j].sMagMax, sAtFreq.sMag)
          data.s[i][j].sMagMin = getMin(data.s[i][j].sMagMin, sAtFreq.sMag)

          data.s[i][j].sDbMax = getMax(data.s[i][j].sDbMax, sAtFreq.sDb)
          data.s[i][j].sDbMin = getMin(data.s[i][j].sDbMin, sAtFreq.sDb)

          data.s[i][j].sAngleMax = getMax(
            data.s[i][j].sAngleMax,
            sAtFreq.sAngle
          )
          data.s[i][j].sAngleMin = getMin(
            data.s[i][j].sAngleMin,
            sAtFreq.sAngle
          )

          data.s[i][j].sDegMax = getMax(data.s[i][j].sDegMax, sAtFreq.sDeg)
          data.s[i][j].sDegMin = getMin(data.s[i][j].sDegMin, sAtFreq.sDeg)
        }
      }
    }
  }

  return data
}

// computes the max of two terms. If a term is undefined/falsy, returns the other term
const getMax = (term1: number, term2: number): number => {
  if (!term1) {
    return term2
  }
  if (!term2) {
    return term1
  }
  return Math.max(term1, term2)
}
// computes the min of two terms. If a term is undefined/falsy, returns the other term
const getMin = (term1: number, term2: number): number => {
  if (!term1) {
    return term2
  }
  if (!term2) {
    return term1
  }
  return Math.min(term1, term2)
}
