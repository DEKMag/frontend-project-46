#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { Command } from 'commander';

const program = new Command();
program
  .version('1.0.0')
  .description('Search for differences between two flat JSON files')
  .arguments('<filepath1> <filepath2>')
  .parse(process.argv);

if (program.args.length !== 2) {
  console.error('Usage: gendiff <filepath1> <filepath2>');
  process.exit(1);
}

const [filePath1, filePath2] = program.args;

const readJsonFileSync = (filePath) => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const content = fs.readFileSync(absolutePath, 'utf-8');
  return JSON.parse(content);
};

const obj1 = readJsonFileSync(filePath1);
const obj2 = readJsonFileSync(filePath2);

const generateDiff = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2)).sort();

  return keys.map((key) => {
    if (_.isEqual(obj1[key], obj2[key])) {
      return `    ${key}: ${JSON.stringify(obj1[key])}`;
    }

    if (!_.has(obj1, key)) {
      return `  + ${key}: ${JSON.stringify(obj2[key])}`;
    }

    if (!_.has(obj2, key)) {
      return `  - ${key}: ${JSON.stringify(obj1[key])}`;
    }

    return `  - ${key}: ${JSON.stringify(
      obj1[key]
    )}\n  + ${key}: ${JSON.stringify(obj2[key])}`;
  });
};

const diff = generateDiff(obj1, obj2);
console.log(`{\n${diff.join('\n')}\n}`);
