const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const babel = require('babel-core');

let ID = 0;

function createAsset(filename) {
  const content = fs.readFileSync(filename, 'utf-8');
  const ast = babylon.parse(content, {
    sourceType: 'module'
  });

  const dependencies = [];
  traverse(ast, {
    ImportDeclaration: ({node}) => {
      // console.log(node);
      dependencies.push(node.source.value);
    }
  });

  const id = ID++;

  const {code} = babel.transformFromAst(ast, null, {
    presets: [
        'env', // to make code run on every popular browser
    ]
  });

  return {
    id,
    filename,
    dependencies,
    code
  }
}

// const mainAsset = createAsset('./example/entry.js');
// console.log('mainAsset:', mainAsset);

function createGraph(entry) {
  const mainAsset = createAsset(entry);
 // console.log('mainAsset:', mainAsset);

  const queue = [mainAsset];

  for(const asset of queue) {
    // console.log(`asset:`, asset);

    const dirname = path.dirname(asset.filename);

    asset.mapping = {};

    // traverse each dependency and create a link in parent
    // push the child to traversal queue
    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath);
      const child = createAsset(absolutePath)

      asset.mapping[relativePath] = child.id;
      queue.push(child);
    });
  }

  return queue;
}

function bundler(graph) {
  let modules = '';

  graph.forEach(mod => {
    modules +=
    `${mod.id}: [
      function(require, module, exports) { 
        ${mod.code} 
      }
    ]
    `;
  });

  const result = `
    (function() {
    })({${modules});
  `;

  return result;
}

const graph = createGraph('./example/entry.js');
// console.log('graphQueue:', graph);

const bundle = bundler(graph);
console.log('bundle:', bundle);



