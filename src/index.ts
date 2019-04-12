interface TouchstoneData {
  options: Options
  data: Array<SParamData>
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
    // default options
    const freqUnit = 'GHZ'
    const paramType = 'S'
    const format = 'MA'
    const z0 = 50

    return {
      options: {
        freqUnit,
        paramType,
        format,
        z0
      },
      data: []
    }
  }
}

export { Network as default }
