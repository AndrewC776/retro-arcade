import { lstat } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';

describe('Package', () => {
  test('The final bundle size should not hit 13kb', async () => {
    const maxBites = 13312;
    const fileInfo = await lstat(path.join(__dirname, '/../dist/index.zip'));
    const size = fileInfo.size;

    expect(size).toBeLessThan(maxBites);
  }, 20000);
});
