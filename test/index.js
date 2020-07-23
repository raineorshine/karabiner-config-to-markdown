const test = require('ava')
const fs = require('fs')
const path = require('path')
const karabinerConfigToMarkdown = require('../index')

test('test', t => {
  const config = require('./karabiner.json')
  const expected = fs.readFileSync(path.join(__dirname, 'expected.txt'), 'utf-8')
  const output = karabinerConfigToMarkdown(config)
  t.is(output, expected)
})

test('shifted char', t => {
  const config = require('./shiftedChar.json')
  const output = karabinerConfigToMarkdown(config)
  t.is(output, `- test
  - L-Shift + L-Option + \`l\` → \`{\`
`)
})

test('shifted tilde', t => {
  const config = require('./shiftedTilde.json')
  const output = karabinerConfigToMarkdown(config)
  t.is(output, `- test
  - L-Option + \`f\` → \`~\`
`)
})
