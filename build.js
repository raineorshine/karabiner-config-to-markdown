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

/************************************
 * Helpers
 ************************************/

const not = f => (...args) => !f(...args)
const indent = s => '  ' + s
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

const Modifiers = modifiers => {
  // normalize from/to modifiers
  const modifiersArray = Array.isArray(modifiers)
    ? modifiers
    : [...modifiers.mandatory || [], ...modifiers.optional || []]
  return modifiersArray.map(s => s + ' + ').join('')
}

/** Renders a manipulator's to' or 'from' entry. */
const ManipulatorEntry = entry =>
  `${entry.modifiers ? Modifiers(entry.modifiers) : ''}${entry.key_code || entry.shell_command || ''}`

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