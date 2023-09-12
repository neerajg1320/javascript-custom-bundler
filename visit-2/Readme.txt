Our custom bundler is implemented in bundler.js

Ref: # https://www.youtube.com/watch?v=Gc9-7PBqOC8

Context: Currently we are working on the webappstarter.com and we want to have a good hold on the bundling process.


Video[6:54]: Javascript Parser Tool
It reads a string and generates an AST (Abstract Syntax Tree)
https://astexplorer.net/

To generate the AST in our custom bundler we import libray called babylon
To traverse the AST we will use a library called babel-traverse

24:29 We use babel to simplify the code in our javascript files so that the code in them is converted to a form which can be run on even older browsers which do not support new formats.

https://babeljs.io/

Video[28:13]
We wrap every module code in an IIFE to prevent the variable leaks. If we don't do this, the global variables of each module become globally accessible. We want to prevent this behaviour.
