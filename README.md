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

Once an identifier is bound it can no longer be normally assigned. You can change the reference to another identifier, however trying to assign a value will result in an error.

To remove the binding or any other value you can use the `delete` command.

```
let a = 3;
let b &= a;
let b = 7; // ERROR
delete b;
let b = 7; // OK
```

## Built In Functions and Values

For random numbers there is a `rand` function. It can take a min (inclusive) and a max (exclusive) value range.

When you call with no parameters it returns a *float* between 0 and 1.

```
rand(); // 0.23452352
```

If you don't specify the max parameter, then it returns between 0 and the value.

```
let r = rand(7); // 5
```

The return value depends on the type of min & max. If min and max are both integers, it will return an integer. If either are floats, it will return a float. Note that using `#.0` will not convert it to float, you will need a minimum value on the right i.e. `0.00000001`.

```
let d6 = rand(1, 7); // 4
let q = rand(2, 3.3); // 3.12434234
let b = rand(0.1, 1); // 0.23523452
```

TODO