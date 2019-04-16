interface Options {
  freqUnit: string
  paramType: string
  importFormat: string
  z0: number
}

interface FreqPoint {
  freq: number
  s: math.Complex[][]
}

export { Options, FreqPoint }
