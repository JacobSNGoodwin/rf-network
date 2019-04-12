interface TouchstoneData {
  data: Array<FreqPoint> | null
}

interface Options {
  freqUnit: string
  paramType: string
  format: string
  z0: number
}

interface FreqPoint {
  freq: number
  s: Array<number> // may change to mathjs matrix
}

type RFNetwork = TouchstoneData & Options

class Network {
  private _touchstoneText: string
  private _networkData: RFNetwork
  private _name: string
  private _fileType: string
  private _nPorts: number

  get touchstoneText() {
    return this._touchstoneText
  }

  get name() {
    return this._name
  }

  get network() {
    return this._networkData
  }

  get nPorts() {
    return this._nPorts
  }

  set setName(newName: string) {
    this._name = newName
  }

  constructor(touchstoneText: string, fileName: string) {
    this._touchstoneText = touchstoneText
    this._networkData = this.parseTouchstoneText(touchstoneText)
    this._name = fileName

    const fileType = fileName.split('.').pop()
    if (!fileType) {
      throw new Error('Could not determine file type or number of ports')
    }
    this._fileType = fileType

    const matchArray = fileType.match(/\d+/g)
    if (!matchArray) {
      throw new Error('Could not determine file type or number of ports')
    }

    this._nPorts = +matchArray[0]
  }

  private parseTouchstoneText(text: string): RFNetwork {
    let nPorts = null

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
    const data = this.parseData(textArray.slice(dataIndex))

    // return final object of type RFNetwork, need to spread inner data to do so
    return {
      data,
      ...options
    }
  }

  // gets the options from the options line
  private parseOptions(optionsLine: string): Options {
    const options: Options = {
      freqUnit: 'GHZ',
      paramType: 'S',
      format: 'MA',
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
        if (options.paramType !== 'S') {
          throw new Error('Currently only S-parameters are supported')
        }
      } else if (option === 'DB' || option === 'MA' || option === 'RI') {
        options.format = <string>optionsArray.shift()
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
    const line1 = dataLines[0].trim()
    const line2 = dataLines[2].trim()
    // split by any number of white space
    const splitter = new RegExp('\\s+')
    const length1 = line1.split(splitter).length
    const length2 = line2.split(splitter).length

    // compute number of ports from above-computed column lengths
    let nPorts: number
    if (length1 === 9 && length2 === 9) {
      // because touchstone spec is annoying for two ports
      nPorts = 2
    } else {
      nPorts = (length1 - 1) / 2
    }

    // number of data lines per frequency
    const linesPerFreq = nPorts === 2 ? 1 : nPorts
    let data: Array<FreqPoint> = []

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
      const freq = +(<string>singleFreq.shift())
      // console.log(singleFreq)
      data.push({
        freq,
        s: []
      })
    }

    return data
  }
}

export { Network as default }
