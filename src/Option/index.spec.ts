import {
  get_in,
  is_none,
  is_option,
  is_some,
  None,
  Option,
  OptionType,
  Some,
  some_constructor,
} from "."

describe("Option", () => {
  interface IScenario<T> {
    value: T
  }

  function getAssertion<T>(type: string): (scenario: IScenario<T>) => void {
    return (scenario: IScenario<T>) => {
      it(
        "correctly creates an instance of Some with value '" + scenario.value + "'",
        () => {
          const subject = Some(scenario.value)

          expect(subject.type).toEqual(OptionType.Some)

          expect(subject.is_some()).toEqual(true)
          expect(subject.is_none()).toEqual(false)
          expect(subject.unwrap_or({} as any)).toEqual(scenario.value)

          expect(typeof subject.unwrap()).toEqual(type.toLowerCase())
          expect(subject.unwrap()).toEqual(scenario.value)
        },
      )
    }
  }

  describe("Some", () => {
    describe("Boolean", () => {
      const type = "Boolean"

      const scenarios: IScenario<boolean>[] = [
        { value: true },
        { value: false },
        { value: Boolean(true) },
      ]

      const assertion = getAssertion<boolean>(type)

      scenarios.forEach(assertion)
    })

    describe("Number", () => {
      const type = "Number"

      const scenarios: IScenario<number>[] = [
        { value: 37 },
        { value: 3.14 },
        { value: 0 },
        { value: Math.LN2 },
        { value: Infinity },
        { value: NaN },
        { value: Number(1) },
      ]

      const assertion = getAssertion<number>(type)

      scenarios.forEach(assertion)
    })

    describe("String", () => {
      const type = "String"

      const scenarios: IScenario<string>[] = [
        { value: "" },
        { value: "bla" },
        { value: typeof 1 },
        { value: String("abc") },
      ]

      const assertion = getAssertion<string>(type)

      scenarios.forEach(assertion)
    })

    describe("Function", () => {
      const type = "Function"

      const scenarios: IScenario<any>[] = [
        {
          value(): undefined {
            return undefined
          },
        },
        {
          value: class C {},
        },
        { value: Math.sin },
      ]

      const assertion = getAssertion<any>(type)

      scenarios.forEach(assertion)
    })

    describe("Object", () => {
      const type = "Object"

      const scenarios: IScenario<object>[] = [
        { value: { a: 1 } },
        { value: [1, 2, 4] },
        { value: new Date() },
        // { value: Boolean(true) },
        // { value: Number(1) },
        // { value: String("abc") },
      ]

      const assertion = getAssertion<object>(type)

      scenarios.forEach(assertion)
    })

    describe("RegEx", () => {
      const val = /s/
      it("correctly creates an instance of Option with value '" + val + "'", () => {
        const subject = Some(val)

        expect(subject.type).toEqual(OptionType.Some)

        expect(subject.is_some()).toEqual(true)
        expect(subject.is_none()).toEqual(false)
        expect(subject.unwrap_or(val)).toEqual(val)

        const type = typeof subject.unwrap()

        expect(type === "function" || type === "object").toEqual(true)
        expect(subject.unwrap()).toEqual(val)
      })
    })

    describe("Undefined, Null", () => {
      const array: string[] = ["a", "b"]
      const outOfBoundIndex = array.length + 1

      const object = {
        a: "_a",
        b: "_b",
      }
      const outOfBoundProperty = "z"

      const scenarios: IScenario<undefined | null>[] = [
        { value: undefined },
        { value: null },
        { value: array[outOfBoundIndex] },
        { value: [null][0] },
        { value: (object as any)[outOfBoundProperty] },
        { value: ({ _: null } as any)._ },
      ]

      const assertion = (scenario: IScenario<any>) => {
        it(`is None when trying to access out of bound index, property or variable,
          calling unwrap() impossible`, () => {
          const subject = Some(scenario.value)

          expect(subject.type).toEqual(OptionType.None)

          expect(subject.is_none()).toEqual(true)
          expect(subject.is_some()).toEqual(false)
          expect(() => subject.unwrap()).toThrow()
        })
      }

      scenarios.forEach(assertion)
    })

    describe("match", () => {
      it("correctly matches Some and returns transformed value", () => {
        const string = Some("string")

        const subject = string.match({
          some: (str) => str.toUpperCase(),
          none: "OTHER STRING",
        })

        expect(subject).toEqual("STRING")
      })

      it("correctly matches None and returns fallback value", () => {
        const arr = [1, 2, 3]
        const maybeNumber = Some(arr[arr.length + 1])

        const subject = maybeNumber.match({
          some: (_) => _ * 2,
          none: NaN,
        })

        expect(subject).toEqual(NaN)
      })
    })

    describe("map", () => {
      it("correctly maps Some and returns a new Some with transformed value", () => {
        const string = Some("123")

        const subject = string.map((_) => parseInt(_, 10))

        expect(is_some(subject) ? subject.unwrap() : undefined).toEqual(123)
      })
    })
  })

  describe("None", () => {
    it("correctly creates its instance, returns correct value when calling unwrap_or()", () => {
      const subject = None

      expect(subject.type).toEqual(OptionType.None)

      expect(subject.is_none()).toEqual(true)
      expect(subject.is_some()).toEqual(false)

      expect(subject.unwrap_or("string")).toEqual("string")
    })

    describe("unwrap_or", () => {
      it("should correctly throw if trying to call with undefined or null", () => {
        const subject = None

        const array = ["a"]
        const outOfBoundIndex = array.length + 1

        expect(() => subject.unwrap_or(array[outOfBoundIndex])).toThrow()
      })
    })

    describe("match", () => {
      it("correctly matches None and returns fallback value", () => {
        const subject = None.match({
          some: (_) => "something",
          none: "nothing",
        })

        expect(subject).toEqual("nothing")
      })
    })

    describe("map", () => {
      it("correctly maps Some and returns a new Some with transformed value", () => {
        const subject = None.map((_) => parseInt(_, 10))

        expect(subject.type).toEqual(OptionType.None)
      })
    })
  })

  describe("Option", () => {
    describe("match", () => {
      it("correctly matches Some and returns transformed value", () => {
        let a: Option<Date>

        const date = new Date()

        if (true === true) {
          a = Some(date)
        } else {
          a = None
        }

        const subject = a.match({
          some: (_) => _.getFullYear(),
          none: 1994,
        })

        expect(subject).toEqual(date.getFullYear())
      })

      it("correctly matches None and returns fallback value", () => {
        let a: Option<boolean>

        const initialValue = true

        if (1 > 2) {
          a = Some(initialValue)
        } else {
          a = None
        }

        const subject = a.match({
          some: (_) => !_,
          none: initialValue,
        })

        expect(subject).toEqual(initialValue)
      })

      it("correctly matches None and returns fallback value when method provided to none branch", () => {
        const a: Option<string> = None

        const subject = a.match({
          some: (_) => _,
          none: () => "N/A",
        })

        expect(subject).toEqual("N/A")
      })
    })

    describe("map", () => {
      it("returns transformed Some when method applied to a value that exists", () => {
        const arr = [1, 2, 3]

        const subject = Some(arr[0]).map((_) => _.toString())

        expect(is_some(subject) ? subject.unwrap() : undefined).toEqual("1")
      })

      it("returns None when method applied to a value that does not exist", () => {
        const arr = [1, 2, 3]

        const subject = Some(arr[arr.length + 1]).map((_) => _.toString())

        expect(subject.is_none()).toEqual(true)
      })

      it("throws when transform function throws", () => {
        const arr = [1, 2, 3]

        const subject = () => Some(arr[0]).map((_) => JSON.parse("{null}"))

        expect(subject).toThrow(SyntaxError) // cos JSON.parse
      })
    })
  })

  describe("constructor", () => {
    it("throws if no value inside", () => {
      expect(() => some_constructor(null as any)).toThrow()
    })
  })
})

