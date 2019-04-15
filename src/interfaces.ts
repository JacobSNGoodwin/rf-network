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

export { Options, FreqPoint }
