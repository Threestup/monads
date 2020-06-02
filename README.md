![Node.js CI](https://github.com/hqoss/monads/workflows/Node.js%20CI/badge.svg)
<!-- [![Codacy Badge](https://api.codacy.com/project/badge/Grade/65406302416243f788cee055ce10821a)](https://www.codacy.com/gh/hqoss/node-http-client?utm_source=github.com&utm_medium=referral&utm_content=hqoss/node-http-client&utm_campaign=Badge_Grade) -->
<!-- [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/65406302416243f788cee055ce10821a)](https://www.codacy.com/gh/hqoss/node-http-client?utm_source=github.com&utm_medium=referral&utm_content=hqoss/node-http-client&utm_campaign=Badge_Coverage) -->

# 👻 Monads

Type safe Option, Result, and Either types; inspired by Rust

## Table of contents

## ⏳ Install

**⚠️ NOTE:** The project is configured to target `ES2018` and the library uses `commonjs` module resolution. Read more in the [Node version support](#node-version-support) section.

```bash
npm install @hqoss/monads
```

## 📝 Usage

### `Option<T>`

ℹ️ See full `Option<T>` **[API documentation here](./src/Option)**.

```typescript
import { Option, Some, None } from "@usefultools/monads"

function divide(numerator: number, denominator: number): Option<number> {
  if (denominator === 0) {
    return None
  } else {
    return Some(numerator / denominator)
  }
};

// The return value of the function is an option
const result = divide(2.0, 3.0)

// Pattern match to retrieve the value
const message = result.match({
  some: res => `Result: ${res}`,
  none: "Cannot divide by 0",
})

console.log(message) // "Result: 0.6666666666666666"
```

### `Result<T, E>`

ℹ️ See full `Result<T, E>` **[API documentation here](./src/Result)**.

```typescript
import { Result, Ok, Err } from "@usefultools/monads"

function getIndex(values: string[], value: string): Result<number, string> {
  const index = values.indexOf(value)

  switch (index) {
    case -1:
      return Err("Value not found")
  default:
    return Ok(index)
  }
}

console.log(getIndex(["a", "b", "c"], "b")) // Ok(1)
console.log(getIndex(["a", "b", "c"], "z")) // Err("Value not found")
```

### API Docs

[See full API Documentation here](docs/globals.md).

## ⚡️ Performance

TBC

## 🧬 Core design principles

-   **Code quality**; This package may end up being used in mission-critical software, so it's important that the code is performant, secure, and battle-tested.

-   **Developer experience**; Developers must be able to use this package with no significant barriers to entry. It has to be easy-to-find, well-documented, and pleasant to use.

-   **Modularity & Configurability**; It's important that users can compose and easily change the ways in which they consume and work with this package.

## Node version support

The project is configured to target ES2018. In practice, this means consumers should run on Node 12 or higher, unless additional compilation/transpilation steps are in place to ensure compatibility with the target runtime.

Please see <https://node.green/#ES2018> for reference.

### Why ES2018

Firstly, according to the official [Node release schedule](https://github.com/nodejs/Release), Node 12.x entered LTS on 2019-10-21 and is scheduled to enter Maintenance on 2020-10-20. With the End-of-Life scheduled for April 2022, we are confident that most users will now be running 12.x or higher.

Secondly, the [7.3 release of V8](https://v8.dev/blog/v8-release-73) (ships with Node 12.x or higher) includes "zero-cost async stack traces".

From the release notes:

> We are turning on the --async-stack-traces flag by default. Zero-cost async stack traces make it easier to diagnose problems in production with heavily asynchronous code, as the error.stack property that is usually sent to log files/services now provides more insight into what caused the problem.

## Testing

[Ava](https://github.com/avajs/ava) and [Jest](https://jestjs.io/) were considered. Jest was chosen as it is very easy to configure and includes most of the features we need out-of-the-box.

Further investigation will be launched in foreseeable future to consider moving to Ava.

We prefer using [Nock](https://github.com/nock/nock) over mocking.

## TODO

A quick and dirty tech debt tracker before we move to Issues.

-   [ ] Write a **Contributing** guide
-   [ ] Complete testing section, add best practices
-   [ ] Describe scripts and usage, add best practices
-   [ ] Add typespec and generate docs
-   [ ] Describe security best practices, e.g. `npm doctor`, `npm audit`, `npm outdated`, `ignore-scripts` in `.npmrc`, etc.
-   [ ] Add "Why should I use this" section
