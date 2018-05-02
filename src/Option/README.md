# Rust-inspired `Option` type

Type `Option<T>` represents an optional value: every `Option` is either `Some` and contains a value, or `None`, and does not.

You could consider using `Option` for:

- Nullable pointers (`null` and/or `undefined`)
- Return value for otherwise reporting simple errors, where None is returned on error
- Default values and/or properties
- Nested optional object properties

`Option`s are commonly paired with pattern matching to query the presence of a value and take action, always accounting for the `None` case.

```typescript
const divide = (numerator: number, denominator: number): Option<number> => {
    if (denominator === 0) {
        return None
    } else {
        return Some(numerator / denominator)
    }
}

// The return value of the function is an option
const result = divide(2.0, 3.0)

// Pattern match to retrieve the value
const message = result.match({
    some: res => `Result: ${res}`,
    none: "Cannot divide by 0",
})

console.log(message) // 'Result: 0.6666666666666666'
```

## Documentation

### `is_some() => boolean`

Returns `true` if the option is a `Some` value.

#### Examples

```typescript
let x: Option<number> = Some(2)
console.log(x.is_some()) // true
```

```typescript
let x: Option<number> = None
console.log(x.is_some()) // false
```

### `is_none() => boolean`

Returns `true` if the option is a `None` value.

#### Examples

```typescript
let x: Option<number> = Some(2)
console.log(x.is_none()) // false
```

```typescript
let x: Option<number> = None
console.log(x.is_none()) // true
```

### `unwrap() => T`

Moves the value `v` out of the `Option<T>` if it is `Some(v)`.

In general, because this function may throw, its use is discouraged.
Instead, try to use `match` and handle the `None` case explicitly.

#### Throws

Throws a `ReferenceError` if the option is `None`.

#### Examples

```typescript
let x = Some("air")
console.log(x.unwrap()) // "air"
```

```typescript
let x = None
console.log(x.unwrap()) // fails, throws an Exception
```

Alternatively, you can choose to use `is_some()` to check whether the option is `Some`.
This will enable you to use `unwrap()` in the `true` / success branch.

```typescript
const getName = (name: Option<string>): string => {
    if (is_some(name)) {
        return name.unwrap()
    } else {
        return 'N/A'
    }
}
```

### `unwrap_or(def: T) => T`

Returns the contained value or a default.

#### Examples

```typescript
console.log(Some("car").unwrap_or("bike")) // "car"
console.log(None.unwrap_or("bike")) // "bike"
```

### `map(fn: (val: T) => U) => Option<U>`

Maps an `Option<T>` to `Option<U>` by applying a function to a contained value.

#### Examples

```typescript
const x: Option<number> = Some(123),
      y: Option<string> = x.map(val => val.toString())

console.log(y.is_some()) // true
console.log(y.is_none()) // false
console.log(y.unwrap_or("N/A")) // "123"
```

```typescript
const x: Option<number> = None,
      y: Option<string> = x.map(val => val.toString())

console.log(y.is_some()) // false
console.log(y.is_none()) // true
console.log(y.unwrap_or("N/A")) // "N/A"
```

### `and_then(fn: (val: T) => Option<U>) => Option<U>`

Returns `None` if the option is `None`, otherwise calls `fn` with the wrapped value and returns the result.

Some languages call this operation `flatmap`.

#### Examples

```typescript
const sq = (x: number): Option<number> => Some(x * x)
const nope = (_: number): Option<number> => None

console.log(Some(2).and_then(sq).and_then(sq)) // Some(16)
console.log(Some(2).and_then(sq).and_then(nope)) // None
console.log(Some(2).and_then(nope).and_then(sq)) // None
console.log(None.and_then(sq).and_then(sq)) // None
```

```typescript
interface Vehicle {
  driver: Option<{ contact: Option<{ name: Option<string> }> }>
}

const getDriverName = (vehicle: Vehicle): Option<string> => {
  return vehicle.driver
                .and_then(val => val.contact)
                .and_then(val => val.name)
}

console.log(getDriverName({driver: Some({contact: Some({name: Some('John')})})})) // Some('John')
console.log(getDriverName({driver: Some({contact: Some({name: None})})})) // None
console.log(getDriverName({driver: Some({contact: None})})) // None
console.log(getDriverName({driver: None})) // None
```

### `or(optb: Option<T>) => Option<T>`

Returns the option if it contains a value, otherwise returns `optb`.

#### Examples

```typescript
const x = Some(2)
const y = None
console.log(x.or(y)) // Some(2)
```

```typescript
const x = None
const y = Some(100)
console.log(x.or(y)) // Some(100)
```

```typescript
const x = Some(2)
const y = Some(100)
console.log(x.or(y)) // Some(2)
```

```typescript
const x: Option<number> = None
const y = None
console.log(x.or(y)) // None
```

### `and(optb: Option<T>) => Option<T>`

Returns `None` if the option is `None`, otherwise returns `optb`.

#### Examples

```typescript
const x = Some(2)
const y = None
console.log(x.and(y)) // None
```

```typescript
const x = None
const y = Some(100)
console.log(x.and(y)) // None
```

```typescript
const x = Some(2)
const y = Some(100)
console.log(x.and(y)) // Some(100)
```

```typescript
const x: Option<number> = None
const y = None
console.log(x.and(y)) // None
```

### `match(p: MatchPattern<T, U>): U`

```typescript
type Resolver<T> = () => T

interface MatchPattern<T, U> {
    some: (val: T) => U
    none: Resolver<U> | U
}
```

Applies a function to retrieve a contained value if `Option` is `Some`; Either returns, or applies another function to
return, a fallback value if `Option` is `None`.

#### Examples

```typescript
const getFullYear = (date: Option<Date>): number => date.match({
    some: val => val.getFullYear(),
    none: 1994
})

const someDate = Some(new Date())
const noDate = None

console.log(getFullYear(someDate)) // 2017
console.log(getFullYear(noDate)) // 1994
```

### `get_in(obj: Object, key: string): Option<T>`

Retrieves value `T` and converts it to `Option<T>` if key leads to this value, otherwise returns `None`.
It is highly recommended to cast the return type to `Option<T>` explicitly, as seen in examples below.

#### Examples

```typescript
interface Car {
  driver?: {
    contact?: {
      name?: string
    }
  }
}

const getDriverName = (car: Car): Option<string> => get_in(car, 'driver.contact.name')

console.log(getDriverName({driver: {}})) // None
console.log(getDriverName({driver: {contact: {}}})) // None
console.log(getDriverName({driver: {contact: {name: 'John'}}})) // Some('John')
```

## Appendix

### Try to avoid constructing `Some` with explicit `null` or `undefined`

```typescript
let x = Some(undefined) // Compiles, but meh.. don't use this please
let y = Some(null) // Compiles, but meh.. don't use this please
```

### Typing in action

```typescript
const getFullYear = (date: Option<Date>): number => date.match({
    some: val => val.getFullYear(),
    none: '1994' // Error: Type 'string | number' is not assignable to type 'number'.
})
```

### React examples

```typescript
interface Props {
    user: Option<User>
}

function UserComponent(props: Props) {
    const { user } = props

    return user.match({
        some: userProps => <UserProfile {...userProps} />
        none: <Loading />
    })
}
```
