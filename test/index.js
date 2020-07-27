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

test('shifted chars', t => {

  const keyCodes = [
    '[',
    ']',
    'comma',
    'period',
    '`',
  ]

  const shiftedManipulator = key_code => ({
    from: { key_code: '*' },
    to: [{ key_code: key_code, modifiers: ['left_shift'] }]
  })

  const output = karabinerConfigToMarkdown({
    profiles: [{
      complex_modifications: {
        rules: [{
          description: 'test',
          manipulators: keyCodes.map(shiftedManipulator)
        }
      ]}
    }]
  })

  t.is(output, `- test
  - \`*\` → \`{\`
  - \`*\` → \`}\`
  - \`*\` → \`<\`
  - \`*\` → \`>\`
  - \`*\` → \`~\`
`)
})

test('Optional modifiers', t => {

  const shiftedManipulator = key_code => ({
  })

  const output = karabinerConfigToMarkdown({
    profiles: [{
      complex_modifications: {
        rules: [{
          description: 'test',
          manipulators: [{
            from: {
              key_code: 'a',
              modifiers: {
                optional: ['left_shift'],
                mandatory: ['left_option'],
              }
            },
            to: [{ key_code: 'b' }]
          }]
        }
      ]}
    }]
  })

  t.is(output, `- test
  - [L-Shift] + L-Option + \`a\` → \`b\`
`)
})
