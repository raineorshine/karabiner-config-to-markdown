const test = require('ava')
const fs = require('fs')
const path = require('path')
const karabinerConfigToMarkdown = require('../index')

test('all the things', t => {
  const config = require('./karabiner.json')
  const expected = fs.readFileSync(path.join(__dirname, 'expected.txt'), 'utf-8')
  const output = karabinerConfigToMarkdown(config)
  t.is(output, expected)
})

test('layout: colemak', t => {
  const config = require('./colemak.json')
  const output = karabinerConfigToMarkdown(config, { layout: 'colemak' })
  t.is(output, `- test
  - R-Shift + \`s\` → \`open '/Applications/Spotify.app'\`
`)
})
