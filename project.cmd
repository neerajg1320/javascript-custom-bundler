Case 1: When not using package.json
node bundler.js |npx js-beautify | npx cli-highlight

# https://astexplorer.net
# We use it to view the Abstract Syntax Tree

Case 2: When using package.json
npm init -y
npm install -D babylon
npm i -D babel-traverse

node bundler.js |npx js-beautify | npx cli-highlight


# https://babeljs.io, select 'Try it out'
# We use this to handle the import statement etc

# For code transformation
npm i -D babel-core babel-preset-env

# In case we want to store it in file
node bundler.js |npx js-beautify | npx cli-highlight >dist/entry.bundle.js