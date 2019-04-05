import { OptionsValues } from './interfaces'

const loadSparams = (file: File): Promise<OptionsValues> => {
  // setup file reader
  const reader = new FileReader()
  reader.readAsText(file)

  // get file type and number of ports to verify proper data formate
  const fileType = file.name.split('.').pop()
  if (!fileType) {
    throw new Error('File extension could not be extracted')
  }
  const digitMatch = fileType.match(/\d+/g)
  if (!digitMatch) {
    throw new Error('Could not extract number of ports from file extension')
  }
  const nPorts: number = +digitMatch[0]

  return new Promise<OptionsValues>((resolve, reject) => {
    reader.onload = () => {
      // since our file reader reads as text, we expect a string isntead of arrayBuffer
      const fileText = <string>reader.result
      const textArray = fileText.split('\n')

      let optionsIndex: number | null = null // index of options line beginning with #
      let dataIndex: number | null = null // start index of actual data

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

      // parse options into desired formats
      if (!optionsIndex) {
        throw new Error('Could not find an options line in file')
      }
      const options = parseOptions(textArray[optionsIndex])
      resolve(options)
    }
  })
}

const parseOptions = (optionsString: string): OptionsValues => {
  const options = {
    freqUnit: 'GHz',
    paramType: 'S',
    format: 'MA',
    Z0: 50
  }
  return options
}

export { loadSparams }
