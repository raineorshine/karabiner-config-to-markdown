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
const indent = s => '  ' + s
const plus = s => s + ' + '

const compose = (...fns) =>
  fns.reduceRight((prev, next) =>
    (...args) => next(prev(...args)),
  id)

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
