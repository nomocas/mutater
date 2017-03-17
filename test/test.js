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

		const obj = { a: true, b:{ c:345 } };
		const newObj = mutate(obj)
			.toggle('a')
			.val();

		it('does not modify original object', () => {
			expect(obj).to.deep.equals({ a: true, b:{ c:345 } });
		});

		it('produces needed object', () => {
			expect(newObj).to.deep.equals({ a: false, b:{ c:345 } });
		});

		it('keeps untouched inner objects unmodified', () => {
			expect(obj.a.b).equal(newObj.a.b);
		});
	});


	describe('inner toggle : ', () => {

		const obj = { a: { d: 12345}, b:{ c:true } };
		const newObj = mutate(obj)
			.from('b', mutate.toggle('c'))
			.val();

		it('does not modify original object', () => {
			expect(obj).to.deep.equals({ a: { d: 12345}, b:{ c:true } });
		});

		it('produces needed object', () => {
			expect(newObj).to.deep.equals({ a: { d: 12345}, b:{ c:false } });
		});

		it('keeps untouched inner objects unmodified', () => {
			expect(obj.a).equal(newObj.a);
		});
	});
});

