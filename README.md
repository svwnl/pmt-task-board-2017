# pmt-task-board-2017
Board showing the status of each task in PMT

Install node.js for your platform, included in the install is node package manager, npm.
Open node.js command prompt. To check the version type

$ node -v

All required node modules for this project can be found in package.json and can be installed using npm.
Go to directory /task-board

$ npm install

Included in the install are Babel and Webpack. Babel is a compiler for writing next generation JavaScript.
Webpack is a module bundler, it packs CommonJs/AMD modules i. e. for the browser.

$ npm install webpack -g

/task-board/src/js files uses a XML syntax inside of JavaScript called JSX.
In order to translate it to vanilla JavaScript we use Babel with babel-preset-react.
To compile source on each change

$ babel --presets react src/js --watch --out-dir src

A babel module loader for webpack, babel-loader, has been added to webpack.config.js, so webpack will run Babel for us.
Check webpack.config.js presets for what js version babel will transpile to, for example babel-preset-react, es2015.

$ webpack

To compile source on each change

$ webpack --watch

To run the webpack web server on localhost:8080 with live update (will run package.json scripts dev)

$npm run dev

To compile to minified production version
On Linux

$ NODE_ENV=production

On Windows

$ set NODE_ENV=production

======================================

Modules are imported like this:
import React from "react";
import ReactDOM from "react-dom";

Install the Babel command-line tools without $ npm install (requires npm):
npm install --global babel-cli
npm install babel-preset-react

$ babel --presets react src/js --watch --out-dir src

