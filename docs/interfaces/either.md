[@hqoss/monads](../README.md) › [Globals](../globals.md) › [Either](either.md)

# Interface: Either <**L, R**>

## Type parameters

▪ **L**

▪ **R**

## Hierarchy

* **Either**

  ↳ [ResLeft](resleft.md)

  ↳ [ResRight](resright.md)

## Index

### Properties

* [type](either.md#type)

### Methods

* [isLeft](either.md#isleft)
* [isRight](either.md#isright)
* [left](either.md#left)
* [leftAndThen](either.md#leftandthen)
* [map](either.md#map)
* [mapLeft](either.md#mapleft)
* [mapRight](either.md#mapright)
* [match](either.md#match)
* [right](either.md#right)
* [rightAndThen](either.md#rightandthen)
* [unwrap](either.md#unwrap)
* [unwrapLeft](either.md#unwrapleft)
* [unwrapLeftOr](either.md#unwrapleftor)
* [unwrapLeftOrElse](either.md#unwrapleftorelse)
* [unwrapRight](either.md#unwrapright)
* [unwrapRightOr](either.md#unwraprightor)
* [unwrapRightOrElse](either.md#unwraprightorelse)

## Properties

###  type

• **type**: *symbol*

Defined in either/either.ts:15

## Methods

###  isLeft

▸ **isLeft**(): *boolean*

Defined in either/either.ts:16

**Returns:** *boolean*

___

###  isRight

▸ **isRight**(): *boolean*

Defined in either/either.ts:17

**Returns:** *boolean*

___

###  left

▸ **left**(): *[Option](option.md)‹L›*

Defined in either/either.ts:18

**Returns:** *[Option](option.md)‹L›*

___

###  leftAndThen

▸ **leftAndThen**<**U**>(`fn`: function): *[Either](either.md)‹U, R›*

Defined in either/either.ts:19

**Type parameters:**

▪ **U**

**Parameters:**

▪ **fn**: *function*

▸ (`val`: L): *[Either](either.md)‹U, R›*

**Parameters:**

Name | Type |
------ | ------ |
`val` | L |

**Returns:** *[Either](either.md)‹U, R›*

___

###  map

▸ **map**<**U**>(`fn`: function): *[Either](either.md)‹U, U›*

Defined in either/either.ts:30

**Type parameters:**

▪ **U**

**Parameters:**

▪ **fn**: *function*

▸ (`val`: L | R): *U*

**Parameters:**

Name | Type |
------ | ------ |
`val` | L &#124; R |

**Returns:** *[Either](either.md)‹U, U›*

___

###  mapLeft

▸ **mapLeft**<**U**>(`fn`: function): *[Either](either.md)‹U, R›*

Defined in either/either.ts:31

**Type parameters:**

▪ **U**

**Parameters:**

▪ **fn**: *function*

▸ (`left`: L): *U*

**Parameters:**

Name | Type |
------ | ------ |
`left` | L |

**Returns:** *[Either](either.md)‹U, R›*

___

###  mapRight

▸ **mapRight**<**U**>(`fn`: function): *[Either](either.md)‹L, U›*

Defined in either/either.ts:32

**Type parameters:**

▪ **U**

**Parameters:**

▪ **fn**: *function*

▸ (`right`: R): *U*

**Parameters:**

Name | Type |
------ | ------ |
`right` | R |

**Returns:** *[Either](either.md)‹L, U›*

___

###  match

▸ **match**<**U**>(`fn`: Match‹L, R, U›): *U*

Defined in either/either.ts:29

**Type parameters:**

▪ **U**

**Parameters:**

Name | Type |
------ | ------ |
`fn` | Match‹L, R, U› |

**Returns:** *U*

___

###  right

▸ **right**(): *[Option](option.md)‹R›*

Defined in either/either.ts:20

**Returns:** *[Option](option.md)‹R›*

___

###  rightAndThen

▸ **rightAndThen**<**U**>(`fn`: function): *[Either](either.md)‹L, U›*

Defined in either/either.ts:21

**Type parameters:**

▪ **U**

**Parameters:**

▪ **fn**: *function*

▸ (`val`: R): *[Either](either.md)‹L, U›*

**Parameters:**

Name | Type |
------ | ------ |
`val` | R |

**Returns:** *[Either](either.md)‹L, U›*

___

###  unwrap

▸ **unwrap**(): *L | R*

Defined in either/either.ts:22

**Returns:** *L | R*

___

###  unwrapLeft

▸ **unwrapLeft**(): *L | never*

Defined in either/either.ts:23

**Returns:** *L | never*

___

###  unwrapLeftOr

▸ **unwrapLeftOr**(`other`: L): *L*

Defined in either/either.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`other` | L |

**Returns:** *L*

___

###  unwrapLeftOrElse

▸ **unwrapLeftOrElse**(`fn`: function): *L*

Defined in either/either.ts:25

**Parameters:**

▪ **fn**: *function*

▸ (`right`: R): *L*

**Parameters:**

Name | Type |
------ | ------ |
`right` | R |

**Returns:** *L*

___

###  unwrapRight

▸ **unwrapRight**(): *R | never*

Defined in either/either.ts:26

**Returns:** *R | never*

___

###  unwrapRightOr

▸ **unwrapRightOr**(`other`: R): *R*

Defined in either/either.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`other` | R |

**Returns:** *R*

___

###  unwrapRightOrElse

▸ **unwrapRightOrElse**(`fn`: function): *R*

Defined in either/either.ts:28

**Parameters:**

▪ **fn**: *function*

▸ (`left`: L): *R*

**Parameters:**

Name | Type |
------ | ------ |
`left` | L |

**Returns:** *R*
