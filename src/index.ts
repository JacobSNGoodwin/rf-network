interface TouchstoneData {
  nPorts: number | null
  options: Options
  data: Array<SParamData> | null
}

interface Options {
  freqUnit: string
  paramType: string
  format: string
  z0: number
}

interface SParamData {
  freq: number
  data: Array<number>
}

class Network {
  private _touchstoneText: string
  private _touchstoneData: TouchstoneData

  get touchstoneText() {
    return this._touchstoneText
  }

  get options() {
    return this._touchstoneData.options
  }

  constructor(touchstoneText: string) {
    this._touchstoneText = touchstoneText
    this._touchstoneData = this.parseTouchstoneText(touchstoneText)
  }

  private parseTouchstoneText(text: string): TouchstoneData {
    let data = null
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

    return {
      nPorts,
      options,
      data
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
}

export { Network as default }
