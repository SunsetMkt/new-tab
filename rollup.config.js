import { readFileSync, writeFile } from 'fs';
import path from 'path';
import preprocessMarkup from '@minna-ui/svelte-preprocess-markup';
import preprocessStyle from '@minna-ui/svelte-preprocess-style';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import { createFilter } from 'rollup-pluginutils'; // eslint-disable-line import/no-extraneous-dependencies
import { plugin as analyze } from 'rollup-plugin-analyzer';
import crass from 'crass';
import manifest from './manifest.js';

const htmlTemplate = readFileSync(`${__dirname}/src/template.html`, 'utf8');
const dev = !!process.env.ROLLUP_WATCH;

const compilerOpts = {
  externs: [
    require.resolve('google-closure-compiler/contrib/externs/chrome.js'),
    require.resolve('google-closure-compiler/contrib/externs/chrome_extensions.js'),
    // require.resolve('google-closure-compiler/contrib/externs/svg.js'),
    path.join(__dirname, 'component-externs.js'),
  ],
  compilation_level: 'ADVANCED',
  language_in: 'ECMASCRIPT_2017',
  charset: 'UTF-8',
  strict_mode_input: true,
  use_types_for_optimization: true,
  warning_level: 'VERBOSE',
  // jscomp_warning: '*', // FIXME: Broken upstream; https://git.io/fAlzj
  // jscomp_error: '*',
  jscomp_off: 'duplicate', // FIXME: Shouldn't need this

  // uncomment for debugging
  // formatting: 'PRETTY_PRINT',
  // debug: true,
};

/**
 * Generic error handler for nodejs callbacks.
 * @param {Error} err
 */
function catchErr(err) { if (err) throw err; }

/**
 * Ultra-minimal template engine.
 * @see https://github.com/Drulac/template-literal
 * @param {string} template A HTML template to compile.
 * @returns {Function}
 */
function compileTemplate(template) {
  return new Function('d', 'return `' + template + '`'); // eslint-disable-line
}

/** Generate HTML from a template and write it to disk */
function makeHtml({
  file,
  template,
  title,
  content,
  exclude,
  include = ['**/*.css', '**/*.postcss', '**/*.pcss'],
  ...options
} = {}) {
  const filter = createFilter(include, exclude);
  const injectHtml = compileTemplate(template);
  const styles = {};

  return {
    name: 'makeHtml',
    transform(source, id) {
      if (!filter(id)) return;

      styles[id] = source;

      return ''; // eslint-disable-line consistent-return
    },
    async generateBundle() {
      // combine all stylesheets
      let css = '';
      for (const id in styles) { // eslint-disable-line
        css += styles[id] || '';
      }

      // minify CSS
      if (!dev && css.length) {
        css = crass.parse(css).optimize({ o1: true, css4: true }).toString();
      }

      // compile HTML from template
      let body = typeof content === 'function'
        ? await content()
        : content;
      body = body.replace('%CSS%', css.length ? `<style>${css}</style>` : '');

      writeFile(path.join(__dirname, file), injectHtml({
        title,
        content: body,
        ...options,
      }).trim(), catchErr);
    },
  };
}

const svelteOpts = {
  dev,
  preprocess: {
    ...(dev ? {} : { markup: preprocessMarkup({
      unsafeWhitespace: true,
      unsafe: true,
    }) }),
    style: preprocessStyle(),
  },
  emitCss: true,
};

const analyzeOpts = {
  showExports: true,
};

// extension manifest
writeFile(`${__dirname}/dist/manifest.json`, JSON.stringify(manifest), catchErr);

export default [
  /** New Tab Page app */
  {
    input: 'src/app.js',
    output: {
      sourcemap: dev,
      format: 'esm',
      file: 'dist/n.js',
    },
    plugins: [
      svelte(svelteOpts),
      resolve(),
      commonjs(),
      !dev && compiler(compilerOpts),
      makeHtml({
        template: htmlTemplate,
        file: 'dist/n.html',
        title: 'New Tab',
        // content: '%CSS%<script src=n.js async></script>',
        // XXX: The first script is `loader.js` run through closure compiler
        // TODO: Should automate this again so it's easy to make changes to loader.js
        content: '<script>chrome.storage.sync.get(["t"],(a)=>{a.t&&(document.body.className=a.t)});</script>%CSS%<script src=n.js async></script>',
      }),
      !dev && analyze(analyzeOpts),
    ],
  },

  /** Settings app */
  {
    input: 'src/settings.js',
    output: {
      sourcemap: dev,
      format: 'esm',
      file: 'dist/s.js',
    },
    plugins: [
      svelte(svelteOpts),
      !dev && compiler(compilerOpts),
      makeHtml({
        template: htmlTemplate,
        file: 'dist/s.html',
        content: '%CSS%<script src=s.js async></script>',
      }),
      !dev && analyze(analyzeOpts),
    ],
  },

  /** Background process */
  {
    input: 'src/background.js',
    output: {
      sourcemap: false,
      format: 'esm',
      file: 'dist/b.js',
    },
    plugins: [
      !dev && compiler(compilerOpts),
      !dev && analyze(analyzeOpts),
    ],
  },
];
