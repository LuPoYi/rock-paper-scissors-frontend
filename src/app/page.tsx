'use client'

import { useState } from 'react'

import ChoiceButton from '@/components/ChoiceButton'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { choiceIcons, contractABI, contractAddress, resultsIcons } from '@/constants'
import { decodeEventLog } from 'viem'
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

export default function Home() {
  const searchParams = useSearchParams()

  const { address } = useAccount()
  const { data: hash, writeContract } = useWriteContract()

  const isDebugMode = !!searchParams.get('debug')

  const [gameResult, setGameResult] = useState<{
    player?: string
    playerChoice?: number
    contractChoice?: number
    result?: number
  }>({})

  const handleChoice = async (choiceIndex: number) => {
    setGameResult({ player: address, playerChoice: choiceIndex })

    try {
      writeContract({
        abi: contractABI,
        address: contractAddress,
        functionName: 'play',
        args: [choiceIndex],
      })

      toast(`You play ${choices[choiceIndex]}...`, { icon: '👏' })
    } catch (error) {
      console.error('Error submit:', error)
    }
  }

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  useWatchContractEvent({
    address: contractAddress,
    abi: contractABI,
    eventName: 'GamePlayed',
    onLogs(logs) {
      for (const { data, topics, transactionHash } of logs) {
        if (transactionHash !== hash) continue

        const decodedLog = decodeEventLog({
          abi: contractABI,
          data: data,
          topics: topics,
        })

        const { player, playerChoice, contractChoice, result } = decodedLog.args as any

        setGameResult({ player, playerChoice, contractChoice, result })

        toast(
          `[${results[result]}] You play ${choices[playerChoice]}, contract play ${choices[contractChoice]}`,
          { icon: '👏' }
        )
      }
    },
  })

  const handleReset = () => setGameResult({})

  return (
    <main className="flex min-h-screen flex-col items-center gap-y-7 p-6 md:p-18">
      <h1 className="text-4xl font-bold">Rock Paper Scissors</h1>
      <div className="py-4">
        <ConnectButton />
      </div>

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

      {isDebugMode && (
        <div className="bg-red-300">
          {gameResult && (
            <>
              <div>result: {results[gameResult.result!]}</div>
              <div>user choice: {choices[gameResult.playerChoice!]}</div>
              <div>contract choice: {choices[gameResult.contractChoice!]}</div>
            </>
          )}

          <div>{hash}</div>
        </div>
      )}

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
