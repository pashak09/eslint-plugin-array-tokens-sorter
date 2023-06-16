# eslint-plugin-array-tokens-sorter

## Purpose 

For an example you have an array of elements, and you want to sort each element in alphabetical order

Code before:

```typescript
class A {}
class B {}
class C {}

const SCOPE: unknown[] = [];

// eslint: enable-alphabetical-order-array
export default [...SCOPE, A, B, C];

export default [...SCOPE, A, B, C]; // eslint: enable-alphabetical-order-array - a second sample of usage

// eslint: enable-unique-alphabetical-order-array
export default [...SCOPE, A, A, B, C];
```

After fixing the code

```typescript
class A {}
class B {}
class C {}

const SCOPE: unknown[] = [];

// eslint: enable-alphabetical-order-array
export default [...SCOPE, A, B, C];

export default [...SCOPE, A, B, C]; // eslint: enable-alphabetical-order-array - a second sample of usage

// eslint: enable-unique-alphabetical-order-array
export default [...SCOPE, A, B, C];
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
