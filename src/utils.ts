export const getRandomInt = (max: number) => Math.floor(Math.random() * max)

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
