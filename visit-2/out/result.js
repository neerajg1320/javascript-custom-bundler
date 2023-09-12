(function(modules) {
    // This function is going to use id 
    function require(id) {
        const [fn, mapping] = modules[id];

        // This function is going to use 'relativePath'
        function localRequire(relativePath) {
            return require(mapping[relativePath])
        }

        const module = {
            exports: {}
        };

        // This is where we are actually running module code
        // Note a require in the user code will ensure that the require module 
        // code is executed first and module.exports is populated with exports 
        // from the required modules
        // So in essence, even though there is only one copy of the code of required 
        // module in bundler memory but the module code is executed each time it is 
        // required by another module.
        fn(localRequire, module, module.exports);

        return module.exports;
    }

    require(0);
})({
    0: [
        function(require, module, exports) {
            "use strict";

            var _message = require("./message.js");

            var _message2 = _interopRequireDefault(_message);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }

            console.log(_message2.default);
        },
        {
            "./message.js": 1
        }
    ],
    1: [
        function(require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _name = require("./name.js");

            exports.default = "hello " + _name.name;
        },
        {
            "./name.js": 2
        }
    ],
    2: [
        function(require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var name = exports.name = 'Neeraj Gupta';
        },
        {}
    ],
});