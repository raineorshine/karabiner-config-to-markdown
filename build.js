const fs = require('fs')
const path = require('path')
const configPath = path.resolve(process.argv[2] || './karabiner.json')
const config = require(configPath)
const readmeTemplate = fs.readFileSync('./readme-template.txt', 'utf-8')

/************************************
 * Constants
 ************************************/

const excludeRules = {
  'Vi Mode: D as Trigger Key': true
}

const keys = {
  close_bracket: ']',
  open_bracket: '[',
  left_arrow: '→',
  right_arrow: '←',
  up_arrow: '↑',
  down_arrow: '↓',
  grave_accent_and_tilde: '` ` `', // double backtick with space to escape
  quote: '\'',
  control: 'Ctrl',
  shift: 'Shift',
  option: 'Option',
  command: 'Command',
  left_control: 'L-Ctrl',
  left_shift: 'L-Shift',
  left_option: 'L-Option',
  left_command: 'L-Command',
  right_control: 'R-Ctrl',
  right_shift: 'R-Shift',
  right_option: 'R-Option',
  right_command: 'R-Command',
}

/************************************
 * Helpers
 ************************************/

const not = f => (...args) => !f(...args)
const indent = s => '  ' + s
const plus = s => s + ' + '

const compose = (...fns) =>
  fns.reduceRight((prev, next) =>
    (...args) => next(prev(...args)),
    x => x
  )

const template = (s, o) => {
  let output = s
  for (const [key, value] of Object.entries(o)) {
    output = output.replace(new RegExp(`\\{\\{\\w*${key}\\w*}}`), value)
  }
  return output
}

/************************************
 * Render
 ************************************/

const Pretty = keyCode => keys[keyCode] || keyCode
const Code = s => `\`${s}\``
const ShellCommand = Code
const Key = compose(Code, Pretty)

const Modifiers = modifiers => {
  // normalize from/to modifiers
  const modifiersArray = Array.isArray(modifiers)
    ? modifiers
    : [...modifiers.mandatory || [], ...modifiers.optional || []]
  return modifiersArray.map(compose(plus, Pretty)).join('')
}

/** Renders a manipulator's to' or 'from' entry. */
const ManipulatorEntry = entry =>
  `${entry.modifiers ? Modifiers(entry.modifiers) : ''}${
    entry.key_code ? Key(entry.key_code) :
    (entry.shell_command ? ShellCommand(entry.shell_command) :
    ''
  )}`

const Manipulator = manipulator => {
  return `${ManipulatorEntry(manipulator.from)} → ${manipulator.to.map(ManipulatorEntry).join(', ')}`
}

const Rule = rule => {
  const renderedManipulators = rule.manipulators
    .map(manipulator =>
      '\n' + indent('- ' + Manipulator(manipulator))
    ).join('')
  return `- ${rule.description}${renderedManipulators}\n`
}

/************************************
 * Main
 ************************************/

const rules = config.profiles[0].complex_modifications.rules
  .filter(rule => !(rule.description in excludeRules))

const output = template(readmeTemplate, { rules: rules.map(Rule).join('') })

console.log(output)