import { describe, expect, test } from 'bun:test';
import { readdir } from 'node:fs/promises';

describe('dist files', () => {
  // FIXME: The bun file type is just inferred from the file extension, not the
  // underlying file data... so that part of this test is not very useful.

  // XXX: Files with unknown type (e.g., symlinks) fall back to the default
  // "application/octet-stream". Bun.file() does not resolve symlinks so it's
  // safe to infer that all these files are therefore regular files.
  const distFiles: [filename: string, type: string][] = [
    ['icon16.png', 'image/png'],
    ['icon48.png', 'image/png'],
    ['icon128.png', 'image/png'],
    ['manifest.json', 'application/json;charset=utf-8'],
    ['newtab.css', 'text/css'],
    ['newtab.html', 'text/html;charset=utf-8'],
    ['newtab.js', 'text/javascript;charset=utf-8'],
    ['settings.css', 'text/css'],
    ['settings.html', 'text/html;charset=utf-8'],
    ['settings.js', 'text/javascript;charset=utf-8'],
    ['sw.js', 'text/javascript;charset=utf-8'],
    ['themes.json', 'application/json;charset=utf-8'],
  ];

  for (const [filename, type] of distFiles) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    test(`file "dist/${filename}" exists with correct type`, () => {
      const file = Bun.file(`dist/${filename}`);
      expect(file.exists()).resolves.toBeTruthy();
      expect(file.size).toBeGreaterThan(0);
      expect(file.type).toBe(type); // TODO: Keep this? Type seems to be resolved from the file extension, not the file data.
    });
  }

  test('contains no extra files', async () => {
    const distDir = await readdir('dist');
    expect(distDir).toHaveLength(distFiles.length);
  });
});
