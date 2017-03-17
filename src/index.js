/**
 * Mutate structured object without changing original one (aka Immutable Fashion).
 * Modify only needed structure (log(n) shallow copies).
 * 
 * @example
 * import mutate from 'mutater';
 * const obj = { a: { b: { c: 'hop', d:[] } }, e:true }
 * const newObj = mutate(obj)
 * 	.from('a.b',
 * 		mutate.set('c', 'foo')
 * 		.push('d', 123)
 * 	)
 * 	.delete(e)
 * 	.val()
 *
 *
 *  ==> obj ==  { a: { b: { c: 'hop', d:[] } }, e:true } // the original one
 *  ==> newObj ==  { a: { b: { c: 'foo', d:[123] } } }
 */

class Mutater {
	constructor(obj, clone = false) {
		this.obj = !clone ? obj : (Array.isArray(obj) ? obj.slice() : Object.assign({}, obj));
	}
	from(path, rule) {
		const obj = reconstructPath(this.obj, path);
		rule.apply(obj);
		return this;
	}
	delete(key) {
		delete this.obj[key];
		return this;
	}
	toggle(key) {
		this.obj[key] = !this.obj[key];
		return this;
	}
	toggleInArray(key, value) {
		const arr = this.obj[key] = this.obj[key].slice();
		for (let i = 0, len = arr.length; i < len; ++i)
			if (arr[i] === value) {
				arr.splice(i, 1);
				return this;
			}
		arr.push(value);
		return this;
	}
	set(key, value) {
		this.obj[key] = value;
		return this;
	}
	push(key, value) {
		this.obj[key] = this.obj[key].slice();
		this.obj[key].push(value);
		return this;
	}
	splice(key, index, number, value) {
		this.obj[key] = this.obj[key].slice();
		if (arguments.length === 4)
			this.obj[key].splice(index, number, value);
		else
			this.obj[key].splice(index, number);
		return this;
	}
	merge(key, value) {
		this.obj[key] = Object.assign({}, this.obj[key], value);
		return this;
	}
	val() {
		return this.obj;
	}
}

class InnerMutater {
	constructor() {
		this._queue = [];
	}
	from(path, rule) {
		this._queue.push({ type: 'from', key: path, value: rule });
		return this;
	}
	splice(key, index, number, value) {
		this._queue.push({ type: 'splice', key, value, index, number });
		return this;
	}

	// api will be completed below (and will reflect Mutater's one)

	/**
	 * apply inner rule on object. do not clone received object. Normally you should never use it directly.
	 * @protected
	 * @param  {Object} obj the object where apply rule
	 * @return {Void}     nothing
	 */
	apply(obj) {
		const m = new Mutater(obj, false);
		this._queue.forEach((action) => action.type === 'splice' ? m.splice(action.key, action.index, action.number, action.value) : m[action.type](action.key, action.value));
	}
}

function reconstructPath(obj, path) {
	let temp = obj;
	path.split('.').forEach((part) => {
		const node = temp[part];
		if (!node)
			temp = temp[part] = {}; // by default : if node not exists : create simple object
		else if (typeof node !== 'object')
			throw new Error('mutater : you try to traverse primitive values');
		else
			temp = temp[part] = Array.isArray(node) ? node.slice() : Object.assign({}, node);
	});
	return temp;
}

function mutate(obj) {
	return new Mutater(obj, true);
}

['delete', 'toggle', 'pop', 'shift']
.forEach((name) => InnerMutater.prototype[name] = function(key) {
	this._queue.push({ type: name, key });
	return this;
});

['toggleInArray', 'set', 'push', 'unshift', 'merge']
.forEach((name) => InnerMutater.prototype[name] = function(key, value) {
	this._queue.push({ type: name, key, value });
	return this;
});

['from', 'delete', 'toggle', 'set', 'merge', 'push', 'toggleInArray', 'splice', 'unshift', 'pop', 'shift']
.forEach((name) => mutate[name] = function(...args) {
	return new InnerMutater()[name](...args);
});

export default mutate;

