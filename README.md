# eslint-plugin-github

## Purpose 

For an example you have an array of elements, and you want to sort each element in alphabetical order

Code before:

```typescript
class A {}
class B {}
class C {}

const SCOPE: unknown[] = [];

// enable-alphabetical-order-array
export default [...SCOPE, A, B, C];

export default [...SCOPE, A, B, C]; // enable-alphabetical-order-array - a second sample of usage
```

After fixing the code

```typescript
class A {}
class B {}
class C {}

const SCOPE: unknown[] = [];

// enable-alphabetical-order-array
export default [...SCOPE, A, B, C];

export default [...SCOPE, A, B, C]; // enable-alphabetical-order-array - a second sample of usage
```

## Installation

```sh
yarn add -D eslint-plugin-array-tokens-sorter
```

## Setup

Add `array-tokens-sorter` to your list of plugins in your ESLint config.

JSON ESLint config example:

```json
{
  "plugins": ["array-tokens-sorter"],
  "rules": {
    "array-tokens-sorter/array": ["error", { "spreadVariablesFirst": true }]
  }
}
```

If you want to indicate the files for research you can use:

```json
{
  "overrides": [
    {
      "files": [
        "src/**/*/index.ts",
        "src/entities.ts"
      ],
      "plugins": [
        "array-tokens-sorter"
      ],
      "rules": {
        "array-tokens-sorter/array": [
          "error",
          {
            "spreadVariablesFirst": true
          }
        ]
      }
    }
  ]
}
```
