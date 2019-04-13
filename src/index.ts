import math from 'mathjs'
import { Function, optionalCallExpression } from '@babel/types'

interface Options {
  freqUnit: string
  paramType: string
  importFormat: string
  z0: number
}

interface FreqPoint {
  freq: number
  s: math.Matrix
}

interface RFNetwork {
  data: Array<FreqPoint>
  // options: Options
}

class Network {
  private _touchstoneText: string
  private _networkData: RFNetwork
  private _fileName: string
  private _label: string
  private _nPorts: number
  private _options: Options

  get touchstoneText() {
    return this._touchstoneText
  }

  get label() {
    return this._label
  }

  get fileName() {
    return this._fileName
  }

  get data() {
    return this._networkData.data
  }

  get options() {
    return this._options
  }

  get nPorts() {
    return this._nPorts
  }

  set setLabel(newLabel: string) {
    this._label = newLabel
  }

  constructor(touchstoneText: string, fileName: string) {
    this._touchstoneText = touchstoneText
    this._label = fileName
    this._fileName = fileName

    const fileType = fileName.split('.').pop()
    if (!fileType) {
      throw new Error('Could not determine file type or number of ports')
    }

    const matchArray = fileType.match(/\d+/g)
    if (!matchArray) {
      throw new Error('Could not determine file type or number of ports')
    }

    this._nPorts = +matchArray[0]
    this._options = {
      freqUnit: 'GHZ',
      paramType: 'S',
      importFormat: 'MA',
      z0: 50
    }
    this._networkData = this.parseTouchstoneText(touchstoneText)
  }

  private parseTouchstoneText(text: string): RFNetwork {
    // get text line-by-line
    const textArray = text.split('\n')

    let optionsIndex: number | null = null
    let dataIndex: number | null = null

    for (let i = 0; i < textArray.length; i++) {
      if (textArray[i][0] === '#') {
        optionsIndex = i
      }
      if (
        optionsIndex && // we've already found options
        textArray[i] && // the line has text
        i > optionsIndex && // we're past the options index
        textArray[i][0] !== '!' // it's not a comment line (can be comment after options, eww)
      ) {
        // start of data which needs to be handled different for different
        // values of nPort
        dataIndex = i
        break
      }
    }

    // Check if no options could be found
    if (!optionsIndex) {
      throw new Error('Could not parse options index')
    }
    if (!dataIndex) {
      throw new Error('Could not parse S-parameter data')
    }

    const options = this.parseOptions(textArray[optionsIndex])
    this._options = options
    const data = this.parseData(textArray.slice(dataIndex))

    return {
      data
      // options
    }
  }

  // gets the options from the options line
  private parseOptions(optionsLine: string): Options {
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

  private parseData(dataLines: string[]): Array<FreqPoint> {
    // number of data lines per frequency
    let linesPerFreq = 1 // for 1 or two ports

    if (this.nPorts > 2) {
      // need to make this computation as only data for 4 parameters can be handled per line
      linesPerFreq = this.nPorts * Math.ceil(this.nPorts / 4)
    }

    let data: Array<FreqPoint> = []

    // split by any number of white space
    const splitter = new RegExp('\\s+')

    // create a function to map data to complex dataType of real and imaginary
    const toComplex = (term1: number, term2: number): math.Complex => {
      if (this.options.importFormat === 'MA') {
        const angle = (term2 * Math.PI) / 180
        return math.complex(<math.PolarCoordinates>{ r: term1, phi: angle })
      } else if (this.options.importFormat === 'DB') {
        const linMag = Math.pow(10, term1 / 20)
        const angle = (term2 * Math.PI) / 180
        return math.complex(<math.PolarCoordinates>{ r: linMag, phi: angle })
      } else if (this.options.importFormat === 'RI') {
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

      if (!singleFreq || singleFreq.length < 2 * this.nPorts * this.nPorts) {
        // end parsing if we have any line without full data
        break
      }
      const freq = +(<string>singleFreq.shift())
      let s = <math.Matrix>math.zeros(this.nPorts, this.nPorts)
      // remember that for n = 2, the its [[S11, S21], [S12, S22]]
      if (this.nPorts === 1) {
        s.subset(math.index(0, 0), toComplex(+singleFreq[0], +singleFreq[1]))
      }

      // for (let i = 0; i < s.size()[0]; i++) {
      //   for (let j = 0; j < s.size()[1]; j++) {
      //     s.subset(math.index(i, j), { a: singleFreq[i], b: singleFreq[j] })
      //   }
      // }

      console.log(s.toString())

      data.push({
        freq,
        s
      })
    }

    return data
  }
}

export { Network as default }
