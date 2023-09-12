const fs = require('fs');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const path = require('path');
const babel = require('babel-core');

let ID = 0;

function createAsset(filename) {
  const content = fs.readFileSync(filename, 'utf-8');
  const ast = babylon.parse(content, {
    sourceType: 'module',
  });
  
  // console.log(ast);
  const dependencies = [];

  traverse(ast, {
    // Following function runs only on ImportDeclaration
    ImportDeclaration: ({node}) => {
      // console.log(node);
      dependencies.push(node.source.value);
    }
  });

  // console.log(dependencies);
  
  const id = ID++;
  
  // presets just specify to babel, how to transform the code
  // env is to ensure that the code runs on every popular browser
  const {code} = babel.transformFromAst(ast, null, {
    presets: ['env']
  });

  return {
    id,
    filename,
    dependencies,
    code,
  }
}

function createGraph(entryFilePath) {
  const mainAsset = createAsset(entryFilePath);

  const queue = [mainAsset];

  // console.log(queue);

  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);

    asset.mapping = {}

    // mapping is going to be of form:
    // mapping: {
    //   './message.js': 1
    // }    
    asset.dependencies.forEach((depRelPath) => {
      const depProjectRelPath = path.join(dirname, depRelPath);
      // console.log(depProjectRelPath);
      const childAsset = createAsset(depProjectRelPath);
     
      asset.mapping[depRelPath] = childAsset.id;
      
      queue.push(childAsset);
    });
  }

  return queue;
}

function bundle(graph) {
  // This is a string  which k1:v1, k2:v2, ...,kn:vn format
  let modules = '';

  // The graph is stored as an array with each element in following example format
  // {
  //   id: 0,
  //   filename: './project/entry.js',
  //   dependencies: [ './message.js' ],
  //   mapping: { './message.js': 1 }
  // },

  graph.forEach(mod => {
    // The first part of tuple is module code wrapped in a fuction
    // As per commonjs specs the bundler has to provide i) require function, ii) module object iii) exports
    // Each entry is of the form {<module id>: [function(require, module, exports) { <module code> }, ] }
    modules +=  `${mod.id}: [
      function (require, module, exports) { 
        ${mod.code} 
      },
      ${JSON.stringify(mod.mapping)}
    ],`
  })

  // We wll print list of modules for debug purpose
  // console.log(modules);

  // The result string contains an IIFE (Imediately Invoked Function Expression)
  const result = `
  (function(modules) {
    // This function is going to use id 
    function require(id) {
      const [fn, mapping] = modules[id];

      // This function is going to use 'relativePath'
      function localRequire(relativePath) {
        return require(mapping[relativePath])
      }

      const module = {exports: {}};

      // This is where we are actually running module code
      fn(localRequire, module, module.exports);

      return module.exports;
    }

    require(0);
  })({${modules}});
  `;

  return result;
}

const mainFile = './project/entry.js';
const graph = createGraph(mainFile);
// console.log('Graph:', graph);

const result = bundle(graph);
console.log(result);