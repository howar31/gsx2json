#!/usr/bin/env node
const commander = require('commander')
const configRegulator = require('../actions/about-us/config-regulator')
const converter = require('../actions/converter')
const uploader = require('../actions/about-us/uploader')
const program = new commander.Command()
// lodash
const includes = require('lodash/includes')
const _ = {
  includes,
}

function parseSection(value) {
  const parsedValue = parseInt(value, 10)
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number')
  }
  const validSection = [ 2, 3, 4, 5 ]
  if (!_.includes(validSection, parsedValue)) {
    throw new commander.InvalidArgumentError('Invalid number')
  }
  return parsedValue
}

// For main site about-us page
program
  .description('update configs for about-us page')
  .option('--id <spreadsheet>', 'google spreadsheet id, required', '16CVkhaSw5sxwjlSt1c0nLzxG7qzEmeO2gCymVsSY6PE')
  .option('--sheetName <name>', 'sheet name, required', 'section-5')
  .option('--section <index>', 'section index number, required', parseSection, 5)
  .option('--branch <branch>', 'git branch (one of "master", "staging", "release")', 'master')
  .action(async (options) => {
    try {
      const rawConfig = await converter(options)
      const config = configRegulator(rawConfig, options)
      await uploader(config, options)
    } catch(err) {
      console.log('fail:\n', err)
    }
  })

program.on('--help', () => {
  console.log('')
  console.log('Example call:')
  console.log('  $ about-us --help')
})

program.parse(process.argv)
