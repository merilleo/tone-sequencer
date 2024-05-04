module.exports = {
  // Specifies that the environment is a browser and is running a version of ECMAScript that is compatible with ECMAScript 2021 standards.
  'env': {
    'browser': true,
    'es2021': true
  },

  // Extends the standard recommendations by ESLint, TypeScript, and Svelte.
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended'
  ],

  // Specifies the parser to be used.
  'parser': '@typescript-eslint/parser',

  // Parser options are for advanced parsing feature configurations.
  'parserOptions': {
    'ecmaVersion': 2023, // The version of ECMAScript syntax to be used.
    'sourceType': 'module', // The source code is in the form of ECMAScript modules.
    'extraFileExtensions': ['.svelte'], // Includes .svelte files for parsing.
    'project': './tsconfig.json',
  },

  // Specifies special parsing for *.svelte files.
  'overrides': [
    {
      'files': ['*.svelte'],
      'parser': 'svelte-eslint-parser',
      'parserOptions': {
        'parser': '@typescript-eslint/parser'
      }
    }
  ],

  // Specifies the plugin to be used.
  'plugins': [
    '@typescript-eslint',
    'check-file'
  ],

  // Specifies the rules to be followed.
  'rules': {
    // Enforces strong typing and readability with booleans.
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      {
        'allowString': false,
        'allowNumber': false
      }
    ],
    // Enforces naming conventions for classes to be in PascalCase.
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'class',
        'format': [
          'PascalCase'
        ]
      }
    ],
    // Enforces consistence in type imports.
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        'prefer': 'type-imports'
      }
    ],
    // Enforces the usage of semicolons.
    '@typescript-eslint/semi': ['error', 'always'],
    // Enforces consistent use of semicolons as delimiters in both multi-line and single-line member expressions.
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        'multiline': {
          'delimiter': 'semi',
          'requireLast': true
        },
        'singleline': {
          'delimiter': 'semi',
          'requireLast': false
        }
      }
    ],
    // Disable the enforcement of no explicit type any
    '@typescript-eslint/no-explicit-any': 'off',
    // Enforces the usage of language tags in Svelte blocks.
    'svelte/block-lang': [
      'error',
      {
        'enforceScriptPresent': true,
        'script': ['ts', null]
      }
    ],
    // Enforce naming convention TypeScript and Svelte files.
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*.{ts,svelte}': 'PASCAL_CASE',
      }
    ],
    // Enforce naming convention for all directories inside the `src` directory.
    'check-file/folder-naming-convention': [
      'error',
      {
        'src/**/': 'KEBAB_CASE',
      }
    ],
    // Enforces 'else' or 'else if' to be on the next line to the closing brace from the previous block.
    "brace-style": ["error", "stroustrup"],
    // Enforces use of curly braces except for one-liners.
    "curly": ["error", "multi-line"],
    // Enforces the use of === and !== over == and !=.
    'eqeqeq': 2,
    // Warns when a defined variable is not used.
    'no-unused-vars': [
      'warn',
      {
        'vars': 'all',
        'args': 'after-used',
        'ignoreRestSiblings': false
      }
    ],
    // Enforces the usage of single quotes.
    'quotes': [
      'error',
      'double',
      {
        'avoidEscape': true,
        'allowTemplateLiterals': true
      }
    ],
    'no-mixed-operators': 'off',
    // Enforces the usage of trailing commas.
    'comma-dangle': [
      'error',
      {
        'functions': 'never',
        'imports': 'never',
        'exports': 'only-multiline',
        'arrays': 'only-multiline',
        'objects': 'only-multiline'
      }
    ]
  }
};