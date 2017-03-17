/*
* @Author: Gilles Coomans
* @Date:   2017-03-16 23:00:20
* @Last Modified by:   Gilles Coomans
* @Last Modified time: 2017-03-16 23:09:56
*/


import mutate from './src/index.js';

const obj = { a: { b: { c: 'hop', d: [] }, f: { g: 6789 } }, e: true };
const time = process.hrtime();
let newObj;
for (let i = 0; i < 1000; ++i)
	newObj = mutate(obj)
	.from('a.b',
		mutate.set('c', 'foo')
		.push('d', 123)
	)
	.delete('e')
	.val();
const diff = process.hrtime(time);

console.log('time : ', Math.round(diff[1]/1000), ' ns - ', obj, newObj);
