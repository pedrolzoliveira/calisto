import { spawn } from 'child_process'

async function initiateDatabase() {
  return await new Promise<void>((resolve, reject) => {
    const childProcess = spawn('yarn', ['prisma', 'db', 'push', '--accept-data-loss'], { env: process.env })

    childProcess.on('exit', (code) => {
      switch (code) {
        case 0:
          resolve()
          break
        default:
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          reject(new Error(`Database setup failed with code ${code}`))
      }
    })
  })
}

export async function setup() {
  if (!process.env.DATABASE_URL?.includes('calisto_test')) {
    throw new Error('Setup must only be run on test database')
  }

  await initiateDatabase()
}
