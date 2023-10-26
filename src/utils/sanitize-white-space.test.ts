import assert from 'node:assert'
import test, { describe } from 'node:test'
import { sanitizeWhiteSpace } from './sanitize-white-space'

describe('sanitizeWhiteSpace', () => {
  test('should remove all white spaces', () => {
    assert.strictEqual(
      sanitizeWhiteSpace('\n  this   is  the test \n  '),
      'this is the test'
    )
  })
})
