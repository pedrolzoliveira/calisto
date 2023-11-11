import { spawn } from 'child_process'

async function initiateDatabase() {
  return new Promise<void>((resolve, reject) => {
    const childProcess = spawn('yarn',  ['prisma', 'db', 'push'], { env: process.env })  

    childProcess.on('exit', resolve)
    childProcess.on('error', reject)
  })
}

export async function setup() {
  if (!process.env.DATABASE_URL?.includes('calisto_test')) {
    throw new Error('Setup must only be run on test database')
  }

  await initiateDatabase()
}