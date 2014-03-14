#!/usr/bin/env node
exports = module.exports = require('util');
var arr = []
, core_slice = arr.slice
, core_splice = arr.splice
, core_concat = arr.concat
, core_push = arr.push
, core_forEach = arr.forEach
, core_map = arr.map
, core_every = arr.every
, core_some = arr.some
, core_filter = arr.filter
, core_reduce = arr.reduce
, core_toString = arr.toString
, core_reduceRight = arr.reduceRight;
exports.noop = function () {};
exports.slice = function (arrLike, f, t) {
	if (exports.isArrayLike(arrLike)) {
		return core_slice.call(arrLike, f, t);
	}
	return arrLike;
};
exports.splice = function (arrLike, i, l) {
	if (exports.isArrayLike(arrLike)) {
		return core_splice.call(arrLike, f, t);
	}
	return arrLike;
};
'Object Function Event Number Boolean String'.split(' ').forEach(function (name) {
	exports['is'+ name] = function (o) {
		return core_toString.call(o) === '[object '+name+']';
	};
});
exports.isArrayLike = function (obj, l) {
	return exports.isArray(obj) || exports.isNumeric(l = obj.length) && l > 0 && (l - 1) in  obj;
};
exports.isNaN = Number.isNaN;
exports.isFinity = Number.isFinity;
exports.isNumeric = function (obj) {
	return obj - parseFloat(obj) >= 0;
};
exports.makeArray = function (obj, ret) {
	ret = ret || [];
	if (exports.isArrayLike(obj)) {
		core_push.apply(ret, core_slice.call(obj));
	}
	return ret;
};
exports.forEach = function (obj, handle, scope) {
	if (exports.isArrayLike(obj)) {
		return core_forEach.call(obj, handle, scope);
	}
	if (exports.isObject(obj)) {
		for (var i in obj) {
			handle.call(scope || global, obj[i], i, obj);
		}
		return ;
	}
	throw TypeError(exports.format('%s should be an object or array'));
};
exports.every = function (obj, handle, scope) {
	if (exports.isArrayLike(obj)) {
		return core_every.call(obj, handle, scope);
	}
	if (exports.isObject(obj)) {
		for (var i in obj) {
			if (!handle.call(scope || global, obj[i], i, obj)) {
				return false;
			}
		}
		return true;
	}
	throw TypeError(exports.format('%s should be an object or array'));
};
exports.some = function (obj, handle, scope) {
	if (exports.isArrayLike(obj)) {
		return core_some.call(obj, handle, scope);
	}
	if (exports.isObject(obj)) {
		for (var i in obj) {
			if (handle.call(scope || global, obj[i], i, obj)) {
				return true;
			};
		}
		return false;
	}
	throw TypeError(exports.format('%s should be an object or array'));
};
exports.filter = function (obj, handle, scope) {
	if (exports.isArrayLike(obj)) {
		return core_filter.call(obj, handle, scope);
	}
	if (exports.isObject(obj)) {
		var ret = {}, i;
		for (i in obj) {
			if (handle.call(scope || global, obj[i], i, obj)) {
				ret[i] = obj[i];
			}
		}
		return ret;
	}
	throw TypeError(exports.format('%s should be an object or array'));
};
exports.map = function (obj, handle, scope) {
	if (exports.isArrayLike(obj)) {
		return core_map.call(obj, handle, scope);
	}
	if (exports.isObject(obj)) {
		var ret = {}, i;
		for (i in obj) {
			ret[i] = handle.call(scope || global, obj[i], i, obj);
		}
		return ret;
	}
	throw TypeError(exports.format('%s should be an object or array'));
};
exports.reduce = function (obj, handle, scope) {
	if (exports.isArrayLike(obj)) {
		return core_reduce.call(obj, handle, scope);
	}
	if (exports.isObject(obj)) {
		var ret = {}
		, keys = Object.keys(obj);
		return keys.reduce(function (i, j, index) {
			return handle.call(scope || global, obj[i], obj[j], index, obj);
		});
	}
	throw TypeError(exports.format('%s should be an object or array'));
};
exports.reduceRight = function (obj, handle, scope) {
	if (exports.isArrayLike(obj)) {
		return core_reduceRight.call(obj, handle, scope);
	}
	if (exports.isObject(obj)) {
		var ret = {}
		, keys = Object.keys(obj);
		return keys.reduceRight(function (i, j, index) {
			return handle.call(scope || global, obj[i], obj[j], index, obj);
		});
	}
	throw TypeError(exports.format('%s should be an object or array'));
};
exports.merge = function () {
	var options = exports.makeArray(arguments)
	, target = options.shift()
	, deep = false;
	if (target === true) {
		target = options.shift();
		deep = true;
	}
	if (!target) {
		return;
	}
	if (!options.length) {
		options = [target];
		target = [];
	}
	exports.forEach(options, function (option, i, clone) {
		clone = deep && 
			(exports.isArrayLike(option) && exports.merge(deep, option)) || option;
		core_push.call(target, clone);
	});
};
exports.extend = function () {
	var options = exports.makeArray(arguments)
	, target = options.shift()
	, deep = false
	, options;
	if (target === true) {
		target = options.shift();
		deep = true;
	}
	if (!target) {
		return ;
	}
	if (!options.length) {
		options = [target];
		target = exports.isObject(target) ? {} : [];
	}
	if (exports.isArrayLike(target) || exports.isObject(target)) {
		exports.forEach(options, function (option) {
			if (option != null) {
				exports.forEach(option, function (val, name, clone) {
					if (val != null) {
						clone = deep && (
								exports.isObject(val) || 
								exports.isArrayLike(val) && 
								exports.extend(deep, val)
							) || val;
						target[name] = clone;
					}
				});
			}
		});
		return target;
	}
	return target;
};
'error log puts debug print'.split(' ').forEach(function (name) {
	var _old = exports[name];
	exports[name] = function (str) {
		if ( exports.isString(str) && arguments.length > 1 ) {
			return _old(exports.format(str, core_slice(arguments, 1)));
		}
		return _old(str);
	}
});