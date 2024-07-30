import abi from './contracts/abi.json'
import { faA, faD, faE, faI, faL, faN, faO, faR, faS, faW } from '@fortawesome/free-solid-svg-icons'
import { faHandPaper, faHandRock, faHandScissors } from '@fortawesome/free-regular-svg-icons'

// Sepolia
export const contractAddress: `0x${string}` = '0xa9da7e28e5e9894a71467f33bbc7dc867f8f9855'

export const contractABI = abi

export const choiceIcons = [
  { choice: 'Rock', icon: faHandRock },
  { choice: 'Paper', icon: faHandPaper },
  { choice: 'Scissors', icon: faHandScissors },
]

export const resultsIcons = [
  { result: 'Win', icons: [faW, faI, faN] },
  { result: 'Lose', icons: [faL, faO, faS, faE] },
  { result: 'Draw', icons: [faD, faR, faA, faW] },
]
