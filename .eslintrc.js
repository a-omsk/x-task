module.exports = {
    "extends": "airbnb-base",
    "env": {
        "jest": true
    },
    "parser": "babel-eslint",   
    "plugins": [
        "react",
        "flowtype"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "indent": ["error", 4],
        "prefer-template": 0,
        "class-methods-use-this": 0,
        "react/jsx-uses-react": 2,
        "react/jsx-uses-vars": 2,
        "arrow-parens": 0,
        "prefer-promise-reject-errors": 0,
        "import/no-extraneous-dependencies": 0,
        "no-prototype-builtins": 0,
        "arrow-body-style": 0,
        "import/no-named-as-default": 0,
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "no-underscore-dangle": 0,
    },
    "settings": {
        "react": {
          "createClass": "createTask",
          "pragma": "XTask",
        },
        "flowtype": {
            "onlyFilesWithFlowAnnotation": false
        }
      }
}