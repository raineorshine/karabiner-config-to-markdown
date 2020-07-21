#!/usr/bin/env node
const path = require('path')
const karabinerConfigToMarkdown = require('./index')
const configPath = path.resolve(process.argv[2] || path.join(process.env.HOME, '/.config/karabiner/karabiner.json'))
const config = require(configPath)
console.log(karabinerConfigToMarkdown(config))
