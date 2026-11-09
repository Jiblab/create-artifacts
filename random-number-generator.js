#!/usr/bin/env node

const fs = require('fs');
const mt19937 = require('@stdlib/random-base-mt19937');

const MAX_UINT32 = 0xFFFFFFFF;

const seedArg = process.argv[2];
const seedStr = seedArg || (Date.now() % (MAX_UINT32 + 1)).toString();

const seed = isNaN(Number(seedStr))
  ? hashString(seedStr)
  : Math.min(Number(seedStr), MAX_UINT32);

const prng = mt19937.factory({ seed });
const numbers = Array.from({ length: 5 }, () => prng());

const report = `
Seed value used: ${seedArg || '(timestamp) ' + seedStr}
Random values:
${numbers.map((n, i) => `  ${i + 1}: ${n.toFixed(6)}`).join('\n')}
`;

fs.writeFileSync('report.txt', report.trim() + '\n');
console.log(report.trim());

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % (MAX_UINT32 + 1);
}
