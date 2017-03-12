#!/usr/bin/env node
const prog = require('caporal')
const version = require('./package.json').version
const fns = require('./scripts')
const { github, pivotal } = require('./scripts')

prog
  .version(version)
  .description('Syncs all the things')
  .option('--project <project>', 'name of project')
  .option('--repo <repo>', 'name of github repo')
  .option('--label <label>', 'label to sync')
  .action(async (args, options, logger) => {
    const stories = await pivotal.fetchTickets(options.project, options.label)
    const result = await github.createPr(options.repo, stories)
  })

prog.parse(process.argv)