describe("is_some", () => {
  it("should unwrap after a successful preliminary check", () => {
    let a: number

    const subject = Some(42)

    if (is_some(subject)) {
      a = subject.unwrap()
    } else {
      a = 0
    }

    expect(a).toEqual(42)
  })

  it("should not unwrap after a failing preliminary check", () => {
    const a: string[] = ["a", "b", "c"]
    const outOfBoundIndex = a.length + 1

    let b: string

    const subject = Some(a[outOfBoundIndex])

    if (is_some(subject)) {
      b = subject.unwrap()
    } else {
      b = "This Is None"
    }

    expect(b).toEqual("This Is None")
  })
})

describe("is_none", () => {
  it("should return true if Option is None", () => {
    const a: string[] = ["a", "b", "c"]
    const outOfBoundIndex = a.length + 1

    let b: string

    const subject = Some(a[outOfBoundIndex])

    if (is_none(subject)) {
      b = "Correct"
    } else {
      b = "Fail"
    }

    expect(is_none(subject)).toEqual(true)
    expect(b).toEqual("Correct")
  })

  it("should return false if Option is Some", () => {
    const a = () => null

    let b: string

    const subject = Some(a)

    if (is_none(subject)) {
      b = "Fail"
    } else {
      b = "Correct"
    }

    expect(is_none(subject)).toEqual(false)
    expect(b).toEqual("Correct")
  })

  it("should return true if value is None", () => {
    let a: string

    const subject = None

    if (is_none(subject)) {
      a = "Correct"
    } else {
      a = "Fail"
    }

    expect(is_none(subject)).toEqual(true)
    expect(a).toEqual("Correct")
  })
})

