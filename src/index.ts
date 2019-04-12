interface TouchstoneData {
  freqUnit: string
  paramType: string
  format: string
  z0: number
  data: Array<SParamData>
}

interface SParamData {
  freq: number,
  data: Array<number>
}

class Network {
  private _touchstoneText: string
  private _touchstoneData: TouchstoneData

  get touchstoneText() {
    return this._touchstoneText
  }

  get z0() {
    return this._touchstoneData.z0
  }

  constructor(touchstoneText: string) {
    this._touchstoneText = touchstoneText
    this._touchstoneData = this.parseTouchstoneText(touchstoneText)
  }

  private parseTouchstoneText(text: string): TouchstoneData {
    // default options
    const freqUnit = 'GHz'
    const paramType = 'S'
    const format = 'MA'
    const z0 = 50

    return {
      freqUnit,
      paramType,
      format,
      z0,
      data: []
    }
  }
}

export { Network as default }
