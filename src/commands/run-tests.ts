import { spec } from 'node:test/reporters';
import { run } from 'node:test';
import process from 'node:process';
import { glob } from 'glob';
import { tearDown } from '../test-utils/tear-down';
import { setup } from '../test-utils/setup';

async function runTests(args: string[]) {
  const files = await glob('**/*.test.ts', { ignore: 'node_modules/**' })
  const testStream = run({
    only: args.includes('--only'),
    watch: args.includes('--watch'),
    setup,
    files,
  })

  testStream.compose(new spec).pipe(process.stdout)
  testStream.on('end', tearDown)
}

runTests(process.argv)