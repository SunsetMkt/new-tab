[![Build status](https://img.shields.io/github/workflow/status/MaxMilton/new-tab/ci)](https://github.com/MaxMilton/new-tab/actions)
[![Coverage status](https://img.shields.io/codeclimate/coverage/MaxMilton/new-tab)](https://codeclimate.com/github/MaxMilton/new-tab)
[![Chrome web store version](https://img.shields.io/chrome-web-store/v/cpcibnbdmpmcmnkhoiilpnlaepkepknb.svg)](https://chrome.google.com/webstore/detail/new-tab/cpcibnbdmpmcmnkhoiilpnlaepkepknb)
[![Licence](https://img.shields.io/github/license/MaxMilton/new-tab.svg)](https://github.com/MaxMilton/new-tab/blob/master/LICENSE)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

# New Tab

A high performance browser new tab page that gets you where you need to go faster. Utilises the latest tools and tech, packaged into a Chrome browser extension.

[![Add to Chrome](https://storage.googleapis.com/chrome-gcs-uploader.appspot.com/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/mPGKYBIR2uCP0ApchDXE.png)](https://chrome.google.com/webstore/detail/new-tab/cpcibnbdmpmcmnkhoiilpnlaepkepknb)

## Overview

I was left frustrated by the default Google Chrome new tab page experience. The "top sites" feature quickly outgrew its usefulness and I found myself using bookmarks instead every time. I never used the Google web search input either, as the search bar is all I need. I wondered... "If I could design my own new tab what would it look like?"... enter the `New Tab` extension.

Originally an experimental project to give me a chance for me to play with the Chrome browser APIs and explore web performance optimisations. It grew into something that actually improved my productivity and so, now `New Tab` is available for anyone to use.

### Features

- Fastest loading of any new tab page with all the basic features.
- Distraction-free, minimal design aesthetic with multiple themes.
- List of your open tabs.
- Search open tabs, bookmarks, history, and top sites in one place.
- Simple bookmarks bar.
- Links to common places in your browser.

### Motives

<!-- prettier-ignore -->
| Issue | Why / How |
| --- | --- |
| Access | Still have access to common things like the bookmarks bar etc. |
| Speed | Near instant access to functionality. Page load performance, runtime performance, and file size should all be scrupulously optimised. |
| Privacy & Security | Zero user tracking (unlike most other extensions!). Very restrictive [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP). Local data only; no remote data fetching. |
| Unobtrusive | No annoying things like distracting colours, illegible text, or entries in your right click menu. |

### Technology

- [Chrome browser APIs](https://developer.chrome.com/apps/api_index)
- [stage1](https://github.com/MaxMilton/stage1) JavaScript framework
- [ekscss](https://github.com/MaxMilton/ekscss) style preprocessor
- [esbuild](https://esbuild.github.io/) JavaScript bundler

## Known issues

1. The extension's bookmarks bar functionality is limited. Chrome doesn't allow extensions to control the native bookmarks bar visibility so I've recreated a simple version. The goal is _high performance_ and quick access rather than trying to emulate the native bookmarks bar. Use the bookmark manager for access to all features.
1. Page needs to be reloaded after adding, editing, or removing bookmarks. Bookmarks don't change often, so changes are not live.
1. Searching the browsing history is slow when you history is _very_ big. Nothing I can do here; this is just a reality of Chrome.
1. The project is set up for development on Linux and may not build on other operating systems.

## Browser support

Recent versions of Google Chrome and other Chromium based browsers (e.g. Brave, Edge).

## Bugs

Please report any bugs you encounter on the [GitHub issue tracker](https://github.com/MaxMilton/new-tab/issues).

## Changelog

See [releases on GitHub](https://github.com/MaxMilton/new-tab/releases).

## License

`New Tab` is an MIT licensed open source project. See [LICENSE](https://github.com/MaxMilton/new-tab/blob/master/LICENSE).

The extension [lightning bolt icon](https://github.com/twitter/twemoji/blob/master/assets/svg/26a1.svg) is from [twitter/twemoji](https://github.com/twitter/twemoji) which is licensed CC-BY 4.0.

Icons used in the app are from [feathericons/feather](https://github.com/feathericons/feather) which is licensed MIT.

---

© 2021 [Max Milton](https://maxmilton.com)
