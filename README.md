# RF-Network

A javascript class for holding data from Touchstone v1 files.

## Usage

You will need to parse the Touchstone file into a string before using this class. This can be done in browser java script with an input of type file, or in node using fs.readFile().

To load the stringified touchstone file into the Network class, use the following.

The filename is passed to the Network constructor to simplify determining the number of ports and then error checking.

```
import Network from 'rf-network'

const network = new Network(touchStoneFileString: string, fileName: string)

network.data // returns an array of network data
```

## Structure of network.data

Network.data is an array of frequency points, []FreqPoint.

FreqPoint us of the following format:
  - FreqPoint.freq: number
  - FreqPoint.s: math.Complex[][]

By default, the S-parameters will be converted to complex number format (R/I format).

The S-parameters are zero-indexed. As an example, if you load an .s2p (two-port) S-parameter file, you would get S21 by accessing S[1][0] at a particular array element.

## Properties and Setters

You can currently access the following properties on the Network class.

```
network.touchstoneText // string text from the touchstone file

network.label // a label for the plot, can be changed with setLabel

network.fileName // the original file name

data // the array of network data
   
nPorts // the number of ports

freqUnit // frequency unit, ie, GHz

paramType // S, Y, Z - currently only supports S-params

z0 - The characteristic impedance   

setLabel(newLabel: string) // give a new label to the plot
   
```