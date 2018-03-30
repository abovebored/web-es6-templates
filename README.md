<img src="https://dadi.tech/assets/products/dadi-web-full.png" alt="DADI Web" height="65"/>

## ES6 template engine interface

[![npm (scoped)](https://img.shields.io/npm/v/web-es6-templates.svg?maxAge=10800&style=flat-square)](https://www.npmjs.com/package/web-es6-templates)
[![coverage](https://img.shields.io/badge/coverage-73%25-yellow.svg?style=flat?style=flat-square)](https://github.com/abovebored/web-es6-templates)
[![Build Status](https://travis-ci.org/abovebored/web-es6-templates.svg?branch=master)](https://travis-ci.org/abovebored/web-es6-templates)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

This module allows native [ES6 template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals) to be used with [DADI Web](https://github.com/dadi/web).

## Installation

- Add this module as a dependency:

   ```
   npm install web-es6-templates --save
   ```

- Include it in the `engines` array passed to Web:

   ```js
   require('@dadi/web')({
     engines: [
       require('web-es6-templates')
     ]
   })
   ```

## Usage

### Config

You can change the folder where your helpers are stored in your `config.xxx.json` file:

```json
  "engines": {
    "es6": {
      "paths": {
        "helpers": "site/helpers"
      }
    }
  }
```

### Helpers

The base directory for absolute paths is the `utils/helpers` directory.

Helpers are `required()` functions that can be embeded into templates to keep your code DRY. Take this example which could live in your `helpers` folder as `slugify.js`.

```javascript
var s = require('underscore.string/slugify')

module.exports.slugify = (chunk) => {
  return s(chunk)
}
```

This function would be used in a template file like so:

```javascript
${slugify('The Quick Brown Fox Jumps Over The Lazy Dog')}
```

Output:

```
the-quick-brown-fox-jumps-over-the-lazy-dog
```

### Includes

The base directory for absolute paths is the `pages/` directory. Take the following directory tree.

```
pages/
|_ partials/
|_ |_ header.js
|_ |_ footer.js
|_ index.js
|_ index.json
```

To include the partials from `index.js`, you can use an underscore to indicate a sub-folder:

```js
${partials_header}

<h1>ES6 Templates test</h1>

<p>This page lives at ${host}.</p>

<h2>Loop test</h2>

<ul>
  ${posts.results.map(i => `<li>${i.attributes.title}</li>`).join('')}
</ul>

${partials_footer}
```

