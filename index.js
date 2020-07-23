/************************************
 * Constants
 ************************************/

const excludeRules = {
  'Vi Mode: D as Trigger Key': true
}

const keys = {
  backslash: '\\',
  close_bracket: ']',
  command: 'Command',
  control: 'Ctrl',
  down_arrow: '↓',
  equal_sign: '=',
  grave_accent_and_tilde: '`',
  hyphen: '-',
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

/** Chars that can be uppercased with shift. */
const lowercaseChars = '`1234567890-=[]\\;\',./'
const uppercaseChars = '~!@#$%^&*()_+{}|:"<>?'

/************************************
 * Helpers
 ************************************/

const id = x => x
const indent = s => '  ' + s
const plus = s => s + ' + '

const compose = (...fns) =>
  fns.reduceRight((prev, next) =>
    (...args) => next(prev(...args)),
  id)

/** Converts a key_code to its corresponding char. */
const keyCodeToChar = keyCode => keys[keyCode] || keyCode

/** Converts a shiftable lowercase char to uppercase. */
const shift= c => {
  const i = lowercaseChars.indexOf(c)
  return i !== -1 ? uppercaseChars[i] : c
}

/** Returns true if a manipulator's 'to' entry contains Shift + shiftableChar. */
const isShiftable = entry =>
  // shift modifier
  (entry.modifiers && entry.modifiers.length == 1 && entry.modifiers[0].includes('shift') &&
  // shiftable char
  lowercaseChars.includes(keyCodeToChar(entry.key_code)))

/************************************
 * Render
 ************************************/

// double backtick with spaces to escape backtick in markdown
const Code = s => `\`${s === '`' ? '` ' + s + ' `' : s}\``
const ShellCommand = Code
const Key = compose(Code, keyCodeToChar)

const Modifiers = modifiers => {
  // normalize from/to modifiers
  const modifiersArray = Array.isArray(modifiers)
    ? modifiers
    : [...modifiers.mandatory || [], ...modifiers.optional || []]
  return modifiersArray.map(compose(plus, keyCodeToChar)).join('')
}

/** Renders a manipulator's 'to' or 'from' entry. */
const ManipulatorEntry = entry =>
  isShiftable(entry)
    // if shift + shiftable char, render shifted char
    ? Key(shift(keyCodeToChar(entry.key_code)))
    // otherwise render modifiers and Key/ShellCommand
    : `${entry.modifiers ? Modifiers(entry.modifiers) : ''}${
      entry.key_code ? Key(entry.key_code) :
      entry.shell_command ? ShellCommand(entry.shell_command) :
      ''
    }`

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

const karabinerConfigToMarkdown = config => {
  const rules = config.profiles[0].complex_modifications.rules
    .filter(rule => !(rule.description in excludeRules))
  return rules.map(Rule).join('')
}

module.exports = karabinerConfigToMarkdown
