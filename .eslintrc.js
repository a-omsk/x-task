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
    },
    "settings": {
        "react": {
          "createClass": "createTask",
          "pragma": "Xpressive",
        },
        "flowtype": {
            "onlyFilesWithFlowAnnotation": false
        }
      }
}