import math from 'mathjs'

import { Options, FreqPoint } from './interfaces'

import optionsFromText from './util/optionsFromText'
import dataFromTextLines from './util/dataFromTextLines'

class Network {
  private _touchstoneText: string
  private _networkData: FreqPoint[]
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
    return this._networkData
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

  private parseTouchstoneText(text: string): FreqPoint[] {
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

    this._options = this.parseOptions(textArray[optionsIndex])
    const data = this.parseData(textArray.slice(dataIndex))

    return data
  }

  // gets the options from the options line
  private parseOptions = (textLine: string) => optionsFromText(textLine)
  private parseData = (dataLines: string[]) =>
    dataFromTextLines(dataLines, this.options, this.nPorts)
}

export { Network as default }
