'use strict'

const ENGINE = {
  config: {
   paths: {
      doc: 'Paths required by ES6 templates',
      format: Object,
      default: {
        helpers: 'workspace/utils/helpers'
      }
    }
  },
  extensions: ['.js'],
  handle: 'es6'
}

module.exports = () => {
  const fs = require('fs')
  const path = require('path')
  const helpers = require(path.join(__dirname, 'lib/helpers'))

  const debug = require('debug')('web:templates:es6')

  const EngineES6 = function (options) {
    debug('Starting ES6 templates engine...')

    this.config = options.config
    this.helpers = []
    this.pagesPath = options.pagesPath
    this.templates = {}
    this.additionalTemplates = options.additionalTemplates
    this.partials = {}

    this._loadAdditionalTemplates()
  }

  EngineES6.prototype._loadAdditionalTemplates = function () {  
    this.additionalTemplates.forEach(file => {
      let extension = path.extname(file)
      let templateName = path.relative(this.pagesPath, file).slice(0, -extension.length).replace(/\//gmi, '_')

      this.partials[templateName] = fs.readFileSync(file, 'utf8')
    })
  }

  /**
    * Returns the engine core module.
    *
    * @return {function} The engine core module.
    */
  EngineES6.prototype.getCore = function () {
    return es6
  }

  /**
    * Returns information about the engine.
    *
    * @return {object} An object containing the engine name and version.
    */
  EngineES6.prototype.getInfo = function () {
    return {
      engine: ENGINE.handle
    }
  }

  /**
    * Requires all JS files within a directory.
    *
    * @param {string} directory The full path to the directory.
    */
  EngineES6.prototype._requireDirectory = function (directory) {
    return helpers
      .readDirectory(directory, {
        extensions: ['.js'],
        recursive: true
      })
      .then(files => {
        files.forEach(file => {
          Object.assign(this.helpers, require(path.resolve(file)))
        })

        return files
      })
  }

  /**
    * Initialises the engine.
    *
    * @return {Promise} A Promise that resolves when the engine is fully loaded.
    */
  EngineES6.prototype.initialise = function () {
    const paths = this.config.get('engines.es6.paths')

    const helpersPath = path.resolve(paths.helpers)

    this._loadAdditionalTemplates()

    return this._requireDirectory(helpersPath)
      .then(helpers => {
        debug('helpers loaded %o', helpers)
      })

    debug('ES6 templates initialised')
  }

  /**
    * Registers the template with markup.
    *
    * @return Loaded template data.
    */
  EngineES6.prototype.register = function (name, data) {
    return this.templates[name] = data
  }

  /**
    * Renders a template.
    *
    * @param {string} name The name of the template.
    * @param {string} data The template content.
    * @param {object} locals The variables to add to the context.
    * @param {object} options Additional render options.
    *
    * @return {Promise} A Promise that resolves with the render result.
    */
  EngineES6.prototype.render = function (name, data, locals, options) {
    // Replace each partial reference in a template with the actual partial
    Object.keys(this.partials).map(i => {
      data = data.replace(new RegExp('\\${'+ i + '}', 'gm'), this.partials[i])
    })

    // Add the helpers to the context
    locals = Object.assign({}, locals, this.helpers)

    // Make a list of the object keys for Funtion()
    var names = Object.keys(locals)
    var argNames = names.join(', ')

    // Make the values a seperate obj
    var argValues = names.map(name => { return locals[name] })

    // Pass the keys only to the template
    var resolver = new Function(argNames, `return \`${data}\``)

    // Resolves the keys to the values
    return new Promise((resolve, reject) => {
      try {
        resolve(resolver.apply(null, argValues))
      }
       catch (err) {
         return reject({
           name: 'web-es6-templates',
           message: 'Error rendering template: ' + name,
           stack: err
         })
       }
    })
  }

  return EngineES6
}

module.exports.metadata = ENGINE
