# janus-script

Scripting interpreter to support adaptive pages

## Documentation

You can assign values using `let` statements:

```
let a = 1;
```

Identifiers can have spaces or any characters in them, however when using spaces and other special characters you must wrap them in curly brackets:

```
let a_b = 3;
let a.b = 4;
let {a=b} = 5;
let {shoe size} = 11.5;
let {something.value 1} = "foo";
```

Identifiers can be "bound" to the value of other identifiers using `&=` the identifier that you want to bind to does not need to exist before it can be bound:

```
let c &= a;
let a = 3;
let b &= a;

//...
Janus> b
3
Janus> c
3
```

Identifiers can be "anchored" to the value of other identifiers using `#=` the identifier that you want to anchor to does not need to exist before it can be anchored.
Anchors differ from bindings in that they do not trigger change events, nor do they reflect in the environment dump (toObj).

```
let c #= a;
let a = 3;
let b #= a;

//...
Janus> b
3
Janus> c
3
```

To remove a binding, anchor, or any other value you can use the `delete` command.

```
let a = 3;
let b &= a;
let b = 7;
delete b;
let b = 7; // OK
```

## Built In Functions and Values

You can determine the type of any identifier using `typeof`:

``` let c = 8; typeof(c); // NUMBER ```

It may be necessary to convert types, this can be done with `string` and `number` :

```
let a = 3;
let b = "I have " + string(a) + " shoes.";
let input = "33";
let result = 19 + number(input);
```

Arrays can be created from string using `array`.

```
let arr = [1, 2, 3];
let j = json(arr); // string
let arr1 = array(j); // back to janus array
```

You can also get the length of an array or string using `len`.

Hash objects can be created from string using `hash`.

```
let o = {"a": 1, "b": 2};
let s = json(o); // json string
let i = hash(s); // back to a janus hash
```

For random numbers there is a `random` function it returns a *float* between 0 and 1.

You can create a deterministic random number generator using `rng`. The seed provided determines the outcome.

```
let seed = 1234;
let rand = rng(seed);
let otherRand = rng(seed);
otherRand() == rand(); // true
```

### Math Library

#### Constants

* Math.E - 2.718281828459045
* Math.PI - 3.141592653589793
* Math.LN10 - 2.302585092994046
* Math.LN2 - 0.6931471805599453
* Math.LOG2E - 1.4426950408889634
* Math.SQRT2 - 1.4142135623730951
* Math.SQRT1_2 - 0.7071067811865476

#### Functions

`Math.log(value)` - Calculates the logarithm of a value.

`Math.max(value1, value2, ...valueN)` - Evaluates value1 and value2 (or more values) and returns the largest value.

`Math.min(value1, value2, ...valueN)` - Evaluates value1 and value2 (or more values) and returns the smallest value.

`Math.round(value)` - rounds to the nearest integer


TODO