describe("is_option", () => {
  it("should return true if Option is None", () => {
    expect(is_option(None)).toEqual(true)
  })

  it("should return true if Option is Some", () => {
    expect(is_option(Some(""))).toEqual(true)
  })

  it("should return false if value is not an Option", () => {
    expect(is_option(new Function())).toEqual(false)
    expect(is_option({})).toEqual(false)
    expect(is_option([])).toEqual(false)
    expect(is_option(true)).toEqual(false)
    expect(is_option("")).toEqual(false)
    expect(is_option(42)).toEqual(false)
  })
})

describe("get_in", () => {
  it("correctly returns a Some if key found in nested object", () => {
    const obj = { a: { b: "val" } }
    const subject: Option<string> = get_in(obj, "a.b")

    expect(subject.is_some()).toEqual(true)
    expect(subject.unwrap_or("")).toEqual("val")
  })

  it("correctly returns a None if key not found in nested object", () => {
    const obj = { a: { b: "val" } }
    const subject: Option<string> = get_in(obj, "a.nonExistentKey")

    expect(subject.is_none()).toEqual(true)
  })

  it("correctly returns a None if object itself undefined", () => {
    const subject: Option<string> = get_in(undefined, "a.b.c.d")

    expect(subject.is_none()).toEqual(true)
  })
})

describe("and_then", () => {
  interface Contact {
    name: Option<string>
  }
  interface Driver {
    contact: Option<Contact>
  }
  interface Truck {
    driver: Option<Driver>
  }

  let contact: Contact
  let driver: Driver
  let truck: Truck

  beforeEach(() => {
    contact = { name: None }
    driver = { contact: None }
    truck = { driver: None }
  })

  it("correctly returns the name as a Some if all properties are Some", () => {
    contact.name = Some("Name")
    driver.contact = Some(contact)
    truck.driver = Some(driver)

    const subject = truck.driver.and_then((_) => _.contact).and_then((_) => _.name)

    expect(subject.is_some()).toEqual(true)
    expect(subject.unwrap_or("")).toEqual("Name")
  })

  it("correctly returns None if 'contact.name' is None", () => {
    driver.contact = Some(contact)
    truck.driver = Some(driver)

    const subject = truck.driver.and_then((_) => _.contact).and_then((_) => _.name)

    expect(subject.is_none()).toEqual(true)
  })

  it("correctly returns None if 'contact' is None", () => {
    contact.name = Some("Name")
    driver.contact = None
    truck.driver = Some(driver)

    const subject = truck.driver.and_then((_) => _.contact).and_then((_) => _.name)

    expect(subject.is_none()).toEqual(true)
  })

  it("correctly returns None if 'driver' is None", () => {
    contact.name = Some("Name")
    driver.contact = Some(contact)
    truck.driver = None

    const subject = truck.driver.and_then((_) => _.contact).and_then((_) => _.name)

    expect(subject.is_none()).toEqual(true)
  })

  it("throws if transform function throws", () => {
    contact.name = Some("Name")
    driver.contact = Some(contact)
    truck.driver = Some(driver)

    const subject = () => truck.driver.and_then((_) => Some(JSON.parse("{null}")))

    expect(subject).toThrow(SyntaxError)
  })
})

describe("or", () => {
  it("correctly returns Some(a) if 'a' is Some and 'b' is None", () => {
    const a = Some(123)
    const b = None
    const subject = a.or(b)
    expect(subject.is_some()).toEqual(true)
    expect(subject.unwrap_or(0)).toEqual(123)
  })

  it("correctly returns Some(b) if 'a' is None and 'b' is Some", () => {
    const a = None
    const b = Some(456)
    const subject = a.or(b)
    expect(subject.is_some()).toEqual(true)
    expect(subject.unwrap_or(0)).toEqual(456)
  })

  it("correctly returns Some(a) if 'a' is Some and 'b' is Some", () => {
    const a = Some(11)
    const b = Some(12)
    const subject = a.or(b)
    expect(subject.is_some()).toEqual(true)
    expect(subject.unwrap_or(0)).toEqual(11)
  })

  it("correctly returns None if 'a' is None and 'b' is None", () => {
    const a = None
    const b = None
    const subject = a.or(b)
    expect(subject.is_none()).toEqual(true)
  })
})

describe("and", () => {
  it("correctly returns None if 'a' is Some and 'b' is None", () => {
    const a = Some(123)
    const b = None
    const subject = a.and(b)
    expect(subject.is_none()).toEqual(true)
  })

  it("correctly returns None if 'a' is None and 'b' is Some", () => {
    const a = None
    const b = Some(123)
    const subject = a.and(b)
    expect(subject.is_none()).toEqual(true)
  })

  it("correctly returns Some(b) if 'a' is Some and 'b' is Some", () => {
    const a = Some(123)
    const b = Some(456)
    const subject = a.and(b)
    expect(subject.is_some()).toEqual(true)
    expect(subject.unwrap_or(0)).toEqual(456)
  })

  it("correctly returns None if 'a' is None and 'b' is None", () => {
    const a = None
    const b = None
    const subject = a.and(b)
    expect(subject.is_none()).toEqual(true)
  })
})
