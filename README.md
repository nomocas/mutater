# Mutater

[![Travis branch](https://img.shields.io/travis/nomocas/mutater/master.svg)](https://travis-ci.org/nomocas/mutater)
[![bitHound Overall Score](https://www.bithound.io/github/nomocas/mutater/badges/score.svg)](https://www.bithound.io/github/nomocas/mutater)
[![Coverage Status](https://coveralls.io/repos/github/nomocas/mutater/badge.svg?branch=master)](https://coveralls.io/github/nomocas/mutater?branch=master)
[![npm](https://img.shields.io/npm/v/mutater.svg)]()
[![npm-downloads](https://img.shields.io/npm/dm/mutater.svg)]()
[![licence](https://img.shields.io/npm/l/mutater.svg)](https://spdx.org/licenses/MIT)
[![dependecies](https://img.shields.io/david/nomocas/mutater.svg)]()
[![dev-dependencies](https://img.shields.io/david/dev/nomocas/mutater.svg)]()

Immutable helper for Objects and Arrays.

Mutate a copy of data without changing the original source.

Natural Chained Syntax. Only makes a shallow copy of log n objects (those modified) and reuses the rest.

ES5/ES6 distributions files. Small (1.0 Ko min/gzip) and Fast (minimal copy and actions).

Of course useful with React-style libs (aka (re)render based on dom-diffing).

## Usage

Immediate mutation (no .val()) :

```javascript
import mutate from 'mutater';  // or var mutate = require('mutater');

const obj = { a: { b: { c: 'hop', d:[] } }, e:true }
const newObj = mutate(obj, 
	mutate.from('a.b',
		mutate.set('c', 'foo')
		.push('d', 123)
	)
	.delete(e)
);

// obj ==  { a: { b: { c: 'hop', d:[] } }, e:true } // the original one
// newObj ==  { a: { b: { c: 'foo', d:[123] } } }

```

On-demand mutation (using .val()) :

```javascript
import mutate from 'mutater';  // or var mutate = require('mutater');

const obj = { a: { b: { c: 'hop', d:[] } }, e:true }
const newObj = mutate(obj)
	.from('a.b',
		mutate.set('c', 'foo')
		.push('d', 123)
	)
	.delete(e)
	.val();


// obj ==  { a: { b: { c: 'hop', d:[] } }, e:true } // the original one
// newObj ==  { a: { b: { c: 'foo', d:[123] } } }

```

Rem : Never forget .val() at end of sentence to return actual value.


## API

```javascript
mutate(myObj)
.set(key, value) // obj[key] = value
.toggle(key)     // obj[key] = !obj[key];
.delete(key) 	// delete obj[key];

// object handling
.merge(key, value) 	// obj[key] = Object.assign({}, obj[key], value); (shallow)

// array handling
.push(key, value) // obj[key].push(value);
.pop(key) // obj[key].pop()
.unshift(key, value) // obj[key].unshift(value);
.shift(key) // obj[key].shift()
.splice(key, index, number, ...value) // obj[key].splice(index, number, ...value)
.toggleInArray(key, value)  // remove or add value in obj[key]

// deeper modifications : move to path.to.sub.object and shallow copy path's node, then apply actions
.from('path.to.sub.object', mutateActions)

// End of chain : return new object (modified one)
.val()
```


"From" case :
```javascript
const newObj = mutate(myObj) // at "root" : use mutate(obj) call to init mutation sentence...
.from('a.b.c', 
	mutate  // inner actions : start without call
		.set('d', myValue)
		.pop('e')
		...
)
...
.val();

```

Rem : inner actions does not implement .val(). (so no need to call it)


## Licence

The [MIT](http://opensource.org/licenses/MIT) License

Copyright 2017 (c) Gilles Coomans

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
