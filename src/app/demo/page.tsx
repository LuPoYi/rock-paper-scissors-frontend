'use client'

import { useState } from 'react'

import ChoiceButton from '@/components/ChoiceButton'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { choiceIcons, contractABI, contractAddress, resultsIcons } from '@/constants'
import { decodeEventLog } from 'viem'
import { delay, getRandomInt } from '@/utils'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import toast, { Toaster } from 'react-hot-toast'
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi'
import { useSearchParams } from 'next/navigation'

const choices = ['rock', 'paper', 'scissors']
const results = ['win', 'lose', 'draw']

const determineResult = (playerChoice: number, contractChoice: number): number => {
  if (playerChoice === contractChoice) return 2 // draw

  const isWin =
    (playerChoice === 0 && contractChoice === 2) ||
    (playerChoice === 1 && contractChoice === 0) ||
    (playerChoice === 2 && contractChoice === 1)

  return isWin ? 0 : 1
}

export default function Home() {
  const [isConfirming, setIsConfirming] = useState(false)
  const [gameResult, setGameResult] = useState<{
    playerChoice?: number
    contractChoice?: number
    result?: number
  }>({})

  const handleChoice = async (choiceIndex: number) => {
    setGameResult({ playerChoice: choiceIndex })
    setIsConfirming(true)

    await delay(3000)

    const contractChoice = getRandomInt(3)
    const result = determineResult(choiceIndex, contractChoice)
    setGameResult((state) => ({ ...state, contractChoice, result }))
    setIsConfirming(false)
  }

  const handleReset = () => setGameResult({})

  return (
    <main className="flex min-h-screen flex-col items-center gap-y-7 p-6 md:p-18">
      <h1 className="text-4xl font-bold">Rock Paper Scissors - DEMO</h1>

      <div className="card bg-green-300 w-full max-w-3xl">
        <div className="card-body">
          <h2 className="card-title">Make your choose</h2>
          <div className="flex justify-between">
            {choices.map((choice, choiceIndex) => (
              <ChoiceButton key={choice} choiceIndex={choiceIndex} onChoice={handleChoice} />
            ))}
          </div>
        </div>
      </div>

      <div className="card bg-blue-300 w-full max-w-3xl">
        <div className="card-body">
          <h2 className="card-title">Game Board</h2>

          {gameResult?.playerChoice !== undefined && (
            <div className="flex justify-between">
              <div>
                <div className="text-slate-800 mb-2 text-center">You</div>
                {gameResult?.playerChoice !== undefined && (
                  <div className="w-24 h-24 flex flex-row items-center rounded-full justify-center bg-slate-200">
                    <FontAwesomeIcon
                      icon={choiceIcons[gameResult.playerChoice].icon}
                      className="text-5xl"
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="text-slate-800 mb-2 text-center">Result</div>
                {isConfirming ? (
                  <div className="flex h-24 w-24 justify-center">
                    <span className="loading loading-dots loading-lg" />
                  </div>
                ) : (
                  <div className="flex">
                    {gameResult?.result !== undefined &&
                      resultsIcons[gameResult.result].icons.map((icon, index) => (
                        <div
                          key={index}
                          className="w-24 h-24 flex flex-row items-center rounded-full justify-center bg-slate-200"
                        >
                          <FontAwesomeIcon icon={icon} className="text-5xl" />
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div>
                <div className="text-slate-800 mb-2 text-center">Contract</div>
                {gameResult?.contractChoice !== undefined ? (
                  <div className="w-24 h-24 flex flex-row items-center rounded-full justify-center bg-slate-200">
                    <FontAwesomeIcon
                      icon={choiceIcons[gameResult.contractChoice].icon}
                      className="text-5xl"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 flex flex-row items-center rounded-full justify-center bg-slate-200">
                    <FontAwesomeIcon icon={faQuestion} className="text-5xl" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="btn btn-outline btn-info" onClick={handleReset}>
        Reset
      </button>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
        }}
      />
    </main>
  )
}
