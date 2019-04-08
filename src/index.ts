// import { OptionsValues } from './interfaces'

class Network {
  static loadSparams(event: Event): Promise<string> {
    // check if file exists and create, otherwise throw an error
    const eventTarget = <HTMLInputElement>event.target
    const fileList = eventTarget.files

    if (!fileList) {
      throw new Error('File does not exist on input')
    }

    const file = fileList[0]

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

    return new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        // since our file reader reads as text, we expect a string isntead of arrayBuffer
        resolve(<string>reader.result)
      }
      reader.onerror = () => {
        reject('Failed to load file')
      }
    })
  }
}

// const loadSparams = (event: Event): Promise<OptionsValues> => {
//   // check if file exists and create, otherwise throw an error
//   const eventTarget = <HTMLInputElement>event.target
//   const fileList = eventTarget.files

//   if (!fileList) {
//     throw new Error('File does not exist on input')
//   }

//   const file = fileList[0]

//   // setup file reader
//   const reader = new FileReader()
//   reader.readAsText(file)

//   // get file type and number of ports to verify proper data formate
//   const fileType = file.name.split('.').pop()
//   if (!fileType) {
//     throw new Error('File extension could not be extracted')
//   }
//   const digitMatch = fileType.match(/\d+/g)
//   if (!digitMatch) {
//     throw new Error('Could not extract number of ports from file extension')
//   }
//   const nPorts: number = +digitMatch[0]

//   return new Promise<OptionsValues>((resolve, reject) => {
//     reader.onload = () => {
//       // since our file reader reads as text, we expect a string isntead of arrayBuffer
//       const fileText = <string>reader.result
//       console.log(fileText)
//       const textArray = fileText.split('\n')

//       let optionsIndex: number | null = null // index of options line beginning with #
//       let dataIndex: number | null = null // start index of actual data

//       for (let i = 0; i < textArray.length; i++) {
//         if (textArray[i][0] === '#') {
//           optionsIndex = i
//         }
//         if (
//           optionsIndex && // we've already found options
//           textArray[i] && // the line has text
//           i > optionsIndex && // we're past the options index
//           textArray[i][0] !== '!' // it's not a comment line (can be comment after options, eww)
//         ) {
//           // start of data which needs to be handled different for different
//           // values of nPort
//           dataIndex = i
//           break
//         }
//       }

//       // parse options into desired formats
//       if (!optionsIndex) {
//         throw new Error('Could not find an options line in file')
//       }
//       const options = parseOptions(textArray[optionsIndex])
//       resolve(options)
//     }
//   })
// }

// const parseOptions = (optionsString: string): OptionsValues => {
//   const options = {
//     freqUnit: 'GHz',
//     paramType: 'S',
//     format: 'MA',
//     Z0: 50
//   }
//   return options
// }

export { Network as default }
