interface TouchstoneData {
  // freqUnit: string
  // paramType: string
  // format: string
  Z0: number
}

class Network {
  private _touchstoneText: string
  private _touchstoneData: TouchstoneData

  get touchstoneText() {
    return this._touchstoneText
  }

  get refImpedance() {
    return this._touchstoneData.Z0
  }

  constructor(touchstoneText: string) {
    this._touchstoneText = touchstoneText
    this._touchstoneData = this.parseTouchstoneText(touchstoneText)
  }

  private parseTouchstoneText(text: string): TouchstoneData {
    return {
      Z0: 50
    }
  }
}

export { Network as default }
