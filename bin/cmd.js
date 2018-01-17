#!/usr/bin/env node
"use strict";
const meow = require("meow");
const run = require("../lib/cli");

const cli = meow(
    `
    Usage
      $ get-github-pr-review-comments --repo owner/repo --projectRoot /path/to/project --token <GitHubToken> <sha>

    Options
      --repo  owner/repo
        e.g.) azu/get-github-pr-review-comments
      --projectRoot -p /path/to/root-project
        e.g.) /Users/azu/get-github-pr-review-comments
      --token GitHub Token
        Get from https://github.com/settings/tokens/new
        or
        export GH_TOKEN=XXX
      --format json
        (optional) json supported
        
     Example:
        get-github-pr-review-comments --repo azu/get-github-pr-review-comments --projectRoot /path/to/get-github-pr-review-comments --token xxx \`git rev-parse HEAD\`
    
`,
    {
        alias: {
            p: "projectRoot"
        }
    }
);
/*
 {
 input: ['2101f5606f2c594f4e8d8262a0c7c99b9679f2f9'],
 flags: {rainbow: true},
 ...
 }
 */

run(cli.input[0], cli.flags)
    .then(function(result) {
        console.log(result);
    })
    .catch(function(error) {
        console.error(error.message, error.stack);
    });
