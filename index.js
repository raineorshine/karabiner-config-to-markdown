const { toQwerty } = require('qwerty-to-colemak')

/************************************
 * Constants
 ************************************/

const excludeRules = {
  'Vi Mode: D as Trigger Key': true
}

const keys = {
  close_bracket: ']',
  command: 'Command',
  control: 'Ctrl',
  down_arrow: '↓',
  grave_accent_and_tilde: '` ` `', // double backtick with space to escape
  left_arrow: '→',
  left_command: 'L-Command',
  left_control: 'L-Ctrl',
  left_option: 'L-Option',
  left_shift: 'L-Shift',
  open_bracket: '[',
  option: 'Option',
  quote: '\'',
  right_arrow: '←',
  right_command: 'R-Command',
  right_control: 'R-Ctrl',
  right_option: 'R-Option',
  right_shift: 'R-Shift',
  semicolon: ';',
  shift: 'Shift',
  up_arrow: '↑',
}

/************************************
 * Helpers
 ************************************/

const id = x => x
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

/** Converts the character to QWERTY, and if the conversion fails return as-is. */
const toQwertyGuarded = s => toQwerty(s) || s

/************************************
 * Render
 ************************************/

const KeyboardLayout = (options={}) => options.layout === 'colemak'
  ? toQwertyGuarded
  : id
const Pretty = keyCode => keys[keyCode] || keyCode
const Code = s => `\`${s}\``
const ShellCommand = Code
const Key = (s, options={}) => compose(Code, Pretty, KeyboardLayout(options))(s)

const Modifiers = modifiers => {
  // normalize from/to modifiers
  const modifiersArray = Array.isArray(modifiers)
    ? modifiers
    : [...modifiers.mandatory || [], ...modifiers.optional || []]
  return modifiersArray.map(compose(plus, Pretty)).join('')
}

/** Renders a manipulator's to' or 'from' entry. */
const ManipulatorEntry = (entry, options={}) =>
  `${entry.modifiers ? Modifiers(entry.modifiers) : ''}${
    entry.key_code ? Key(entry.key_code, options) :
    (entry.shell_command ? ShellCommand(entry.shell_command) :
    ''
  )}`

const Manipulator = (manipulator, options={}) => {
  return `${ManipulatorEntry(manipulator.from, options)} → ${manipulator.to.map(entry => ManipulatorEntry(entry, options)).join(', ')}`
}

const Rule = (rule, options={}) => {
  const renderedManipulators = rule.manipulators
    .map(manipulator =>
      '\n' + indent('- ' + Manipulator(manipulator, options))
    ).join('')
  return `- ${rule.description}${renderedManipulators}\n`
}

/************************************
 * Main
 ************************************/

const karabinerConfigToMarkdown = (config, options={}) => {
  const rules = config.profiles[0].complex_modifications.rules
    .filter(rule => !(rule.description in excludeRules))
  return rules.map(rule => Rule(rule, options)).join('')
}

module.exports = karabinerConfigToMarkdown
