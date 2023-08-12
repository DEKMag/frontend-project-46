import { expect } from 'chai';
import fs from 'fs';
import { generateDiff } from '../gendiff';

describe('generateDiff', () => {
  it('should return the correct diff when comparing two JSON files', () => {
    const filePath1 = './file1.json';
    const filePath2 = './file2.json';
    const obj1 = JSON.parse(fs.readFileSync(filePath1, 'utf-8'));
    const obj2 = JSON.parse(fs.readFileSync(filePath2, 'utf-8'));

    const expectedDiff = [
      '  - follow: false',
      '    host: "hexlet.io"',
      '  - proxy: "123.234.53.22"',
      '  - timeout: 50',
      '  + timeout: 20',
      '  + verbose: true',
    ];

    const diff = generateDiff(obj1, obj2);

    expect(diff).to.deep.equal(expectedDiff);
  });
});
