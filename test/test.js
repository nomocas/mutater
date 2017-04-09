/* global describe, it */
import chai from 'chai';
import mutate from '../src/index.js';

const expect = chai.expect;
// chai.should();

describe('mutater', () => {
	describe('complex test : ', () => {

		const obj = { a: { b: { c: 'hop', d: [] }, f: { g: 6789 } }, e: true };
		const newObj = mutate(obj)
			.from('a.b',
				mutate.set('c', 'foo')
				.push('d', 123)
			)
			.delete('e')
			.val();


		it('does not modify original object', () => {
			expect(obj).to.deep.equals({ a: { b: { c: 'hop', d: [] }, f: { g: 6789 } }, e: true });
		});

		it('produces needed object', () => {
			expect(newObj).to.deep.equals({ a: { b: { c: 'foo', d: [123] }, f: { g: 6789 } } });
		});

		it('keeps untouched inner objects unmodified', () => {
			expect(obj.a.b.f).equal(newObj.a.b.f);
		});
	});

	describe('root toggle : ', () => {

		const obj = { a: true, b: { c: 345 } };
		const newObj = mutate(obj)
			.toggle('a')
			.val();

		it('does not modify original object', () => {
			expect(obj).to.deep.equals({ a: true, b: { c: 345 } });
		});

		it('produces needed object', () => {
			expect(newObj).to.deep.equals({ a: false, b: { c: 345 } });
		});

		it('keeps untouched inner objects unmodified', () => {
			expect(obj.b).equal(newObj.b);
		});
	});


	describe('inner toggle : ', () => {

		const obj = { a: { d: 12345 }, b: { c: true } };
		const newObj = mutate(obj)
			.from('b', mutate.toggle('c'))
			.val();

		it('does not modify original object', () => {
			expect(obj).to.deep.equals({ a: { d: 12345 }, b: { c: true } });
		});

		it('produces needed object', () => {
			expect(newObj).to.deep.equals({ a: { d: 12345 }, b: { c: false } });
		});

		it('keeps untouched inner objects unmodified', () => {
			expect(obj.a).equal(newObj.a);
		});
	});

	describe('root splice : ', () => {

		const obj = { a: [1, 2, 3], b: { c: 345 } };
		const newObj = mutate(obj)
			.splice('a', 1, 1, 67)
			.val();

		it('does not modify original object', () => {
			expect(obj).to.deep.equals({ a: [1, 2, 3], b: { c: 345 } });
		});

		it('produces needed object', () => {
			expect(newObj).to.deep.equals({ a: [1, 67, 3], b: { c: 345 } });
		});

		it('keeps untouched inner objects unmodified', () => {
			expect(obj.b).equal(newObj.b);
		});
	});
	describe('root splice (no addition) : ', () => {

		const obj = { a: [1, 2, 3], b: { c: 345 } };
		const newObj = mutate(obj)
			.splice('a', 1, 1)
			.val();

		it('does not modify original object', () => {
			expect(obj).to.deep.equals({ a: [1, 2, 3], b: { c: 345 } });
		});

		it('produces needed object', () => {
			expect(newObj).to.deep.equals({ a: [1, 3], b: { c: 345 } });
		});

		it('keeps untouched inner objects unmodified', () => {
			expect(obj.b).equal(newObj.b);
		});
	});

	describe('inner splice : ', () => {

		const obj = { a: { d: 12345 }, b: { c: [1, 2, 3] } };
		const newObj = mutate(obj)
			.from('b', mutate.splice('c', 1, 1, 67))
			.val();

		it('does not modify original object', () => {
			expect(obj).to.deep.equals({ a: { d: 12345 }, b: { c: [1, 2, 3] } });
		});

		it('produces needed object', () => {
			expect(newObj).to.deep.equals({ a: { d: 12345 }, b: { c: [1, 67, 3] } });
		});

		it('keeps untouched inner objects unmodified', () => {
			expect(obj.a).equal(newObj.a);
		});
	});

	describe('toggleInArray : ', () => {

		const obj = { a: { d: 12345 }, b: [1, 2, 3] };
		const newObj = mutate(obj).toggleInArray('b', 2).val();

		it('does not modify original object', () => {
			expect(obj).to.deep.equals({ a: { d: 12345 }, b: [1, 2, 3] });
		});

		it('produces needed object', () => {
			expect(newObj).to.deep.equals({ a: { d: 12345 }, b: [1, 3] });
		});

		it('keeps untouched inner objects unmodified', () => {
			expect(obj.a).equal(newObj.a);
		});
	});
	describe('mutate(obj, rule) : ', () => {

		const obj = { a: { d: 12345 }, b: [1, 2, 3] };
		const newObj = mutate(obj, mutate.toggleInArray('b', 2));

		it('does not modify original object', () => {
			expect(obj).to.deep.equals({ a: { d: 12345 }, b: [1, 2, 3] });
		});

		it('produces needed object', () => {
			expect(newObj).to.deep.equals({ a: { d: 12345 }, b: [1, 3] });
		});

		it('keeps untouched inner objects unmodified', () => {
			expect(obj.a).equal(newObj.a);
		});
	});
});

