;
window.Modernizr = (function(window, document, undefined) {
	var version = '2.8.3',
		Modernizr = {},
		enableClasses = true,
		docElement = document.documentElement,
		mod = 'modernizr',
		modElem = document.createElement(mod),
		mStyle = modElem.style,
		inputElem, toString = {}.toString,
		prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
		omPrefixes = 'Webkit Moz O ms',
		cssomPrefixes = omPrefixes.split(' '),
		domPrefixes = omPrefixes.toLowerCase().split(' '),
		ns = {
			'svg': 'http://www.w3.org/2000/svg'
		},
		tests = {},
		inputs = {},
		attrs = {},
		classes = [],
		slice = classes.slice,
		featureName, injectElementWithStyles = function(rule, callback, nodes, testnames) {
			var style, ret, node, docOverflow, div = document.createElement('div'),
				body = document.body,
				fakeBody = body || document.createElement('body');
			if (parseInt(nodes, 10)) {
				while (nodes--) {
					node = document.createElement('div');
					node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
					div.appendChild(node);
				}
			}
			style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
			div.id = mod;
			(body ? div : fakeBody).innerHTML += style;
			fakeBody.appendChild(div);
			if (!body) {
				fakeBody.style.background = '';
				fakeBody.style.overflow = 'hidden';
				docOverflow = docElement.style.overflow;
				docElement.style.overflow = 'hidden';
				docElement.appendChild(fakeBody);
			}
			ret = callback(div, rule);
			if (!body) {
				fakeBody.parentNode.removeChild(fakeBody);
				docElement.style.overflow = docOverflow;
			} else {
				div.parentNode.removeChild(div);
			}
			return !!ret;
		},
		isEventSupported = (function() {
			var TAGNAMES = {
				'select': 'input',
				'change': 'input',
				'submit': 'form',
				'reset': 'form',
				'error': 'img',
				'load': 'img',
				'abort': 'img'
			};

			function isEventSupported(eventName, element) {
				element = element || document.createElement(TAGNAMES[eventName] || 'div');
				eventName = 'on' + eventName;
				var isSupported = eventName in element;
				if (!isSupported) {
					if (!element.setAttribute) {
						element = document.createElement('div');
					}
					if (element.setAttribute && element.removeAttribute) {
						element.setAttribute(eventName, '');
						isSupported = is(element[eventName], 'function');
						if (!is(element[eventName], 'undefined')) {
							element[eventName] = undefined;
						}
						element.removeAttribute(eventName);
					}
				}
				element = null;
				return isSupported;
			}
			return isEventSupported;
		})(),
		_hasOwnProperty = ({}).hasOwnProperty,
		hasOwnProp;
	if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
		hasOwnProp = function(object, property) {
			return _hasOwnProperty.call(object, property);
		};
	} else {
		hasOwnProp = function(object, property) {
			return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
		};
	}
	if (!Function.prototype.bind) {
		Function.prototype.bind = function bind(that) {
			var target = this;
			if (typeof target != "function") {
				throw new TypeError();
			}
			var args = slice.call(arguments, 1),
				bound = function() {
					if (this instanceof bound) {
						var F = function() {};
						F.prototype = target.prototype;
						var self = new F();
						var result = target.apply(self, args.concat(slice.call(arguments)));
						if (Object(result) === result) {
							return result;
						}
						return self;
					} else {
						return target.apply(that, args.concat(slice.call(arguments)));
					}
				};
			return bound;
		};
	}

	function setCss(str) {
		mStyle.cssText = str;
	}

	function setCssAll(str1, str2) {
		return setCss(prefixes.join(str1 + ';') + (str2 || ''));
	}

	function is(obj, type) {
		return typeof obj === type;
	}

	function contains(str, substr) {
		return !!~('' + str).indexOf(substr);
	}

	function testProps(props, prefixed) {
		for (var i in props) {
			var prop = props[i];
			if (!contains(prop, "-") && mStyle[prop] !== undefined) {
				return prefixed == 'pfx' ? prop : true;
			}
		}
		return false;
	}

	function testDOMProps(props, obj, elem) {
		for (var i in props) {
			var item = obj[props[i]];
			if (item !== undefined) {
				if (elem === false) return props[i];
				if (is(item, 'function')) {
					return item.bind(elem || obj);
				}
				return item;
			}
		}
		return false;
	}

	function testPropsAll(prop, prefixed, elem) {
		var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
			props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
		if (is(prefixed, "string") || is(prefixed, "undefined")) {
			return testProps(props, prefixed);
		} else {
			props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
			return testDOMProps(props, prefixed, elem);
		}
	}
	tests['flexbox'] = function() {
		return testPropsAll('flexWrap');
	};
	tests['touch'] = function() {
		var bool;
		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			bool = true;
		} else {
			injectElementWithStyles(['@media (', prefixes.join('touch-enabled),('), mod, ')', '{#modernizr{top:9px;position:absolute}}'].join(''), function(node) {
				bool = node.offsetTop === 9;
			});
		}
		return bool;
	};
	tests['rgba'] = function() {
		setCss('background-color:rgba(150,255,150,.5)');
		return contains(mStyle.backgroundColor, 'rgba');
	};
	tests['hsla'] = function() {
		setCss('background-color:hsla(120,40%,100%,.5)');
		return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
	};
	tests['multiplebgs'] = function() {
		setCss('background:url(https://),url(https://),red url(https://)');
		return (/(url\s*\(.*?){3}/).test(mStyle.background);
	};
	tests['backgroundsize'] = function() {
		return testPropsAll('backgroundSize');
	};
	tests['cssanimations'] = function() {
		return testPropsAll('animationName');
	};
	tests['csscolumns'] = function() {
		return testPropsAll('columnCount');
	};
	tests['csstransforms'] = function() {
		return !!testPropsAll('transform');
	};
	tests['csstransforms3d'] = function() {
		var ret = !!testPropsAll('perspective');
		if (ret && 'webkitPerspective' in docElement.style) {
			injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function(node, rule) {
				ret = node.offsetLeft === 9 && node.offsetHeight === 3;
			});
		}
		return ret;
	};
	tests['fontface'] = function() {
		var bool;
		injectElementWithStyles('@font-face {font-family:"font";src:url("https:///")}', function(node, rule) {
			var style = document.getElementById('smodernizr'),
				sheet = style.sheet || style.styleSheet,
				cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';
			bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
		});
		return bool;
	};
	tests['svg'] = function() {
		return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
	};
	tests['inlinesvg'] = function() {
		var div = document.createElement('div');
		div.innerHTML = '<svg/>';
		return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
	};
	tests['svgclippaths'] = function() {
		return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
	};
	for (var feature in tests) {
		if (hasOwnProp(tests, feature)) {
			featureName = feature.toLowerCase();
			Modernizr[featureName] = tests[feature]();
			classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
		}
	}
	Modernizr.addTest = function(feature, test) {
		if (typeof feature == 'object') {
			for (var key in feature) {
				if (hasOwnProp(feature, key)) {
					Modernizr.addTest(key, feature[key]);
				}
			}
		} else {
			feature = feature.toLowerCase();
			if (Modernizr[feature] !== undefined) {
				return Modernizr;
			}
			test = typeof test == 'function' ? test() : test;
			if (typeof enableClasses !== "undefined" && enableClasses) {
				docElement.className += ' ' + (test ? '' : 'no-') + feature;
			}
			Modernizr[feature] = test;
		}
		return Modernizr;
	};
	setCss('');
	modElem = inputElem = null;;
	(function(window, document) {
		var version = '3.7.0';
		var options = window.html5 || {};
		var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
		var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
		var supportsHtml5Styles;
		var expando = '_html5shiv';
		var expanID = 0;
		var expandoData = {};
		var supportsUnknownElements;
		(function() {
			try {
				var a = document.createElement('a');
				a.innerHTML = '<xyz></xyz>';
				supportsHtml5Styles = ('hidden' in a);
				supportsUnknownElements = a.childNodes.length == 1 || (function() {
					(document.createElement)('a');
					var frag = document.createDocumentFragment();
					return (typeof frag.cloneNode == 'undefined' || typeof frag.createDocumentFragment == 'undefined' || typeof frag.createElement == 'undefined');
				}());
			} catch (e) {
				supportsHtml5Styles = true;
				supportsUnknownElements = true;
			}
		}());

		function addStyleSheet(ownerDocument, cssText) {
			var p = ownerDocument.createElement('p'),
				parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;
			p.innerHTML = 'x<style>' + cssText + '</style>';
			return parent.insertBefore(p.lastChild, parent.firstChild);
		}

		function getElements() {
			var elements = html5.elements;
			return typeof elements == 'string' ? elements.split(' ') : elements;
		}

		function getExpandoData(ownerDocument) {
			var data = expandoData[ownerDocument[expando]];
			if (!data) {
				data = {};
				expanID++;
				ownerDocument[expando] = expanID;
				expandoData[expanID] = data;
			}
			return data;
		}

		function createElement(nodeName, ownerDocument, data) {
			if (!ownerDocument) {
				ownerDocument = document;
			}
			if (supportsUnknownElements) {
				return ownerDocument.createElement(nodeName);
			}
			if (!data) {
				data = getExpandoData(ownerDocument);
			}
			var node;
			if (data.cache[nodeName]) {
				node = data.cache[nodeName].cloneNode();
			} else if (saveClones.test(nodeName)) {
				node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
			} else {
				node = data.createElem(nodeName);
			}
			return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
		}

		function createDocumentFragment(ownerDocument, data) {
			if (!ownerDocument) {
				ownerDocument = document;
			}
			if (supportsUnknownElements) {
				return ownerDocument.createDocumentFragment();
			}
			data = data || getExpandoData(ownerDocument);
			var clone = data.frag.cloneNode(),
				i = 0,
				elems = getElements(),
				l = elems.length;
			for (; i < l; i++) {
				clone.createElement(elems[i]);
			}
			return clone;
		}

		function shivMethods(ownerDocument, data) {
			if (!data.cache) {
				data.cache = {};
				data.createElem = ownerDocument.createElement;
				data.createFrag = ownerDocument.createDocumentFragment;
				data.frag = data.createFrag();
			}
			ownerDocument.createElement = function(nodeName) {
				if (!html5.shivMethods) {
					return data.createElem(nodeName);
				}
				return createElement(nodeName, ownerDocument, data);
			};
			ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' + 'var n=f.cloneNode(),c=n.createElement;' + 'h.shivMethods&&(' + getElements().join().replace(/[\w\-]+/g, function(nodeName) {
				data.createElem(nodeName);
				data.frag.createElement(nodeName);
				return 'c("' + nodeName + '")';
			}) + ');return n}')(html5, data.frag);
		}

		function shivDocument(ownerDocument) {
			if (!ownerDocument) {
				ownerDocument = document;
			}
			var data = getExpandoData(ownerDocument);
			if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
				data.hasCSS = !!addStyleSheet(ownerDocument, 'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' + 'mark{background:#FF0;color:#000}' + 'template{display:none}');
			}
			if (!supportsUnknownElements) {
				shivMethods(ownerDocument, data);
			}
			return ownerDocument;
		}
		var html5 = {
			'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',
			'version': version,
			'shivCSS': (options.shivCSS !== false),
			'supportsUnknownElements': supportsUnknownElements,
			'shivMethods': (options.shivMethods !== false),
			'type': 'default',
			'shivDocument': shivDocument,
			createElement: createElement,
			createDocumentFragment: createDocumentFragment
		};
		window.html5 = html5;
		shivDocument(document);
	}(this, document));
	Modernizr._version = version;
	Modernizr._prefixes = prefixes;
	Modernizr._domPrefixes = domPrefixes;
	Modernizr._cssomPrefixes = cssomPrefixes;
	Modernizr.hasEvent = isEventSupported;
	Modernizr.testProp = function(prop) {
		return testProps([prop]);
	};
	Modernizr.testAllProps = testPropsAll;
	Modernizr.testStyles = injectElementWithStyles;
	Modernizr.prefixed = function(prop, obj, elem) {
		if (!obj) {
			return testPropsAll(prop, 'pfx');
		} else {
			return testPropsAll(prop, obj, elem);
		}
	};
	docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') + (enableClasses ? ' js ' + classes.join(' ') : '');
	return Modernizr;
})(this, this.document);
(function(a, b, c) {
	function d(a) {
		return "[object Function]" == o.call(a)
	}

	function e(a) {
		return "string" == typeof a
	}

	function f() {}

	function g(a) {
		return !a || "loaded" == a || "complete" == a || "uninitialized" == a
	}

	function h() {
		var a = p.shift();
		q = 1, a ? a.t ? m(function() {
			("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
		}, 0) : (a(), h()) : q = 0
	}

	function i(a, c, d, e, f, i, j) {
		function k(b) {
			if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
				"img" != a && m(function() {
					t.removeChild(l)
				}, 50);
				for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload()
			}
		}
		var j = j || B.errorTimeout,
			l = b.createElement(a),
			o = 0,
			r = 0,
			u = {
				t: d,
				s: c,
				e: f,
				a: i,
				x: j
			};
		1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
			k.call(this, r)
		}, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l))
	}

	function j(a, b, c, d, f) {
		return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this
	}

	function k() {
		var a = B;
		return a.loader = {
			load: j,
			i: 0
		}, a
	}
	var l = b.documentElement,
		m = a.setTimeout,
		n = b.getElementsByTagName("script")[0],
		o = {}.toString,
		p = [],
		q = 0,
		r = "MozAppearance" in l.style,
		s = r && !!b.createRange().compareNode,
		t = s ? l : n.parentNode,
		l = a.opera && "[object Opera]" == o.call(a.opera),
		l = !!b.attachEvent && !l,
		u = r ? "object" : l ? "script" : "img",
		v = l ? "script" : u,
		w = Array.isArray || function(a) {
			return "[object Array]" == o.call(a)
		},
		x = [],
		y = {},
		z = {
			timeout: function(a, b) {
				return b.length && (a.timeout = b[0]), a
			}
		},
		A, B;
	B = function(a) {
		function b(a) {
			var a = a.split("!"),
				b = x.length,
				c = a.pop(),
				d = a.length,
				c = {
					url: c,
					origUrl: c,
					prefixes: a
				},
				e, f, g;
			for (f = 0; f < d; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
			for (f = 0; f < b; f++) c = x[f](c);
			return c
		}

		function g(a, e, f, g, h) {
			var i = b(a),
				j = i.autoCallback;
			i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("index.html").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function() {
				k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2
			})))
		}

		function h(a, b) {
			function c(a, c) {
				if (a) {
					if (e(a)) c || (j = function() {
						var a = [].slice.call(arguments);
						k.apply(this, a), l()
					}), g(a, j, b, 0, h);
					else if (Object(a) === a)
						for (n in m = function() {
								var b = 0,
									c;
								for (c in a) a.hasOwnProperty(c) && b++;
								return b
							}(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function() {
							var a = [].slice.call(arguments);
							k.apply(this, a), l()
						} : j[n] = function(a) {
							return function() {
								var b = [].slice.call(arguments);
								a && a.apply(this, b), l()
							}
						}(k[n])), g(a[n], j, b, n, h))
				} else !c && l()
			}
			var h = !!a.test,
				i = a.load || a.both,
				j = a.callback || f,
				k = j,
				l = a.complete || f,
				m, n;
			c(h ? a.yep : a.nope, !!i), i && c(i)
		}
		var i, j, l = this.yepnope.loader;
		if (e(a)) g(a, 0, l, 0);
		else if (w(a))
			for (i = 0; i < a.length; i++) j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l);
		else Object(a) === a && h(a, l)
	}, B.addPrefix = function(a, b) {
		z[a] = b
	}, B.addFilter = function(a) {
		x.push(a)
	}, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function() {
		b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete"
	}, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
		var k = b.createElement("script"),
			l, o, e = e || B.errorTimeout;
		k.src = a;
		for (o in d) k.setAttribute(o, d[o]);
		c = j ? h : c || f, k.onreadystatechange = k.onload = function() {
			!l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null)
		}, m(function() {
			l || (l = 1, c(1))
		}, e), i ? k.onload() : n.parentNode.insertBefore(k, n)
	}, a.yepnope.injectCss = function(a, c, d, e, g, i) {
		var e = b.createElement("link"),
			j, c = i ? h : c || f;
		e.href = a, e.rel = "stylesheet", e.type = "text/css";
		for (j in d) e.setAttribute(j, d[j]);
		g || (n.parentNode.insertBefore(e, n), m(c, 0))
	}
})(this, document);
Modernizr.load = function() {
	yepnope.apply(window, [].slice.call(arguments, 0));
};;
/*!
 * Detectizr v2.1.0
 * http://barisaydinoglu.github.com/Detectizr/
 *
 * Written by Baris Aydinoglu (http://baris.aydinoglu.info) - Copyright 2012
 * Released under the MIT license
 *
 * Date: 2015-01-03
 */
window.Detectizr = (function(window, navigator, document, undefined) {
	var Detectizr = {},
		Modernizr = window.Modernizr,
		deviceTypes = ["tv", "tablet", "mobile", "desktop"],
		options = {
			addAllFeaturesAsClass: false,
			detectDevice: true,
			detectDeviceModel: true,
			detectScreen: true,
			detectOS: true,
			detectBrowser: true,
			detectPlugins: true
		},
		plugins2detect = [{
			name: "adobereader",
			substrs: ["Adobe", "Acrobat"],
			progIds: ["AcroPDF.PDF", "PDF.PDFCtrl.5"]
		}, {
			name: "flash",
			substrs: ["Shockwave Flash"],
			progIds: ["ShockwaveFlash.ShockwaveFlash.1"]
		}, {
			name: "wmplayer",
			substrs: ["Windows Media"],
			progIds: ["wmplayer.ocx"]
		}, {
			name: "silverlight",
			substrs: ["Silverlight"],
			progIds: ["AgControl.AgControl"]
		}, {
			name: "quicktime",
			substrs: ["QuickTime"],
			progIds: ["QuickTime.QuickTime"]
		}],
		rclass = /[\t\r\n]/g,
		docElement = document.documentElement,
		resizeTimeoutId, oldOrientation;

	function extend(obj, extObj) {
		var a, b, i;
		if (arguments.length > 2) {
			for (a = 1, b = arguments.length; a < b; a += 1) {
				extend(obj, arguments[a]);
			}
		} else {
			for (i in extObj) {
				if (extObj.hasOwnProperty(i)) {
					obj[i] = extObj[i];
				}
			}
		}
		return obj;
	}

	function is(key) {
		return Detectizr.browser.userAgent.indexOf(key) > -1;
	}

	function test(regex) {
		return regex.test(Detectizr.browser.userAgent);
	}

	function exec(regex) {
		return regex.exec(Detectizr.browser.userAgent);
	}

	function trim(value) {
		return value.replace(/^\s+|\s+$/g, "");
	}

	function toCamel(string) {
		if (string === null || string === undefined) {
			return "";
		}
		return String(string).replace(/((\s|\-|\.)+[a-z0-9])/g, function($1) {
			return $1.toUpperCase().replace(/(\s|\-|\.)/g, "");
		});
	}

	function removeClass(element, value) {
		var class2remove = value || "",
			cur = element.nodeType === 1 && (element.className ? (" " + element.className + " ").replace(rclass, " ") : "");
		if (cur) {
			while (cur.indexOf(" " + class2remove + " ") >= 0) {
				cur = cur.replace(" " + class2remove + " ", " ");
			}
			element.className = value ? trim(cur) : "";
		}
	}

	function addVersionTest(version, major, minor) {
		if (!!version) {
			version = toCamel(version);
			if (!!major) {
				major = toCamel(major);
				addConditionalTest(version + major, true);
				if (!!minor) {
					addConditionalTest(version + major + "_" + minor, true);
				}
			}
		}
	}

	function addConditionalTest(feature, test) {
		if (!!feature && !!Modernizr) {
			if (options.addAllFeaturesAsClass) {
				Modernizr.addTest(feature, test);
			} else {
				test = typeof test === "function" ? test() : test;
				if (test) {
					Modernizr.addTest(feature, true);
				} else {
					delete Modernizr[feature];
					removeClass(docElement, feature);
				}
			}
		}
	}

	function setVersion(versionType, versionFull) {
		versionType.version = versionFull;
		var versionArray = versionFull.split(".");
		if (versionArray.length > 0) {
			versionArray = versionArray.reverse();
			versionType.major = versionArray.pop();
			if (versionArray.length > 0) {
				versionType.minor = versionArray.pop();
				if (versionArray.length > 0) {
					versionArray = versionArray.reverse();
					versionType.patch = versionArray.join(".");
				} else {
					versionType.patch = "0";
				}
			} else {
				versionType.minor = "0";
			}
		} else {
			versionType.major = "0";
		}
	}

	function checkOrientation() {
		window.clearTimeout(resizeTimeoutId);
		resizeTimeoutId = window.setTimeout(function() {
			oldOrientation = Detectizr.device.orientation;
			if (window.innerHeight > window.innerWidth) {
				Detectizr.device.orientation = "portrait";
			} else {
				Detectizr.device.orientation = "landscape";
			}
			addConditionalTest(Detectizr.device.orientation, true);
			if (oldOrientation !== Detectizr.device.orientation) {
				addConditionalTest(oldOrientation, false);
			}
		}, 10);
	}

	function detectPlugin(substrs) {
		var plugins = navigator.plugins,
			plugin, haystack, pluginFoundText, j, k;
		for (j = plugins.length - 1; j >= 0; j--) {
			plugin = plugins[j];
			haystack = plugin.name + plugin.description;
			pluginFoundText = 0;
			for (k = substrs.length; k >= 0; k--) {
				if (haystack.indexOf(substrs[k]) !== -1) {
					pluginFoundText += 1;
				}
			}
			if (pluginFoundText === substrs.length) {
				return true;
			}
		}
		return false;
	}

	function detectObject(progIds) {
		var j;
		for (j = progIds.length - 1; j >= 0; j--) {
			try {
				new ActiveXObject(progIds[j]);
			} catch (e) {}
		}
		return false;
	}

	function detect(opt) {
		var i, j, device, os, browser, plugin2detect, pluginFound;
		options = extend({}, options, opt || {});
		if (options.detectDevice) {
			Detectizr.device = {
				type: "",
				model: "",
				orientation: ""
			};
			device = Detectizr.device;
			if (test(/googletv|smarttv|smart-tv|internet.tv|netcast|nettv|appletv|boxee|kylo|roku|dlnadoc|roku|pov_tv|hbbtv|ce\-html/)) {
				device.type = deviceTypes[0];
				device.model = "smartTv";
			} else if (test(/xbox|playstation.3|wii/)) {
				device.type = deviceTypes[0];
				device.model = "gameConsole";
			} else if (test(/ip(a|ro)d/)) {
				device.type = deviceTypes[1];
				device.model = "ipad";
			} else if ((test(/tablet/) && !test(/rx-34/)) || test(/folio/)) {
				device.type = deviceTypes[1];
				device.model = String(exec(/playbook/) || "");
			} else if (test(/linux/) && test(/android/) && !test(/fennec|mobi|htc.magic|htcX06ht|nexus.one|sc-02b|fone.945/)) {
				device.type = deviceTypes[1];
				device.model = "android";
			} else if (test(/kindle/) || (test(/mac.os/) && test(/silk/))) {
				device.type = deviceTypes[1];
				device.model = "kindle";
			} else if (test(/gt-p10|sc-01c|shw-m180s|sgh-t849|sch-i800|shw-m180l|sph-p100|sgh-i987|zt180|htc(.flyer|\_flyer)|sprint.atp51|viewpad7|pandigital(sprnova|nova)|ideos.s7|dell.streak.7|advent.vega|a101it|a70bht|mid7015|next2|nook/) || (test(/mb511/) && test(/rutem/))) {
				device.type = deviceTypes[1];
				device.model = "android";
			} else if (test(/bb10/)) {
				device.type = deviceTypes[1];
				device.model = "blackberry";
			} else {
				device.model = exec(/iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec|j2me/);
				if (device.model !== null) {
					device.type = deviceTypes[2];
					device.model = String(device.model);
				} else {
					device.model = "";
					if (test(/bolt|fennec|iris|maemo|minimo|mobi|mowser|netfront|novarra|prism|rx-34|skyfire|tear|xv6875|xv6975|google.wireless.transcoder/)) {
						device.type = deviceTypes[2];
					} else if (test(/opera/) && test(/windows.nt.5/) && test(/htc|xda|mini|vario|samsung\-gt\-i8000|samsung\-sgh\-i9/)) {
						device.type = deviceTypes[2];
					} else if ((test(/windows.(nt|xp|me|9)/) && !test(/phone/)) || test(/win(9|.9|nt)/) || test(/\(windows 8\)/)) {
						device.type = deviceTypes[3];
					} else if (test(/macintosh|powerpc/) && !test(/silk/)) {
						device.type = deviceTypes[3];
						device.model = "mac";
					} else if (test(/linux/) && test(/x11/)) {
						device.type = deviceTypes[3];
					} else if (test(/solaris|sunos|bsd/)) {
						device.type = deviceTypes[3];
					} else if (test(/cros/)) {
						device.type = deviceTypes[3];
					} else if (test(/bot|crawler|spider|yahoo|ia_archiver|covario-ids|findlinks|dataparksearch|larbin|mediapartners-google|ng-search|snappy|teoma|jeeves|tineye/) && !test(/mobile/)) {
						device.type = deviceTypes[3];
						device.model = "crawler";
					} else {
						device.type = deviceTypes[2];
					}
				}
			}
			for (i = 0, j = deviceTypes.length; i < j; i += 1) {
				addConditionalTest(deviceTypes[i], (device.type === deviceTypes[i]));
			}
			if (options.detectDeviceModel) {
				addConditionalTest(toCamel(device.model), true);
			}
		}
		if (options.detectScreen) {
			device.screen = {};
			if (!!Modernizr && !!Modernizr.mq) {
				if (Modernizr.mq("only screen and (max-width: 240px)")) {
					device.screen.size = "veryVerySmall";
					addConditionalTest("veryVerySmallScreen", true);
				} else if (Modernizr.mq("only screen and (max-width: 320px)")) {
					device.screen.size = "verySmall";
					addConditionalTest("verySmallScreen", true);
				} else if (Modernizr.mq("only screen and (max-width: 480px)")) {
					device.screen.size = "small";
					addConditionalTest("smallScreen", true);
				}
				if (device.type === deviceTypes[1] || device.type === deviceTypes[2]) {
					if (Modernizr.mq("only screen and (-moz-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)")) {
						device.screen.resolution = "high";
						addConditionalTest("highresolution", true);
					}
				}
			}
			if (device.type === deviceTypes[1] || device.type === deviceTypes[2]) {
				window.onresize = function(event) {
					checkOrientation(event);
				};
				checkOrientation();
			} else {
				device.orientation = "landscape";
				addConditionalTest(device.orientation, true);
			}
		}
		if (options.detectOS) {
			Detectizr.os = {};
			os = Detectizr.os;
			if (device.model !== "") {
				if (device.model === "ipad" || device.model === "iphone" || device.model === "ipod") {
					os.name = "ios";
					setVersion(os, (test(/os\s([\d_]+)/) ? RegExp.$1 : "").replace(/_/g, "."));
				} else if (device.model === "android") {
					os.name = "android";
					setVersion(os, (test(/android\s([\d\.]+)/) ? RegExp.$1 : ""));
				} else if (device.model === "blackberry") {
					os.name = "blackberry";
					setVersion(os, (test(/version\/([^\s]+)/) ? RegExp.$1 : ""));
				} else if (device.model === "playbook") {
					os.name = "blackberry";
					setVersion(os, (test(/os ([^\s]+)/) ? RegExp.$1.replace(";", "") : ""));
				}
			}
			if (!os.name) {
				if (is("win") || is("16bit")) {
					os.name = "windows";
					if (is("windows nt 6.3")) {
						setVersion(os, "8.1");
					} else if (is("windows nt 6.2") || test(/\(windows 8\)/)) {
						setVersion(os, "8");
					} else if (is("windows nt 6.1")) {
						setVersion(os, "7");
					} else if (is("windows nt 6.0")) {
						setVersion(os, "vista");
					} else if (is("windows nt 5.2") || is("windows nt 5.1") || is("windows xp")) {
						setVersion(os, "xp");
					} else if (is("windows nt 5.0") || is("windows 2000")) {
						setVersion(os, "2k");
					} else if (is("winnt") || is("windows nt")) {
						setVersion(os, "nt");
					} else if (is("win98") || is("windows 98")) {
						setVersion(os, "98");
					} else if (is("win95") || is("windows 95")) {
						setVersion(os, "95");
					}
				} else if (is("mac") || is("darwin")) {
					os.name = "mac os";
					if (is("68k") || is("68000")) {
						setVersion(os, "68k");
					} else if (is("ppc") || is("powerpc")) {
						setVersion(os, "ppc");
					} else if (is("os x")) {
						setVersion(os, (test(/os\sx\s([\d_]+)/) ? RegExp.$1 : "os x").replace(/_/g, "."));
					}
				} else if (is("webtv")) {
					os.name = "webtv";
				} else if (is("x11") || is("inux")) {
					os.name = "linux";
				} else if (is("sunos")) {
					os.name = "sun";
				} else if (is("irix")) {
					os.name = "irix";
				} else if (is("freebsd")) {
					os.name = "freebsd";
				} else if (is("bsd")) {
					os.name = "bsd";
				}
			}
			if (!!os.name) {
				addConditionalTest(os.name, true);
				if (!!os.major) {
					addVersionTest(os.name, os.major);
					if (!!os.minor) {
						addVersionTest(os.name, os.major, os.minor);
					}
				}
			}
			if (test(/\sx64|\sx86|\swin64|\swow64|\samd64/)) {
				os.addressRegisterSize = "64bit";
			} else {
				os.addressRegisterSize = "32bit";
			}
			addConditionalTest(os.addressRegisterSize, true);
		}
		if (options.detectBrowser) {
			browser = Detectizr.browser;
			if (!test(/opera|webtv/) && (test(/msie\s([\d\w\.]+)/) || is("trident"))) {
				browser.engine = "trident";
				browser.name = "ie";
				if (!window.addEventListener && document.documentMode && document.documentMode === 7) {
					setVersion(browser, "8.compat");
				} else if (test(/trident.*rv[ :](\d+)\./)) {
					setVersion(browser, RegExp.$1);
				} else {
					setVersion(browser, (test(/trident\/4\.0/) ? "8" : RegExp.$1));
				}
			} else if (is("firefox")) {
				browser.engine = "gecko";
				browser.name = "firefox";
				setVersion(browser, (test(/firefox\/([\d\w\.]+)/) ? RegExp.$1 : ""));
			} else if (is("gecko/index.html")) {
				browser.engine = "gecko";
			} else if (is("opera")) {
				browser.name = "opera";
				browser.engine = "presto";
				setVersion(browser, (test(/version\/([\d\.]+)/) ? RegExp.$1 : (test(/opera(\s|\/)([\d\.]+)/) ? RegExp.$2 : "")));
			} else if (is("konqueror")) {
				browser.name = "konqueror";
			} else if (is("chrome")) {
				browser.engine = "webkit";
				browser.name = "chrome";
				setVersion(browser, (test(/chrome\/([\d\.]+)/) ? RegExp.$1 : ""));
			} else if (is("iron")) {
				browser.engine = "webkit";
				browser.name = "iron";
			} else if (is("crios")) {
				browser.name = "chrome";
				browser.engine = "webkit";
				setVersion(browser, (test(/crios\/([\d\.]+)/) ? RegExp.$1 : ""));
			} else if (is("applewebkit/index.html")) {
				browser.name = "safari";
				browser.engine = "webkit";
				setVersion(browser, (test(/version\/([\d\.]+)/) ? RegExp.$1 : ""));
			} else if (is("mozilla/index.html")) {
				browser.engine = "gecko";
			}
			if (!!browser.name) {
				addConditionalTest(browser.name, true);
				if (!!browser.major) {
					addVersionTest(browser.name, browser.major);
					if (!!browser.minor) {
						addVersionTest(browser.name, browser.major, browser.minor);
					}
				}
			}
			addConditionalTest(browser.engine, true);
			browser.language = navigator.userLanguage || navigator.language;
			addConditionalTest(browser.language, true);
		}
		if (options.detectPlugins) {
			browser.plugins = [];
			for (i = plugins2detect.length - 1; i >= 0; i--) {
				plugin2detect = plugins2detect[i];
				pluginFound = false;
				if (window.ActiveXObject) {
					pluginFound = detectObject(plugin2detect.progIds);
				} else if (navigator.plugins) {
					pluginFound = detectPlugin(plugin2detect.substrs);
				}
				if (pluginFound) {
					browser.plugins.push(plugin2detect.name);
					addConditionalTest(plugin2detect.name, true);
				}
			}
			if (navigator.javaEnabled()) {
				browser.plugins.push("java");
				addConditionalTest("java", true);
			}
		}
	}
	Detectizr.detect = function(settings) {
		return detect(settings);
	};
	Detectizr.init = function() {
		if (Detectizr !== undefined) {
			Detectizr.browser = {
				userAgent: (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
			};
			Detectizr.detect();
		}
	};
	Detectizr.init();
	return Detectizr;
}(this, this.navigator, this.document));
/*! jQuery v1.8.3 jquery.com | jquery.org/license */
(function(e, t) {
	function _(e) {
		var t = M[e] = {};
		return v.each(e.split(y), function(e, n) {
			t[n] = !0
		}), t
	}

	function H(e, n, r) {
		if (r === t && e.nodeType === 1) {
			var i = "data-" + n.replace(P, "-$1").toLowerCase();
			r = e.getAttribute(i);
			if (typeof r == "string") {
				try {
					r = r === "true" ? !0 : r === "false" ? !1 : r === "null" ? null : +r + "" === r ? +r : D.test(r) ? v.parseJSON(r) : r
				} catch (s) {}
				v.data(e, n, r)
			} else r = t
		}
		return r
	}

	function B(e) {
		var t;
		for (t in e) {
			if (t === "data" && v.isEmptyObject(e[t])) continue;
			if (t !== "toJSON") return !1
		}
		return !0
	}

	function et() {
		return !1
	}

	function tt() {
		return !0
	}

	function ut(e) {
		return !e || !e.parentNode || e.parentNode.nodeType === 11
	}

	function at(e, t) {
		do e = e[t]; while (e && e.nodeType !== 1);
		return e
	}

	function ft(e, t, n) {
		t = t || 0;
		if (v.isFunction(t)) return v.grep(e, function(e, r) {
			var i = !!t.call(e, r, e);
			return i === n
		});
		if (t.nodeType) return v.grep(e, function(e, r) {
			return e === t === n
		});
		if (typeof t == "string") {
			var r = v.grep(e, function(e) {
				return e.nodeType === 1
			});
			if (it.test(t)) return v.filter(t, r, !n);
			t = v.filter(t, r)
		}
		return v.grep(e, function(e, r) {
			return v.inArray(e, t) >= 0 === n
		})
	}

	function lt(e) {
		var t = ct.split("|"),
			n = e.createDocumentFragment();
		if (n.createElement)
			while (t.length) n.createElement(t.pop());
		return n
	}

	function Lt(e, t) {
		return e.getElementsByTagName(t)[0] || e.appendChild(e.ownerDocument.createElement(t))
	}

	function At(e, t) {
		if (t.nodeType !== 1 || !v.hasData(e)) return;
		var n, r, i, s = v._data(e),
			o = v._data(t, s),
			u = s.events;
		if (u) {
			delete o.handle, o.events = {};
			for (n in u)
				for (r = 0, i = u[n].length; r < i; r++) v.event.add(t, n, u[n][r])
		}
		o.data && (o.data = v.extend({}, o.data))
	}

	function Ot(e, t) {
		var n;
		if (t.nodeType !== 1) return;
		t.clearAttributes && t.clearAttributes(), t.mergeAttributes && t.mergeAttributes(e), n = t.nodeName.toLowerCase(), n === "object" ? (t.parentNode && (t.outerHTML = e.outerHTML), v.support.html5Clone && e.innerHTML && !v.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : n === "input" && Et.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : n === "option" ? t.selected = e.defaultSelected : n === "input" || n === "textarea" ? t.defaultValue = e.defaultValue : n === "script" && t.text !== e.text && (t.text = e.text), t.removeAttribute(v.expando)
	}

	function Mt(e) {
		return typeof e.getElementsByTagName != "undefined" ? e.getElementsByTagName("*") : typeof e.querySelectorAll != "undefined" ? e.querySelectorAll("*") : []
	}

	function _t(e) {
		Et.test(e.type) && (e.defaultChecked = e.checked)
	}

	function Qt(e, t) {
		if (t in e) return t;
		var n = t.charAt(0).toUpperCase() + t.slice(1),
			r = t,
			i = Jt.length;
		while (i--) {
			t = Jt[i] + n;
			if (t in e) return t
		}
		return r
	}

	function Gt(e, t) {
		return e = t || e, v.css(e, "display") === "none" || !v.contains(e.ownerDocument, e)
	}

	function Yt(e, t) {
		var n, r, i = [],
			s = 0,
			o = e.length;
		for (; s < o; s++) {
			n = e[s];
			if (!n.style) continue;
			i[s] = v._data(n, "olddisplay"), t ? (!i[s] && n.style.display === "none" && (n.style.display = ""), n.style.display === "" && Gt(n) && (i[s] = v._data(n, "olddisplay", nn(n.nodeName)))) : (r = Dt(n, "display"), !i[s] && r !== "none" && v._data(n, "olddisplay", r))
		}
		for (s = 0; s < o; s++) {
			n = e[s];
			if (!n.style) continue;
			if (!t || n.style.display === "none" || n.style.display === "") n.style.display = t ? i[s] || "" : "none"
		}
		return e
	}

	function Zt(e, t, n) {
		var r = Rt.exec(t);
		return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
	}

	function en(e, t, n, r) {
		var i = n === (r ? "border" : "content") ? 4 : t === "width" ? 1 : 0,
			s = 0;
		for (; i < 4; i += 2) n === "margin" && (s += v.css(e, n + $t[i], !0)), r ? (n === "content" && (s -= parseFloat(Dt(e, "padding" + $t[i])) || 0), n !== "margin" && (s -= parseFloat(Dt(e, "border" + $t[i] + "Width")) || 0)) : (s += parseFloat(Dt(e, "padding" + $t[i])) || 0, n !== "padding" && (s += parseFloat(Dt(e, "border" + $t[i] + "Width")) || 0));
		return s
	}

	function tn(e, t, n) {
		var r = t === "width" ? e.offsetWidth : e.offsetHeight,
			i = !0,
			s = v.support.boxSizing && v.css(e, "boxSizing") === "border-box";
		if (r <= 0 || r == null) {
			r = Dt(e, t);
			if (r < 0 || r == null) r = e.style[t];
			if (Ut.test(r)) return r;
			i = s && (v.support.boxSizingReliable || r === e.style[t]), r = parseFloat(r) || 0
		}
		return r + en(e, t, n || (s ? "border" : "content"), i) + "px"
	}

	function nn(e) {
		if (Wt[e]) return Wt[e];
		var t = v("<" + e + ">").appendTo(i.body),
			n = t.css("display");
		t.remove();
		if (n === "none" || n === "") {
			Pt = i.body.appendChild(Pt || v.extend(i.createElement("iframe"), {
				frameBorder: 0,
				width: 0,
				height: 0
			}));
			if (!Ht || !Pt.createElement) Ht = (Pt.contentWindow || Pt.contentDocument).document, Ht.write("<!doctype html><html><body>"), Ht.close();
			t = Ht.body.appendChild(Ht.createElement(e)), n = Dt(t, "display"), i.body.removeChild(Pt)
		}
		return Wt[e] = n, n
	}

	function fn(e, t, n, r) {
		var i;
		if (v.isArray(t)) v.each(t, function(t, i) {
			n || sn.test(e) ? r(e, i) : fn(e + "[" + (typeof i == "object" ? t : "") + "]", i, n, r)
		});
		else if (!n && v.type(t) === "object")
			for (i in t) fn(e + "[" + i + "]", t[i], n, r);
		else r(e, t)
	}

	function Cn(e) {
		return function(t, n) {
			typeof t != "string" && (n = t, t = "*");
			var r, i, s, o = t.toLowerCase().split(y),
				u = 0,
				a = o.length;
			if (v.isFunction(n))
				for (; u < a; u++) r = o[u], s = /^\+/.test(r), s && (r = r.substr(1) || "*"), i = e[r] = e[r] || [], i[s ? "unshift" : "push"](n)
		}
	}

	function kn(e, n, r, i, s, o) {
		s = s || n.dataTypes[0], o = o || {}, o[s] = !0;
		var u, a = e[s],
			f = 0,
			l = a ? a.length : 0,
			c = e === Sn;
		for (; f < l && (c || !u); f++) u = a[f](n, r, i), typeof u == "string" && (!c || o[u] ? u = t : (n.dataTypes.unshift(u), u = kn(e, n, r, i, u, o)));
		return (c || !u) && !o["*"] && (u = kn(e, n, r, i, "*", o)), u
	}

	function Ln(e, n) {
		var r, i, s = v.ajaxSettings.flatOptions || {};
		for (r in n) n[r] !== t && ((s[r] ? e : i || (i = {}))[r] = n[r]);
		i && v.extend(!0, e, i)
	}

	function An(e, n, r) {
		var i, s, o, u, a = e.contents,
			f = e.dataTypes,
			l = e.responseFields;
		for (s in l) s in r && (n[l[s]] = r[s]);
		while (f[0] === "*") f.shift(), i === t && (i = e.mimeType || n.getResponseHeader("content-type"));
		if (i)
			for (s in a)
				if (a[s] && a[s].test(i)) {
					f.unshift(s);
					break
				}
		if (f[0] in r) o = f[0];
		else {
			for (s in r) {
				if (!f[0] || e.converters[s + " " + f[0]]) {
					o = s;
					break
				}
				u || (u = s)
			}
			o = o || u
		}
		if (o) return o !== f[0] && f.unshift(o), r[o]
	}

	function On(e, t) {
		var n, r, i, s, o = e.dataTypes.slice(),
			u = o[0],
			a = {},
			f = 0;
		e.dataFilter && (t = e.dataFilter(t, e.dataType));
		if (o[1])
			for (n in e.converters) a[n.toLowerCase()] = e.converters[n];
		for (; i = o[++f];)
			if (i !== "*") {
				if (u !== "*" && u !== i) {
					n = a[u + " " + i] || a["* " + i];
					if (!n)
						for (r in a) {
							s = r.split(" ");
							if (s[1] === i) {
								n = a[u + " " + s[0]] || a["* " + s[0]];
								if (n) {
									n === !0 ? n = a[r] : a[r] !== !0 && (i = s[0], o.splice(f--, 0, i));
									break
								}
							}
						}
					if (n !== !0)
						if (n && e["throws"]) t = n(t);
						else try {
							t = n(t)
						} catch (l) {
							return {
								state: "parsererror",
								error: n ? l : "No conversion from " + u + " to " + i
							}
						}
				}
				u = i
			}
		return {
			state: "success",
			data: t
		}
	}

	function Fn() {
		try {
			return new e.XMLHttpRequest
		} catch (t) {}
	}

	function In() {
		try {
			return new e.ActiveXObject("Microsoft.XMLHTTP")
		} catch (t) {}
	}

	function $n() {
		return setTimeout(function() {
			qn = t
		}, 0), qn = v.now()
	}

	function Jn(e, t) {
		v.each(t, function(t, n) {
			var r = (Vn[t] || []).concat(Vn["*"]),
				i = 0,
				s = r.length;
			for (; i < s; i++)
				if (r[i].call(e, t, n)) return
		})
	}

	function Kn(e, t, n) {
		var r, i = 0,
			s = 0,
			o = Xn.length,
			u = v.Deferred().always(function() {
				delete a.elem
			}),
			a = function() {
				var t = qn || $n(),
					n = Math.max(0, f.startTime + f.duration - t),
					r = n / f.duration || 0,
					i = 1 - r,
					s = 0,
					o = f.tweens.length;
				for (; s < o; s++) f.tweens[s].run(i);
				return u.notifyWith(e, [f, i, n]), i < 1 && o ? n : (u.resolveWith(e, [f]), !1)
			},
			f = u.promise({
				elem: e,
				props: v.extend({}, t),
				opts: v.extend(!0, {
					specialEasing: {}
				}, n),
				originalProperties: t,
				originalOptions: n,
				startTime: qn || $n(),
				duration: n.duration,
				tweens: [],
				createTween: function(t, n, r) {
					var i = v.Tween(e, f.opts, t, n, f.opts.specialEasing[t] || f.opts.easing);
					return f.tweens.push(i), i
				},
				stop: function(t) {
					var n = 0,
						r = t ? f.tweens.length : 0;
					for (; n < r; n++) f.tweens[n].run(1);
					return t ? u.resolveWith(e, [f, t]) : u.rejectWith(e, [f, t]), this
				}
			}),
			l = f.props;
		Qn(l, f.opts.specialEasing);
		for (; i < o; i++) {
			r = Xn[i].call(f, e, l, f.opts);
			if (r) return r
		}
		return Jn(f, l), v.isFunction(f.opts.start) && f.opts.start.call(e, f), v.fx.timer(v.extend(a, {
			anim: f,
			queue: f.opts.queue,
			elem: e
		})), f.progress(f.opts.progress).done(f.opts.done, f.opts.complete).fail(f.opts.fail).always(f.opts.always)
	}

	function Qn(e, t) {
		var n, r, i, s, o;
		for (n in e) {
			r = v.camelCase(n), i = t[r], s = e[n], v.isArray(s) && (i = s[1], s = e[n] = s[0]), n !== r && (e[r] = s, delete e[n]), o = v.cssHooks[r];
			if (o && "expand" in o) {
				s = o.expand(s), delete e[r];
				for (n in s) n in e || (e[n] = s[n], t[n] = i)
			} else t[r] = i
		}
	}

	function Gn(e, t, n) {
		var r, i, s, o, u, a, f, l, c, h = this,
			p = e.style,
			d = {},
			m = [],
			g = e.nodeType && Gt(e);
		n.queue || (l = v._queueHooks(e, "fx"), l.unqueued == null && (l.unqueued = 0, c = l.empty.fire, l.empty.fire = function() {
			l.unqueued || c()
		}), l.unqueued++, h.always(function() {
			h.always(function() {
				l.unqueued--, v.queue(e, "fx").length || l.empty.fire()
			})
		})), e.nodeType === 1 && ("height" in t || "width" in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], v.css(e, "display") === "inline" && v.css(e, "float") === "none" && (!v.support.inlineBlockNeedsLayout || nn(e.nodeName) === "inline" ? p.display = "inline-block" : p.zoom = 1)), n.overflow && (p.overflow = "hidden", v.support.shrinkWrapBlocks || h.done(function() {
			p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
		}));
		for (r in t) {
			s = t[r];
			if (Un.exec(s)) {
				delete t[r], a = a || s === "toggle";
				if (s === (g ? "hide" : "show")) continue;
				m.push(r)
			}
		}
		o = m.length;
		if (o) {
			u = v._data(e, "fxshow") || v._data(e, "fxshow", {}), "hidden" in u && (g = u.hidden), a && (u.hidden = !g), g ? v(e).show() : h.done(function() {
				v(e).hide()
			}), h.done(function() {
				var t;
				v.removeData(e, "fxshow", !0);
				for (t in d) v.style(e, t, d[t])
			});
			for (r = 0; r < o; r++) i = m[r], f = h.createTween(i, g ? u[i] : 0), d[i] = u[i] || v.style(e, i), i in u || (u[i] = f.start, g && (f.end = f.start, f.start = i === "width" || i === "height" ? 1 : 0))
		}
	}

	function Yn(e, t, n, r, i) {
		return new Yn.prototype.init(e, t, n, r, i)
	}

	function Zn(e, t) {
		var n, r = {
				height: e
			},
			i = 0;
		t = t ? 1 : 0;
		for (; i < 4; i += 2 - t) n = $t[i], r["margin" + n] = r["padding" + n] = e;
		return t && (r.opacity = r.width = e), r
	}

	function tr(e) {
		return v.isWindow(e) ? e : e.nodeType === 9 ? e.defaultView || e.parentWindow : !1
	}
	var n, r, i = e.document,
		s = e.location,
		o = e.navigator,
		u = e.jQuery,
		a = e.$,
		f = Array.prototype.push,
		l = Array.prototype.slice,
		c = Array.prototype.indexOf,
		h = Object.prototype.toString,
		p = Object.prototype.hasOwnProperty,
		d = String.prototype.trim,
		v = function(e, t) {
			return new v.fn.init(e, t, n)
		},
		m = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,
		g = /\S/,
		y = /\s+/,
		b = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
		w = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
		E = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
		S = /^[\],:{}\s]*$/,
		x = /(?:^|:|,)(?:\s*\[)+/g,
		T = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
		N = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,
		C = /^-ms-/,
		k = /-([\da-z])/gi,
		L = function(e, t) {
			return (t + "").toUpperCase()
		},
		A = function() {
			i.addEventListener ? (i.removeEventListener("DOMContentLoaded", A, !1), v.ready()) : i.readyState === "complete" && (i.detachEvent("onreadystatechange", A), v.ready())
		},
		O = {};
	v.fn = v.prototype = {
		constructor: v,
		init: function(e, n, r) {
			var s, o, u, a;
			if (!e) return this;
			if (e.nodeType) return this.context = this[0] = e, this.length = 1, this;
			if (typeof e == "string") {
				e.charAt(0) === "<" && e.charAt(e.length - 1) === ">" && e.length >= 3 ? s = [null, e, null] : s = w.exec(e);
				if (s && (s[1] || !n)) {
					if (s[1]) return n = n instanceof v ? n[0] : n, a = n && n.nodeType ? n.ownerDocument || n : i, e = v.parseHTML(s[1], a, !0), E.test(s[1]) && v.isPlainObject(n) && this.attr.call(e, n, !0), v.merge(this, e);
					o = i.getElementById(s[2]);
					if (o && o.parentNode) {
						if (o.id !== s[2]) return r.find(e);
						this.length = 1, this[0] = o
					}
					return this.context = i, this.selector = e, this
				}
				return !n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e)
			}
			return v.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), v.makeArray(e, this))
		},
		selector: "",
		jquery: "1.8.3",
		length: 0,
		size: function() {
			return this.length
		},
		toArray: function() {
			return l.call(this)
		},
		get: function(e) {
			return e == null ? this.toArray() : e < 0 ? this[this.length + e] : this[e]
		},
		pushStack: function(e, t, n) {
			var r = v.merge(this.constructor(), e);
			return r.prevObject = this, r.context = this.context, t === "find" ? r.selector = this.selector + (this.selector ? " " : "") + n : t && (r.selector = this.selector + "." + t + "(" + n + ")"), r
		},
		each: function(e, t) {
			return v.each(this, e, t)
		},
		ready: function(e) {
			return v.ready.promise().done(e), this
		},
		eq: function(e) {
			return e = +e, e === -1 ? this.slice(e) : this.slice(e, e + 1)
		},
		first: function() {
			return this.eq(0)
		},
		last: function() {
			return this.eq(-1)
		},
		slice: function() {
			return this.pushStack(l.apply(this, arguments), "slice", l.call(arguments).join(","))
		},
		map: function(e) {
			return this.pushStack(v.map(this, function(t, n) {
				return e.call(t, n, t)
			}))
		},
		end: function() {
			return this.prevObject || this.constructor(null)
		},
		push: f,
		sort: [].sort,
		splice: [].splice
	}, v.fn.init.prototype = v.fn, v.extend = v.fn.extend = function() {
		var e, n, r, i, s, o, u = arguments[0] || {},
			a = 1,
			f = arguments.length,
			l = !1;
		typeof u == "boolean" && (l = u, u = arguments[1] || {}, a = 2), typeof u != "object" && !v.isFunction(u) && (u = {}), f === a && (u = this, --a);
		for (; a < f; a++)
			if ((e = arguments[a]) != null)
				for (n in e) {
					r = u[n], i = e[n];
					if (u === i) continue;
					l && i && (v.isPlainObject(i) || (s = v.isArray(i))) ? (s ? (s = !1, o = r && v.isArray(r) ? r : []) : o = r && v.isPlainObject(r) ? r : {}, u[n] = v.extend(l, o, i)) : i !== t && (u[n] = i)
				}
			return u
	}, v.extend({
		noConflict: function(t) {
			return e.$ === v && (e.$ = a), t && e.jQuery === v && (e.jQuery = u), v
		},
		isReady: !1,
		readyWait: 1,
		holdReady: function(e) {
			e ? v.readyWait++ : v.ready(!0)
		},
		ready: function(e) {
			if (e === !0 ? --v.readyWait : v.isReady) return;
			if (!i.body) return setTimeout(v.ready, 1);
			v.isReady = !0;
			if (e !== !0 && --v.readyWait > 0) return;
			r.resolveWith(i, [v]), v.fn.trigger && v(i).trigger("ready").off("ready")
		},
		isFunction: function(e) {
			return v.type(e) === "function"
		},
		isArray: Array.isArray || function(e) {
			return v.type(e) === "array"
		},
		isWindow: function(e) {
			return e != null && e == e.window
		},
		isNumeric: function(e) {
			return !isNaN(parseFloat(e)) && isFinite(e)
		},
		type: function(e) {
			return e == null ? String(e) : O[h.call(e)] || "object"
		},
		isPlainObject: function(e) {
			if (!e || v.type(e) !== "object" || e.nodeType || v.isWindow(e)) return !1;
			try {
				if (e.constructor && !p.call(e, "constructor") && !p.call(e.constructor.prototype, "isPrototypeOf")) return !1
			} catch (n) {
				return !1
			}
			var r;
			for (r in e);
			return r === t || p.call(e, r)
		},
		isEmptyObject: function(e) {
			var t;
			for (t in e) return !1;
			return !0
		},
		error: function(e) {
			throw new Error(e)
		},
		parseHTML: function(e, t, n) {
			var r;
			return !e || typeof e != "string" ? null : (typeof t == "boolean" && (n = t, t = 0), t = t || i, (r = E.exec(e)) ? [t.createElement(r[1])] : (r = v.buildFragment([e], t, n ? null : []), v.merge([], (r.cacheable ? v.clone(r.fragment) : r.fragment).childNodes)))
		},
		parseJSON: function(t) {
			if (!t || typeof t != "string") return null;
			t = v.trim(t);
			if (e.JSON && e.JSON.parse) return e.JSON.parse(t);
			if (S.test(t.replace(T, "@").replace(N, "]").replace(x, ""))) return (new Function("return " + t))();
			v.error("Invalid JSON: " + t)
		},
		parseXML: function(n) {
			var r, i;
			if (!n || typeof n != "string") return null;
			try {
				e.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n))
			} catch (s) {
				r = t
			}
			return (!r || !r.documentElement || r.getElementsByTagName("parsererror").length) && v.error("Invalid XML: " + n), r
		},
		noop: function() {},
		globalEval: function(t) {
			t && g.test(t) && (e.execScript || function(t) {
				e.eval.call(e, t)
			})(t)
		},
		camelCase: function(e) {
			return e.replace(C, "ms-").replace(k, L)
		},
		nodeName: function(e, t) {
			return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
		},
		each: function(e, n, r) {
			var i, s = 0,
				o = e.length,
				u = o === t || v.isFunction(e);
			if (r) {
				if (u) {
					for (i in e)
						if (n.apply(e[i], r) === !1) break
				} else
					for (; s < o;)
						if (n.apply(e[s++], r) === !1) break
			} else if (u) {
				for (i in e)
					if (n.call(e[i], i, e[i]) === !1) break
			} else
				for (; s < o;)
					if (n.call(e[s], s, e[s++]) === !1) break; return e
		},
		trim: d && !d.call("\ufeff\u00a0") ? function(e) {
			return e == null ? "" : d.call(e)
		} : function(e) {
			return e == null ? "" : (e + "").replace(b, "")
		},
		makeArray: function(e, t) {
			var n, r = t || [];
			return e != null && (n = v.type(e), e.length == null || n === "string" || n === "function" || n === "regexp" || v.isWindow(e) ? f.call(r, e) : v.merge(r, e)), r
		},
		inArray: function(e, t, n) {
			var r;
			if (t) {
				if (c) return c.call(t, e, n);
				r = t.length, n = n ? n < 0 ? Math.max(0, r + n) : n : 0;
				for (; n < r; n++)
					if (n in t && t[n] === e) return n
			}
			return -1
		},
		merge: function(e, n) {
			var r = n.length,
				i = e.length,
				s = 0;
			if (typeof r == "number")
				for (; s < r; s++) e[i++] = n[s];
			else
				while (n[s] !== t) e[i++] = n[s++];
			return e.length = i, e
		},
		grep: function(e, t, n) {
			var r, i = [],
				s = 0,
				o = e.length;
			n = !!n;
			for (; s < o; s++) r = !!t(e[s], s), n !== r && i.push(e[s]);
			return i
		},
		map: function(e, n, r) {
			var i, s, o = [],
				u = 0,
				a = e.length,
				f = e instanceof v || a !== t && typeof a == "number" && (a > 0 && e[0] && e[a - 1] || a === 0 || v.isArray(e));
			if (f)
				for (; u < a; u++) i = n(e[u], u, r), i != null && (o[o.length] = i);
			else
				for (s in e) i = n(e[s], s, r), i != null && (o[o.length] = i);
			return o.concat.apply([], o)
		},
		guid: 1,
		proxy: function(e, n) {
			var r, i, s;
			return typeof n == "string" && (r = e[n], n = e, e = r), v.isFunction(e) ? (i = l.call(arguments, 2), s = function() {
				return e.apply(n, i.concat(l.call(arguments)))
			}, s.guid = e.guid = e.guid || v.guid++, s) : t
		},
		access: function(e, n, r, i, s, o, u) {
			var a, f = r == null,
				l = 0,
				c = e.length;
			if (r && typeof r == "object") {
				for (l in r) v.access(e, n, l, r[l], 1, o, i);
				s = 1
			} else if (i !== t) {
				a = u === t && v.isFunction(i), f && (a ? (a = n, n = function(e, t, n) {
					return a.call(v(e), n)
				}) : (n.call(e, i), n = null));
				if (n)
					for (; l < c; l++) n(e[l], r, a ? i.call(e[l], l, n(e[l], r)) : i, u);
				s = 1
			}
			return s ? e : f ? n.call(e) : c ? n(e[0], r) : o
		},
		now: function() {
			return (new Date).getTime()
		}
	}), v.ready.promise = function(t) {
		if (!r) {
			r = v.Deferred();
			if (i.readyState === "complete") setTimeout(v.ready, 1);
			else if (i.addEventListener) i.addEventListener("DOMContentLoaded", A, !1), e.addEventListener("load", v.ready, !1);
			else {
				i.attachEvent("onreadystatechange", A), e.attachEvent("onload", v.ready);
				var n = !1;
				try {
					n = e.frameElement == null && i.documentElement
				} catch (s) {}
				n && n.doScroll && function o() {
					if (!v.isReady) {
						try {
							n.doScroll("left")
						} catch (e) {
							return setTimeout(o, 50)
						}
						v.ready()
					}
				}()
			}
		}
		return r.promise(t)
	}, v.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(e, t) {
		O["[object " + t + "]"] = t.toLowerCase()
	}), n = v(i);
	var M = {};
	v.Callbacks = function(e) {
		e = typeof e == "string" ? M[e] || _(e) : v.extend({}, e);
		var n, r, i, s, o, u, a = [],
			f = !e.once && [],
			l = function(t) {
				n = e.memory && t, r = !0, u = s || 0, s = 0, o = a.length, i = !0;
				for (; a && u < o; u++)
					if (a[u].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
						n = !1;
						break
					}
				i = !1, a && (f ? f.length && l(f.shift()) : n ? a = [] : c.disable())
			},
			c = {
				add: function() {
					if (a) {
						var t = a.length;
						(function r(t) {
							v.each(t, function(t, n) {
								var i = v.type(n);
								i === "function" ? (!e.unique || !c.has(n)) && a.push(n) : n && n.length && i !== "string" && r(n)
							})
						})(arguments), i ? o = a.length : n && (s = t, l(n))
					}
					return this
				},
				remove: function() {
					return a && v.each(arguments, function(e, t) {
						var n;
						while ((n = v.inArray(t, a, n)) > -1) a.splice(n, 1), i && (n <= o && o--, n <= u && u--)
					}), this
				},
				has: function(e) {
					return v.inArray(e, a) > -1
				},
				empty: function() {
					return a = [], this
				},
				disable: function() {
					return a = f = n = t, this
				},
				disabled: function() {
					return !a
				},
				lock: function() {
					return f = t, n || c.disable(), this
				},
				locked: function() {
					return !f
				},
				fireWith: function(e, t) {
					return t = t || [], t = [e, t.slice ? t.slice() : t], a && (!r || f) && (i ? f.push(t) : l(t)), this
				},
				fire: function() {
					return c.fireWith(this, arguments), this
				},
				fired: function() {
					return !!r
				}
			};
		return c
	}, v.extend({
		Deferred: function(e) {
			var t = [
					["resolve", "done", v.Callbacks("once memory"), "resolved"],
					["reject", "fail", v.Callbacks("once memory"), "rejected"],
					["notify", "progress", v.Callbacks("memory")]
				],
				n = "pending",
				r = {
					state: function() {
						return n
					},
					always: function() {
						return i.done(arguments).fail(arguments), this
					},
					then: function() {
						var e = arguments;
						return v.Deferred(function(n) {
							v.each(t, function(t, r) {
								var s = r[0],
									o = e[t];
								i[r[1]](v.isFunction(o) ? function() {
									var e = o.apply(this, arguments);
									e && v.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[s + "With"](this === i ? n : this, [e])
								} : n[s])
							}), e = null
						}).promise()
					},
					promise: function(e) {
						return e != null ? v.extend(e, r) : r
					}
				},
				i = {};
			return r.pipe = r.then, v.each(t, function(e, s) {
				var o = s[2],
					u = s[3];
				r[s[1]] = o.add, u && o.add(function() {
					n = u
				}, t[e ^ 1][2].disable, t[2][2].lock), i[s[0]] = o.fire, i[s[0] + "With"] = o.fireWith
			}), r.promise(i), e && e.call(i, i), i
		},
		when: function(e) {
			var t = 0,
				n = l.call(arguments),
				r = n.length,
				i = r !== 1 || e && v.isFunction(e.promise) ? r : 0,
				s = i === 1 ? e : v.Deferred(),
				o = function(e, t, n) {
					return function(r) {
						t[e] = this, n[e] = arguments.length > 1 ? l.call(arguments) : r, n === u ? s.notifyWith(t, n) : --i || s.resolveWith(t, n)
					}
				},
				u, a, f;
			if (r > 1) {
				u = new Array(r), a = new Array(r), f = new Array(r);
				for (; t < r; t++) n[t] && v.isFunction(n[t].promise) ? n[t].promise().done(o(t, f, n)).fail(s.reject).progress(o(t, a, u)) : --i
			}
			return i || s.resolveWith(f, n), s.promise()
		}
	}), v.support = function() {
		var t, n, r, s, o, u, a, f, l, c, h, p = i.createElement("div");
		p.setAttribute("className", "t"), p.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = p.getElementsByTagName("*"), r = p.getElementsByTagName("a")[0];
		if (!n || !r || !n.length) return {};
		s = i.createElement("select"), o = s.appendChild(i.createElement("option")), u = p.getElementsByTagName("input")[0], r.style.cssText = "top:1px;float:left;opacity:.5", t = {
			leadingWhitespace: p.firstChild.nodeType === 3,
			tbody: !p.getElementsByTagName("tbody").length,
			htmlSerialize: !!p.getElementsByTagName("link").length,
			style: /top/.test(r.getAttribute("style")),
			hrefNormalized: r.getAttribute("href") === "/a",
			opacity: /^0.5/.test(r.style.opacity),
			cssFloat: !!r.style.cssFloat,
			checkOn: u.value === "on",
			optSelected: o.selected,
			getSetAttribute: p.className !== "t",
			enctype: !!i.createElement("form").enctype,
			html5Clone: i.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
			boxModel: i.compatMode === "CSS1Compat",
			submitBubbles: !0,
			changeBubbles: !0,
			focusinBubbles: !1,
			deleteExpando: !0,
			noCloneEvent: !0,
			inlineBlockNeedsLayout: !1,
			shrinkWrapBlocks: !1,
			reliableMarginRight: !0,
			boxSizingReliable: !0,
			pixelPosition: !1
		}, u.checked = !0, t.noCloneChecked = u.cloneNode(!0).checked, s.disabled = !0, t.optDisabled = !o.disabled;
		try {
			delete p.test
		} catch (d) {
			t.deleteExpando = !1
		}!p.addEventListener && p.attachEvent && p.fireEvent && (p.attachEvent("onclick", h = function() {
			t.noCloneEvent = !1
		}), p.cloneNode(!0).fireEvent("onclick"), p.detachEvent("onclick", h)), u = i.createElement("input"), u.value = "t", u.setAttribute("type", "radio"), t.radioValue = u.value === "t", u.setAttribute("checked", "checked"), u.setAttribute("name", "t"), p.appendChild(u), a = i.createDocumentFragment(), a.appendChild(p.lastChild), t.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked, t.appendChecked = u.checked, a.removeChild(u), a.appendChild(p);
		if (p.attachEvent)
			for (l in {
					submit: !0,
					change: !0,
					focusin: !0
				}) f = "on" + l, c = f in p, c || (p.setAttribute(f, "return;"), c = typeof p[f] == "function"), t[l + "Bubbles"] = c;
		return v(function() {
			var n, r, s, o, u = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
				a = i.getElementsByTagName("body")[0];
			if (!a) return;
			n = i.createElement("div"), n.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", a.insertBefore(n, a.firstChild), r = i.createElement("div"), n.appendChild(r), r.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", s = r.getElementsByTagName("td"), s[0].style.cssText = "padding:0;margin:0;border:0;display:none", c = s[0].offsetHeight === 0, s[0].style.display = "", s[1].style.display = "none", t.reliableHiddenOffsets = c && s[0].offsetHeight === 0, r.innerHTML = "", r.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", t.boxSizing = r.offsetWidth === 4, t.doesNotIncludeMarginInBodyOffset = a.offsetTop !== 1, e.getComputedStyle && (t.pixelPosition = (e.getComputedStyle(r, null) || {}).top !== "1%", t.boxSizingReliable = (e.getComputedStyle(r, null) || {
				width: "4px"
			}).width === "4px", o = i.createElement("div"), o.style.cssText = r.style.cssText = u, o.style.marginRight = o.style.width = "0", r.style.width = "1px", r.appendChild(o), t.reliableMarginRight = !parseFloat((e.getComputedStyle(o, null) || {}).marginRight)), typeof r.style.zoom != "undefined" && (r.innerHTML = "", r.style.cssText = u + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = r.offsetWidth === 3, r.style.display = "block", r.style.overflow = "visible", r.innerHTML = "<div></div>", r.firstChild.style.width = "5px", t.shrinkWrapBlocks = r.offsetWidth !== 3, n.style.zoom = 1), a.removeChild(n), n = r = s = o = null
		}), a.removeChild(p), n = r = s = o = u = a = p = null, t
	}();
	var D = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
		P = /([A-Z])/g;
	v.extend({
		cache: {},
		deletedIds: [],
		uuid: 0,
		expando: "jQuery" + (v.fn.jquery + Math.random()).replace(/\D/g, ""),
		noData: {
			embed: !0,
			object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
			applet: !0
		},
		hasData: function(e) {
			return e = e.nodeType ? v.cache[e[v.expando]] : e[v.expando], !!e && !B(e)
		},
		data: function(e, n, r, i) {
			if (!v.acceptData(e)) return;
			var s, o, u = v.expando,
				a = typeof n == "string",
				f = e.nodeType,
				l = f ? v.cache : e,
				c = f ? e[u] : e[u] && u;
			if ((!c || !l[c] || !i && !l[c].data) && a && r === t) return;
			c || (f ? e[u] = c = v.deletedIds.pop() || v.guid++ : c = u), l[c] || (l[c] = {}, f || (l[c].toJSON = v.noop));
			if (typeof n == "object" || typeof n == "function") i ? l[c] = v.extend(l[c], n) : l[c].data = v.extend(l[c].data, n);
			return s = l[c], i || (s.data || (s.data = {}), s = s.data), r !== t && (s[v.camelCase(n)] = r), a ? (o = s[n], o == null && (o = s[v.camelCase(n)])) : o = s, o
		},
		removeData: function(e, t, n) {
			if (!v.acceptData(e)) return;
			var r, i, s, o = e.nodeType,
				u = o ? v.cache : e,
				a = o ? e[v.expando] : v.expando;
			if (!u[a]) return;
			if (t) {
				r = n ? u[a] : u[a].data;
				if (r) {
					v.isArray(t) || (t in r ? t = [t] : (t = v.camelCase(t), t in r ? t = [t] : t = t.split(" ")));
					for (i = 0, s = t.length; i < s; i++) delete r[t[i]];
					if (!(n ? B : v.isEmptyObject)(r)) return
				}
			}
			if (!n) {
				delete u[a].data;
				if (!B(u[a])) return
			}
			o ? v.cleanData([e], !0) : v.support.deleteExpando || u != u.window ? delete u[a] : u[a] = null
		},
		_data: function(e, t, n) {
			return v.data(e, t, n, !0)
		},
		acceptData: function(e) {
			var t = e.nodeName && v.noData[e.nodeName.toLowerCase()];
			return !t || t !== !0 && e.getAttribute("classid") === t
		}
	}), v.fn.extend({
		data: function(e, n) {
			var r, i, s, o, u, a = this[0],
				f = 0,
				l = null;
			if (e === t) {
				if (this.length) {
					l = v.data(a);
					if (a.nodeType === 1 && !v._data(a, "parsedAttrs")) {
						s = a.attributes;
						for (u = s.length; f < u; f++) o = s[f].name, o.indexOf("data-") || (o = v.camelCase(o.substring(5)), H(a, o, l[o]));
						v._data(a, "parsedAttrs", !0)
					}
				}
				return l
			}
			return typeof e == "object" ? this.each(function() {
				v.data(this, e)
			}) : (r = e.split(".", 2), r[1] = r[1] ? "." + r[1] : "", i = r[1] + "!", v.access(this, function(n) {
				if (n === t) return l = this.triggerHandler("getData" + i, [r[0]]), l === t && a && (l = v.data(a, e), l = H(a, e, l)), l === t && r[1] ? this.data(r[0]) : l;
				r[1] = n, this.each(function() {
					var t = v(this);
					t.triggerHandler("setData" + i, r), v.data(this, e, n), t.triggerHandler("changeData" + i, r)
				})
			}, null, n, arguments.length > 1, null, !1))
		},
		removeData: function(e) {
			return this.each(function() {
				v.removeData(this, e)
			})
		}
	}), v.extend({
		queue: function(e, t, n) {
			var r;
			if (e) return t = (t || "fx") + "queue", r = v._data(e, t), n && (!r || v.isArray(n) ? r = v._data(e, t, v.makeArray(n)) : r.push(n)), r || []
		},
		dequeue: function(e, t) {
			t = t || "fx";
			var n = v.queue(e, t),
				r = n.length,
				i = n.shift(),
				s = v._queueHooks(e, t),
				o = function() {
					v.dequeue(e, t)
				};
			i === "inprogress" && (i = n.shift(), r--), i && (t === "fx" && n.unshift("inprogress"), delete s.stop, i.call(e, o, s)), !r && s && s.empty.fire()
		},
		_queueHooks: function(e, t) {
			var n = t + "queueHooks";
			return v._data(e, n) || v._data(e, n, {
				empty: v.Callbacks("once memory").add(function() {
					v.removeData(e, t + "queue", !0), v.removeData(e, n, !0)
				})
			})
		}
	}), v.fn.extend({
		queue: function(e, n) {
			var r = 2;
			return typeof e != "string" && (n = e, e = "fx", r--), arguments.length < r ? v.queue(this[0], e) : n === t ? this : this.each(function() {
				var t = v.queue(this, e, n);
				v._queueHooks(this, e), e === "fx" && t[0] !== "inprogress" && v.dequeue(this, e)
			})
		},
		dequeue: function(e) {
			return this.each(function() {
				v.dequeue(this, e)
			})
		},
		delay: function(e, t) {
			return e = v.fx ? v.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
				var r = setTimeout(t, e);
				n.stop = function() {
					clearTimeout(r)
				}
			})
		},
		clearQueue: function(e) {
			return this.queue(e || "fx", [])
		},
		promise: function(e, n) {
			var r, i = 1,
				s = v.Deferred(),
				o = this,
				u = this.length,
				a = function() {
					--i || s.resolveWith(o, [o])
				};
			typeof e != "string" && (n = e, e = t), e = e || "fx";
			while (u--) r = v._data(o[u], e + "queueHooks"), r && r.empty && (i++, r.empty.add(a));
			return a(), s.promise(n)
		}
	});
	var j, F, I, q = /[\t\r\n]/g,
		R = /\r/g,
		U = /^(?:button|input)$/i,
		z = /^(?:button|input|object|select|textarea)$/i,
		W = /^a(?:rea|)$/i,
		X = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
		V = v.support.getSetAttribute;
	v.fn.extend({
		attr: function(e, t) {
			return v.access(this, v.attr, e, t, arguments.length > 1)
		},
		removeAttr: function(e) {
			return this.each(function() {
				v.removeAttr(this, e)
			})
		},
		prop: function(e, t) {
			return v.access(this, v.prop, e, t, arguments.length > 1)
		},
		removeProp: function(e) {
			return e = v.propFix[e] || e, this.each(function() {
				try {
					this[e] = t, delete this[e]
				} catch (n) {}
			})
		},
		addClass: function(e) {
			var t, n, r, i, s, o, u;
			if (v.isFunction(e)) return this.each(function(t) {
				v(this).addClass(e.call(this, t, this.className))
			});
			if (e && typeof e == "string") {
				t = e.split(y);
				for (n = 0, r = this.length; n < r; n++) {
					i = this[n];
					if (i.nodeType === 1)
						if (!i.className && t.length === 1) i.className = e;
						else {
							s = " " + i.className + " ";
							for (o = 0, u = t.length; o < u; o++) s.indexOf(" " + t[o] + " ") < 0 && (s += t[o] + " ");
							i.className = v.trim(s)
						}
				}
			}
			return this
		},
		removeClass: function(e) {
			var n, r, i, s, o, u, a;
			if (v.isFunction(e)) return this.each(function(t) {
				v(this).removeClass(e.call(this, t, this.className))
			});
			if (e && typeof e == "string" || e === t) {
				n = (e || "").split(y);
				for (u = 0, a = this.length; u < a; u++) {
					i = this[u];
					if (i.nodeType === 1 && i.className) {
						r = (" " + i.className + " ").replace(q, " ");
						for (s = 0, o = n.length; s < o; s++)
							while (r.indexOf(" " + n[s] + " ") >= 0) r = r.replace(" " + n[s] + " ", " ");
						i.className = e ? v.trim(r) : ""
					}
				}
			}
			return this
		},
		toggleClass: function(e, t) {
			var n = typeof e,
				r = typeof t == "boolean";
			return v.isFunction(e) ? this.each(function(n) {
				v(this).toggleClass(e.call(this, n, this.className, t), t)
			}) : this.each(function() {
				if (n === "string") {
					var i, s = 0,
						o = v(this),
						u = t,
						a = e.split(y);
					while (i = a[s++]) u = r ? u : !o.hasClass(i), o[u ? "addClass" : "removeClass"](i)
				} else if (n === "undefined" || n === "boolean") this.className && v._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : v._data(this, "__className__") || ""
			})
		},
		hasClass: function(e) {
			var t = " " + e + " ",
				n = 0,
				r = this.length;
			for (; n < r; n++)
				if (this[n].nodeType === 1 && (" " + this[n].className + " ").replace(q, " ").indexOf(t) >= 0) return !0;
			return !1
		},
		val: function(e) {
			var n, r, i, s = this[0];
			if (!arguments.length) {
				if (s) return n = v.valHooks[s.type] || v.valHooks[s.nodeName.toLowerCase()], n && "get" in n && (r = n.get(s, "value")) !== t ? r : (r = s.value, typeof r == "string" ? r.replace(R, "") : r == null ? "" : r);
				return
			}
			return i = v.isFunction(e), this.each(function(r) {
				var s, o = v(this);
				if (this.nodeType !== 1) return;
				i ? s = e.call(this, r, o.val()) : s = e, s == null ? s = "" : typeof s == "number" ? s += "" : v.isArray(s) && (s = v.map(s, function(e) {
					return e == null ? "" : e + ""
				})), n = v.valHooks[this.type] || v.valHooks[this.nodeName.toLowerCase()];
				if (!n || !("set" in n) || n.set(this, s, "value") === t) this.value = s
			})
		}
	}), v.extend({
		valHooks: {
			option: {
				get: function(e) {
					var t = e.attributes.value;
					return !t || t.specified ? e.value : e.text
				}
			},
			select: {
				get: function(e) {
					var t, n, r = e.options,
						i = e.selectedIndex,
						s = e.type === "select-one" || i < 0,
						o = s ? null : [],
						u = s ? i + 1 : r.length,
						a = i < 0 ? u : s ? i : 0;
					for (; a < u; a++) {
						n = r[a];
						if ((n.selected || a === i) && (v.support.optDisabled ? !n.disabled : n.getAttribute("disabled") === null) && (!n.parentNode.disabled || !v.nodeName(n.parentNode, "optgroup"))) {
							t = v(n).val();
							if (s) return t;
							o.push(t)
						}
					}
					return o
				},
				set: function(e, t) {
					var n = v.makeArray(t);
					return v(e).find("option").each(function() {
						this.selected = v.inArray(v(this).val(), n) >= 0
					}), n.length || (e.selectedIndex = -1), n
				}
			}
		},
		attrFn: {},
		attr: function(e, n, r, i) {
			var s, o, u, a = e.nodeType;
			if (!e || a === 3 || a === 8 || a === 2) return;
			if (i && v.isFunction(v.fn[n])) return v(e)[n](r);
			if (typeof e.getAttribute == "undefined") return v.prop(e, n, r);
			u = a !== 1 || !v.isXMLDoc(e), u && (n = n.toLowerCase(), o = v.attrHooks[n] || (X.test(n) ? F : j));
			if (r !== t) {
				if (r === null) {
					v.removeAttr(e, n);
					return
				}
				return o && "set" in o && u && (s = o.set(e, r, n)) !== t ? s : (e.setAttribute(n, r + ""), r)
			}
			return o && "get" in o && u && (s = o.get(e, n)) !== null ? s : (s = e.getAttribute(n), s === null ? t : s)
		},
		removeAttr: function(e, t) {
			var n, r, i, s, o = 0;
			if (t && e.nodeType === 1) {
				r = t.split(y);
				for (; o < r.length; o++) i = r[o], i && (n = v.propFix[i] || i, s = X.test(i), s || v.attr(e, i, ""), e.removeAttribute(V ? i : n), s && n in e && (e[n] = !1))
			}
		},
		attrHooks: {
			type: {
				set: function(e, t) {
					if (U.test(e.nodeName) && e.parentNode) v.error("type property can't be changed");
					else if (!v.support.radioValue && t === "radio" && v.nodeName(e, "input")) {
						var n = e.value;
						return e.setAttribute("type", t), n && (e.value = n), t
					}
				}
			},
			value: {
				get: function(e, t) {
					return j && v.nodeName(e, "button") ? j.get(e, t) : t in e ? e.value : null
				},
				set: function(e, t, n) {
					if (j && v.nodeName(e, "button")) return j.set(e, t, n);
					e.value = t
				}
			}
		},
		propFix: {
			tabindex: "tabIndex",
			readonly: "readOnly",
			"for": "htmlFor",
			"class": "className",
			maxlength: "maxLength",
			cellspacing: "cellSpacing",
			cellpadding: "cellPadding",
			rowspan: "rowSpan",
			colspan: "colSpan",
			usemap: "useMap",
			frameborder: "frameBorder",
			contenteditable: "contentEditable"
		},
		prop: function(e, n, r) {
			var i, s, o, u = e.nodeType;
			if (!e || u === 3 || u === 8 || u === 2) return;
			return o = u !== 1 || !v.isXMLDoc(e), o && (n = v.propFix[n] || n, s = v.propHooks[n]), r !== t ? s && "set" in s && (i = s.set(e, r, n)) !== t ? i : e[n] = r : s && "get" in s && (i = s.get(e, n)) !== null ? i : e[n]
		},
		propHooks: {
			tabIndex: {
				get: function(e) {
					var n = e.getAttributeNode("tabindex");
					return n && n.specified ? parseInt(n.value, 10) : z.test(e.nodeName) || W.test(e.nodeName) && e.href ? 0 : t
				}
			}
		}
	}), F = {
		get: function(e, n) {
			var r, i = v.prop(e, n);
			return i === !0 || typeof i != "boolean" && (r = e.getAttributeNode(n)) && r.nodeValue !== !1 ? n.toLowerCase() : t
		},
		set: function(e, t, n) {
			var r;
			return t === !1 ? v.removeAttr(e, n) : (r = v.propFix[n] || n, r in e && (e[r] = !0), e.setAttribute(n, n.toLowerCase())), n
		}
	}, V || (I = {
		name: !0,
		id: !0,
		coords: !0
	}, j = v.valHooks.button = {
		get: function(e, n) {
			var r;
			return r = e.getAttributeNode(n), r && (I[n] ? r.value !== "" : r.specified) ? r.value : t
		},
		set: function(e, t, n) {
			var r = e.getAttributeNode(n);
			return r || (r = i.createAttribute(n), e.setAttributeNode(r)), r.value = t + ""
		}
	}, v.each(["width", "height"], function(e, t) {
		v.attrHooks[t] = v.extend(v.attrHooks[t], {
			set: function(e, n) {
				if (n === "") return e.setAttribute(t, "auto"), n
			}
		})
	}), v.attrHooks.contenteditable = {
		get: j.get,
		set: function(e, t, n) {
			t === "" && (t = "false"), j.set(e, t, n)
		}
	}), v.support.hrefNormalized || v.each(["href", "src", "width", "height"], function(e, n) {
		v.attrHooks[n] = v.extend(v.attrHooks[n], {
			get: function(e) {
				var r = e.getAttribute(n, 2);
				return r === null ? t : r
			}
		})
	}), v.support.style || (v.attrHooks.style = {
		get: function(e) {
			return e.style.cssText.toLowerCase() || t
		},
		set: function(e, t) {
			return e.style.cssText = t + ""
		}
	}), v.support.optSelected || (v.propHooks.selected = v.extend(v.propHooks.selected, {
		get: function(e) {
			var t = e.parentNode;
			return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
		}
	})), v.support.enctype || (v.propFix.enctype = "encoding"), v.support.checkOn || v.each(["radio", "checkbox"], function() {
		v.valHooks[this] = {
			get: function(e) {
				return e.getAttribute("value") === null ? "on" : e.value
			}
		}
	}), v.each(["radio", "checkbox"], function() {
		v.valHooks[this] = v.extend(v.valHooks[this], {
			set: function(e, t) {
				if (v.isArray(t)) return e.checked = v.inArray(v(e).val(), t) >= 0
			}
		})
	});
	var $ = /^(?:textarea|input|select)$/i,
		J = /^([^\.]*|)(?:\.(.+)|)$/,
		K = /(?:^|\s)hover(\.\S+|)\b/,
		Q = /^key/,
		G = /^(?:mouse|contextmenu)|click/,
		Y = /^(?:focusinfocus|focusoutblur)$/,
		Z = function(e) {
			return v.event.special.hover ? e : e.replace(K, "mouseenter$1 mouseleave$1")
		};
	v.event = {
			add: function(e, n, r, i, s) {
				var o, u, a, f, l, c, h, p, d, m, g;
				if (e.nodeType === 3 || e.nodeType === 8 || !n || !r || !(o = v._data(e))) return;
				r.handler && (d = r, r = d.handler, s = d.selector), r.guid || (r.guid = v.guid++), a = o.events, a || (o.events = a = {}), u = o.handle, u || (o.handle = u = function(e) {
					return typeof v == "undefined" || !!e && v.event.triggered === e.type ? t : v.event.dispatch.apply(u.elem, arguments)
				}, u.elem = e), n = v.trim(Z(n)).split(" ");
				for (f = 0; f < n.length; f++) {
					l = J.exec(n[f]) || [], c = l[1], h = (l[2] || "").split(".").sort(), g = v.event.special[c] || {}, c = (s ? g.delegateType : g.bindType) || c, g = v.event.special[c] || {}, p = v.extend({
						type: c,
						origType: l[1],
						data: i,
						handler: r,
						guid: r.guid,
						selector: s,
						needsContext: s && v.expr.match.needsContext.test(s),
						namespace: h.join(".")
					}, d), m = a[c];
					if (!m) {
						m = a[c] = [], m.delegateCount = 0;
						if (!g.setup || g.setup.call(e, i, h, u) === !1) e.addEventListener ? e.addEventListener(c, u, !1) : e.attachEvent && e.attachEvent("on" + c, u)
					}
					g.add && (g.add.call(e, p), p.handler.guid || (p.handler.guid = r.guid)), s ? m.splice(m.delegateCount++, 0, p) : m.push(p), v.event.global[c] = !0
				}
				e = null
			},
			global: {},
			remove: function(e, t, n, r, i) {
				var s, o, u, a, f, l, c, h, p, d, m, g = v.hasData(e) && v._data(e);
				if (!g || !(h = g.events)) return;
				t = v.trim(Z(t || "")).split(" ");
				for (s = 0; s < t.length; s++) {
					o = J.exec(t[s]) || [], u = a = o[1], f = o[2];
					if (!u) {
						for (u in h) v.event.remove(e, u + t[s], n, r, !0);
						continue
					}
					p = v.event.special[u] || {}, u = (r ? p.delegateType : p.bindType) || u, d = h[u] || [], l = d.length, f = f ? new RegExp("(^|\\.)" + f.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
					for (c = 0; c < d.length; c++) m = d[c], (i || a === m.origType) && (!n || n.guid === m.guid) && (!f || f.test(m.namespace)) && (!r || r === m.selector || r === "**" && m.selector) && (d.splice(c--, 1), m.selector && d.delegateCount--, p.remove && p.remove.call(e, m));
					d.length === 0 && l !== d.length && ((!p.teardown || p.teardown.call(e, f, g.handle) === !1) && v.removeEvent(e, u, g.handle), delete h[u])
				}
				v.isEmptyObject(h) && (delete g.handle, v.removeData(e, "events", !0))
			},
			customEvent: {
				getData: !0,
				setData: !0,
				changeData: !0
			},
			trigger: function(n, r, s, o) {
				if (!s || s.nodeType !== 3 && s.nodeType !== 8) {
					var u, a, f, l, c, h, p, d, m, g, y = n.type || n,
						b = [];
					if (Y.test(y + v.event.triggered)) return;
					y.indexOf("!") >= 0 && (y = y.slice(0, -1), a = !0), y.indexOf(".") >= 0 && (b = y.split("."), y = b.shift(), b.sort());
					if ((!s || v.event.customEvent[y]) && !v.event.global[y]) return;
					n = typeof n == "object" ? n[v.expando] ? n : new v.Event(y, n) : new v.Event(y), n.type = y, n.isTrigger = !0, n.exclusive = a, n.namespace = b.join("."), n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + b.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, h = y.indexOf(":") < 0 ? "on" + y : "";
					if (!s) {
						u = v.cache;
						for (f in u) u[f].events && u[f].events[y] && v.event.trigger(n, r, u[f].handle.elem, !0);
						return
					}
					n.result = t, n.target || (n.target = s), r = r != null ? v.makeArray(r) : [], r.unshift(n), p = v.event.special[y] || {};
					if (p.trigger && p.trigger.apply(s, r) === !1) return;
					m = [
						[s, p.bindType || y]
					];
					if (!o && !p.noBubble && !v.isWindow(s)) {
						g = p.delegateType || y, l = Y.test(g + y) ? s : s.parentNode;
						for (c = s; l; l = l.parentNode) m.push([l, g]), c = l;
						c === (s.ownerDocument || i) && m.push([c.defaultView || c.parentWindow || e, g])
					}
					for (f = 0; f < m.length && !n.isPropagationStopped(); f++) l = m[f][0], n.type = m[f][1], d = (v._data(l, "events") || {})[n.type] && v._data(l, "handle"), d && d.apply(l, r), d = h && l[h], d && v.acceptData(l) && d.apply && d.apply(l, r) === !1 && n.preventDefault();
					return n.type = y, !o && !n.isDefaultPrevented() && (!p._default || p._default.apply(s.ownerDocument, r) === !1) && (y !== "click" || !v.nodeName(s, "a")) && v.acceptData(s) && h && s[y] && (y !== "focus" && y !== "blur" || n.target.offsetWidth !== 0) && !v.isWindow(s) && (c = s[h], c && (s[h] = null), v.event.triggered = y, s[y](), v.event.triggered = t, c && (s[h] = c)), n.result
				}
				return
			},
			dispatch: function(n) {
				n = v.event.fix(n || e.event);
				var r, i, s, o, u, a, f, c, h, p, d = (v._data(this, "events") || {})[n.type] || [],
					m = d.delegateCount,
					g = l.call(arguments),
					y = !n.exclusive && !n.namespace,
					b = v.event.special[n.type] || {},
					w = [];
				g[0] = n, n.delegateTarget = this;
				if (b.preDispatch && b.preDispatch.call(this, n) === !1) return;
				if (m && (!n.button || n.type !== "click"))
					for (s = n.target; s != this; s = s.parentNode || this)
						if (s.disabled !== !0 || n.type !== "click") {
							u = {}, f = [];
							for (r = 0; r < m; r++) c = d[r], h = c.selector, u[h] === t && (u[h] = c.needsContext ? v(h, this).index(s) >= 0 : v.find(h, this, null, [s]).length), u[h] && f.push(c);
							f.length && w.push({
								elem: s,
								matches: f
							})
						}
				d.length > m && w.push({
					elem: this,
					matches: d.slice(m)
				});
				for (r = 0; r < w.length && !n.isPropagationStopped(); r++) {
					a = w[r], n.currentTarget = a.elem;
					for (i = 0; i < a.matches.length && !n.isImmediatePropagationStopped(); i++) {
						c = a.matches[i];
						if (y || !n.namespace && !c.namespace || n.namespace_re && n.namespace_re.test(c.namespace)) n.data = c.data, n.handleObj = c, o = ((v.event.special[c.origType] || {}).handle || c.handler).apply(a.elem, g), o !== t && (n.result = o, o === !1 && (n.preventDefault(), n.stopPropagation()))
					}
				}
				return b.postDispatch && b.postDispatch.call(this, n), n.result
			},
			props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
			fixHooks: {},
			keyHooks: {
				props: "char charCode key keyCode".split(" "),
				filter: function(e, t) {
					return e.which == null && (e.which = t.charCode != null ? t.charCode : t.keyCode), e
				}
			},
			mouseHooks: {
				props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
				filter: function(e, n) {
					var r, s, o, u = n.button,
						a = n.fromElement;
					return e.pageX == null && n.clientX != null && (r = e.target.ownerDocument || i, s = r.documentElement, o = r.body, e.pageX = n.clientX + (s && s.scrollLeft || o && o.scrollLeft || 0) - (s && s.clientLeft || o && o.clientLeft || 0), e.pageY = n.clientY + (s && s.scrollTop || o && o.scrollTop || 0) - (s && s.clientTop || o && o.clientTop || 0)), !e.relatedTarget && a && (e.relatedTarget = a === e.target ? n.toElement : a), !e.which && u !== t && (e.which = u & 1 ? 1 : u & 2 ? 3 : u & 4 ? 2 : 0), e
				}
			},
			fix: function(e) {
				if (e[v.expando]) return e;
				var t, n, r = e,
					s = v.event.fixHooks[e.type] || {},
					o = s.props ? this.props.concat(s.props) : this.props;
				e = v.Event(r);
				for (t = o.length; t;) n = o[--t], e[n] = r[n];
				return e.target || (e.target = r.srcElement || i), e.target.nodeType === 3 && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, s.filter ? s.filter(e, r) : e
			},
			special: {
				load: {
					noBubble: !0
				},
				focus: {
					delegateType: "focusin"
				},
				blur: {
					delegateType: "focusout"
				},
				beforeunload: {
					setup: function(e, t, n) {
						v.isWindow(this) && (this.onbeforeunload = n)
					},
					teardown: function(e, t) {
						this.onbeforeunload === t && (this.onbeforeunload = null)
					}
				}
			},
			simulate: function(e, t, n, r) {
				var i = v.extend(new v.Event, n, {
					type: e,
					isSimulated: !0,
					originalEvent: {}
				});
				r ? v.event.trigger(i, null, t) : v.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
			}
		}, v.event.handle = v.event.dispatch, v.removeEvent = i.removeEventListener ? function(e, t, n) {
			e.removeEventListener && e.removeEventListener(t, n, !1)
		} : function(e, t, n) {
			var r = "on" + t;
			e.detachEvent && (typeof e[r] == "undefined" && (e[r] = null), e.detachEvent(r, n))
		}, v.Event = function(e, t) {
			if (!(this instanceof v.Event)) return new v.Event(e, t);
			e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? tt : et) : this.type = e, t && v.extend(this, t), this.timeStamp = e && e.timeStamp || v.now(), this[v.expando] = !0
		}, v.Event.prototype = {
			preventDefault: function() {
				this.isDefaultPrevented = tt;
				var e = this.originalEvent;
				if (!e) return;
				e.preventDefault ? e.preventDefault() : e.returnValue = !1
			},
			stopPropagation: function() {
				this.isPropagationStopped = tt;
				var e = this.originalEvent;
				if (!e) return;
				e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0
			},
			stopImmediatePropagation: function() {
				this.isImmediatePropagationStopped = tt, this.stopPropagation()
			},
			isDefaultPrevented: et,
			isPropagationStopped: et,
			isImmediatePropagationStopped: et
		}, v.each({
			mouseenter: "mouseover",
			mouseleave: "mouseout"
		}, function(e, t) {
			v.event.special[e] = {
				delegateType: t,
				bindType: t,
				handle: function(e) {
					var n, r = this,
						i = e.relatedTarget,
						s = e.handleObj,
						o = s.selector;
					if (!i || i !== r && !v.contains(r, i)) e.type = s.origType, n = s.handler.apply(this, arguments), e.type = t;
					return n
				}
			}
		}), v.support.submitBubbles || (v.event.special.submit = {
			setup: function() {
				if (v.nodeName(this, "form")) return !1;
				v.event.add(this, "click._submit keypress._submit", function(e) {
					var n = e.target,
						r = v.nodeName(n, "input") || v.nodeName(n, "button") ? n.form : t;
					r && !v._data(r, "_submit_attached") && (v.event.add(r, "submit._submit", function(e) {
						e._submit_bubble = !0
					}), v._data(r, "_submit_attached", !0))
				})
			},
			postDispatch: function(e) {
				e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && v.event.simulate("submit", this.parentNode, e, !0))
			},
			teardown: function() {
				if (v.nodeName(this, "form")) return !1;
				v.event.remove(this, "._submit")
			}
		}), v.support.changeBubbles || (v.event.special.change = {
			setup: function() {
				if ($.test(this.nodeName)) {
					if (this.type === "checkbox" || this.type === "radio") v.event.add(this, "propertychange._change", function(e) {
						e.originalEvent.propertyName === "checked" && (this._just_changed = !0)
					}), v.event.add(this, "click._change", function(e) {
						this._just_changed && !e.isTrigger && (this._just_changed = !1), v.event.simulate("change", this, e, !0)
					});
					return !1
				}
				v.event.add(this, "beforeactivate._change", function(e) {
					var t = e.target;
					$.test(t.nodeName) && !v._data(t, "_change_attached") && (v.event.add(t, "change._change", function(e) {
						this.parentNode && !e.isSimulated && !e.isTrigger && v.event.simulate("change", this.parentNode, e, !0)
					}), v._data(t, "_change_attached", !0))
				})
			},
			handle: function(e) {
				var t = e.target;
				if (this !== t || e.isSimulated || e.isTrigger || t.type !== "radio" && t.type !== "checkbox") return e.handleObj.handler.apply(this, arguments)
			},
			teardown: function() {
				return v.event.remove(this, "._change"), !$.test(this.nodeName)
			}
		}), v.support.focusinBubbles || v.each({
			focus: "focusin",
			blur: "focusout"
		}, function(e, t) {
			var n = 0,
				r = function(e) {
					v.event.simulate(t, e.target, v.event.fix(e), !0)
				};
			v.event.special[t] = {
				setup: function() {
					n++ === 0 && i.addEventListener(e, r, !0)
				},
				teardown: function() {
					--n === 0 && i.removeEventListener(e, r, !0)
				}
			}
		}), v.fn.extend({
			on: function(e, n, r, i, s) {
				var o, u;
				if (typeof e == "object") {
					typeof n != "string" && (r = r || n, n = t);
					for (u in e) this.on(u, n, r, e[u], s);
					return this
				}
				r == null && i == null ? (i = n, r = n = t) : i == null && (typeof n == "string" ? (i = r, r = t) : (i = r, r = n, n = t));
				if (i === !1) i = et;
				else if (!i) return this;
				return s === 1 && (o = i, i = function(e) {
					return v().off(e), o.apply(this, arguments)
				}, i.guid = o.guid || (o.guid = v.guid++)), this.each(function() {
					v.event.add(this, e, i, r, n)
				})
			},
			one: function(e, t, n, r) {
				return this.on(e, t, n, r, 1)
			},
			off: function(e, n, r) {
				var i, s;
				if (e && e.preventDefault && e.handleObj) return i = e.handleObj, v(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
				if (typeof e == "object") {
					for (s in e) this.off(s, n, e[s]);
					return this
				}
				if (n === !1 || typeof n == "function") r = n, n = t;
				return r === !1 && (r = et), this.each(function() {
					v.event.remove(this, e, r, n)
				})
			},
			bind: function(e, t, n) {
				return this.on(e, null, t, n)
			},
			unbind: function(e, t) {
				return this.off(e, null, t)
			},
			live: function(e, t, n) {
				return v(this.context).on(e, this.selector, t, n), this
			},
			die: function(e, t) {
				return v(this.context).off(e, this.selector || "**", t), this
			},
			delegate: function(e, t, n, r) {
				return this.on(t, e, n, r)
			},
			undelegate: function(e, t, n) {
				return arguments.length === 1 ? this.off(e, "**") : this.off(t, e || "**", n)
			},
			trigger: function(e, t) {
				return this.each(function() {
					v.event.trigger(e, t, this)
				})
			},
			triggerHandler: function(e, t) {
				if (this[0]) return v.event.trigger(e, t, this[0], !0)
			},
			toggle: function(e) {
				var t = arguments,
					n = e.guid || v.guid++,
					r = 0,
					i = function(n) {
						var i = (v._data(this, "lastToggle" + e.guid) || 0) % r;
						return v._data(this, "lastToggle" + e.guid, i + 1), n.preventDefault(), t[i].apply(this, arguments) || !1
					};
				i.guid = n;
				while (r < t.length) t[r++].guid = n;
				return this.click(i)
			},
			hover: function(e, t) {
				return this.mouseenter(e).mouseleave(t || e)
			}
		}), v.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
			v.fn[t] = function(e, n) {
				return n == null && (n = e, e = null), arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
			}, Q.test(t) && (v.event.fixHooks[t] = v.event.keyHooks), G.test(t) && (v.event.fixHooks[t] = v.event.mouseHooks)
		}),
		function(e, t) {
			function nt(e, t, n, r) {
				n = n || [], t = t || g;
				var i, s, a, f, l = t.nodeType;
				if (!e || typeof e != "string") return n;
				if (l !== 1 && l !== 9) return [];
				a = o(t);
				if (!a && !r)
					if (i = R.exec(e))
						if (f = i[1]) {
							if (l === 9) {
								s = t.getElementById(f);
								if (!s || !s.parentNode) return n;
								if (s.id === f) return n.push(s), n
							} else if (t.ownerDocument && (s = t.ownerDocument.getElementById(f)) && u(t, s) && s.id === f) return n.push(s), n
						} else {
							if (i[2]) return S.apply(n, x.call(t.getElementsByTagName(e), 0)), n;
							if ((f = i[3]) && Z && t.getElementsByClassName) return S.apply(n, x.call(t.getElementsByClassName(f), 0)), n
						}
				return vt(e.replace(j, "$1"), t, n, r, a)
			}

			function rt(e) {
				return function(t) {
					var n = t.nodeName.toLowerCase();
					return n === "input" && t.type === e
				}
			}

			function it(e) {
				return function(t) {
					var n = t.nodeName.toLowerCase();
					return (n === "input" || n === "button") && t.type === e
				}
			}

			function st(e) {
				return N(function(t) {
					return t = +t, N(function(n, r) {
						var i, s = e([], n.length, t),
							o = s.length;
						while (o--) n[i = s[o]] && (n[i] = !(r[i] = n[i]))
					})
				})
			}

			function ot(e, t, n) {
				if (e === t) return n;
				var r = e.nextSibling;
				while (r) {
					if (r === t) return -1;
					r = r.nextSibling
				}
				return 1
			}

			function ut(e, t) {
				var n, r, s, o, u, a, f, l = L[d][e + " "];
				if (l) return t ? 0 : l.slice(0);
				u = e, a = [], f = i.preFilter;
				while (u) {
					if (!n || (r = F.exec(u))) r && (u = u.slice(r[0].length) || u), a.push(s = []);
					n = !1;
					if (r = I.exec(u)) s.push(n = new m(r.shift())), u = u.slice(n.length), n.type = r[0].replace(j, " ");
					for (o in i.filter)(r = J[o].exec(u)) && (!f[o] || (r = f[o](r))) && (s.push(n = new m(r.shift())), u = u.slice(n.length), n.type = o, n.matches = r);
					if (!n) break
				}
				return t ? u.length : u ? nt.error(e) : L(e, a).slice(0)
			}

			function at(e, t, r) {
				var i = t.dir,
					s = r && t.dir === "parentNode",
					o = w++;
				return t.first ? function(t, n, r) {
					while (t = t[i])
						if (s || t.nodeType === 1) return e(t, n, r)
				} : function(t, r, u) {
					if (!u) {
						var a, f = b + " " + o + " ",
							l = f + n;
						while (t = t[i])
							if (s || t.nodeType === 1) {
								if ((a = t[d]) === l) return t.sizset;
								if (typeof a == "string" && a.indexOf(f) === 0) {
									if (t.sizset) return t
								} else {
									t[d] = l;
									if (e(t, r, u)) return t.sizset = !0, t;
									t.sizset = !1
								}
							}
					} else
						while (t = t[i])
							if (s || t.nodeType === 1)
								if (e(t, r, u)) return t
				}
			}

			function ft(e) {
				return e.length > 1 ? function(t, n, r) {
					var i = e.length;
					while (i--)
						if (!e[i](t, n, r)) return !1;
					return !0
				} : e[0]
			}

			function lt(e, t, n, r, i) {
				var s, o = [],
					u = 0,
					a = e.length,
					f = t != null;
				for (; u < a; u++)
					if (s = e[u])
						if (!n || n(s, r, i)) o.push(s), f && t.push(u);
				return o
			}

			function ct(e, t, n, r, i, s) {
				return r && !r[d] && (r = ct(r)), i && !i[d] && (i = ct(i, s)), N(function(s, o, u, a) {
					var f, l, c, h = [],
						p = [],
						d = o.length,
						v = s || dt(t || "*", u.nodeType ? [u] : u, []),
						m = e && (s || !t) ? lt(v, h, e, u, a) : v,
						g = n ? i || (s ? e : d || r) ? [] : o : m;
					n && n(m, g, u, a);
					if (r) {
						f = lt(g, p), r(f, [], u, a), l = f.length;
						while (l--)
							if (c = f[l]) g[p[l]] = !(m[p[l]] = c)
					}
					if (s) {
						if (i || e) {
							if (i) {
								f = [], l = g.length;
								while (l--)(c = g[l]) && f.push(m[l] = c);
								i(null, g = [], f, a)
							}
							l = g.length;
							while (l--)(c = g[l]) && (f = i ? T.call(s, c) : h[l]) > -1 && (s[f] = !(o[f] = c))
						}
					} else g = lt(g === o ? g.splice(d, g.length) : g), i ? i(null, o, g, a) : S.apply(o, g)
				})
			}

			function ht(e) {
				var t, n, r, s = e.length,
					o = i.relative[e[0].type],
					u = o || i.relative[" "],
					a = o ? 1 : 0,
					f = at(function(e) {
						return e === t
					}, u, !0),
					l = at(function(e) {
						return T.call(t, e) > -1
					}, u, !0),
					h = [function(e, n, r) {
						return !o && (r || n !== c) || ((t = n).nodeType ? f(e, n, r) : l(e, n, r))
					}];
				for (; a < s; a++)
					if (n = i.relative[e[a].type]) h = [at(ft(h), n)];
					else {
						n = i.filter[e[a].type].apply(null, e[a].matches);
						if (n[d]) {
							r = ++a;
							for (; r < s; r++)
								if (i.relative[e[r].type]) break;
							return ct(a > 1 && ft(h), a > 1 && e.slice(0, a - 1).join("").replace(j, "$1"), n, a < r && ht(e.slice(a, r)), r < s && ht(e = e.slice(r)), r < s && e.join(""))
						}
						h.push(n)
					}
				return ft(h)
			}

			function pt(e, t) {
				var r = t.length > 0,
					s = e.length > 0,
					o = function(u, a, f, l, h) {
						var p, d, v, m = [],
							y = 0,
							w = "0",
							x = u && [],
							T = h != null,
							N = c,
							C = u || s && i.find.TAG("*", h && a.parentNode || a),
							k = b += N == null ? 1 : Math.E;
						T && (c = a !== g && a, n = o.el);
						for (;
							(p = C[w]) != null; w++) {
							if (s && p) {
								for (d = 0; v = e[d]; d++)
									if (v(p, a, f)) {
										l.push(p);
										break
									}
								T && (b = k, n = ++o.el)
							}
							r && ((p = !v && p) && y--, u && x.push(p))
						}
						y += w;
						if (r && w !== y) {
							for (d = 0; v = t[d]; d++) v(x, m, a, f);
							if (u) {
								if (y > 0)
									while (w--) !x[w] && !m[w] && (m[w] = E.call(l));
								m = lt(m)
							}
							S.apply(l, m), T && !u && m.length > 0 && y + t.length > 1 && nt.uniqueSort(l)
						}
						return T && (b = k, c = N), x
					};
				return o.el = 0, r ? N(o) : o
			}

			function dt(e, t, n) {
				var r = 0,
					i = t.length;
				for (; r < i; r++) nt(e, t[r], n);
				return n
			}

			function vt(e, t, n, r, s) {
				var o, u, f, l, c, h = ut(e),
					p = h.length;
				if (!r && h.length === 1) {
					u = h[0] = h[0].slice(0);
					if (u.length > 2 && (f = u[0]).type === "ID" && t.nodeType === 9 && !s && i.relative[u[1].type]) {
						t = i.find.ID(f.matches[0].replace($, ""), t, s)[0];
						if (!t) return n;
						e = e.slice(u.shift().length)
					}
					for (o = J.POS.test(e) ? -1 : u.length - 1; o >= 0; o--) {
						f = u[o];
						if (i.relative[l = f.type]) break;
						if (c = i.find[l])
							if (r = c(f.matches[0].replace($, ""), z.test(u[0].type) && t.parentNode || t, s)) {
								u.splice(o, 1), e = r.length && u.join("");
								if (!e) return S.apply(n, x.call(r, 0)), n;
								break
							}
					}
				}
				return a(e, h)(r, t, s, n, z.test(e)), n
			}

			function mt() {}
			var n, r, i, s, o, u, a, f, l, c, h = !0,
				p = "undefined",
				d = ("sizcache" + Math.random()).replace(".", ""),
				m = String,
				g = e.document,
				y = g.documentElement,
				b = 0,
				w = 0,
				E = [].pop,
				S = [].push,
				x = [].slice,
				T = [].indexOf || function(e) {
					var t = 0,
						n = this.length;
					for (; t < n; t++)
						if (this[t] === e) return t;
					return -1
				},
				N = function(e, t) {
					return e[d] = t == null || t, e
				},
				C = function() {
					var e = {},
						t = [];
					return N(function(n, r) {
						return t.push(n) > i.cacheLength && delete e[t.shift()], e[n + " "] = r
					}, e)
				},
				k = C(),
				L = C(),
				A = C(),
				O = "[\\x20\\t\\r\\n\\f]",
				M = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",
				_ = M.replace("w", "w#"),
				D = "([*^$|!~]?=)",
				P = "\\[" + O + "*(" + M + ")" + O + "*(?:" + D + O + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + _ + ")|)|)" + O + "*\\]",
				H = ":(" + M + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + P + ")|[^:]|\\\\.)*|.*))\\)|)",
				B = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + O + "*((?:-\\d)?\\d*)" + O + "*\\)|)(?=[^-]|$)",
				j = new RegExp("^" + O + "+|((?:^|[^\\\\])(?:\\\\.)*)" + O + "+$", "g"),
				F = new RegExp("^" + O + "*," + O + "*"),
				I = new RegExp("^" + O + "*([\\x20\\t\\r\\n\\f>+~])" + O + "*"),
				q = new RegExp(H),
				R = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,
				U = /^:not/,
				z = /[\x20\t\r\n\f]*[+~]/,
				W = /:not\($/,
				X = /h\d/i,
				V = /input|select|textarea|button/i,
				$ = /\\(?!\\)/g,
				J = {
					ID: new RegExp("^#(" + M + ")"),
					CLASS: new RegExp("^\\.(" + M + ")"),
					NAME: new RegExp("^\\[name=['\"]?(" + M + ")['\"]?\\]"),
					TAG: new RegExp("^(" + M.replace("w", "w*") + ")"),
					ATTR: new RegExp("^" + P),
					PSEUDO: new RegExp("^" + H),
					POS: new RegExp(B, "i"),
					CHILD: new RegExp("^:(only|nth|first|last)-child(?:\\(" + O + "*(even|odd|(([+-]|)(\\d*)n|)" + O + "*(?:([+-]|)" + O + "*(\\d+)|))" + O + "*\\)|)", "i"),
					needsContext: new RegExp("^" + O + "*[>+~]|" + B, "i")
				},
				K = function(e) {
					var t = g.createElement("div");
					try {
						return e(t)
					} catch (n) {
						return !1
					} finally {
						t = null
					}
				},
				Q = K(function(e) {
					return e.appendChild(g.createComment("")), !e.getElementsByTagName("*").length
				}),
				G = K(function(e) {
					return e.innerHTML = "<a href='#'></a>", e.firstChild && typeof e.firstChild.getAttribute !== p && e.firstChild.getAttribute("href") === "#"
				}),
				Y = K(function(e) {
					e.innerHTML = "<select></select>";
					var t = typeof e.lastChild.getAttribute("multiple");
					return t !== "boolean" && t !== "string"
				}),
				Z = K(function(e) {
					return e.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", !e.getElementsByClassName || !e.getElementsByClassName("e").length ? !1 : (e.lastChild.className = "e", e.getElementsByClassName("e").length === 2)
				}),
				et = K(function(e) {
					e.id = d + 0, e.innerHTML = "<a name='" + d + "'></a><div name='" + d + "'></div>", y.insertBefore(e, y.firstChild);
					var t = g.getElementsByName && g.getElementsByName(d).length === 2 + g.getElementsByName(d + 0).length;
					return r = !g.getElementById(d), y.removeChild(e), t
				});
			try {
				x.call(y.childNodes, 0)[0].nodeType
			} catch (tt) {
				x = function(e) {
					var t, n = [];
					for (; t = this[e]; e++) n.push(t);
					return n
				}
			}
			nt.matches = function(e, t) {
				return nt(e, null, null, t)
			}, nt.matchesSelector = function(e, t) {
				return nt(t, null, null, [e]).length > 0
			}, s = nt.getText = function(e) {
				var t, n = "",
					r = 0,
					i = e.nodeType;
				if (i) {
					if (i === 1 || i === 9 || i === 11) {
						if (typeof e.textContent == "string") return e.textContent;
						for (e = e.firstChild; e; e = e.nextSibling) n += s(e)
					} else if (i === 3 || i === 4) return e.nodeValue
				} else
					for (; t = e[r]; r++) n += s(t);
				return n
			}, o = nt.isXML = function(e) {
				var t = e && (e.ownerDocument || e).documentElement;
				return t ? t.nodeName !== "HTML" : !1
			}, u = nt.contains = y.contains ? function(e, t) {
				var n = e.nodeType === 9 ? e.documentElement : e,
					r = t && t.parentNode;
				return e === r || !!(r && r.nodeType === 1 && n.contains && n.contains(r))
			} : y.compareDocumentPosition ? function(e, t) {
				return t && !!(e.compareDocumentPosition(t) & 16)
			} : function(e, t) {
				while (t = t.parentNode)
					if (t === e) return !0;
				return !1
			}, nt.attr = function(e, t) {
				var n, r = o(e);
				return r || (t = t.toLowerCase()), (n = i.attrHandle[t]) ? n(e) : r || Y ? e.getAttribute(t) : (n = e.getAttributeNode(t), n ? typeof e[t] == "boolean" ? e[t] ? t : null : n.specified ? n.value : null : null)
			}, i = nt.selectors = {
				cacheLength: 50,
				createPseudo: N,
				match: J,
				attrHandle: G ? {} : {
					href: function(e) {
						return e.getAttribute("href", 2)
					},
					type: function(e) {
						return e.getAttribute("type")
					}
				},
				find: {
					ID: r ? function(e, t, n) {
						if (typeof t.getElementById !== p && !n) {
							var r = t.getElementById(e);
							return r && r.parentNode ? [r] : []
						}
					} : function(e, n, r) {
						if (typeof n.getElementById !== p && !r) {
							var i = n.getElementById(e);
							return i ? i.id === e || typeof i.getAttributeNode !== p && i.getAttributeNode("id").value === e ? [i] : t : []
						}
					},
					TAG: Q ? function(e, t) {
						if (typeof t.getElementsByTagName !== p) return t.getElementsByTagName(e)
					} : function(e, t) {
						var n = t.getElementsByTagName(e);
						if (e === "*") {
							var r, i = [],
								s = 0;
							for (; r = n[s]; s++) r.nodeType === 1 && i.push(r);
							return i
						}
						return n
					},
					NAME: et && function(e, t) {
						if (typeof t.getElementsByName !== p) return t.getElementsByName(name)
					},
					CLASS: Z && function(e, t, n) {
						if (typeof t.getElementsByClassName !== p && !n) return t.getElementsByClassName(e)
					}
				},
				relative: {
					">": {
						dir: "parentNode",
						first: !0
					},
					" ": {
						dir: "parentNode"
					},
					"+": {
						dir: "previousSibling",
						first: !0
					},
					"~": {
						dir: "previousSibling"
					}
				},
				preFilter: {
					ATTR: function(e) {
						return e[1] = e[1].replace($, ""), e[3] = (e[4] || e[5] || "").replace($, ""), e[2] === "~=" && (e[3] = " " + e[3] + " "), e.slice(0, 4)
					},
					CHILD: function(e) {
						return e[1] = e[1].toLowerCase(), e[1] === "nth" ? (e[2] || nt.error(e[0]), e[3] = +(e[3] ? e[4] + (e[5] || 1) : 2 * (e[2] === "even" || e[2] === "odd")), e[4] = +(e[6] + e[7] || e[2] === "odd")) : e[2] && nt.error(e[0]), e
					},
					PSEUDO: function(e) {
						var t, n;
						if (J.CHILD.test(e[0])) return null;
						if (e[3]) e[2] = e[3];
						else if (t = e[4]) q.test(t) && (n = ut(t, !0)) && (n = t.indexOf(")", t.length - n) - t.length) && (t = t.slice(0, n), e[0] = e[0].slice(0, n)), e[2] = t;
						return e.slice(0, 3)
					}
				},
				filter: {
					ID: r ? function(e) {
						return e = e.replace($, ""),
							function(t) {
								return t.getAttribute("id") === e
							}
					} : function(e) {
						return e = e.replace($, ""),
							function(t) {
								var n = typeof t.getAttributeNode !== p && t.getAttributeNode("id");
								return n && n.value === e
							}
					},
					TAG: function(e) {
						return e === "*" ? function() {
							return !0
						} : (e = e.replace($, "").toLowerCase(), function(t) {
							return t.nodeName && t.nodeName.toLowerCase() === e
						})
					},
					CLASS: function(e) {
						var t = k[d][e + " "];
						return t || (t = new RegExp("(^|" + O + ")" + e + "(" + O + "|$)")) && k(e, function(e) {
							return t.test(e.className || typeof e.getAttribute !== p && e.getAttribute("class") || "")
						})
					},
					ATTR: function(e, t, n) {
						return function(r, i) {
							var s = nt.attr(r, e);
							return s == null ? t === "!=" : t ? (s += "", t === "=" ? s === n : t === "!=" ? s !== n : t === "^=" ? n && s.indexOf(n) === 0 : t === "*=" ? n && s.indexOf(n) > -1 : t === "$=" ? n && s.substr(s.length - n.length) === n : t === "~=" ? (" " + s + " ").indexOf(n) > -1 : t === "|=" ? s === n || s.substr(0, n.length + 1) === n + "-" : !1) : !0
						}
					},
					CHILD: function(e, t, n, r) {
						return e === "nth" ? function(e) {
							var t, i, s = e.parentNode;
							if (n === 1 && r === 0) return !0;
							if (s) {
								i = 0;
								for (t = s.firstChild; t; t = t.nextSibling)
									if (t.nodeType === 1) {
										i++;
										if (e === t) break
									}
							}
							return i -= r, i === n || i % n === 0 && i / n >= 0
						} : function(t) {
							var n = t;
							switch (e) {
								case "only":
								case "first":
									while (n = n.previousSibling)
										if (n.nodeType === 1) return !1;
									if (e === "first") return !0;
									n = t;
								case "last":
									while (n = n.nextSibling)
										if (n.nodeType === 1) return !1;
									return !0
							}
						}
					},
					PSEUDO: function(e, t) {
						var n, r = i.pseudos[e] || i.setFilters[e.toLowerCase()] || nt.error("unsupported pseudo: " + e);
						return r[d] ? r(t) : r.length > 1 ? (n = [e, e, "", t], i.setFilters.hasOwnProperty(e.toLowerCase()) ? N(function(e, n) {
							var i, s = r(e, t),
								o = s.length;
							while (o--) i = T.call(e, s[o]), e[i] = !(n[i] = s[o])
						}) : function(e) {
							return r(e, 0, n)
						}) : r
					}
				},
				pseudos: {
					not: N(function(e) {
						var t = [],
							n = [],
							r = a(e.replace(j, "$1"));
						return r[d] ? N(function(e, t, n, i) {
							var s, o = r(e, null, i, []),
								u = e.length;
							while (u--)
								if (s = o[u]) e[u] = !(t[u] = s)
						}) : function(e, i, s) {
							return t[0] = e, r(t, null, s, n), !n.pop()
						}
					}),
					has: N(function(e) {
						return function(t) {
							return nt(e, t).length > 0
						}
					}),
					contains: N(function(e) {
						return function(t) {
							return (t.textContent || t.innerText || s(t)).indexOf(e) > -1
						}
					}),
					enabled: function(e) {
						return e.disabled === !1
					},
					disabled: function(e) {
						return e.disabled === !0
					},
					checked: function(e) {
						var t = e.nodeName.toLowerCase();
						return t === "input" && !!e.checked || t === "option" && !!e.selected
					},
					selected: function(e) {
						return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
					},
					parent: function(e) {
						return !i.pseudos.empty(e)
					},
					empty: function(e) {
						var t;
						e = e.firstChild;
						while (e) {
							if (e.nodeName > "@" || (t = e.nodeType) === 3 || t === 4) return !1;
							e = e.nextSibling
						}
						return !0
					},
					header: function(e) {
						return X.test(e.nodeName)
					},
					text: function(e) {
						var t, n;
						return e.nodeName.toLowerCase() === "input" && (t = e.type) === "text" && ((n = e.getAttribute("type")) == null || n.toLowerCase() === t)
					},
					radio: rt("radio"),
					checkbox: rt("checkbox"),
					file: rt("file"),
					password: rt("password"),
					image: rt("image"),
					submit: it("submit"),
					reset: it("reset"),
					button: function(e) {
						var t = e.nodeName.toLowerCase();
						return t === "input" && e.type === "button" || t === "button"
					},
					input: function(e) {
						return V.test(e.nodeName)
					},
					focus: function(e) {
						var t = e.ownerDocument;
						return e === t.activeElement && (!t.hasFocus || t.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
					},
					active: function(e) {
						return e === e.ownerDocument.activeElement
					},
					first: st(function() {
						return [0]
					}),
					last: st(function(e, t) {
						return [t - 1]
					}),
					eq: st(function(e, t, n) {
						return [n < 0 ? n + t : n]
					}),
					even: st(function(e, t) {
						for (var n = 0; n < t; n += 2) e.push(n);
						return e
					}),
					odd: st(function(e, t) {
						for (var n = 1; n < t; n += 2) e.push(n);
						return e
					}),
					lt: st(function(e, t, n) {
						for (var r = n < 0 ? n + t : n; --r >= 0;) e.push(r);
						return e
					}),
					gt: st(function(e, t, n) {
						for (var r = n < 0 ? n + t : n; ++r < t;) e.push(r);
						return e
					})
				}
			}, f = y.compareDocumentPosition ? function(e, t) {
				return e === t ? (l = !0, 0) : (!e.compareDocumentPosition || !t.compareDocumentPosition ? e.compareDocumentPosition : e.compareDocumentPosition(t) & 4) ? -1 : 1
			} : function(e, t) {
				if (e === t) return l = !0, 0;
				if (e.sourceIndex && t.sourceIndex) return e.sourceIndex - t.sourceIndex;
				var n, r, i = [],
					s = [],
					o = e.parentNode,
					u = t.parentNode,
					a = o;
				if (o === u) return ot(e, t);
				if (!o) return -1;
				if (!u) return 1;
				while (a) i.unshift(a), a = a.parentNode;
				a = u;
				while (a) s.unshift(a), a = a.parentNode;
				n = i.length, r = s.length;
				for (var f = 0; f < n && f < r; f++)
					if (i[f] !== s[f]) return ot(i[f], s[f]);
				return f === n ? ot(e, s[f], -1) : ot(i[f], t, 1)
			}, [0, 0].sort(f), h = !l, nt.uniqueSort = function(e) {
				var t, n = [],
					r = 1,
					i = 0;
				l = h, e.sort(f);
				if (l) {
					for (; t = e[r]; r++) t === e[r - 1] && (i = n.push(r));
					while (i--) e.splice(n[i], 1)
				}
				return e
			}, nt.error = function(e) {
				throw new Error("Syntax error, unrecognized expression: " + e)
			}, a = nt.compile = function(e, t) {
				var n, r = [],
					i = [],
					s = A[d][e + " "];
				if (!s) {
					t || (t = ut(e)), n = t.length;
					while (n--) s = ht(t[n]), s[d] ? r.push(s) : i.push(s);
					s = A(e, pt(i, r))
				}
				return s
			}, g.querySelectorAll && function() {
				var e, t = vt,
					n = /'|\\/g,
					r = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
					i = [":focus"],
					s = [":active"],
					u = y.matchesSelector || y.mozMatchesSelector || y.webkitMatchesSelector || y.oMatchesSelector || y.msMatchesSelector;
				K(function(e) {
					e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || i.push("\\[" + O + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), e.querySelectorAll(":checked").length || i.push(":checked")
				}), K(function(e) {
					e.innerHTML = "<p test=''></p>", e.querySelectorAll("[test^='']").length && i.push("[*^$]=" + O + "*(?:\"\"|'')"), e.innerHTML = "<input type='hidden'/>", e.querySelectorAll(":enabled").length || i.push(":enabled", ":disabled")
				}), i = new RegExp(i.join("|")), vt = function(e, r, s, o, u) {
					if (!o && !u && !i.test(e)) {
						var a, f, l = !0,
							c = d,
							h = r,
							p = r.nodeType === 9 && e;
						if (r.nodeType === 1 && r.nodeName.toLowerCase() !== "object") {
							a = ut(e), (l = r.getAttribute("id")) ? c = l.replace(n, "\\$&") : r.setAttribute("id", c), c = "[id='" + c + "'] ", f = a.length;
							while (f--) a[f] = c + a[f].join("");
							h = z.test(e) && r.parentNode || r, p = a.join(",")
						}
						if (p) try {
							return S.apply(s, x.call(h.querySelectorAll(p), 0)), s
						} catch (v) {} finally {
							l || r.removeAttribute("id")
						}
					}
					return t(e, r, s, o, u)
				}, u && (K(function(t) {
					e = u.call(t, "div");
					try {
						u.call(t, "[test!='']:sizzle"), s.push("!=", H)
					} catch (n) {}
				}), s = new RegExp(s.join("|")), nt.matchesSelector = function(t, n) {
					n = n.replace(r, "='$1']");
					if (!o(t) && !s.test(n) && !i.test(n)) try {
						var a = u.call(t, n);
						if (a || e || t.document && t.document.nodeType !== 11) return a
					} catch (f) {}
					return nt(n, null, null, [t]).length > 0
				})
			}(), i.pseudos.nth = i.pseudos.eq, i.filters = mt.prototype = i.pseudos, i.setFilters = new mt, nt.attr = v.attr, v.find = nt, v.expr = nt.selectors, v.expr[":"] = v.expr.pseudos, v.unique = nt.uniqueSort, v.text = nt.getText, v.isXMLDoc = nt.isXML, v.contains = nt.contains
		}(e);
	var nt = /Until$/,
		rt = /^(?:parents|prev(?:Until|All))/,
		it = /^.[^:#\[\.,]*$/,
		st = v.expr.match.needsContext,
		ot = {
			children: !0,
			contents: !0,
			next: !0,
			prev: !0
		};
	v.fn.extend({
		find: function(e) {
			var t, n, r, i, s, o, u = this;
			if (typeof e != "string") return v(e).filter(function() {
				for (t = 0, n = u.length; t < n; t++)
					if (v.contains(u[t], this)) return !0
			});
			o = this.pushStack("", "find", e);
			for (t = 0, n = this.length; t < n; t++) {
				r = o.length, v.find(e, this[t], o);
				if (t > 0)
					for (i = r; i < o.length; i++)
						for (s = 0; s < r; s++)
							if (o[s] === o[i]) {
								o.splice(i--, 1);
								break
							}
			}
			return o
		},
		has: function(e) {
			var t, n = v(e, this),
				r = n.length;
			return this.filter(function() {
				for (t = 0; t < r; t++)
					if (v.contains(this, n[t])) return !0
			})
		},
		not: function(e) {
			return this.pushStack(ft(this, e, !1), "not", e)
		},
		filter: function(e) {
			return this.pushStack(ft(this, e, !0), "filter", e)
		},
		is: function(e) {
			return !!e && (typeof e == "string" ? st.test(e) ? v(e, this.context).index(this[0]) >= 0 : v.filter(e, this).length > 0 : this.filter(e).length > 0)
		},
		closest: function(e, t) {
			var n, r = 0,
				i = this.length,
				s = [],
				o = st.test(e) || typeof e != "string" ? v(e, t || this.context) : 0;
			for (; r < i; r++) {
				n = this[r];
				while (n && n.ownerDocument && n !== t && n.nodeType !== 11) {
					if (o ? o.index(n) > -1 : v.find.matchesSelector(n, e)) {
						s.push(n);
						break
					}
					n = n.parentNode
				}
			}
			return s = s.length > 1 ? v.unique(s) : s, this.pushStack(s, "closest", e)
		},
		index: function(e) {
			return e ? typeof e == "string" ? v.inArray(this[0], v(e)) : v.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1
		},
		add: function(e, t) {
			var n = typeof e == "string" ? v(e, t) : v.makeArray(e && e.nodeType ? [e] : e),
				r = v.merge(this.get(), n);
			return this.pushStack(ut(n[0]) || ut(r[0]) ? r : v.unique(r))
		},
		addBack: function(e) {
			return this.add(e == null ? this.prevObject : this.prevObject.filter(e))
		}
	}), v.fn.andSelf = v.fn.addBack, v.each({
		parent: function(e) {
			var t = e.parentNode;
			return t && t.nodeType !== 11 ? t : null
		},
		parents: function(e) {
			return v.dir(e, "parentNode")
		},
		parentsUntil: function(e, t, n) {
			return v.dir(e, "parentNode", n)
		},
		next: function(e) {
			return at(e, "nextSibling")
		},
		prev: function(e) {
			return at(e, "previousSibling")
		},
		nextAll: function(e) {
			return v.dir(e, "nextSibling")
		},
		prevAll: function(e) {
			return v.dir(e, "previousSibling")
		},
		nextUntil: function(e, t, n) {
			return v.dir(e, "nextSibling", n)
		},
		prevUntil: function(e, t, n) {
			return v.dir(e, "previousSibling", n)
		},
		siblings: function(e) {
			return v.sibling((e.parentNode || {}).firstChild, e)
		},
		children: function(e) {
			return v.sibling(e.firstChild)
		},
		contents: function(e) {
			return v.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : v.merge([], e.childNodes)
		}
	}, function(e, t) {
		v.fn[e] = function(n, r) {
			var i = v.map(this, t, n);
			return nt.test(e) || (r = n), r && typeof r == "string" && (i = v.filter(r, i)), i = this.length > 1 && !ot[e] ? v.unique(i) : i, this.length > 1 && rt.test(e) && (i = i.reverse()), this.pushStack(i, e, l.call(arguments).join(","))
		}
	}), v.extend({
		filter: function(e, t, n) {
			return n && (e = ":not(" + e + ")"), t.length === 1 ? v.find.matchesSelector(t[0], e) ? [t[0]] : [] : v.find.matches(e, t)
		},
		dir: function(e, n, r) {
			var i = [],
				s = e[n];
			while (s && s.nodeType !== 9 && (r === t || s.nodeType !== 1 || !v(s).is(r))) s.nodeType === 1 && i.push(s), s = s[n];
			return i
		},
		sibling: function(e, t) {
			var n = [];
			for (; e; e = e.nextSibling) e.nodeType === 1 && e !== t && n.push(e);
			return n
		}
	});
	var ct = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
		ht = / jQuery\d+="(?:null|\d+)"/g,
		pt = /^\s+/,
		dt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
		vt = /<([\w:]+)/,
		mt = /<tbody/i,
		gt = /<|&#?\w+;/,
		yt = /<(?:script|style|link)/i,
		bt = /<(?:script|object|embed|option|style)/i,
		wt = new RegExp("<(?:" + ct + ")[\\s/>]", "i"),
		Et = /^(?:checkbox|radio)$/,
		St = /checked\s*(?:[^=]|=\s*.checked.)/i,
		xt = /\/(java|ecma)script/i,
		Tt = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
		Nt = {
			option: [1, "<select multiple='multiple'>", "</select>"],
			legend: [1, "<fieldset>", "</fieldset>"],
			thead: [1, "<table>", "</table>"],
			tr: [2, "<table><tbody>", "</tbody></table>"],
			td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
			col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
			area: [1, "<map>", "</map>"],
			_default: [0, "", ""]
		},
		Ct = lt(i),
		kt = Ct.appendChild(i.createElement("div"));
	Nt.optgroup = Nt.option, Nt.tbody = Nt.tfoot = Nt.colgroup = Nt.caption = Nt.thead, Nt.th = Nt.td, v.support.htmlSerialize || (Nt._default = [1, "X<div>", "</div>"]), v.fn.extend({
			text: function(e) {
				return v.access(this, function(e) {
					return e === t ? v.text(this) : this.empty().append((this[0] && this[0].ownerDocument || i).createTextNode(e))
				}, null, e, arguments.length)
			},
			wrapAll: function(e) {
				if (v.isFunction(e)) return this.each(function(t) {
					v(this).wrapAll(e.call(this, t))
				});
				if (this[0]) {
					var t = v(e, this[0].ownerDocument).eq(0).clone(!0);
					this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
						var e = this;
						while (e.firstChild && e.firstChild.nodeType === 1) e = e.firstChild;
						return e
					}).append(this)
				}
				return this
			},
			wrapInner: function(e) {
				return v.isFunction(e) ? this.each(function(t) {
					v(this).wrapInner(e.call(this, t))
				}) : this.each(function() {
					var t = v(this),
						n = t.contents();
					n.length ? n.wrapAll(e) : t.append(e)
				})
			},
			wrap: function(e) {
				var t = v.isFunction(e);
				return this.each(function(n) {
					v(this).wrapAll(t ? e.call(this, n) : e)
				})
			},
			unwrap: function() {
				return this.parent().each(function() {
					v.nodeName(this, "body") || v(this).replaceWith(this.childNodes)
				}).end()
			},
			append: function() {
				return this.domManip(arguments, !0, function(e) {
					(this.nodeType === 1 || this.nodeType === 11) && this.appendChild(e)
				})
			},
			prepend: function() {
				return this.domManip(arguments, !0, function(e) {
					(this.nodeType === 1 || this.nodeType === 11) && this.insertBefore(e, this.firstChild)
				})
			},
			before: function() {
				if (!ut(this[0])) return this.domManip(arguments, !1, function(e) {
					this.parentNode.insertBefore(e, this)
				});
				if (arguments.length) {
					var e = v.clean(arguments);
					return this.pushStack(v.merge(e, this), "before", this.selector)
				}
			},
			after: function() {
				if (!ut(this[0])) return this.domManip(arguments, !1, function(e) {
					this.parentNode.insertBefore(e, this.nextSibling)
				});
				if (arguments.length) {
					var e = v.clean(arguments);
					return this.pushStack(v.merge(this, e), "after", this.selector)
				}
			},
			remove: function(e, t) {
				var n, r = 0;
				for (;
					(n = this[r]) != null; r++)
					if (!e || v.filter(e, [n]).length) !t && n.nodeType === 1 && (v.cleanData(n.getElementsByTagName("*")), v.cleanData([n])), n.parentNode && n.parentNode.removeChild(n);
				return this
			},
			empty: function() {
				var e, t = 0;
				for (;
					(e = this[t]) != null; t++) {
					e.nodeType === 1 && v.cleanData(e.getElementsByTagName("*"));
					while (e.firstChild) e.removeChild(e.firstChild)
				}
				return this
			},
			clone: function(e, t) {
				return e = e == null ? !1 : e, t = t == null ? e : t, this.map(function() {
					return v.clone(this, e, t)
				})
			},
			html: function(e) {
				return v.access(this, function(e) {
					var n = this[0] || {},
						r = 0,
						i = this.length;
					if (e === t) return n.nodeType === 1 ? n.innerHTML.replace(ht, "") : t;
					if (typeof e == "string" && !yt.test(e) && (v.support.htmlSerialize || !wt.test(e)) && (v.support.leadingWhitespace || !pt.test(e)) && !Nt[(vt.exec(e) || ["", ""])[1].toLowerCase()]) {
						e = e.replace(dt, "<$1></$2>");
						try {
							for (; r < i; r++) n = this[r] || {}, n.nodeType === 1 && (v.cleanData(n.getElementsByTagName("*")), n.innerHTML = e);
							n = 0
						} catch (s) {}
					}
					n && this.empty().append(e)
				}, null, e, arguments.length)
			},
			replaceWith: function(e) {
				return ut(this[0]) ? this.length ? this.pushStack(v(v.isFunction(e) ? e() : e), "replaceWith", e) : this : v.isFunction(e) ? this.each(function(t) {
					var n = v(this),
						r = n.html();
					n.replaceWith(e.call(this, t, r))
				}) : (typeof e != "string" && (e = v(e).detach()), this.each(function() {
					var t = this.nextSibling,
						n = this.parentNode;
					v(this).remove(), t ? v(t).before(e) : v(n).append(e)
				}))
			},
			detach: function(e) {
				return this.remove(e, !0)
			},
			domManip: function(e, n, r) {
				e = [].concat.apply([], e);
				var i, s, o, u, a = 0,
					f = e[0],
					l = [],
					c = this.length;
				if (!v.support.checkClone && c > 1 && typeof f == "string" && St.test(f)) return this.each(function() {
					v(this).domManip(e, n, r)
				});
				if (v.isFunction(f)) return this.each(function(i) {
					var s = v(this);
					e[0] = f.call(this, i, n ? s.html() : t), s.domManip(e, n, r)
				});
				if (this[0]) {
					i = v.buildFragment(e, this, l), o = i.fragment, s = o.firstChild, o.childNodes.length === 1 && (o = s);
					if (s) {
						n = n && v.nodeName(s, "tr");
						for (u = i.cacheable || c - 1; a < c; a++) r.call(n && v.nodeName(this[a], "table") ? Lt(this[a], "tbody") : this[a], a === u ? o : v.clone(o, !0, !0))
					}
					o = s = null, l.length && v.each(l, function(e, t) {
						t.src ? v.ajax ? v.ajax({
							url: t.src,
							type: "GET",
							dataType: "script",
							async: !1,
							global: !1,
							"throws": !0
						}) : v.error("no ajax") : v.globalEval((t.text || t.textContent || t.innerHTML || "").replace(Tt, "")), t.parentNode && t.parentNode.removeChild(t)
					})
				}
				return this
			}
		}), v.buildFragment = function(e, n, r) {
			var s, o, u, a = e[0];
			return n = n || i, n = !n.nodeType && n[0] || n, n = n.ownerDocument || n, e.length === 1 && typeof a == "string" && a.length < 512 && n === i && a.charAt(0) === "<" && !bt.test(a) && (v.support.checkClone || !St.test(a)) && (v.support.html5Clone || !wt.test(a)) && (o = !0, s = v.fragments[a], u = s !== t), s || (s = n.createDocumentFragment(), v.clean(e, n, s, r), o && (v.fragments[a] = u && s)), {
				fragment: s,
				cacheable: o
			}
		}, v.fragments = {}, v.each({
			appendTo: "append",
			prependTo: "prepend",
			insertBefore: "before",
			insertAfter: "after",
			replaceAll: "replaceWith"
		}, function(e, t) {
			v.fn[e] = function(n) {
				var r, i = 0,
					s = [],
					o = v(n),
					u = o.length,
					a = this.length === 1 && this[0].parentNode;
				if ((a == null || a && a.nodeType === 11 && a.childNodes.length === 1) && u === 1) return o[t](this[0]), this;
				for (; i < u; i++) r = (i > 0 ? this.clone(!0) : this).get(), v(o[i])[t](r), s = s.concat(r);
				return this.pushStack(s, e, o.selector)
			}
		}), v.extend({
			clone: function(e, t, n) {
				var r, i, s, o;
				v.support.html5Clone || v.isXMLDoc(e) || !wt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (kt.innerHTML = e.outerHTML, kt.removeChild(o = kt.firstChild));
				if ((!v.support.noCloneEvent || !v.support.noCloneChecked) && (e.nodeType === 1 || e.nodeType === 11) && !v.isXMLDoc(e)) {
					Ot(e, o), r = Mt(e), i = Mt(o);
					for (s = 0; r[s]; ++s) i[s] && Ot(r[s], i[s])
				}
				if (t) {
					At(e, o);
					if (n) {
						r = Mt(e), i = Mt(o);
						for (s = 0; r[s]; ++s) At(r[s], i[s])
					}
				}
				return r = i = null, o
			},
			clean: function(e, t, n, r) {
				var s, o, u, a, f, l, c, h, p, d, m, g, y = t === i && Ct,
					b = [];
				if (!t || typeof t.createDocumentFragment == "undefined") t = i;
				for (s = 0;
					(u = e[s]) != null; s++) {
					typeof u == "number" && (u += "");
					if (!u) continue;
					if (typeof u == "string")
						if (!gt.test(u)) u = t.createTextNode(u);
						else {
							y = y || lt(t), c = t.createElement("div"), y.appendChild(c), u = u.replace(dt, "<$1></$2>"), a = (vt.exec(u) || ["", ""])[1].toLowerCase(), f = Nt[a] || Nt._default, l = f[0], c.innerHTML = f[1] + u + f[2];
							while (l--) c = c.lastChild;
							if (!v.support.tbody) {
								h = mt.test(u), p = a === "table" && !h ? c.firstChild && c.firstChild.childNodes : f[1] === "<table>" && !h ? c.childNodes : [];
								for (o = p.length - 1; o >= 0; --o) v.nodeName(p[o], "tbody") && !p[o].childNodes.length && p[o].parentNode.removeChild(p[o])
							}!v.support.leadingWhitespace && pt.test(u) && c.insertBefore(t.createTextNode(pt.exec(u)[0]), c.firstChild), u = c.childNodes, c.parentNode.removeChild(c)
						}
					u.nodeType ? b.push(u) : v.merge(b, u)
				}
				c && (u = c = y = null);
				if (!v.support.appendChecked)
					for (s = 0;
						(u = b[s]) != null; s++) v.nodeName(u, "input") ? _t(u) : typeof u.getElementsByTagName != "undefined" && v.grep(u.getElementsByTagName("input"), _t);
				if (n) {
					m = function(e) {
						if (!e.type || xt.test(e.type)) return r ? r.push(e.parentNode ? e.parentNode.removeChild(e) : e) : n.appendChild(e)
					};
					for (s = 0;
						(u = b[s]) != null; s++)
						if (!v.nodeName(u, "script") || !m(u)) n.appendChild(u), typeof u.getElementsByTagName != "undefined" && (g = v.grep(v.merge([], u.getElementsByTagName("script")), m), b.splice.apply(b, [s + 1, 0].concat(g)), s += g.length)
				}
				return b
			},
			cleanData: function(e, t) {
				var n, r, i, s, o = 0,
					u = v.expando,
					a = v.cache,
					f = v.support.deleteExpando,
					l = v.event.special;
				for (;
					(i = e[o]) != null; o++)
					if (t || v.acceptData(i)) {
						r = i[u], n = r && a[r];
						if (n) {
							if (n.events)
								for (s in n.events) l[s] ? v.event.remove(i, s) : v.removeEvent(i, s, n.handle);
							a[r] && (delete a[r], f ? delete i[u] : i.removeAttribute ? i.removeAttribute(u) : i[u] = null, v.deletedIds.push(r))
						}
					}
			}
		}),
		function() {
			var e, t;
			v.uaMatch = function(e) {
				e = e.toLowerCase();
				var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || e.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
				return {
					browser: t[1] || "",
					version: t[2] || "0"
				}
			}, e = v.uaMatch(o.userAgent), t = {}, e.browser && (t[e.browser] = !0, t.version = e.version), t.chrome ? t.webkit = !0 : t.webkit && (t.safari = !0), v.browser = t, v.sub = function() {
				function e(t, n) {
					return new e.fn.init(t, n)
				}
				v.extend(!0, e, this), e.superclass = this, e.fn = e.prototype = this(), e.fn.constructor = e, e.sub = this.sub, e.fn.init = function(r, i) {
					return i && i instanceof v && !(i instanceof e) && (i = e(i)), v.fn.init.call(this, r, i, t)
				}, e.fn.init.prototype = e.fn;
				var t = e(i);
				return e
			}
		}();
	var Dt, Pt, Ht, Bt = /alpha\([^)]*\)/i,
		jt = /opacity=([^)]*)/,
		Ft = /^(top|right|bottom|left)$/,
		It = /^(none|table(?!-c[ea]).+)/,
		qt = /^margin/,
		Rt = new RegExp("^(" + m + ")(.*)$", "i"),
		Ut = new RegExp("^(" + m + ")(?!px)[a-z%]+$", "i"),
		zt = new RegExp("^([-+])=(" + m + ")", "i"),
		Wt = {
			BODY: "block"
		},
		Xt = {
			position: "absolute",
			visibility: "hidden",
			display: "block"
		},
		Vt = {
			letterSpacing: 0,
			fontWeight: 400
		},
		$t = ["Top", "Right", "Bottom", "Left"],
		Jt = ["Webkit", "O", "Moz", "ms"],
		Kt = v.fn.toggle;
	v.fn.extend({
		css: function(e, n) {
			return v.access(this, function(e, n, r) {
				return r !== t ? v.style(e, n, r) : v.css(e, n)
			}, e, n, arguments.length > 1)
		},
		show: function() {
			return Yt(this, !0)
		},
		hide: function() {
			return Yt(this)
		},
		toggle: function(e, t) {
			var n = typeof e == "boolean";
			return v.isFunction(e) && v.isFunction(t) ? Kt.apply(this, arguments) : this.each(function() {
				(n ? e : Gt(this)) ? v(this).show(): v(this).hide()
			})
		}
	}), v.extend({
		cssHooks: {
			opacity: {
				get: function(e, t) {
					if (t) {
						var n = Dt(e, "opacity");
						return n === "" ? "1" : n
					}
				}
			}
		},
		cssNumber: {
			fillOpacity: !0,
			fontWeight: !0,
			lineHeight: !0,
			opacity: !0,
			orphans: !0,
			widows: !0,
			zIndex: !0,
			zoom: !0
		},
		cssProps: {
			"float": v.support.cssFloat ? "cssFloat" : "styleFloat"
		},
		style: function(e, n, r, i) {
			if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) return;
			var s, o, u, a = v.camelCase(n),
				f = e.style;
			n = v.cssProps[a] || (v.cssProps[a] = Qt(f, a)), u = v.cssHooks[n] || v.cssHooks[a];
			if (r === t) return u && "get" in u && (s = u.get(e, !1, i)) !== t ? s : f[n];
			o = typeof r, o === "string" && (s = zt.exec(r)) && (r = (s[1] + 1) * s[2] + parseFloat(v.css(e, n)), o = "number");
			if (r == null || o === "number" && isNaN(r)) return;
			o === "number" && !v.cssNumber[a] && (r += "px");
			if (!u || !("set" in u) || (r = u.set(e, r, i)) !== t) try {
				f[n] = r
			} catch (l) {}
		},
		css: function(e, n, r, i) {
			var s, o, u, a = v.camelCase(n);
			return n = v.cssProps[a] || (v.cssProps[a] = Qt(e.style, a)), u = v.cssHooks[n] || v.cssHooks[a], u && "get" in u && (s = u.get(e, !0, i)), s === t && (s = Dt(e, n)), s === "normal" && n in Vt && (s = Vt[n]), r || i !== t ? (o = parseFloat(s), r || v.isNumeric(o) ? o || 0 : s) : s
		},
		swap: function(e, t, n) {
			var r, i, s = {};
			for (i in t) s[i] = e.style[i], e.style[i] = t[i];
			r = n.call(e);
			for (i in t) e.style[i] = s[i];
			return r
		}
	}), e.getComputedStyle ? Dt = function(t, n) {
		var r, i, s, o, u = e.getComputedStyle(t, null),
			a = t.style;
		return u && (r = u.getPropertyValue(n) || u[n], r === "" && !v.contains(t.ownerDocument, t) && (r = v.style(t, n)), Ut.test(r) && qt.test(n) && (i = a.width, s = a.minWidth, o = a.maxWidth, a.minWidth = a.maxWidth = a.width = r, r = u.width, a.width = i, a.minWidth = s, a.maxWidth = o)), r
	} : i.documentElement.currentStyle && (Dt = function(e, t) {
		var n, r, i = e.currentStyle && e.currentStyle[t],
			s = e.style;
		return i == null && s && s[t] && (i = s[t]), Ut.test(i) && !Ft.test(t) && (n = s.left, r = e.runtimeStyle && e.runtimeStyle.left, r && (e.runtimeStyle.left = e.currentStyle.left), s.left = t === "fontSize" ? "1em" : i, i = s.pixelLeft + "px", s.left = n, r && (e.runtimeStyle.left = r)), i === "" ? "auto" : i
	}), v.each(["height", "width"], function(e, t) {
		v.cssHooks[t] = {
			get: function(e, n, r) {
				if (n) return e.offsetWidth === 0 && It.test(Dt(e, "display")) ? v.swap(e, Xt, function() {
					return tn(e, t, r)
				}) : tn(e, t, r)
			},
			set: function(e, n, r) {
				return Zt(e, n, r ? en(e, t, r, v.support.boxSizing && v.css(e, "boxSizing") === "border-box") : 0)
			}
		}
	}), v.support.opacity || (v.cssHooks.opacity = {
		get: function(e, t) {
			return jt.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
		},
		set: function(e, t) {
			var n = e.style,
				r = e.currentStyle,
				i = v.isNumeric(t) ? "alpha(opacity=" + t * 100 + ")" : "",
				s = r && r.filter || n.filter || "";
			n.zoom = 1;
			if (t >= 1 && v.trim(s.replace(Bt, "")) === "" && n.removeAttribute) {
				n.removeAttribute("filter");
				if (r && !r.filter) return
			}
			n.filter = Bt.test(s) ? s.replace(Bt, i) : s + " " + i
		}
	}), v(function() {
		v.support.reliableMarginRight || (v.cssHooks.marginRight = {
			get: function(e, t) {
				return v.swap(e, {
					display: "inline-block"
				}, function() {
					if (t) return Dt(e, "marginRight")
				})
			}
		}), !v.support.pixelPosition && v.fn.position && v.each(["top", "left"], function(e, t) {
			v.cssHooks[t] = {
				get: function(e, n) {
					if (n) {
						var r = Dt(e, t);
						return Ut.test(r) ? v(e).position()[t] + "px" : r
					}
				}
			}
		})
	}), v.expr && v.expr.filters && (v.expr.filters.hidden = function(e) {
		return e.offsetWidth === 0 && e.offsetHeight === 0 || !v.support.reliableHiddenOffsets && (e.style && e.style.display || Dt(e, "display")) === "none"
	}, v.expr.filters.visible = function(e) {
		return !v.expr.filters.hidden(e)
	}), v.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function(e, t) {
		v.cssHooks[e + t] = {
			expand: function(n) {
				var r, i = typeof n == "string" ? n.split(" ") : [n],
					s = {};
				for (r = 0; r < 4; r++) s[e + $t[r] + t] = i[r] || i[r - 2] || i[0];
				return s
			}
		}, qt.test(e) || (v.cssHooks[e + t].set = Zt)
	});
	var rn = /%20/g,
		sn = /\[\]$/,
		on = /\r?\n/g,
		un = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
		an = /^(?:select|textarea)/i;
	v.fn.extend({
		serialize: function() {
			return v.param(this.serializeArray())
		},
		serializeArray: function() {
			return this.map(function() {
				return this.elements ? v.makeArray(this.elements) : this
			}).filter(function() {
				return this.name && !this.disabled && (this.checked || an.test(this.nodeName) || un.test(this.type))
			}).map(function(e, t) {
				var n = v(this).val();
				return n == null ? null : v.isArray(n) ? v.map(n, function(e, n) {
					return {
						name: t.name,
						value: e.replace(on, "\r\n")
					}
				}) : {
					name: t.name,
					value: n.replace(on, "\r\n")
				}
			}).get()
		}
	}), v.param = function(e, n) {
		var r, i = [],
			s = function(e, t) {
				t = v.isFunction(t) ? t() : t == null ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
			};
		n === t && (n = v.ajaxSettings && v.ajaxSettings.traditional);
		if (v.isArray(e) || e.jquery && !v.isPlainObject(e)) v.each(e, function() {
			s(this.name, this.value)
		});
		else
			for (r in e) fn(r, e[r], n, s);
		return i.join("&").replace(rn, "+")
	};
	var ln, cn, hn = /#.*$/,
		pn = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
		dn = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
		vn = /^(?:GET|HEAD)$/,
		mn = /^\/\//,
		gn = /\?/,
		yn = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		bn = /([?&])_=[^&]*/,
		wn = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
		En = v.fn.load,
		Sn = {},
		xn = {},
		Tn = ["*/"] + ["*"];
	try {
		cn = s.href
	} catch (Nn) {
		cn = i.createElement("a"), cn.href = "", cn = cn.href
	}
	ln = wn.exec(cn.toLowerCase()) || [], v.fn.load = function(e, n, r) {
		if (typeof e != "string" && En) return En.apply(this, arguments);
		if (!this.length) return this;
		var i, s, o, u = this,
			a = e.indexOf(" ");
		return a >= 0 && (i = e.slice(a, e.length), e = e.slice(0, a)), v.isFunction(n) ? (r = n, n = t) : n && typeof n == "object" && (s = "POST"), v.ajax({
			url: e,
			type: s,
			dataType: "html",
			data: n,
			complete: function(e, t) {
				r && u.each(r, o || [e.responseText, t, e])
			}
		}).done(function(e) {
			o = arguments, u.html(i ? v("<div>").append(e.replace(yn, "")).find(i) : e)
		}), this
	}, v.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(e, t) {
		v.fn[t] = function(e) {
			return this.on(t, e)
		}
	}), v.each(["get", "post"], function(e, n) {
		v[n] = function(e, r, i, s) {
			return v.isFunction(r) && (s = s || i, i = r, r = t), v.ajax({
				type: n,
				url: e,
				data: r,
				success: i,
				dataType: s
			})
		}
	}), v.extend({
		getScript: function(e, n) {
			return v.get(e, t, n, "script")
		},
		getJSON: function(e, t, n) {
			return v.get(e, t, n, "json")
		},
		ajaxSetup: function(e, t) {
			return t ? Ln(e, v.ajaxSettings) : (t = e, e = v.ajaxSettings), Ln(e, t), e
		},
		ajaxSettings: {
			url: cn,
			isLocal: dn.test(ln[1]),
			global: !0,
			type: "GET",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			processData: !0,
			async: !0,
			accepts: {
				xml: "application/xml, text/xml",
				html: "text/html",
				text: "text/plain",
				json: "application/json, text/javascript",
				"*": Tn
			},
			contents: {
				xml: /xml/,
				html: /html/,
				json: /json/
			},
			responseFields: {
				xml: "responseXML",
				text: "responseText"
			},
			converters: {
				"* text": e.String,
				"text html": !0,
				"text json": v.parseJSON,
				"text xml": v.parseXML
			},
			flatOptions: {
				context: !0,
				url: !0
			}
		},
		ajaxPrefilter: Cn(Sn),
		ajaxTransport: Cn(xn),
		ajax: function(e, n) {
			function T(e, n, s, a) {
				var l, y, b, w, S, T = n;
				if (E === 2) return;
				E = 2, u && clearTimeout(u), o = t, i = a || "", x.readyState = e > 0 ? 4 : 0, s && (w = An(c, x, s));
				if (e >= 200 && e < 300 || e === 304) c.ifModified && (S = x.getResponseHeader("Last-Modified"), S && (v.lastModified[r] = S), S = x.getResponseHeader("Etag"), S && (v.etag[r] = S)), e === 304 ? (T = "notmodified", l = !0) : (l = On(c, w), T = l.state, y = l.data, b = l.error, l = !b);
				else {
					b = T;
					if (!T || e) T = "error", e < 0 && (e = 0)
				}
				x.status = e, x.statusText = (n || T) + "", l ? d.resolveWith(h, [y, T, x]) : d.rejectWith(h, [x, T, b]), x.statusCode(g), g = t, f && p.trigger("ajax" + (l ? "Success" : "Error"), [x, c, l ? y : b]), m.fireWith(h, [x, T]), f && (p.trigger("ajaxComplete", [x, c]), --v.active || v.event.trigger("ajaxStop"))
			}
			typeof e == "object" && (n = e, e = t), n = n || {};
			var r, i, s, o, u, a, f, l, c = v.ajaxSetup({}, n),
				h = c.context || c,
				p = h !== c && (h.nodeType || h instanceof v) ? v(h) : v.event,
				d = v.Deferred(),
				m = v.Callbacks("once memory"),
				g = c.statusCode || {},
				b = {},
				w = {},
				E = 0,
				S = "canceled",
				x = {
					readyState: 0,
					setRequestHeader: function(e, t) {
						if (!E) {
							var n = e.toLowerCase();
							e = w[n] = w[n] || e, b[e] = t
						}
						return this
					},
					getAllResponseHeaders: function() {
						return E === 2 ? i : null
					},
					getResponseHeader: function(e) {
						var n;
						if (E === 2) {
							if (!s) {
								s = {};
								while (n = pn.exec(i)) s[n[1].toLowerCase()] = n[2]
							}
							n = s[e.toLowerCase()]
						}
						return n === t ? null : n
					},
					overrideMimeType: function(e) {
						return E || (c.mimeType = e), this
					},
					abort: function(e) {
						return e = e || S, o && o.abort(e), T(0, e), this
					}
				};
			d.promise(x), x.success = x.done, x.error = x.fail, x.complete = m.add, x.statusCode = function(e) {
				if (e) {
					var t;
					if (E < 2)
						for (t in e) g[t] = [g[t], e[t]];
					else t = e[x.status], x.always(t)
				}
				return this
			}, c.url = ((e || c.url) + "").replace(hn, "").replace(mn, ln[1] + "//"), c.dataTypes = v.trim(c.dataType || "*").toLowerCase().split(y), c.crossDomain == null && (a = wn.exec(c.url.toLowerCase()), c.crossDomain = !(!a || a[1] === ln[1] && a[2] === ln[2] && (a[3] || (a[1] === "http:" ? 80 : 443)) == (ln[3] || (ln[1] === "http:" ? 80 : 443)))), c.data && c.processData && typeof c.data != "string" && (c.data = v.param(c.data, c.traditional)), kn(Sn, c, n, x);
			if (E === 2) return x;
			f = c.global, c.type = c.type.toUpperCase(), c.hasContent = !vn.test(c.type), f && v.active++ === 0 && v.event.trigger("ajaxStart");
			if (!c.hasContent) {
				c.data && (c.url += (gn.test(c.url) ? "&" : "?") + c.data, delete c.data), r = c.url;
				if (c.cache === !1) {
					var N = v.now(),
						C = c.url.replace(bn, "$1_=" + N);
					c.url = C + (C === c.url ? (gn.test(c.url) ? "&" : "?") + "_=" + N : "")
				}
			}(c.data && c.hasContent && c.contentType !== !1 || n.contentType) && x.setRequestHeader("Content-Type", c.contentType), c.ifModified && (r = r || c.url, v.lastModified[r] && x.setRequestHeader("If-Modified-Since", v.lastModified[r]), v.etag[r] && x.setRequestHeader("If-None-Match", v.etag[r])), x.setRequestHeader("Accept", c.dataTypes[0] && c.accepts[c.dataTypes[0]] ? c.accepts[c.dataTypes[0]] + (c.dataTypes[0] !== "*" ? ", " + Tn + "; q=0.01" : "") : c.accepts["*"]);
			for (l in c.headers) x.setRequestHeader(l, c.headers[l]);
			if (!c.beforeSend || c.beforeSend.call(h, x, c) !== !1 && E !== 2) {
				S = "abort";
				for (l in {
						success: 1,
						error: 1,
						complete: 1
					}) x[l](c[l]);
				o = kn(xn, c, n, x);
				if (!o) T(-1, "No Transport");
				else {
					x.readyState = 1, f && p.trigger("ajaxSend", [x, c]), c.async && c.timeout > 0 && (u = setTimeout(function() {
						x.abort("timeout")
					}, c.timeout));
					try {
						E = 1, o.send(b, T)
					} catch (k) {
						if (!(E < 2)) throw k;
						T(-1, k)
					}
				}
				return x
			}
			return x.abort()
		},
		active: 0,
		lastModified: {},
		etag: {}
	});
	var Mn = [],
		_n = /\?/,
		Dn = /(=)\?(?=&|$)|\?\?/,
		Pn = v.now();
	v.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function() {
			var e = Mn.pop() || v.expando + "_" + Pn++;
			return this[e] = !0, e
		}
	}), v.ajaxPrefilter("json jsonp", function(n, r, i) {
		var s, o, u, a = n.data,
			f = n.url,
			l = n.jsonp !== !1,
			c = l && Dn.test(f),
			h = l && !c && typeof a == "string" && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Dn.test(a);
		if (n.dataTypes[0] === "jsonp" || c || h) return s = n.jsonpCallback = v.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, o = e[s], c ? n.url = f.replace(Dn, "$1" + s) : h ? n.data = a.replace(Dn, "$1" + s) : l && (n.url += (_n.test(f) ? "&" : "?") + n.jsonp + "=" + s), n.converters["script json"] = function() {
			return u || v.error(s + " was not called"), u[0]
		}, n.dataTypes[0] = "json", e[s] = function() {
			u = arguments
		}, i.always(function() {
			e[s] = o, n[s] && (n.jsonpCallback = r.jsonpCallback, Mn.push(s)), u && v.isFunction(o) && o(u[0]), u = o = t
		}), "script"
	}), v.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /javascript|ecmascript/
		},
		converters: {
			"text script": function(e) {
				return v.globalEval(e), e
			}
		}
	}), v.ajaxPrefilter("script", function(e) {
		e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
	}), v.ajaxTransport("script", function(e) {
		if (e.crossDomain) {
			var n, r = i.head || i.getElementsByTagName("head")[0] || i.documentElement;
			return {
				send: function(s, o) {
					n = i.createElement("script"), n.async = "async", e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function(e, i) {
						if (i || !n.readyState || /loaded|complete/.test(n.readyState)) n.onload = n.onreadystatechange = null, r && n.parentNode && r.removeChild(n), n = t, i || o(200, "success")
					}, r.insertBefore(n, r.firstChild)
				},
				abort: function() {
					n && n.onload(0, 1)
				}
			}
		}
	});
	var Hn, Bn = e.ActiveXObject ? function() {
			for (var e in Hn) Hn[e](0, 1)
		} : !1,
		jn = 0;
	v.ajaxSettings.xhr = e.ActiveXObject ? function() {
			return !this.isLocal && Fn() || In()
		} : Fn,
		function(e) {
			v.extend(v.support, {
				ajax: !!e,
				cors: !!e && "withCredentials" in e
			})
		}(v.ajaxSettings.xhr()), v.support.ajax && v.ajaxTransport(function(n) {
			if (!n.crossDomain || v.support.cors) {
				var r;
				return {
					send: function(i, s) {
						var o, u, a = n.xhr();
						n.username ? a.open(n.type, n.url, n.async, n.username, n.password) : a.open(n.type, n.url, n.async);
						if (n.xhrFields)
							for (u in n.xhrFields) a[u] = n.xhrFields[u];
						n.mimeType && a.overrideMimeType && a.overrideMimeType(n.mimeType), !n.crossDomain && !i["X-Requested-With"] && (i["X-Requested-With"] = "XMLHttpRequest");
						try {
							for (u in i) a.setRequestHeader(u, i[u])
						} catch (f) {}
						a.send(n.hasContent && n.data || null), r = function(e, i) {
							var u, f, l, c, h;
							try {
								if (r && (i || a.readyState === 4)) {
									r = t, o && (a.onreadystatechange = v.noop, Bn && delete Hn[o]);
									if (i) a.readyState !== 4 && a.abort();
									else {
										u = a.status, l = a.getAllResponseHeaders(), c = {}, h = a.responseXML, h && h.documentElement && (c.xml = h);
										try {
											c.text = a.responseText
										} catch (p) {}
										try {
											f = a.statusText
										} catch (p) {
											f = ""
										}!u && n.isLocal && !n.crossDomain ? u = c.text ? 200 : 404 : u === 1223 && (u = 204)
									}
								}
							} catch (d) {
								i || s(-1, d)
							}
							c && s(u, f, c, l)
						}, n.async ? a.readyState === 4 ? setTimeout(r, 0) : (o = ++jn, Bn && (Hn || (Hn = {}, v(e).unload(Bn)), Hn[o] = r), a.onreadystatechange = r) : r()
					},
					abort: function() {
						r && r(0, 1)
					}
				}
			}
		});
	var qn, Rn, Un = /^(?:toggle|show|hide)$/,
		zn = new RegExp("^(?:([-+])=|)(" + m + ")([a-z%]*)$", "i"),
		Wn = /queueHooks$/,
		Xn = [Gn],
		Vn = {
			"*": [function(e, t) {
				var n, r, i = this.createTween(e, t),
					s = zn.exec(t),
					o = i.cur(),
					u = +o || 0,
					a = 1,
					f = 20;
				if (s) {
					n = +s[2], r = s[3] || (v.cssNumber[e] ? "" : "px");
					if (r !== "px" && u) {
						u = v.css(i.elem, e, !0) || n || 1;
						do a = a || ".5", u /= a, v.style(i.elem, e, u + r); while (a !== (a = i.cur() / o) && a !== 1 && --f)
					}
					i.unit = r, i.start = u, i.end = s[1] ? u + (s[1] + 1) * n : n
				}
				return i
			}]
		};
	v.Animation = v.extend(Kn, {
		tweener: function(e, t) {
			v.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
			var n, r = 0,
				i = e.length;
			for (; r < i; r++) n = e[r], Vn[n] = Vn[n] || [], Vn[n].unshift(t)
		},
		prefilter: function(e, t) {
			t ? Xn.unshift(e) : Xn.push(e)
		}
	}), v.Tween = Yn, Yn.prototype = {
		constructor: Yn,
		init: function(e, t, n, r, i, s) {
			this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = s || (v.cssNumber[n] ? "" : "px")
		},
		cur: function() {
			var e = Yn.propHooks[this.prop];
			return e && e.get ? e.get(this) : Yn.propHooks._default.get(this)
		},
		run: function(e) {
			var t, n = Yn.propHooks[this.prop];
			return this.options.duration ? this.pos = t = v.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : Yn.propHooks._default.set(this), this
		}
	}, Yn.prototype.init.prototype = Yn.prototype, Yn.propHooks = {
		_default: {
			get: function(e) {
				var t;
				return e.elem[e.prop] == null || !!e.elem.style && e.elem.style[e.prop] != null ? (t = v.css(e.elem, e.prop, !1, ""), !t || t === "auto" ? 0 : t) : e.elem[e.prop]
			},
			set: function(e) {
				v.fx.step[e.prop] ? v.fx.step[e.prop](e) : e.elem.style && (e.elem.style[v.cssProps[e.prop]] != null || v.cssHooks[e.prop]) ? v.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
			}
		}
	}, Yn.propHooks.scrollTop = Yn.propHooks.scrollLeft = {
		set: function(e) {
			e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
		}
	}, v.each(["toggle", "show", "hide"], function(e, t) {
		var n = v.fn[t];
		v.fn[t] = function(r, i, s) {
			return r == null || typeof r == "boolean" || !e && v.isFunction(r) && v.isFunction(i) ? n.apply(this, arguments) : this.animate(Zn(t, !0), r, i, s)
		}
	}), v.fn.extend({
		fadeTo: function(e, t, n, r) {
			return this.filter(Gt).css("opacity", 0).show().end().animate({
				opacity: t
			}, e, n, r)
		},
		animate: function(e, t, n, r) {
			var i = v.isEmptyObject(e),
				s = v.speed(t, n, r),
				o = function() {
					var t = Kn(this, v.extend({}, e), s);
					i && t.stop(!0)
				};
			return i || s.queue === !1 ? this.each(o) : this.queue(s.queue, o)
		},
		stop: function(e, n, r) {
			var i = function(e) {
				var t = e.stop;
				delete e.stop, t(r)
			};
			return typeof e != "string" && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function() {
				var t = !0,
					n = e != null && e + "queueHooks",
					s = v.timers,
					o = v._data(this);
				if (n) o[n] && o[n].stop && i(o[n]);
				else
					for (n in o) o[n] && o[n].stop && Wn.test(n) && i(o[n]);
				for (n = s.length; n--;) s[n].elem === this && (e == null || s[n].queue === e) && (s[n].anim.stop(r), t = !1, s.splice(n, 1));
				(t || !r) && v.dequeue(this, e)
			})
		}
	}), v.each({
		slideDown: Zn("show"),
		slideUp: Zn("hide"),
		slideToggle: Zn("toggle"),
		fadeIn: {
			opacity: "show"
		},
		fadeOut: {
			opacity: "hide"
		},
		fadeToggle: {
			opacity: "toggle"
		}
	}, function(e, t) {
		v.fn[e] = function(e, n, r) {
			return this.animate(t, e, n, r)
		}
	}), v.speed = function(e, t, n) {
		var r = e && typeof e == "object" ? v.extend({}, e) : {
			complete: n || !n && t || v.isFunction(e) && e,
			duration: e,
			easing: n && t || t && !v.isFunction(t) && t
		};
		r.duration = v.fx.off ? 0 : typeof r.duration == "number" ? r.duration : r.duration in v.fx.speeds ? v.fx.speeds[r.duration] : v.fx.speeds._default;
		if (r.queue == null || r.queue === !0) r.queue = "fx";
		return r.old = r.complete, r.complete = function() {
			v.isFunction(r.old) && r.old.call(this), r.queue && v.dequeue(this, r.queue)
		}, r
	}, v.easing = {
		linear: function(e) {
			return e
		},
		swing: function(e) {
			return .5 - Math.cos(e * Math.PI) / 2
		}
	}, v.timers = [], v.fx = Yn.prototype.init, v.fx.tick = function() {
		var e, n = v.timers,
			r = 0;
		qn = v.now();
		for (; r < n.length; r++) e = n[r], !e() && n[r] === e && n.splice(r--, 1);
		n.length || v.fx.stop(), qn = t
	}, v.fx.timer = function(e) {
		e() && v.timers.push(e) && !Rn && (Rn = setInterval(v.fx.tick, v.fx.interval))
	}, v.fx.interval = 13, v.fx.stop = function() {
		clearInterval(Rn), Rn = null
	}, v.fx.speeds = {
		slow: 600,
		fast: 200,
		_default: 400
	}, v.fx.step = {}, v.expr && v.expr.filters && (v.expr.filters.animated = function(e) {
		return v.grep(v.timers, function(t) {
			return e === t.elem
		}).length
	});
	var er = /^(?:body|html)$/i;
	v.fn.offset = function(e) {
		if (arguments.length) return e === t ? this : this.each(function(t) {
			v.offset.setOffset(this, e, t)
		});
		var n, r, i, s, o, u, a, f = {
				top: 0,
				left: 0
			},
			l = this[0],
			c = l && l.ownerDocument;
		if (!c) return;
		return (r = c.body) === l ? v.offset.bodyOffset(l) : (n = c.documentElement, v.contains(n, l) ? (typeof l.getBoundingClientRect != "undefined" && (f = l.getBoundingClientRect()), i = tr(c), s = n.clientTop || r.clientTop || 0, o = n.clientLeft || r.clientLeft || 0, u = i.pageYOffset || n.scrollTop, a = i.pageXOffset || n.scrollLeft, {
			top: f.top + u - s,
			left: f.left + a - o
		}) : f)
	}, v.offset = {
		bodyOffset: function(e) {
			var t = e.offsetTop,
				n = e.offsetLeft;
			return v.support.doesNotIncludeMarginInBodyOffset && (t += parseFloat(v.css(e, "marginTop")) || 0, n += parseFloat(v.css(e, "marginLeft")) || 0), {
				top: t,
				left: n
			}
		},
		setOffset: function(e, t, n) {
			var r = v.css(e, "position");
			r === "static" && (e.style.position = "relative");
			var i = v(e),
				s = i.offset(),
				o = v.css(e, "top"),
				u = v.css(e, "left"),
				a = (r === "absolute" || r === "fixed") && v.inArray("auto", [o, u]) > -1,
				f = {},
				l = {},
				c, h;
			a ? (l = i.position(), c = l.top, h = l.left) : (c = parseFloat(o) || 0, h = parseFloat(u) || 0), v.isFunction(t) && (t = t.call(e, n, s)), t.top != null && (f.top = t.top - s.top + c), t.left != null && (f.left = t.left - s.left + h), "using" in t ? t.using.call(e, f) : i.css(f)
		}
	}, v.fn.extend({
		position: function() {
			if (!this[0]) return;
			var e = this[0],
				t = this.offsetParent(),
				n = this.offset(),
				r = er.test(t[0].nodeName) ? {
					top: 0,
					left: 0
				} : t.offset();
			return n.top -= parseFloat(v.css(e, "marginTop")) || 0, n.left -= parseFloat(v.css(e, "marginLeft")) || 0, r.top += parseFloat(v.css(t[0], "borderTopWidth")) || 0, r.left += parseFloat(v.css(t[0], "borderLeftWidth")) || 0, {
				top: n.top - r.top,
				left: n.left - r.left
			}
		},
		offsetParent: function() {
			return this.map(function() {
				var e = this.offsetParent || i.body;
				while (e && !er.test(e.nodeName) && v.css(e, "position") === "static") e = e.offsetParent;
				return e || i.body
			})
		}
	}), v.each({
		scrollLeft: "pageXOffset",
		scrollTop: "pageYOffset"
	}, function(e, n) {
		var r = /Y/.test(n);
		v.fn[e] = function(i) {
			return v.access(this, function(e, i, s) {
				var o = tr(e);
				if (s === t) return o ? n in o ? o[n] : o.document.documentElement[i] : e[i];
				o ? o.scrollTo(r ? v(o).scrollLeft() : s, r ? s : v(o).scrollTop()) : e[i] = s
			}, e, i, arguments.length, null)
		}
	}), v.each({
		Height: "height",
		Width: "width"
	}, function(e, n) {
		v.each({
			padding: "inner" + e,
			content: n,
			"": "outer" + e
		}, function(r, i) {
			v.fn[i] = function(i, s) {
				var o = arguments.length && (r || typeof i != "boolean"),
					u = r || (i === !0 || s === !0 ? "margin" : "border");
				return v.access(this, function(n, r, i) {
					var s;
					return v.isWindow(n) ? n.document.documentElement["client" + e] : n.nodeType === 9 ? (s = n.documentElement, Math.max(n.body["scroll" + e], s["scroll" + e], n.body["offset" + e], s["offset" + e], s["client" + e])) : i === t ? v.css(n, r, i, u) : v.style(n, r, i, u)
				}, n, o ? i : t, o, null)
			}
		})
	}), e.jQuery = e.$ = v, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
		return v
	})
})(window);
(function(e, t) {
	"use strict";
	var n = e.History = e.History || {},
		r = e.jQuery;
	if (typeof n.Adapter != "undefined") throw new Error("History.js Adapter has already been loaded...");
	n.Adapter = {
		bind: function(e, t, n) {
			r(e).bind(t, n)
		},
		trigger: function(e, t, n) {
			r(e).trigger(t, n)
		},
		extractEventData: function(e, n, r) {
			var i = n && n.originalEvent && n.originalEvent[e] || r && r[e] || t;
			return i
		},
		onDomLoad: function(e) {
			r(e)
		}
	}, typeof n.init != "undefined" && n.init()
})(window),
function(e, t) {
	"use strict";
	var n = e.console || t,
		r = e.document,
		i = e.navigator,
		s = !1,
		o = e.setTimeout,
		u = e.clearTimeout,
		a = e.setInterval,
		f = e.clearInterval,
		l = e.JSON,
		c = e.alert,
		h = e.History = e.History || {},
		p = e.history;
	try {
		s = e.sessionStorage, s.setItem("TEST", "1"), s.removeItem("TEST")
	} catch (d) {
		s = !1
	}
	l.stringify = l.stringify || l.encode, l.parse = l.parse || l.decode;
	if (typeof h.init != "undefined") throw new Error("History.js Core has already been loaded...");
	h.init = function(e) {
		return typeof h.Adapter == "undefined" ? !1 : (typeof h.initCore != "undefined" && h.initCore(), typeof h.initHtml4 != "undefined" && h.initHtml4(), !0)
	}, h.initCore = function(d) {
		if (typeof h.initCore.initialized != "undefined") return !1;
		h.initCore.initialized = !0, h.options = h.options || {}, h.options.hashChangeInterval = h.options.hashChangeInterval || 100, h.options.safariPollInterval = h.options.safariPollInterval || 500, h.options.doubleCheckInterval = h.options.doubleCheckInterval || 500, h.options.disableSuid = h.options.disableSuid || !1, h.options.storeInterval = h.options.storeInterval || 1e3, h.options.busyDelay = h.options.busyDelay || 250, h.options.debug = h.options.debug || !1, h.options.initialTitle = h.options.initialTitle || r.title, h.options.html4Mode = h.options.html4Mode || !1, h.options.delayInit = h.options.delayInit || !1, h.intervalList = [], h.clearAllIntervals = function() {
			var e, t = h.intervalList;
			if (typeof t != "undefined" && t !== null) {
				for (e = 0; e < t.length; e++) f(t[e]);
				h.intervalList = null
			}
		}, h.debug = function() {
			(h.options.debug || !1) && h.log.apply(h, arguments)
		}, h.log = function() {
			var e = typeof n != "undefined" && typeof n.log != "undefined" && typeof n.log.apply != "undefined",
				t = r.getElementById("log"),
				i, s, o, u, a;
			e ? (u = Array.prototype.slice.call(arguments), i = u.shift(), typeof n.debug != "undefined" ? n.debug.apply(n, [i, u]) : n.log.apply(n, [i, u])) : i = "\n" + arguments[0] + "\n";
			for (s = 1, o = arguments.length; s < o; ++s) {
				a = arguments[s];
				if (typeof a == "object" && typeof l != "undefined") try {
					a = l.stringify(a)
				} catch (f) {}
				i += "\n" + a + "\n"
			}
			return t ? (t.value += i + "\n-----\n", t.scrollTop = t.scrollHeight - t.clientHeight) : e || c(i), !0
		}, h.getInternetExplorerMajorVersion = function() {
			var e = h.getInternetExplorerMajorVersion.cached = typeof h.getInternetExplorerMajorVersion.cached != "undefined" ? h.getInternetExplorerMajorVersion.cached : function() {
				var e = 3,
					t = r.createElement("div"),
					n = t.getElementsByTagName("i");
				while ((t.innerHTML = "<!--[if gt IE " + ++e + "]><i></i><![endif]-->") && n[0]);
				return e > 4 ? e : !1
			}();
			return e
		}, h.isInternetExplorer = function() {
			var e = h.isInternetExplorer.cached = typeof h.isInternetExplorer.cached != "undefined" ? h.isInternetExplorer.cached : Boolean(h.getInternetExplorerMajorVersion());
			return e
		}, h.options.html4Mode ? h.emulated = {
			pushState: !0,
			hashChange: !0
		} : h.emulated = {
			pushState: !Boolean(e.history && e.history.pushState && e.history.replaceState && !/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(i.userAgent) && !/AppleWebKit\/5([0-2]|3[0-2])/i.test(i.userAgent)),
			hashChange: Boolean(!("onhashchange" in e || "onhashchange" in r) || h.isInternetExplorer() && h.getInternetExplorerMajorVersion() < 8)
		}, h.enabled = !h.emulated.pushState, h.bugs = {
			setHash: Boolean(!h.emulated.pushState && i.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),
			safariPoll: Boolean(!h.emulated.pushState && i.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),
			ieDoubleCheck: Boolean(h.isInternetExplorer() && h.getInternetExplorerMajorVersion() < 8),
			hashEscape: Boolean(h.isInternetExplorer() && h.getInternetExplorerMajorVersion() < 7)
		}, h.isEmptyObject = function(e) {
			for (var t in e)
				if (e.hasOwnProperty(t)) return !1;
			return !0
		}, h.cloneObject = function(e) {
			var t, n;
			return e ? (t = l.stringify(e), n = l.parse(t)) : n = {}, n
		}, h.getRootUrl = function() {
			var e = r.location.protocol + "//" + (r.location.hostname || r.location.host);
			if (r.location.port || !1) e += ":" + r.location.port;
			return e += "/", e
		}, h.getBaseHref = function() {
			var e = r.getElementsByTagName("base"),
				t = null,
				n = "";
			return e.length === 1 && (t = e[0], n = t.href.replace(/[^\/]+$/, "")), n = n.replace(/\/+$/, ""), n && (n += "/"), n
		}, h.getBaseUrl = function() {
			var e = h.getBaseHref() || h.getBasePageUrl() || h.getRootUrl();
			return e
		}, h.getPageUrl = function() {
			var e = h.getState(!1, !1),
				t = (e || {}).url || h.getLocationHref(),
				n;
			return n = t.replace(/\/+$/, "").replace(/[^\/]+$/, function(e, t, n) {
				return /\./.test(e) ? e : e + "/"
			}), n
		}, h.getBasePageUrl = function() {
			var e = h.getLocationHref().replace(/[#\?].*/, "").replace(/[^\/]+$/, function(e, t, n) {
				return /[^\/]$/.test(e) ? "" : e
			}).replace(/\/+$/, "") + "/";
			return e
		}, h.getFullUrl = function(e, t) {
			var n = e,
				r = e.substring(0, 1);
			return t = typeof t == "undefined" ? !0 : t, /[a-z]+\:\/\//.test(e) || (r === "/" ? n = h.getRootUrl() + e.replace(/^\/+/, "") : r === "#" ? n = h.getPageUrl().replace(/#.*/, "") + e : r === "?" ? n = h.getPageUrl().replace(/[\?#].*/, "") + e : t ? n = h.getBaseUrl() + e.replace(/^(\.\/)+/, "") : n = h.getBasePageUrl() + e.replace(/^(\.\/)+/, "")), n.replace(/\#$/, "")
		}, h.getShortUrl = function(e) {
			var t = e,
				n = h.getBaseUrl(),
				r = h.getRootUrl();
			return h.emulated.pushState && (t = t.replace(n, "")), t = t.replace(r, "/"), h.isTraditionalAnchor(t) && (t = "./" + t), t = t.replace(/^(\.\/)+/g, "./").replace(/\#$/, ""), t
		}, h.getLocationHref = function(e) {
			return e = e || r, e.URL === e.location.href ? e.location.href : e.location.href === decodeURIComponent(e.URL) ? e.URL : e.location.hash && decodeURIComponent(e.location.href.replace(/^[^#]+/, "")) === e.location.hash ? e.location.href : e.URL.indexOf("#") == -1 && e.location.href.indexOf("#") != -1 ? e.location.href : e.URL || e.location.href
		}, h.store = {}, h.idToState = h.idToState || {}, h.stateToId = h.stateToId || {}, h.urlToId = h.urlToId || {}, h.storedStates = h.storedStates || [], h.savedStates = h.savedStates || [], h.normalizeStore = function() {
			h.store.idToState = h.store.idToState || {}, h.store.urlToId = h.store.urlToId || {}, h.store.stateToId = h.store.stateToId || {}
		}, h.getState = function(e, t) {
			typeof e == "undefined" && (e = !0), typeof t == "undefined" && (t = !0);
			var n = h.getLastSavedState();
			return !n && t && (n = h.createStateObject()), e && (n = h.cloneObject(n), n.url = n.cleanUrl || n.url), n
		}, h.getIdByState = function(e) {
			var t = h.extractId(e.url),
				n;
			if (!t) {
				n = h.getStateString(e);
				if (typeof h.stateToId[n] != "undefined") t = h.stateToId[n];
				else if (typeof h.store.stateToId[n] != "undefined") t = h.store.stateToId[n];
				else {
					for (;;) {
						t = (new Date).getTime() + String(Math.random()).replace(/\D/g, "");
						if (typeof h.idToState[t] == "undefined" && typeof h.store.idToState[t] == "undefined") break
					}
					h.stateToId[n] = t, h.idToState[t] = e
				}
			}
			return t
		}, h.normalizeState = function(e) {
			var t, n;
			if (!e || typeof e != "object") e = {};
			if (typeof e.normalized != "undefined") return e;
			if (!e.data || typeof e.data != "object") e.data = {};
			return t = {}, t.normalized = !0, t.title = e.title || "", t.url = h.getFullUrl(e.url ? e.url : h.getLocationHref()), t.hash = h.getShortUrl(t.url), t.data = h.cloneObject(e.data), t.id = h.getIdByState(t), t.cleanUrl = t.url.replace(/\??\&_suid.*/, ""), t.url = t.cleanUrl, n = !h.isEmptyObject(t.data), (t.title || n) && h.options.disableSuid !== !0 && (t.hash = h.getShortUrl(t.url).replace(/\??\&_suid.*/, ""), /\?/.test(t.hash) || (t.hash += "?"), t.hash += "&_suid=" + t.id), t.hashedUrl = h.getFullUrl(t.hash), (h.emulated.pushState || h.bugs.safariPoll) && h.hasUrlDuplicate(t) && (t.url = t.hashedUrl), t
		}, h.createStateObject = function(e, t, n) {
			var r = {
				data: e,
				title: t,
				url: n
			};
			return r = h.normalizeState(r), r
		}, h.getStateById = function(e) {
			e = String(e);
			var n = h.idToState[e] || h.store.idToState[e] || t;
			return n
		}, h.getStateString = function(e) {
			var t, n, r;
			return t = h.normalizeState(e), n = {
				data: t.data,
				title: e.title,
				url: e.url
			}, r = l.stringify(n), r
		}, h.getStateId = function(e) {
			var t, n;
			return t = h.normalizeState(e), n = t.id, n
		}, h.getHashByState = function(e) {
			var t, n;
			return t = h.normalizeState(e), n = t.hash, n
		}, h.extractId = function(e) {
			var t, n, r, i;
			return e.indexOf("#") != -1 ? i = e.split("#")[0] : i = e, n = /(.*)\&_suid=([0-9]+)$/.exec(i), r = n ? n[1] || e : e, t = n ? String(n[2] || "") : "", t || !1
		}, h.isTraditionalAnchor = function(e) {
			var t = !/[\/\?\.]/.test(e);
			return t
		}, h.extractState = function(e, t) {
			var n = null,
				r, i;
			return t = t || !1, r = h.extractId(e), r && (n = h.getStateById(r)), n || (i = h.getFullUrl(e), r = h.getIdByUrl(i) || !1, r && (n = h.getStateById(r)), !n && t && !h.isTraditionalAnchor(e) && (n = h.createStateObject(null, null, i))), n
		}, h.getIdByUrl = function(e) {
			var n = h.urlToId[e] || h.store.urlToId[e] || t;
			return n
		}, h.getLastSavedState = function() {
			return h.savedStates[h.savedStates.length - 1] || t
		}, h.getLastStoredState = function() {
			return h.storedStates[h.storedStates.length - 1] || t
		}, h.hasUrlDuplicate = function(e) {
			var t = !1,
				n;
			return n = h.extractState(e.url), t = n && n.id !== e.id, t
		}, h.storeState = function(e) {
			return h.urlToId[e.url] = e.id, h.storedStates.push(h.cloneObject(e)), e
		}, h.isLastSavedState = function(e) {
			var t = !1,
				n, r, i;
			return h.savedStates.length && (n = e.id, r = h.getLastSavedState(), i = r.id, t = n === i), t
		}, h.saveState = function(e) {
			return h.isLastSavedState(e) ? !1 : (h.savedStates.push(h.cloneObject(e)), !0)
		}, h.getStateByIndex = function(e) {
			var t = null;
			return typeof e == "undefined" ? t = h.savedStates[h.savedStates.length - 1] : e < 0 ? t = h.savedStates[h.savedStates.length + e] : t = h.savedStates[e], t
		}, h.getCurrentIndex = function() {
			var e = null;
			return h.savedStates.length < 1 ? e = 0 : e = h.savedStates.length - 1, e
		}, h.getHash = function(e) {
			var t = h.getLocationHref(e),
				n;
			return n = h.getHashByUrl(t), n
		}, h.unescapeHash = function(e) {
			var t = h.normalizeHash(e);
			return t = decodeURIComponent(t), t
		}, h.normalizeHash = function(e) {
			var t = e.replace(/[^#]*#/, "").replace(/#.*/, "");
			return t
		}, h.setHash = function(e, t) {
			var n, i;
			return t !== !1 && h.busy() ? (h.pushQueue({
				scope: h,
				callback: h.setHash,
				args: arguments,
				queue: t
			}), !1) : (h.busy(!0), n = h.extractState(e, !0), n && !h.emulated.pushState ? h.pushState(n.data, n.title, n.url, !1) : h.getHash() !== e && (h.bugs.setHash ? (i = h.getPageUrl(), h.pushState(null, null, i + "#" + e, !1)) : r.location.hash = e), h)
		}, h.escapeHash = function(t) {
			var n = h.normalizeHash(t);
			return n = e.encodeURIComponent(n), h.bugs.hashEscape || (n = n.replace(/\%21/g, "!").replace(/\%26/g, "&").replace(/\%3D/g, "=").replace(/\%3F/g, "?")), n
		}, h.getHashByUrl = function(e) {
			var t = String(e).replace(/([^#]*)#?([^#]*)#?(.*)/, "$2");
			return t = h.unescapeHash(t), t
		}, h.setTitle = function(e) {
			var t = e.title,
				n;
			t || (n = h.getStateByIndex(0), n && n.url === e.url && (t = n.title || h.options.initialTitle));
			try {
				r.getElementsByTagName("title")[0].innerHTML = t.replace("<", "&lt;").replace(">", "&gt;").replace(" & ", " &amp; ")
			} catch (i) {}
			return r.title = t, h
		}, h.queues = [], h.busy = function(e) {
			typeof e != "undefined" ? h.busy.flag = e : typeof h.busy.flag == "undefined" && (h.busy.flag = !1);
			if (!h.busy.flag) {
				u(h.busy.timeout);
				var t = function() {
					var e, n, r;
					if (h.busy.flag) return;
					for (e = h.queues.length - 1; e >= 0; --e) {
						n = h.queues[e];
						if (n.length === 0) continue;
						r = n.shift(), h.fireQueueItem(r), h.busy.timeout = o(t, h.options.busyDelay)
					}
				};
				h.busy.timeout = o(t, h.options.busyDelay)
			}
			return h.busy.flag
		}, h.busy.flag = !1, h.fireQueueItem = function(e) {
			return e.callback.apply(e.scope || h, e.args || [])
		}, h.pushQueue = function(e) {
			return h.queues[e.queue || 0] = h.queues[e.queue || 0] || [], h.queues[e.queue || 0].push(e), h
		}, h.queue = function(e, t) {
			return typeof e == "function" && (e = {
				callback: e
			}), typeof t != "undefined" && (e.queue = t), h.busy() ? h.pushQueue(e) : h.fireQueueItem(e), h
		}, h.clearQueue = function() {
			return h.busy.flag = !1, h.queues = [], h
		}, h.stateChanged = !1, h.doubleChecker = !1, h.doubleCheckComplete = function() {
			return h.stateChanged = !0, h.doubleCheckClear(), h
		}, h.doubleCheckClear = function() {
			return h.doubleChecker && (u(h.doubleChecker), h.doubleChecker = !1), h
		}, h.doubleCheck = function(e) {
			return h.stateChanged = !1, h.doubleCheckClear(), h.bugs.ieDoubleCheck && (h.doubleChecker = o(function() {
				return h.doubleCheckClear(), h.stateChanged || e(), !0
			}, h.options.doubleCheckInterval)), h
		}, h.safariStatePoll = function() {
			var t = h.extractState(h.getLocationHref()),
				n;
			if (!h.isLastSavedState(t)) return n = t, n || (n = h.createStateObject()), h.Adapter.trigger(e, "popstate"), h;
			return
		}, h.back = function(e) {
			return e !== !1 && h.busy() ? (h.pushQueue({
				scope: h,
				callback: h.back,
				args: arguments,
				queue: e
			}), !1) : (h.busy(!0), h.doubleCheck(function() {
				h.back(!1)
			}), p.go(-1), !0)
		}, h.forward = function(e) {
			return e !== !1 && h.busy() ? (h.pushQueue({
				scope: h,
				callback: h.forward,
				args: arguments,
				queue: e
			}), !1) : (h.busy(!0), h.doubleCheck(function() {
				h.forward(!1)
			}), p.go(1), !0)
		}, h.go = function(e, t) {
			var n;
			if (e > 0)
				for (n = 1; n <= e; ++n) h.forward(t);
			else {
				if (!(e < 0)) throw new Error("History.go: History.go requires a positive or negative integer passed.");
				for (n = -1; n >= e; --n) h.back(t)
			}
			return h
		};
		if (h.emulated.pushState) {
			var v = function() {};
			h.pushState = h.pushState || v, h.replaceState = h.replaceState || v
		} else h.onPopState = function(t, n) {
			var r = !1,
				i = !1,
				s, o;
			return h.doubleCheckComplete(), s = h.getHash(), s ? (o = h.extractState(s || h.getLocationHref(), !0), o ? h.replaceState(o.data, o.title, o.url, !1) : (h.Adapter.trigger(e, "anchorchange"), h.busy(!1)), h.expectedStateId = !1, !1) : (r = h.Adapter.extractEventData("state", t, n) || !1, r ? i = h.getStateById(r) : h.expectedStateId ? i = h.getStateById(h.expectedStateId) : i = h.extractState(h.getLocationHref()), i || (i = h.createStateObject(null, null, h.getLocationHref())), h.expectedStateId = !1, h.isLastSavedState(i) ? (h.busy(!1), !1) : (h.storeState(i), h.saveState(i), h.setTitle(i), h.Adapter.trigger(e, "statechange"), h.busy(!1), !0))
		}, h.Adapter.bind(e, "popstate", h.onPopState), h.pushState = function(t, n, r, i) {
			if (h.getHashByUrl(r) && h.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
			if (i !== !1 && h.busy()) return h.pushQueue({
				scope: h,
				callback: h.pushState,
				args: arguments,
				queue: i
			}), !1;
			h.busy(!0);
			var s = h.createStateObject(t, n, r);
			return h.isLastSavedState(s) ? h.busy(!1) : (h.storeState(s), h.expectedStateId = s.id, p.pushState(s.id, s.title, s.url), h.Adapter.trigger(e, "popstate")), !0
		}, h.replaceState = function(t, n, r, i) {
			if (h.getHashByUrl(r) && h.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
			if (i !== !1 && h.busy()) return h.pushQueue({
				scope: h,
				callback: h.replaceState,
				args: arguments,
				queue: i
			}), !1;
			h.busy(!0);
			var s = h.createStateObject(t, n, r);
			return h.isLastSavedState(s) ? h.busy(!1) : (h.storeState(s), h.expectedStateId = s.id, p.replaceState(s.id, s.title, s.url), h.Adapter.trigger(e, "popstate")), !0
		};
		if (s) {
			try {
				h.store = l.parse(s.getItem("History.store")) || {}
			} catch (m) {
				h.store = {}
			}
			h.normalizeStore()
		} else h.store = {}, h.normalizeStore();
		h.Adapter.bind(e, "unload", h.clearAllIntervals), h.saveState(h.storeState(h.extractState(h.getLocationHref(), !0))), s && (h.onUnload = function() {
			var e, t, n;
			try {
				e = l.parse(s.getItem("History.store")) || {}
			} catch (r) {
				e = {}
			}
			e.idToState = e.idToState || {}, e.urlToId = e.urlToId || {}, e.stateToId = e.stateToId || {};
			for (t in h.idToState) {
				if (!h.idToState.hasOwnProperty(t)) continue;
				e.idToState[t] = h.idToState[t]
			}
			for (t in h.urlToId) {
				if (!h.urlToId.hasOwnProperty(t)) continue;
				e.urlToId[t] = h.urlToId[t]
			}
			for (t in h.stateToId) {
				if (!h.stateToId.hasOwnProperty(t)) continue;
				e.stateToId[t] = h.stateToId[t]
			}
			h.store = e, h.normalizeStore(), n = l.stringify(e);
			try {
				s.setItem("History.store", n)
			} catch (i) {
				if (i.code !== DOMException.QUOTA_EXCEEDED_ERR) throw i;
				s.length && (s.removeItem("History.store"), s.setItem("History.store", n))
			}
		}, h.intervalList.push(a(h.onUnload, h.options.storeInterval)), h.Adapter.bind(e, "beforeunload", h.onUnload), h.Adapter.bind(e, "unload", h.onUnload));
		if (!h.emulated.pushState) {
			h.bugs.safariPoll && h.intervalList.push(a(h.safariStatePoll, h.options.safariPollInterval));
			if (i.vendor === "Apple Computer, Inc." || (i.appCodeName || "") === "Mozilla") h.Adapter.bind(e, "hashchange", function() {
				h.Adapter.trigger(e, "popstate")
			}), h.getHash() && h.Adapter.onDomLoad(function() {
				h.Adapter.trigger(e, "hashchange")
			})
		}
	}, (!h.options || !h.options.delayInit) && h.init()
}(window);
/*!
 * VERSION: 0.13.0
 * DATE: 2015-03-13
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * Requires TweenLite and CSSPlugin version 1.16.1 or later (TweenMax contains both TweenLite and CSSPlugin). ThrowPropsPlugin is required for momentum-based continuation of movement after the mouse/touch is released (ThrowPropsPlugin is a membership benefit of Club GreenSock - http://greensock.com/club/).
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
		"use strict";
		_gsScope._gsDefine("utils.Draggable", ["events.EventDispatcher", "TweenLite"], function(t, e) {
			var i, s, r, n, a, o = {
					css: {}
				},
				l = {
					css: {}
				},
				h = {
					css: {}
				},
				u = {
					css: {}
				},
				_ = _gsScope._gsDefine.globals,
				c = {},
				f = document,
				p = f.documentElement || {},
				d = [],
				m = function() {
					return !1
				},
				g = 180 / Math.PI,
				v = 999999999999999,
				y = Date.now || function() {
					return (new Date).getTime()
				},
				T = !(f.addEventListener || !f.all),
				w = f.createElement("div"),
				x = [],
				b = {},
				P = 0,
				S = /^(?:a|input|textarea|button|select)$/i,
				C = 0,
				k = -1 !== navigator.userAgent.toLowerCase().indexOf("android"),
				R = 0,
				A = {},
				O = function(t) {
					if ("string" == typeof t && (t = e.selector(t)), !t || t.nodeType) return [t];
					var i, s = [],
						r = t.length;
					for (i = 0; i !== r; s.push(t[i++]));
					return s
				},
				D = function() {
					for (var t = x.length; --t > -1;) x[t]()
				},
				M = function(t) {
					x.push(t), 1 === x.length && e.ticker.addEventListener("tick", D, this, !1, 1)
				},
				L = function(t) {
					for (var i = x.length; --i > -1;) x[i] === t && x.splice(i, 1);
					e.to(N, 0, {
						overwrite: "all",
						delay: 15,
						onComplete: N
					})
				},
				N = function() {
					x.length || e.ticker.removeEventListener("tick", D)
				},
				E = function(t, e) {
					var i;
					for (i in e) void 0 === t[i] && (t[i] = e[i]);
					return t
				},
				I = function() {
					return null != window.pageYOffset ? window.pageYOffset : null != f.scrollTop ? f.scrollTop : p.scrollTop || f.body.scrollTop || 0
				},
				z = function() {
					return null != window.pageXOffset ? window.pageXOffset : null != f.scrollLeft ? f.scrollLeft : p.scrollLeft || f.body.scrollLeft || 0
				},
				X = function(t, e) {
					be(t, "scroll", e), B(t.parentNode) || X(t.parentNode, e)
				},
				F = function(t, e) {
					Pe(t, "scroll", e), B(t.parentNode) || F(t.parentNode, e)
				},
				B = function(t) {
					return !(t && t !== p && t !== f && t !== f.body && t !== window && t.nodeType && t.parentNode)
				},
				Y = function(t, e) {
					var i = "x" === e ? "Width" : "Height",
						s = "scroll" + i,
						r = "client" + i,
						n = f.body;
					return Math.max(0, B(t) ? Math.max(p[s], n[s]) - (window["inner" + i] || p[r] || n[r]) : t[s] - t[r])
				},
				U = function(t) {
					var e = B(t),
						i = Y(t, "x"),
						s = Y(t, "y");
					e ? t = A : U(t.parentNode), t._gsMaxScrollX = i, t._gsMaxScrollY = s, t._gsScrollX = t.scrollLeft || 0, t._gsScrollY = t.scrollTop || 0
				},
				j = function(t, e) {
					return t = t || window.event, c.pageX = t.clientX + f.body.scrollLeft + p.scrollLeft, c.pageY = t.clientY + f.body.scrollTop + p.scrollTop, e && (t.returnValue = !1), c
				},
				W = function(t) {
					return t ? ("string" == typeof t && (t = e.selector(t)), t.length && t !== window && t[0] && t[0].style && !t.nodeType && (t = t[0]), t === window || t.nodeType && t.style ? t : null) : t
				},
				q = function(t, e) {
					var s, r, n, a = t.style;
					if (void 0 === a[e]) {
						for (n = ["O", "Moz", "ms", "Ms", "Webkit"], r = 5, s = e.charAt(0).toUpperCase() + e.substr(1); --r > -1 && void 0 === a[n[r] + s];);
						if (0 > r) return "";
						i = 3 === r ? "ms" : n[r], e = i + s
					}
					return e
				},
				V = function(t, e, i) {
					var s = t.style;
					s && (void 0 === s[e] && (e = q(t, e)), null == i ? s.removeProperty ? s.removeProperty(e.replace(/([A-Z])/g, "-$1").toLowerCase()) : s.removeAttribute(e) : void 0 !== s[e] && (s[e] = i))
				},
				G = f.defaultView ? f.defaultView.getComputedStyle : m,
				H = /(?:Left|Right|Width)/i,
				Q = /(?:\d|\-|\+|=|#|\.)*/g,
				Z = function(t, e, i, s, r) {
					if ("px" === s || !s) return i;
					if ("auto" === s || !i) return 0;
					var n, a = H.test(e),
						o = t,
						l = ee.style,
						h = 0 > i;
					return h && (i = -i), "%" === s && -1 !== e.indexOf("border") ? n = i / 100 * (a ? t.clientWidth : t.clientHeight) : (l.cssText = "border:0 solid red;position:" + K(t, "position", !0) + ";line-height:0;", "%" !== s && o.appendChild ? l[a ? "borderLeftWidth" : "borderTopWidth"] = i + s : (o = t.parentNode || f.body, l[a ? "width" : "height"] = i + s), o.appendChild(ee), n = parseFloat(ee[a ? "offsetWidth" : "offsetHeight"]), o.removeChild(ee), 0 !== n || r || (n = Z(t, e, i, s, !0))), h ? -n : n
				},
				$ = function(t, e) {
					if ("absolute" !== K(t, "position", !0)) return 0;
					var i = "left" === e ? "Left" : "Top",
						s = K(t, "margin" + i, !0);
					return t["offset" + i] - (Z(t, e, parseFloat(s), (s + "").replace(Q, "")) || 0)
				},
				K = function(t, e, i) {
					var s, r = (t._gsTransform || {})[e];
					return r || 0 === r ? r : (t.style[e] ? r = t.style[e] : (s = G(t)) ? (r = s.getPropertyValue(e.replace(/([A-Z])/g, "-$1").toLowerCase()), r = r || s.length ? r : s[e]) : t.currentStyle && (r = t.currentStyle[e]), "auto" !== r || "top" !== e && "left" !== e || (r = $(t, e)), i ? r : parseFloat(r) || 0)
				},
				J = function(t, e, i) {
					var s = t.vars,
						r = s[i],
						n = t._listeners[e];
					"function" == typeof r && r.apply(s[i + "Scope"] || t, s[i + "Params"] || [t.pointerEvent]), n && t.dispatchEvent(e)
				},
				te = function(t, e) {
					var i, s, r, n = W(t);
					return n ? ve(n, e) : void 0 !== t.left ? (r = fe(e), {
						left: t.left - r.x,
						top: t.top - r.y,
						width: t.width,
						height: t.height
					}) : (s = t.min || t.minX || t.minRotation || 0, i = t.min || t.minY || 0, {
						left: s,
						top: i,
						width: (t.max || t.maxX || t.maxRotation || 0) - s,
						height: (t.max || t.maxY || 0) - i
					})
				},
				ee = f.createElement("div"),
				ie = "" !== q(ee, "perspective"),
				se = q(ee, "transformOrigin").replace(/^ms/g, "Ms").replace(/([A-Z])/g, "-$1").toLowerCase(),
				re = q(ee, "transform"),
				ne = re.replace(/^ms/g, "Ms").replace(/([A-Z])/g, "-$1").toLowerCase(),
				ae = {},
				oe = {},
				le = function() {
					if (!T) {
						var t = "http://www.w3.org/2000/svg",
							e = f.createElementNS(t, "svg"),
							i = f.createElementNS(t, "rect");
						return i.setAttributeNS(null, "width", "10"), i.setAttributeNS(null, "height", "10"), e.appendChild(i), e
					}
				}(),
				he = window.SVGElement,
				ue = function(t) {
					return !!(he && "function" == typeof t.getBBox && t.getCTM && (!t.parentNode || t.parentNode.getBBox && t.parentNode.getCTM))
				},
				_e = ["class", "viewBox", "width", "height", "xml:space"],
				ce = function(t) {
					if (!t.getBoundingClientRect || !t.parentNode) return {
						offsetTop: 0,
						offsetLeft: 0,
						scaleX: 1,
						scaleY: 1,
						offsetParent: p
					};
					if (t._gsSVGData && t._gsSVGData.lastUpdate === e.ticker.frame) return t._gsSVGData;
					var i, s, r, n, a, o, l = t,
						h = t.style.cssText,
						u = t._gsSVGData = t._gsSVGData || {};
					if ("svg" !== (t.nodeName + "").toLowerCase() && t.getBBox) {
						for (l = t.parentNode, i = t.getBBox(); l && "svg" !== (l.nodeName + "").toLowerCase();) l = l.parentNode;
						return u = ce(l), {
							offsetTop: i.y * u.scaleY,
							offsetLeft: i.x * u.scaleX,
							scaleX: u.scaleX,
							scaleY: u.scaleY,
							offsetParent: l || p
						}
					}
					for (; !l.offsetParent && l.parentNode;) l = l.parentNode;
					for (t.parentNode.insertBefore(le, t), t.parentNode.removeChild(t), le.style.cssText = h, le.style[re] = "none", a = _e.length; --a > -1;) o = t.getAttribute(_e[a]), o ? le.setAttribute(_e[a], o) : le.removeAttribute(_e[a]);
					return i = le.getBoundingClientRect(), n = le.firstChild.getBoundingClientRect(), r = l.offsetParent, r ? (r === f.body && p && (r = p), s = r.getBoundingClientRect()) : s = {
						top: -I(),
						left: -z()
					}, le.parentNode.insertBefore(t, le), t.parentNode.removeChild(le), u.scaleX = n.width / 10, u.scaleY = n.height / 10, u.offsetLeft = i.left - s.left, u.offsetTop = i.top - s.top, u.offsetParent = l.offsetParent || p, u.lastUpdate = e.ticker.frame, u
				},
				fe = function(t, i) {
					if (i = i || {}, !t || t === p || !t.parentNode) return {
						x: 0,
						y: 0
					};
					var s = G(t),
						r = se && s ? s.getPropertyValue(se) : "50% 50%",
						n = r.split(" "),
						a = -1 !== r.indexOf("left") ? "0%" : -1 !== r.indexOf("right") ? "100%" : n[0],
						o = -1 !== r.indexOf("top") ? "0%" : -1 !== r.indexOf("bottom") ? "100%" : n[1];
					return ("center" === o || null == o) && (o = "50%"), ("center" === a || isNaN(parseFloat(a))) && (a = "50%"), t.getBBox && ue(t) ? (t._gsTransform || (e.set(t, {
						x: "+=0",
						overwrite: !1
					}), void 0 === t._gsTransform.xOrigin && console.log("Draggable requires at least GSAP 1.16.1")), r = t.getBBox(), n = ce(t), i.x = (t._gsTransform.xOrigin - r.x) * n.scaleX, i.y = (t._gsTransform.yOrigin - r.y) * n.scaleY) : (i.x = -1 !== a.indexOf("%") ? t.offsetWidth * parseFloat(a) / 100 : parseFloat(a), i.y = -1 !== o.indexOf("%") ? t.offsetHeight * parseFloat(o) / 100 : parseFloat(o)), i
				},
				pe = function(t, e, i) {
					var s, r, a, o, l, h;
					return t !== window && t && t.parentNode ? (s = G(t), r = s ? s.getPropertyValue(ne) : t.currentStyle ? t.currentStyle[re] : "1,0,0,1,0,0", r = (r + "").match(/(?:\-|\b)[\d\-\.e]+\b/g) || [1, 0, 0, 1, 0, 0], r.length > 6 && (r = [r[0], r[1], r[4], r[5], r[12], r[13]]), e && (a = t.parentNode, h = t.getBBox && ue(t) || void 0 === t.offsetLeft && "svg" === (t.nodeName + "").toLowerCase() ? ce(t) : t, o = h.offsetParent, l = a === p || a === f.body, void 0 === n && f.body && re && (n = function() {
						var t, e, i = f.createElement("div"),
							s = f.createElement("div");
						return s.style.position = "absolute", f.body.appendChild(i), i.appendChild(s), t = s.offsetParent, i.style[re] = "rotate(1deg)", e = s.offsetParent === t, f.body.removeChild(i), e
					}()), r[4] = Number(r[4]) + e.x + (h.offsetLeft || 0) - i.x - (l ? 0 : a.scrollLeft) + (o ? parseInt(K(o, "borderLeftWidth"), 10) || 0 : 0), r[5] = Number(r[5]) + e.y + (h.offsetTop || 0) - i.y - (l ? 0 : a.scrollTop) + (o ? parseInt(K(o, "borderTopWidth"), 10) || 0 : 0), !a || a.offsetParent !== o || n && "100100" !== pe(a).join("") || (r[4] -= a.offsetLeft || 0, r[5] -= a.offsetTop || 0), a && "fixed" === K(t, "position", !0) && (r[4] += z(), r[5] += I())), r) : [1, 0, 0, 1, 0, 0]
				},
				de = function(t, e) {
					if (!t || t === window || !t.parentNode) return [1, 0, 0, 1, 0, 0];
					for (var i, s, r, n, a, o, l, h, u = fe(t, ae), _ = fe(t.parentNode, oe), c = pe(t, u, _);
						(t = t.parentNode) && t.parentNode && t !== p;) u = _, _ = fe(t.parentNode, u === ae ? oe : ae), l = pe(t, u, _), i = c[0], s = c[1], r = c[2], n = c[3], a = c[4], o = c[5], c[0] = i * l[0] + s * l[2], c[1] = i * l[1] + s * l[3], c[2] = r * l[0] + n * l[2], c[3] = r * l[1] + n * l[3], c[4] = a * l[0] + o * l[2] + l[4], c[5] = a * l[1] + o * l[3] + l[5];
					return e && (i = c[0], s = c[1], r = c[2], n = c[3], a = c[4], o = c[5], h = i * n - s * r, c[0] = n / h, c[1] = -s / h, c[2] = -r / h, c[3] = i / h, c[4] = (r * o - n * a) / h, c[5] = -(i * o - s * a) / h), c
				},
				me = function(t, e, i) {
					var s = de(t),
						r = e.x,
						n = e.y;
					return i = i === !0 ? e : i || {}, i.x = r * s[0] + n * s[2] + s[4], i.y = r * s[1] + n * s[3] + s[5], i
				},
				ge = function(t, e, i) {
					var s = t.x * e[0] + t.y * e[2] + e[4],
						r = t.x * e[1] + t.y * e[3] + e[5];
					return t.x = s * i[0] + r * i[2] + i[4], t.y = s * i[1] + r * i[3] + i[5], t
				},
				ve = function(t, e) {
					var i, s, r, n, a, o, l, h, u, _, c;
					return t === window ? (n = I(), s = z(), r = s + (p.clientWidth || t.innerWidth || f.body.clientWidth || 0), a = n + ((t.innerHeight || 0) - 20 < p.clientHeight ? p.clientHeight : t.innerHeight || f.body.clientHeight || 0)) : (i = fe(t), s = -i.x, r = s + t.offsetWidth, n = -i.y, a = n + t.offsetHeight), t === e ? {
						left: s,
						top: n,
						width: r - s,
						height: a - n
					} : (o = de(t), l = de(e, !0), h = ge({
						x: s,
						y: n
					}, o, l), u = ge({
						x: r,
						y: n
					}, o, l), _ = ge({
						x: r,
						y: a
					}, o, l), c = ge({
						x: s,
						y: a
					}, o, l), s = Math.min(h.x, u.x, _.x, c.x), n = Math.min(h.y, u.y, _.y, c.y), {
						left: s,
						top: n,
						width: Math.max(h.x, u.x, _.x, c.x) - s,
						height: Math.max(h.y, u.y, _.y, c.y) - n
					})
				},
				ye = function(t) {
					return t.length && t[0] && (t[0].nodeType && t[0].style && !t.nodeType || t[0].length && t[0][0]) ? !0 : !1
				},
				Te = function(t) {
					var e, i, s, r = [],
						n = t.length;
					for (e = 0; n > e; e++)
						if (i = t[e], ye(i))
							for (s = i.length, s = 0; i.length > s; s++) r.push(i[s]);
						else r.push(i);
					return r
				},
				we = "ontouchstart" in p && "orientation" in window,
				xe = function(t) {
					for (var e = t.split(","), i = (void 0 !== ee.onpointerdown ? "pointerdown,pointermove,pointerup,pointercancel" : void 0 !== ee.onmspointerdown ? "MSPointerDown,MSPointerMove,MSPointerUp,MSPointerCancel" : t).split(","), s = {}, r = 8; --r > -1;) s[e[r]] = i[r], s[i[r]] = e[r];
					return s
				}("touchstart,touchmove,touchend,touchcancel"),
				be = function(t, e, i, s) {
					t.addEventListener ? t.addEventListener(xe[e] || e, i, s) : t.attachEvent && t.attachEvent("on" + e, i)
				},
				Pe = function(t, e, i) {
					t.removeEventListener ? t.removeEventListener(xe[e] || e, i) : t.detachEvent && t.detachEvent("on" + e, i)
				},
				Se = function(t) {
					s = t.touches && t.touches.length > C, Pe(t.target, "touchend", Se)
				},
				Ce = function(t) {
					s = t.touches && t.touches.length > C, be(t.target, "touchend", Se)
				},
				ke = function(t, e, i, s, r, n) {
					var a, o, l, h = {};
					if (e)
						if (1 !== r && e instanceof Array) {
							for (h.end = a = [], l = e.length, o = 0; l > o; o++) a[o] = e[o] * r;
							i += 1.1, s -= 1.1
						} else h.end = "function" == typeof e ? function(i) {
							return e.call(t, i) * r
						} : e;
					return (i || 0 === i) && (h.max = i), (s || 0 === s) && (h.min = s), n && (h.velocity = 0), h
				},
				Re = function(t) {
					var e;
					return t && t.getAttribute && "BODY" !== t.nodeName ? "true" === (e = t.getAttribute("data-clickable")) || "false" !== e && (t.onclick || S.test(t.nodeName + "") || "true" === t.getAttribute("contentEditable")) ? !0 : Re(t.parentNode) : !1
				},
				Ae = function(t, e) {
					for (var i, s = t.length; --s > -1;) i = t[s], i.ondragstart = i.onselectstart = e ? null : m, V(i, "userSelect", e ? "text" : "none")
				},
				Oe = function() {
					var t, e = f.createElement("div"),
						i = f.createElement("div"),
						s = i.style,
						r = f.body || ee;
					return s.display = "inline-block", s.position = "relative", e.style.cssText = i.innerHTML = "width:90px; height:40px; padding:10px; overflow:auto; visibility: hidden", e.appendChild(i), r.appendChild(e), a = i.offsetHeight + 18 > e.scrollHeight, s.width = "100%", re || (s.paddingRight = "500px", t = e.scrollLeft = e.scrollWidth - e.clientWidth, s.left = "-90px", t = t !== e.scrollLeft), r.removeChild(e), t
				}(),
				De = function(t, i) {
					t = W(t), i = i || {};
					var s, r, n, o, l, h, u = f.createElement("div"),
						_ = u.style,
						c = t.firstChild,
						p = 0,
						d = 0,
						m = t.scrollTop,
						g = t.scrollLeft,
						v = t.scrollWidth,
						y = t.scrollHeight,
						w = 0,
						x = 0,
						b = 0;
					ie && i.force3D !== !1 ? (l = "translate3d(", h = "px,0px)") : re && (l = "translate(", h = "px)"), this.scrollTop = function(t, e) {
						return arguments.length ? (this.top(-t, e), void 0) : -this.top()
					}, this.scrollLeft = function(t, e) {
						return arguments.length ? (this.left(-t, e), void 0) : -this.left()
					}, this.left = function(s, r) {
						if (!arguments.length) return -(t.scrollLeft + d);
						var n = t.scrollLeft - g,
							a = d;
						return (n > 2 || -2 > n) && !r ? (g = t.scrollLeft, e.killTweensOf(this, !0, {
							left: 1,
							scrollLeft: 1
						}), this.left(-g), i.onKill && i.onKill(), void 0) : (s = -s, 0 > s ? (d = 0 | s - .5, s = 0) : s > x ? (d = 0 | s - x, s = x) : d = 0, (d || a) && (l ? this._suspendTransforms || (_[re] = l + -d + "px," + -p + h) : _.left = -d + "px", Oe && d + w >= 0 && (_.paddingRight = d + w + "px")), t.scrollLeft = 0 | s, g = t.scrollLeft, void 0)
					}, this.top = function(s, r) {
						if (!arguments.length) return -(t.scrollTop + p);
						var n = t.scrollTop - m,
							a = p;
						return (n > 2 || -2 > n) && !r ? (m = t.scrollTop, e.killTweensOf(this, !0, {
							top: 1,
							scrollTop: 1
						}), this.top(-m), i.onKill && i.onKill(), void 0) : (s = -s, 0 > s ? (p = 0 | s - .5, s = 0) : s > b ? (p = 0 | s - b, s = b) : p = 0, (p || a) && (l ? this._suspendTransforms || (_[re] = l + -d + "px," + -p + h) : _.top = -p + "px"), t.scrollTop = 0 | s, m = t.scrollTop, void 0)
					}, this.maxScrollTop = function() {
						return b
					}, this.maxScrollLeft = function() {
						return x
					}, this.disable = function() {
						for (c = u.firstChild; c;) o = c.nextSibling, t.appendChild(c), c = o;
						t === u.parentNode && t.removeChild(u)
					}, this.enable = function() {
						if (c = t.firstChild, c !== u) {
							for (; c;) o = c.nextSibling, u.appendChild(c), c = o;
							t.appendChild(u), this.calibrate()
						}
					}, this.calibrate = function(e) {
						var i, o, l = t.clientWidth === s;
						m = t.scrollTop, g = t.scrollLeft, (!l || t.clientHeight !== r || u.offsetHeight !== n || v !== t.scrollWidth || y !== t.scrollHeight || e) && ((p || d) && (i = this.left(), o = this.top(), this.left(-t.scrollLeft), this.top(-t.scrollTop)), (!l || e) && (_.display = "block", _.width = "auto", _.paddingRight = "0px", w = Math.max(0, t.scrollWidth - t.clientWidth), w && (w += K(t, "paddingLeft") + (a ? K(t, "paddingRight") : 0))), _.display = "inline-block", _.position = "relative", _.overflow = "visible", _.verticalAlign = "top", _.width = "100%", _.paddingRight = w + "px", a && (_.paddingBottom = K(t, "paddingBottom", !0)), T && (_.zoom = "1"), s = t.clientWidth, r = t.clientHeight, v = t.scrollWidth, y = t.scrollHeight, x = t.scrollWidth - s, b = t.scrollHeight - r, n = u.offsetHeight, _.display = "block", (i || o) && (this.left(i), this.top(o)))
					}, this.content = u, this.element = t, this._suspendTransforms = !1, this.enable()
				},
				Me = function(i, n) {
					t.call(this, i), i = W(i), r || (r = _.com.greensock.plugins.ThrowPropsPlugin), this.vars = n = n || {}, this.target = i, this.x = this.y = this.rotation = 0, this.dragResistance = parseFloat(n.dragResistance) || 0, this.edgeResistance = isNaN(n.edgeResistance) ? 1 : parseFloat(n.edgeResistance) || 0, this.lockAxis = n.lockAxis, this.autoScroll = n.autoScroll || 0, this.lockedAxis = null, this.allowEventDefault = !!n.allowEventDefault;
					var a, c, m, x, S, D, N, I, z, Y, q, G, H, Q, Z, $, ee, ie, se, re, ne, ae, oe, le, he, ue, _e, ce, fe, pe, ge, ve = (n.type || (T ? "top,left" : "x,y")).toLowerCase(),
						ye = -1 !== ve.indexOf("x") || -1 !== ve.indexOf("y"),
						Te = -1 !== ve.indexOf("rotation"),
						Se = Te ? "rotation" : ye ? "x" : "left",
						Oe = ye ? "y" : "top",
						Le = -1 !== ve.indexOf("x") || -1 !== ve.indexOf("left") || "scroll" === ve,
						Ee = -1 !== ve.indexOf("y") || -1 !== ve.indexOf("top") || "scroll" === ve,
						Ie = n.minimumMovement || 2,
						ze = this,
						Xe = O(n.trigger || n.handle || i),
						Fe = {},
						Be = 0,
						Ye = !1,
						Ue = n.clickableTest || Re,
						je = function(t) {
							if (ze.autoScroll && ze.isDragging && (ie || Ye)) {
								var e, s, r, n, a, o, l, h, u = i,
									_ = 15 * ze.autoScroll;
								for (Ye = !1, A.scrollTop = null != window.pageYOffset ? window.pageYOffset : null != p.scrollTop ? p.scrollTop : f.body.scrollTop, A.scrollLeft = null != window.pageXOffset ? window.pageXOffset : null != p.scrollLeft ? p.scrollLeft : f.body.scrollLeft, n = ze.pointerX - A.scrollLeft, a = ze.pointerY - A.scrollTop; u && !s;) s = B(u.parentNode), e = s ? A : u.parentNode, r = s ? {
									bottom: Math.max(p.clientHeight, window.innerHeight || 0),
									right: Math.max(p.clientWidth, window.innerWidth || 0),
									left: 0,
									top: 0
								} : e.getBoundingClientRect(), o = l = 0, Ee && (a > r.bottom - 40 && (h = e._gsMaxScrollY - e.scrollTop) ? (Ye = !0, l = Math.min(h, 0 | _ * (1 - Math.max(0, r.bottom - a) / 40))) : r.top + 40 > a && e.scrollTop && (Ye = !0, l = -Math.min(e.scrollTop, 0 | _ * (1 - Math.max(0, a - r.top) / 40))), l && (e.scrollTop += l)), Le && (n > r.right - 40 && (h = e._gsMaxScrollX - e.scrollLeft) ? (Ye = !0, o = Math.min(h, 0 | _ * (1 - Math.max(0, r.right - n) / 40))) : r.left + 40 > n && e.scrollLeft && (Ye = !0, o = -Math.min(e.scrollLeft, 0 | _ * (1 - Math.max(0, n - r.left) / 40))), o && (e.scrollLeft += o)), s && (o || l) && (window.scrollTo(e.scrollLeft, e.scrollTop), Je(ze.pointerX + o, ze.pointerY + l)), u = e
							}
							if (ie) {
								var d = ze.x,
									m = ze.y,
									g = 1e-6;
								g > d && d > -g && (d = 0), g > m && m > -g && (m = 0), Te ? (fe.data.rotation = ze.rotation = d, fe.setRatio(1)) : c ? (Ee && c.top(m), Le && c.left(d)) : ye ? (Ee && (fe.data.y = m), Le && (fe.data.x = d), fe.setRatio(1)) : (Ee && (i.style.top = m + "px"), Le && (i.style.left = d + "px")), I && !t && J(ze, "drag", "onDrag")
							}
							ie = !1
						},
						We = function(t, s) {
							var r;
							i._gsTransform || !ye && !Te || e.set(i, {
								x: "+=0",
								overwrite: !1
							}), ye ? (ze.y = i._gsTransform.y, ze.x = i._gsTransform.x) : Te ? ze.x = ze.rotation = i._gsTransform.rotation : c ? (ze.y = c.top(), ze.x = c.left()) : (ze.y = parseInt(i.style.top, 10) || 0, ze.x = parseInt(i.style.left, 10) || 0), !re && !ne || s || (re && (r = re(ze.x), r !== ze.x && (ze.x = r, Te && (ze.rotation = r), ie = !0)), ne && (r = ne(ze.y), r !== ze.y && (ze.y = r, ie = !0)), ie && je(!0)), n.onThrowUpdate && !t && n.onThrowUpdate.apply(n.onThrowUpdateScope || ze, n.onThrowUpdateParams || d)
						},
						qe = function() {
							var t, e, s, r;
							N = !1, c ? (c.calibrate(), ze.minX = Y = -c.maxScrollLeft(), ze.minY = G = -c.maxScrollTop(), ze.maxX = z = ze.maxY = q = 0, N = !0) : n.bounds && (t = te(n.bounds, i.parentNode), Te ? (ze.minX = Y = t.left, ze.maxX = z = t.left + t.width, ze.minY = G = ze.maxY = q = 0) : void 0 !== n.bounds.maxX || void 0 !== n.bounds.maxY ? (t = n.bounds, ze.minX = Y = t.minX, ze.minY = G = t.minY, ze.maxX = z = t.maxX, ze.maxY = q = t.maxY) : (e = te(i, i.parentNode), ze.minX = Y = K(i, Se) + t.left - e.left, ze.minY = G = K(i, Oe) + t.top - e.top, ze.maxX = z = Y + (t.width - e.width), ze.maxY = q = G + (t.height - e.height)), Y > z && (ze.minX = z, ze.maxX = z = Y, Y = ze.minX), G > q && (ze.minY = q, ze.maxY = q = G, G = ze.minY), Te && (ze.minRotation = Y, ze.maxRotation = z), N = !0), n.liveSnap && (s = n.liveSnap === !0 ? n.snap || {} : n.liveSnap, r = s instanceof Array || "function" == typeof s, Te ? (re = Ze(r ? s : s.rotation, Y, z, 1), ne = null) : (Le && (re = Ze(r ? s : s.x || s.left || s.scrollLeft, Y, z, c ? -1 : 1)), Ee && (ne = Ze(r ? s : s.y || s.top || s.scrollTop, G, q, c ? -1 : 1))))
						},
						Ve = function(t, e) {
							var s, a, o;
							t && r ? (t === !0 && (s = n.snap || {}, a = s instanceof Array || "function" == typeof s, t = {
								resistance: (n.throwResistance || n.resistance || 1e3) / (Te ? 10 : 1)
							}, Te ? t.rotation = ke(ze, a ? s : s.rotation, z, Y, 1, e) : (Le && (t[Se] = ke(ze, a ? s : s.x || s.left || s.scrollLeft, z, Y, c ? -1 : 1, e || "x" === ze.lockedAxis)), Ee && (t[Oe] = ke(ze, a ? s : s.y || s.top || s.scrollTop, q, G, c ? -1 : 1, e || "y" === ze.lockedAxis)))), ze.tween = o = r.to(c || i, {
								throwProps: t,
								ease: n.ease || _.Power3.easeOut,
								onComplete: n.onThrowComplete,
								onCompleteParams: n.onThrowCompleteParams,
								onCompleteScope: n.onThrowCompleteScope || ze,
								onUpdate: n.fastMode ? n.onThrowUpdate : We,
								onUpdateParams: n.fastMode ? n.onThrowUpdateParams : null,
								onUpdateScope: n.onThrowUpdateScope || ze
							}, isNaN(n.maxDuration) ? 2 : n.maxDuration, isNaN(n.minDuration) ? .5 : n.minDuration, isNaN(n.overshootTolerance) ? 1 - ze.edgeResistance + .2 : n.overshootTolerance), n.fastMode || (c && (c._suspendTransforms = !0), o.render(o.duration(), !0, !0), We(!0, !0), ze.endX = ze.x, ze.endY = ze.y, Te && (ze.endRotation = ze.x), o.play(0), We(!0, !0), c && (c._suspendTransforms = !1))) : N && ze.applyBounds()
						},
						Ge = function() {
							le = de(i.parentNode, !0), le[1] || le[2] || 1 != le[0] || 1 != le[3] || 0 != le[4] || 0 != le[5] || (le = null)
						},
						He = function() {
							var t = 1 - ze.edgeResistance;
							Ge(), c ? (qe(), D = c.top(), S = c.left()) : (Qe() ? (We(!0, !0), qe()) : ze.applyBounds(), Te ? (ee = me(i, {
								x: 0,
								y: 0
							}), We(!0, !0), S = ze.x, D = ze.y = Math.atan2(ee.y - x, m - ee.x) * g) : (_e = i.parentNode ? i.parentNode.scrollTop || 0 : 0, ce = i.parentNode ? i.parentNode.scrollLeft || 0 : 0, D = K(i, Oe), S = K(i, Se))), N && t && (S > z ? S = z + (S - z) / t : Y > S && (S = Y - (Y - S) / t), Te || (D > q ? D = q + (D - q) / t : G > D && (D = G - (G - D) / t)))
						},
						Qe = function() {
							return ze.tween && ze.tween.isActive()
						},
						Ze = function(t, e, i, s) {
							return "function" == typeof t ? function(r) {
								var n = ze.isPressed ? 1 - ze.edgeResistance : 1;
								return t.call(ze, r > i ? i + (r - i) * n : e > r ? e + (r - e) * n : r) * s
							} : t instanceof Array ? function(s) {
								for (var r, n, a = t.length, o = 0, l = v; --a > -1;) r = t[a], n = r - s, 0 > n && (n = -n), l > n && r >= e && i >= r && (o = a, l = n);
								return t[o]
							} : isNaN(t) ? function(t) {
								return t
							} : function() {
								return t * s
							}
						},
						$e = function(t) {
							var s, r;
							if (a && !ze.isPressed && t && !("mousedown" === t.type && 30 > y() - ue && xe[ze.pointerEvent.type])) {
								if (he = Qe(), ze.pointerEvent = t, xe[t.type] ? (oe = -1 !== t.type.indexOf("touch") ? t.currentTarget : f, be(oe, "touchend", ti), be(oe, "touchmove", Ke), be(oe, "touchcancel", ti), be(f, "touchstart", Ce)) : (oe = null, be(f, "mousemove", Ke)), ge = null, be(f, "mouseup", ti), t && t.target && be(t.target, "mouseup", ti), ae = Ue.call(ze, t.target) && !n.dragClickables) return be(t.target, "change", ti), J(ze, "press", "onPress"), Ae(Xe, !0), void 0;
								if (pe = !oe || Le === Ee || c || ze.vars.allowNativeTouchScrolling === !1 ? !1 : Le ? "y" : "x", T ? t = j(t, !0) : pe || ze.allowEventDefault || (t.preventDefault(), t.preventManipulation && t.preventManipulation()), t.changedTouches ? (t = Z = t.changedTouches[0], $ = t.identifier) : t.pointerId ? $ = t.pointerId : Z = null, C++, M(je), x = ze.pointerY = t.pageY, m = ze.pointerX = t.pageX, (pe || ze.autoScroll) && U(i.parentNode), !ze.autoScroll || Te || c || !i.parentNode || i.getBBox || !i.parentNode._gsMaxScrollX || w.parentNode || (w.style.width = i.parentNode.scrollWidth + "px", i.parentNode.appendChild(w)), He(), le && (s = m * le[0] + x * le[2] + le[4], x = m * le[1] + x * le[3] + le[5], m = s), ze.tween && ze.tween.kill(), e.killTweensOf(c || i, !0, Fe), c && e.killTweensOf(i, !0, {
										scrollTo: 1
									}), ze.tween = ze.lockedAxis = null, (n.zIndexBoost || !Te && !c && n.zIndexBoost !== !1) && (i.style.zIndex = Me.zIndex++), ze.isPressed = !0, I = !(!n.onDrag && !ze._listeners.drag), !Te)
									for (r = Xe.length; --r > -1;) V(Xe[r], "cursor", n.cursor || "move");
								J(ze, "press", "onPress")
							}
						},
						Ke = function(t) {
							var e, i, r, n, o = t;
							if (a && !s && ze.isPressed && t) {
								if (ze.pointerEvent = t, e = t.changedTouches) {
									if (t = e[0], t !== Z && t.identifier !== $) {
										for (n = e.length; --n > -1 && (t = e[n]).identifier !== $;);
										if (0 > n) return
									}
								} else if (t.pointerId && $ && t.pointerId !== $) return;
								if (T) t = j(t, !0);
								else {
									if (oe && pe && !ge && (i = t.pageX, r = t.pageY, le && (n = i * le[0] + r * le[2] + le[4], r = i * le[1] + r * le[3] + le[5], i = n), ge = Math.abs(i - m) > Math.abs(r - x) && Le ? "x" : "y", ze.vars.lockAxisOnTouchScroll !== !1 && (ze.lockedAxis = "x" === ge ? "y" : "x", "function" == typeof ze.vars.onLockAxis && ze.vars.onLockAxis.call(ze, o)), k && pe === ge)) return ti(o), void 0;
									ze.allowEventDefault || pe && (!ge || pe === ge) || o.cancelable === !1 || (o.preventDefault(), o.preventManipulation && o.preventManipulation())
								}
								ze.autoScroll && (Ye = !0), Je(t.pageX, t.pageY)
							}
						},
						Je = function(t, e) {
							var i, s, r, n, a, o, l = 1 - ze.dragResistance,
								h = 1 - ze.edgeResistance;
							ze.pointerX = t, ze.pointerY = e, Te ? (n = Math.atan2(ee.y - e, t - ee.x) * g, a = ze.y - n, ze.y = n, a > 180 ? D -= 360 : -180 > a && (D += 360), r = S + (D - n) * l) : (le && (o = t * le[0] + e * le[2] + le[4], e = t * le[1] + e * le[3] + le[5], t = o), s = e - x, i = t - m, Ie > s && s > -Ie && (s = 0), Ie > i && i > -Ie && (i = 0), (ze.lockAxis || ze.lockedAxis) && (i || s) && (o = ze.lockedAxis, o || (ze.lockedAxis = o = Le && Math.abs(i) > Math.abs(s) ? "y" : Ee ? "x" : null, o && "function" == typeof ze.vars.onLockAxis && ze.vars.onLockAxis.call(ze, ze.pointerEvent)), "y" === o ? s = 0 : "x" === o && (i = 0)), r = S + i * l, n = D + s * l), re || ne ? (re && (r = re(r)), ne && (n = ne(n))) : N && (r > z ? r = z + (r - z) * h : Y > r && (r = Y + (r - Y) * h), Te || (n > q ? n = q + (n - q) * h : G > n && (n = G + (n - G) * h))), Te || (r = Math.round(r), n = Math.round(n)), (ze.x !== r || ze.y !== n && !Te) && (ze.x = ze.endX = r, Te ? ze.endRotation = r : ze.y = ze.endY = n, ie = !0, ze.isDragging || (ze.isDragging = !0, J(ze, "dragstart", "onDragStart")))
						},
						ti = function(t, e) {
							if (a && ze.isPressed && (!t || !$ || e || !t.pointerId || t.pointerId === $)) {
								ze.isPressed = !1;
								var s, r, o, l, h = t,
									u = ze.isDragging;
								if (oe ? (Pe(oe, "touchend", ti), Pe(oe, "touchmove", Ke), Pe(oe, "touchcancel", ti), Pe(f, "touchstart", Ce)) : Pe(f, "mousemove", Ke), Pe(f, "mouseup", ti), t && t.target && Pe(t.target, "mouseup", ti), ie = !1, w.parentNode && w.parentNode.removeChild(w), ae) return t && Pe(t.target, "change", ti), Ae(Xe, !1), J(ze, "release", "onRelease"), J(ze, "click", "onClick"), ae = !1, void 0;
								if (L(je), !Te)
									for (r = Xe.length; --r > -1;) V(Xe[r], "cursor", n.cursor || "move");
								if (u && (Be = R = y(), ze.isDragging = !1), C--, t) {
									if (T && (t = j(t, !1)), s = t.changedTouches, s && (t = s[0], t !== Z && t.identifier !== $)) {
										for (r = s.length; --r > -1 && (t = s[r]).identifier !== $;);
										if (0 > r) return
									}
									ze.pointerEvent = h, ze.pointerX = t.pageX, ze.pointerY = t.pageY
								}
								return h && !u ? (he && (n.snap || n.bounds) && Ve(n.throwProps), J(ze, "release", "onRelease"), k && "touchmove" === h.type || (J(ze, "click", "onClick"), l = h.target || h.srcElement || i, l.click ? l.click() : f.createEvent && (o = f.createEvent("MouseEvents"), o.initEvent("click", !0, !0), l.dispatchEvent(o)), ue = y())) : (Ve(n.throwProps), T || ze.allowEventDefault || !h || !n.dragClickables && Ue.call(ze, h.target) || !u || pe && (!ge || pe !== ge) || h.cancelable === !1 || (h.preventDefault(), h.preventManipulation && h.preventManipulation()), J(ze, "release", "onRelease")), u && J(ze, "dragend", "onDragEnd"), !0
							}
						},
						ei = function(t) {
							if (t && ze.isDragging) {
								var e = t.target || t.srcElement || i.parentNode,
									s = e.scrollLeft - e._gsScrollX,
									r = e.scrollTop - e._gsScrollY;
								(s || r) && (m -= s, x -= r, e._gsScrollX += s, e._gsScrollY += r, Je(ze.pointerX, ze.pointerY))
							}
						},
						ii = function(t) {
							var e = y(),
								i = 40 > e - ue,
								s = 40 > e - Be;
							(ze.isPressed || s || i) && (t.preventDefault ? (t.preventDefault(), (i || s && ze.vars.suppressClickOnDrag !== !1) && t.stopImmediatePropagation()) : t.returnValue = !1, t.preventManipulation && t.preventManipulation())
						};
					se = Me.get(this.target), se && se.kill(), this.startDrag = function(t) {
						$e(t), ze.isDragging || (ze.isDragging = !0, J(ze, "dragstart", "onDragStart"))
					}, this.drag = Ke, this.endDrag = function(t) {
						ti(t, !0)
					}, this.timeSinceDrag = function() {
						return ze.isDragging ? 0 : (y() - Be) / 1e3
					}, this.hitTest = function(t, e) {
						return Me.hitTest(ze.target, t, e)
					}, this.getDirection = function(t, e) {
						var i, s, n, a, o, l, h = "velocity" === t && r ? t : "object" != typeof t || Te ? "start" : "element";
						return "element" === h && (o = Ne(ze.target), l = Ne(t)), i = "start" === h ? ze.x - S : "velocity" === h ? r.getVelocity(this.target, Se) : o.left + o.width / 2 - (l.left + l.width / 2), Te ? 0 > i ? "counter-clockwise" : "clockwise" : (e = e || 2, s = "start" === h ? ze.y - D : "velocity" === h ? r.getVelocity(this.target, Oe) : o.top + o.height / 2 - (l.top + l.height / 2), n = Math.abs(i / s), a = 1 / e > n ? "" : 0 > i ? "left" : "right", e > n && ("" !== a && (a += "-"), a += 0 > s ? "up" : "down"), a)
					}, this.applyBounds = function(t) {
						var e, i;
						return t && n.bounds !== t ? (n.bounds = t, ze.update(!0)) : (We(!0), qe(), N && (e = ze.x, i = ze.y, N && (e > z ? e = z : Y > e && (e = Y), i > q ? i = q : G > i && (i = G)), (ze.x !== e || ze.y !== i) && (ze.x = ze.endX = e, Te ? ze.endRotation = e : ze.y = ze.endY = i, ie = !0, je())), ze)
					}, this.update = function(t) {
						var e = ze.x,
							i = ze.y;
						return Ge(), t ? ze.applyBounds() : (ie && je(), We(!0)), ze.isPressed && (Le && Math.abs(e - ze.x) > .01 || Ee && Math.abs(i - ze.y) > .01 && !Te) && He(), ze
					}, this.enable = function(t) {
						var s, o, l;
						if ("soft" !== t) {
							for (o = Xe.length; --o > -1;) l = Xe[o], be(l, "mousedown", $e), be(l, "touchstart", $e), be(l, "click", ii, !0), Te || V(l, "cursor", n.cursor || "move"), V(l, "touchCallout", "none"), V(l, "touchAction", Le === Ee || c ? "none" : Le ? "pan-y" : "pan-x");
							Ae(Xe, !1)
						}
						return X(ze.target, ei), a = !0, r && "soft" !== t && r.track(c || i, ye ? "x,y" : Te ? "rotation" : "top,left"), c && c.enable(), i._gsDragID = s = "d" + P++, b[s] = this, c && (c.element._gsDragID = s), e.set(i, {
							x: "+=0",
							overwrite: !1
						}), fe = {
							t: i,
							data: T ? Q : i._gsTransform,
							tween: {},
							setRatio: T ? function() {
								e.set(i, H)
							} : CSSPlugin._internals.setTransformRatio || CSSPlugin._internals.set3DTransformRatio
						}, this.update(!0), ze
					}, this.disable = function(t) {
						var e, s, n = this.isDragging;
						if (!Te)
							for (e = Xe.length; --e > -1;) V(Xe[e], "cursor", null);
						if ("soft" !== t) {
							for (e = Xe.length; --e > -1;) s = Xe[e], V(s, "touchCallout", null), V(s, "touchAction", null), Pe(s, "mousedown", $e), Pe(s, "touchstart", $e), Pe(s, "click", ii);
							Ae(Xe, !0), oe && (Pe(oe, "touchcancel", ti), Pe(oe, "touchend", ti), Pe(oe, "touchmove", Ke)), Pe(f, "mouseup", ti), Pe(f, "mousemove", Ke)
						}
						return F(i, ei), a = !1, r && "soft" !== t && r.untrack(c || i, ye ? "x,y" : Te ? "rotation" : "top,left"), c && c.disable(), L(je), this.isDragging = this.isPressed = ae = !1, n && J(this, "dragend", "onDragEnd"), ze
					}, this.enabled = function(t, e) {
						return arguments.length ? t ? this.enable(e) : this.disable(e) : a
					}, this.kill = function() {
						return e.killTweensOf(c || i, !0, Fe), ze.disable(), delete b[i._gsDragID], ze
					}, -1 !== ve.indexOf("scroll") && (c = this.scrollProxy = new De(i, E({
						onKill: function() {
							ze.isPressed && ti(null)
						}
					}, n)), i.style.overflowY = Ee && !we ? "auto" : "hidden", i.style.overflowX = Le && !we ? "auto" : "hidden", i = c.content), n.force3D !== !1 && e.set(i, {
						force3D: !0
					}), Te ? Fe.rotation = 1 : (Le && (Fe[Se] = 1), Ee && (Fe[Oe] = 1)), Te ? (H = u, Q = H.css, H.overwrite = !1) : ye && (H = Le && Ee ? o : Le ? l : h, Q = H.css, H.overwrite = !1), this.enable()
				},
				Le = Me.prototype = new t;
			Le.constructor = Me, Le.pointerX = Le.pointerY = 0, Le.isDragging = Le.isPressed = !1, Me.version = "0.13.0", Me.zIndex = 1e3, be(f, "touchcancel", function() {}), be(f, "contextmenu", function() {
				var t;
				for (t in b) b[t].isPressed && b[t].endDrag()
			}), Me.create = function(t, i) {
				"string" == typeof t && (t = e.selector(t));
				for (var s = ye(t) ? Te(t) : [t], r = s.length; --r > -1;) s[r] = new Me(s[r], i);
				return s
			}, Me.get = function(t) {
				return b[(W(t) || {})._gsDragID]
			}, Me.timeSinceDrag = function() {
				return (y() - R) / 1e3
			};
			var Ne = function(t, e) {
				var i = t.pageX !== e ? {
					left: t.pageX,
					top: t.pageY,
					right: t.pageX + 1,
					bottom: t.pageY + 1
				} : t.nodeType || t.left === e || t.top === e ? W(t).getBoundingClientRect() : t;
				return i.right === e && i.width !== e ? (i.right = i.left + i.width, i.bottom = i.top + i.height) : i.width === e && (i = {
					width: i.right - i.left,
					height: i.bottom - i.top,
					right: i.right,
					left: i.left,
					bottom: i.bottom,
					top: i.top
				}), i
			};
			return Me.hitTest = function(t, e, i) {
				if (t === e) return !1;
				var s, r, n, a = Ne(t),
					o = Ne(e),
					l = o.left > a.right || o.right < a.left || o.top > a.bottom || o.bottom < a.top;
				return l || !i ? !l : (n = -1 !== (i + "").indexOf("%"), i = parseFloat(i) || 0, s = {
					left: Math.max(a.left, o.left),
					top: Math.max(a.top, o.top)
				}, s.width = Math.min(a.right, o.right) - s.left, s.height = Math.min(a.bottom, o.bottom) - s.top, 0 > s.width || 0 > s.height ? !1 : n ? (i *= .01, r = s.width * s.height, r >= a.width * a.height * i || r >= o.width * o.height * i) : s.width > i && s.height > i)
			}, w.style.cssText = "visibility:hidden;height:1px;top:-1px;pointer-events:none;position:relative;clear:both;", Me
		}, !0)
	}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
	function(t) {
		"use strict";
		var e = function() {
			return (_gsScope.GreenSockGlobals || _gsScope)[t]
		};
		"function" == typeof define && define.amd ? define(["TweenLite"], e) : "undefined" != typeof module && module.exports && (require("../TweenLite.js"), require("../plugins/CSSPlugin.js"), module.exports = e())
	}("Draggable");
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
	def: 'easeOutQuad',
	swing: function(x, t, b, c, d) {
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function(x, t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	easeOutQuad: function(x, t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	easeInOutQuad: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},
	easeInCubic: function(x, t, b, c, d) {
		return c * (t /= d) * t * t + b;
	},
	easeOutCubic: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	},
	easeInOutCubic: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t + 2) + b;
	},
	easeInQuart: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	},
	easeOutQuart: function(x, t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	easeInOutQuart: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	easeInQuint: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t * t + b;
	},
	easeOutQuint: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},
	easeInOutQuint: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	},
	easeInSine: function(x, t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},
	easeOutSine: function(x, t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	easeInOutSine: function(x, t, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	},
	easeInExpo: function(x, t, b, c, d) {
		return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	},
	easeOutExpo: function(x, t, b, c, d) {
		return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},
	easeInOutExpo: function(x, t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function(x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	},
	easeOutCirc: function(x, t, b, c, d) {
		return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	},
	easeInOutCirc: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	},
	easeInElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	easeOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},
	easeInOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d / 2) == 2) return b + c;
		if (!p) p = d * (.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},
	easeInBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	easeOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	easeInOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},
	easeInBounce: function(x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
	},
	easeOutBounce: function(x, t, b, c, d) {
		if ((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if (t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
		} else if (t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
		} else {
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
		}
	},
	easeInOutBounce: function(x, t, b, c, d) {
		if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	}
});
/*!
 * VERSION: 1.16.1
 * DATE: 2015-03-13
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
		"use strict";
		_gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(t, e) {
			var i, r, s, n, a = function() {
					t.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = a.prototype.setRatio
				},
				o = _gsScope._gsDefine.globals,
				l = {},
				h = a.prototype = new t("css");
			h.constructor = a, a.version = "1.16.1", a.API = 2, a.defaultTransformPerspective = 0, a.defaultSkewType = "compensated", h = "px", a.suffixMap = {
				top: h,
				right: h,
				bottom: h,
				left: h,
				width: h,
				height: h,
				fontSize: h,
				padding: h,
				margin: h,
				perspective: h,
				lineHeight: ""
			};
			var u, f, p, c, _, d, m = /(?:\d|\-\d|\.\d|\-\.\d)+/g,
				g = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
				v = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
				y = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
				x = /(?:\d|\-|\+|=|#|\.)*/g,
				T = /opacity *= *([^)]*)/i,
				w = /opacity:([^;]*)/i,
				b = /alpha\(opacity *=.+?\)/i,
				P = /^(rgb|hsl)/,
				S = /([A-Z])/g,
				C = /-([a-z])/gi,
				O = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
				k = function(t, e) {
					return e.toUpperCase()
				},
				R = /(?:Left|Right|Width)/i,
				A = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
				M = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
				D = /,(?=[^\)]*(?:\(|$))/gi,
				N = Math.PI / 180,
				L = 180 / Math.PI,
				X = {},
				z = document,
				E = function(t) {
					return z.createElementNS ? z.createElementNS("http://www.w3.org/1999/xhtml", t) : z.createElement(t)
				},
				F = E("div"),
				I = E("img"),
				Y = a._internals = {
					_specialProps: l
				},
				B = navigator.userAgent,
				U = function() {
					var t = B.indexOf("Android"),
						e = E("a");
					return p = -1 !== B.indexOf("Safari") && -1 === B.indexOf("Chrome") && (-1 === t || Number(B.substr(t + 8, 1)) > 3), _ = p && 6 > Number(B.substr(B.indexOf("Version/") + 8, 1)), c = -1 !== B.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(B) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(B)) && (d = parseFloat(RegExp.$1)), e ? (e.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(e.style.opacity)) : !1
				}(),
				j = function(t) {
					return T.test("string" == typeof t ? t : (t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
				},
				V = function(t) {
					window.console && console.log(t)
				},
				W = "",
				q = "",
				G = function(t, e) {
					e = e || F;
					var i, r, s = e.style;
					if (void 0 !== s[t]) return t;
					for (t = t.charAt(0).toUpperCase() + t.substr(1), i = ["O", "Moz", "ms", "Ms", "Webkit"], r = 5; --r > -1 && void 0 === s[i[r] + t];);
					return r >= 0 ? (q = 3 === r ? "ms" : i[r], W = "-" + q.toLowerCase() + "-", q + t) : null
				},
				H = z.defaultView ? z.defaultView.getComputedStyle : function() {},
				Q = a.getStyle = function(t, e, i, r, s) {
					var n;
					return U || "opacity" !== e ? (!r && t.style[e] ? n = t.style[e] : (i = i || H(t)) ? n = i[e] || i.getPropertyValue(e) || i.getPropertyValue(e.replace(S, "-$1").toLowerCase()) : t.currentStyle && (n = t.currentStyle[e]), null == s || n && "none" !== n && "auto" !== n && "auto auto" !== n ? n : s) : j(t)
				},
				Z = Y.convertToPixels = function(t, i, r, s, n) {
					if ("px" === s || !s) return r;
					if ("auto" === s || !r) return 0;
					var o, l, h, u = R.test(i),
						f = t,
						p = F.style,
						c = 0 > r;
					if (c && (r = -r), "%" === s && -1 !== i.indexOf("border")) o = r / 100 * (u ? t.clientWidth : t.clientHeight);
					else {
						if (p.cssText = "border:0 solid red;position:" + Q(t, "position") + ";line-height:0;", "%" !== s && f.appendChild) p[u ? "borderLeftWidth" : "borderTopWidth"] = r + s;
						else {
							if (f = t.parentNode || z.body, l = f._gsCache, h = e.ticker.frame, l && u && l.time === h) return l.width * r / 100;
							p[u ? "width" : "height"] = r + s
						}
						f.appendChild(F), o = parseFloat(F[u ? "offsetWidth" : "offsetHeight"]), f.removeChild(F), u && "%" === s && a.cacheWidths !== !1 && (l = f._gsCache = f._gsCache || {}, l.time = h, l.width = 100 * (o / r)), 0 !== o || n || (o = Z(t, i, r, s, !0))
					}
					return c ? -o : o
				},
				$ = Y.calculateOffset = function(t, e, i) {
					if ("absolute" !== Q(t, "position", i)) return 0;
					var r = "left" === e ? "Left" : "Top",
						s = Q(t, "margin" + r, i);
					return t["offset" + r] - (Z(t, e, parseFloat(s), s.replace(x, "")) || 0)
				},
				K = function(t, e) {
					var i, r, s, n = {};
					if (e = e || H(t, null))
						if (i = e.length)
							for (; --i > -1;) s = e[i], (-1 === s.indexOf("-transform") || be === s) && (n[s.replace(C, k)] = e.getPropertyValue(s));
						else
							for (i in e)(-1 === i.indexOf("Transform") || we === i) && (n[i] = e[i]);
					else if (e = t.currentStyle || t.style)
						for (i in e) "string" == typeof i && void 0 === n[i] && (n[i.replace(C, k)] = e[i]);
					return U || (n.opacity = j(t)), r = De(t, e, !1), n.rotation = r.rotation, n.skewX = r.skewX, n.scaleX = r.scaleX, n.scaleY = r.scaleY, n.x = r.x, n.y = r.y, Se && (n.z = r.z, n.rotationX = r.rotationX, n.rotationY = r.rotationY, n.scaleZ = r.scaleZ), n.filters && delete n.filters, n
				},
				J = function(t, e, i, r, s) {
					var n, a, o, l = {},
						h = t.style;
					for (a in i) "cssText" !== a && "length" !== a && isNaN(a) && (e[a] !== (n = i[a]) || s && s[a]) && -1 === a.indexOf("Origin") && ("number" == typeof n || "string" == typeof n) && (l[a] = "auto" !== n || "left" !== a && "top" !== a ? "" !== n && "auto" !== n && "none" !== n || "string" != typeof e[a] || "" === e[a].replace(y, "") ? n : 0 : $(t, a), void 0 !== h[a] && (o = new ce(h, a, h[a], o)));
					if (r)
						for (a in r) "className" !== a && (l[a] = r[a]);
					return {
						difs: l,
						firstMPT: o
					}
				},
				te = {
					width: ["Left", "Right"],
					height: ["Top", "Bottom"]
				},
				ee = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
				ie = function(t, e, i) {
					var r = parseFloat("width" === e ? t.offsetWidth : t.offsetHeight),
						s = te[e],
						n = s.length;
					for (i = i || H(t, null); --n > -1;) r -= parseFloat(Q(t, "padding" + s[n], i, !0)) || 0, r -= parseFloat(Q(t, "border" + s[n] + "Width", i, !0)) || 0;
					return r
				},
				re = function(t, e) {
					(null == t || "" === t || "auto" === t || "auto auto" === t) && (t = "0 0");
					var i = t.split(" "),
						r = -1 !== t.indexOf("left") ? "0%" : -1 !== t.indexOf("right") ? "100%" : i[0],
						s = -1 !== t.indexOf("top") ? "0%" : -1 !== t.indexOf("bottom") ? "100%" : i[1];
					return null == s ? s = "center" === r ? "50%" : "0" : "center" === s && (s = "50%"), ("center" === r || isNaN(parseFloat(r)) && -1 === (r + "").indexOf("=")) && (r = "50%"), t = r + " " + s + (i.length > 2 ? " " + i[2] : ""), e && (e.oxp = -1 !== r.indexOf("%"), e.oyp = -1 !== s.indexOf("%"), e.oxr = "=" === r.charAt(1), e.oyr = "=" === s.charAt(1), e.ox = parseFloat(r.replace(y, "")), e.oy = parseFloat(s.replace(y, "")), e.v = t), e || t
				},
				se = function(t, e) {
					return "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) : parseFloat(t) - parseFloat(e)
				},
				ne = function(t, e) {
					return null == t ? e : "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) + e : parseFloat(t)
				},
				ae = function(t, e, i, r) {
					var s, n, a, o, l, h = 1e-6;
					return null == t ? o = e : "number" == typeof t ? o = t : (s = 360, n = t.split("_"), l = "=" === t.charAt(1), a = (l ? parseInt(t.charAt(0) + "1", 10) * parseFloat(n[0].substr(2)) : parseFloat(n[0])) * (-1 === t.indexOf("rad") ? 1 : L) - (l ? 0 : e), n.length && (r && (r[i] = e + a), -1 !== t.indexOf("short") && (a %= s, a !== a % (s / 2) && (a = 0 > a ? a + s : a - s)), -1 !== t.indexOf("_cw") && 0 > a ? a = (a + 9999999999 * s) % s - (0 | a / s) * s : -1 !== t.indexOf("ccw") && a > 0 && (a = (a - 9999999999 * s) % s - (0 | a / s) * s)), o = e + a), h > o && o > -h && (o = 0), o
				},
				oe = {
					aqua: [0, 255, 255],
					lime: [0, 255, 0],
					silver: [192, 192, 192],
					black: [0, 0, 0],
					maroon: [128, 0, 0],
					teal: [0, 128, 128],
					blue: [0, 0, 255],
					navy: [0, 0, 128],
					white: [255, 255, 255],
					fuchsia: [255, 0, 255],
					olive: [128, 128, 0],
					yellow: [255, 255, 0],
					orange: [255, 165, 0],
					gray: [128, 128, 128],
					purple: [128, 0, 128],
					green: [0, 128, 0],
					red: [255, 0, 0],
					pink: [255, 192, 203],
					cyan: [0, 255, 255],
					transparent: [255, 255, 255, 0]
				},
				le = function(t, e, i) {
					return t = 0 > t ? t + 1 : t > 1 ? t - 1 : t, 0 | 255 * (1 > 6 * t ? e + 6 * (i - e) * t : .5 > t ? i : 2 > 3 * t ? e + 6 * (i - e) * (2 / 3 - t) : e) + .5
				},
				he = a.parseColor = function(t) {
					var e, i, r, s, n, a;
					return t && "" !== t ? "number" == typeof t ? [t >> 16, 255 & t >> 8, 255 & t] : ("," === t.charAt(t.length - 1) && (t = t.substr(0, t.length - 1)), oe[t] ? oe[t] : "#" === t.charAt(0) ? (4 === t.length && (e = t.charAt(1), i = t.charAt(2), r = t.charAt(3), t = "#" + e + e + i + i + r + r), t = parseInt(t.substr(1), 16), [t >> 16, 255 & t >> 8, 255 & t]) : "hsl" === t.substr(0, 3) ? (t = t.match(m), s = Number(t[0]) % 360 / 360, n = Number(t[1]) / 100, a = Number(t[2]) / 100, i = .5 >= a ? a * (n + 1) : a + n - a * n, e = 2 * a - i, t.length > 3 && (t[3] = Number(t[3])), t[0] = le(s + 1 / 3, e, i), t[1] = le(s, e, i), t[2] = le(s - 1 / 3, e, i), t) : (t = t.match(m) || oe.transparent, t[0] = Number(t[0]), t[1] = Number(t[1]), t[2] = Number(t[2]), t.length > 3 && (t[3] = Number(t[3])), t)) : oe.black
				},
				ue = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";
			for (h in oe) ue += "|" + h + "\\b";
			ue = RegExp(ue + ")", "gi");
			var fe = function(t, e, i, r) {
					if (null == t) return function(t) {
						return t
					};
					var s, n = e ? (t.match(ue) || [""])[0] : "",
						a = t.split(n).join("").match(v) || [],
						o = t.substr(0, t.indexOf(a[0])),
						l = ")" === t.charAt(t.length - 1) ? ")" : "",
						h = -1 !== t.indexOf(" ") ? " " : ",",
						u = a.length,
						f = u > 0 ? a[0].replace(m, "") : "";
					return u ? s = e ? function(t) {
						var e, p, c, _;
						if ("number" == typeof t) t += f;
						else if (r && D.test(t)) {
							for (_ = t.replace(D, "|").split("|"), c = 0; _.length > c; c++) _[c] = s(_[c]);
							return _.join(",")
						}
						if (e = (t.match(ue) || [n])[0], p = t.split(e).join("").match(v) || [], c = p.length, u > c--)
							for (; u > ++c;) p[c] = i ? p[0 | (c - 1) / 2] : a[c];
						return o + p.join(h) + h + e + l + (-1 !== t.indexOf("inset") ? " inset" : "")
					} : function(t) {
						var e, n, p;
						if ("number" == typeof t) t += f;
						else if (r && D.test(t)) {
							for (n = t.replace(D, "|").split("|"), p = 0; n.length > p; p++) n[p] = s(n[p]);
							return n.join(",")
						}
						if (e = t.match(v) || [], p = e.length, u > p--)
							for (; u > ++p;) e[p] = i ? e[0 | (p - 1) / 2] : a[p];
						return o + e.join(h) + l
					} : function(t) {
						return t
					}
				},
				pe = function(t) {
					return t = t.split(","),
						function(e, i, r, s, n, a, o) {
							var l, h = (i + "").split(" ");
							for (o = {}, l = 0; 4 > l; l++) o[t[l]] = h[l] = h[l] || h[(l - 1) / 2 >> 0];
							return s.parse(e, o, n, a)
						}
				},
				ce = (Y._setPluginRatio = function(t) {
					this.plugin.setRatio(t);
					for (var e, i, r, s, n = this.data, a = n.proxy, o = n.firstMPT, l = 1e-6; o;) e = a[o.v], o.r ? e = Math.round(e) : l > e && e > -l && (e = 0), o.t[o.p] = e, o = o._next;
					if (n.autoRotate && (n.autoRotate.rotation = a.rotation), 1 === t)
						for (o = n.firstMPT; o;) {
							if (i = o.t, i.type) {
								if (1 === i.type) {
									for (s = i.xs0 + i.s + i.xs1, r = 1; i.l > r; r++) s += i["xn" + r] + i["xs" + (r + 1)];
									i.e = s
								}
							} else i.e = i.s + i.xs0;
							o = o._next
						}
				}, function(t, e, i, r, s) {
					this.t = t, this.p = e, this.v = i, this.r = s, r && (r._prev = this, this._next = r)
				}),
				_e = (Y._parseToProxy = function(t, e, i, r, s, n) {
					var a, o, l, h, u, f = r,
						p = {},
						c = {},
						_ = i._transform,
						d = X;
					for (i._transform = null, X = e, r = u = i.parse(t, e, r, s), X = d, n && (i._transform = _, f && (f._prev = null, f._prev && (f._prev._next = null))); r && r !== f;) {
						if (1 >= r.type && (o = r.p, c[o] = r.s + r.c, p[o] = r.s, n || (h = new ce(r, "s", o, h, r.r), r.c = 0), 1 === r.type))
							for (a = r.l; --a > 0;) l = "xn" + a, o = r.p + "_" + l, c[o] = r.data[l], p[o] = r[l], n || (h = new ce(r, l, o, h, r.rxp[l]));
						r = r._next
					}
					return {
						proxy: p,
						end: c,
						firstMPT: h,
						pt: u
					}
				}, Y.CSSPropTween = function(t, e, r, s, a, o, l, h, u, f, p) {
					this.t = t, this.p = e, this.s = r, this.c = s, this.n = l || e, t instanceof _e || n.push(this.n), this.r = h, this.type = o || 0, u && (this.pr = u, i = !0), this.b = void 0 === f ? r : f, this.e = void 0 === p ? r + s : p, a && (this._next = a, a._prev = this)
				}),
				de = a.parseComplex = function(t, e, i, r, s, n, a, o, l, h) {
					i = i || n || "", a = new _e(t, e, 0, 0, a, h ? 2 : 1, null, !1, o, i, r), r += "";
					var f, p, c, _, d, v, y, x, T, w, b, S, C = i.split(", ").join(",").split(" "),
						O = r.split(", ").join(",").split(" "),
						k = C.length,
						R = u !== !1;
					for ((-1 !== r.indexOf(",") || -1 !== i.indexOf(",")) && (C = C.join(" ").replace(D, ", ").split(" "), O = O.join(" ").replace(D, ", ").split(" "), k = C.length), k !== O.length && (C = (n || "").split(" "), k = C.length), a.plugin = l, a.setRatio = h, f = 0; k > f; f++)
						if (_ = C[f], d = O[f], x = parseFloat(_), x || 0 === x) a.appendXtra("", x, se(d, x), d.replace(g, ""), R && -1 !== d.indexOf("px"), !0);
						else if (s && ("#" === _.charAt(0) || oe[_] || P.test(_))) S = "," === d.charAt(d.length - 1) ? ")," : ")", _ = he(_), d = he(d), T = _.length + d.length > 6, T && !U && 0 === d[3] ? (a["xs" + a.l] += a.l ? " transparent" : "transparent", a.e = a.e.split(O[f]).join("transparent")) : (U || (T = !1), a.appendXtra(T ? "rgba(" : "rgb(", _[0], d[0] - _[0], ",", !0, !0).appendXtra("", _[1], d[1] - _[1], ",", !0).appendXtra("", _[2], d[2] - _[2], T ? "," : S, !0), T && (_ = 4 > _.length ? 1 : _[3], a.appendXtra("", _, (4 > d.length ? 1 : d[3]) - _, S, !1)));
					else if (v = _.match(m)) {
						if (y = d.match(g), !y || y.length !== v.length) return a;
						for (c = 0, p = 0; v.length > p; p++) b = v[p], w = _.indexOf(b, c), a.appendXtra(_.substr(c, w - c), Number(b), se(y[p], b), "", R && "px" === _.substr(w + b.length, 2), 0 === p), c = w + b.length;
						a["xs" + a.l] += _.substr(c)
					} else a["xs" + a.l] += a.l ? " " + _ : _;
					if (-1 !== r.indexOf("=") && a.data) {
						for (S = a.xs0 + a.data.s, f = 1; a.l > f; f++) S += a["xs" + f] + a.data["xn" + f];
						a.e = S + a["xs" + f]
					}
					return a.l || (a.type = -1, a.xs0 = a.e), a.xfirst || a
				},
				me = 9;
			for (h = _e.prototype, h.l = h.pr = 0; --me > 0;) h["xn" + me] = 0, h["xs" + me] = "";
			h.xs0 = "", h._next = h._prev = h.xfirst = h.data = h.plugin = h.setRatio = h.rxp = null, h.appendXtra = function(t, e, i, r, s, n) {
				var a = this,
					o = a.l;
				return a["xs" + o] += n && o ? " " + t : t || "", i || 0 === o || a.plugin ? (a.l++, a.type = a.setRatio ? 2 : 1, a["xs" + a.l] = r || "", o > 0 ? (a.data["xn" + o] = e + i, a.rxp["xn" + o] = s, a["xn" + o] = e, a.plugin || (a.xfirst = new _e(a, "xn" + o, e, i, a.xfirst || a, 0, a.n, s, a.pr), a.xfirst.xs0 = 0), a) : (a.data = {
					s: e + i
				}, a.rxp = {}, a.s = e, a.c = i, a.r = s, a)) : (a["xs" + o] += e + (r || ""), a)
			};
			var ge = function(t, e) {
					e = e || {}, this.p = e.prefix ? G(t) || t : t, l[t] = l[this.p] = this, this.format = e.formatter || fe(e.defaultValue, e.color, e.collapsible, e.multi), e.parser && (this.parse = e.parser), this.clrs = e.color, this.multi = e.multi, this.keyword = e.keyword, this.dflt = e.defaultValue, this.pr = e.priority || 0
				},
				ve = Y._registerComplexSpecialProp = function(t, e, i) {
					"object" != typeof e && (e = {
						parser: i
					});
					var r, s, n = t.split(","),
						a = e.defaultValue;
					for (i = i || [a], r = 0; n.length > r; r++) e.prefix = 0 === r && e.prefix, e.defaultValue = i[r] || a, s = new ge(n[r], e)
				},
				ye = function(t) {
					if (!l[t]) {
						var e = t.charAt(0).toUpperCase() + t.substr(1) + "Plugin";
						ve(t, {
							parser: function(t, i, r, s, n, a, h) {
								var u = o.com.greensock.plugins[e];
								return u ? (u._cssRegister(), l[r].parse(t, i, r, s, n, a, h)) : (V("Error: " + e + " js file not loaded."), n)
							}
						})
					}
				};
			h = ge.prototype, h.parseComplex = function(t, e, i, r, s, n) {
				var a, o, l, h, u, f, p = this.keyword;
				if (this.multi && (D.test(i) || D.test(e) ? (o = e.replace(D, "|").split("|"), l = i.replace(D, "|").split("|")) : p && (o = [e], l = [i])), l) {
					for (h = l.length > o.length ? l.length : o.length, a = 0; h > a; a++) e = o[a] = o[a] || this.dflt, i = l[a] = l[a] || this.dflt, p && (u = e.indexOf(p), f = i.indexOf(p), u !== f && (-1 === f ? o[a] = o[a].split(p).join("") : -1 === u && (o[a] += " " + p)));
					e = o.join(", "), i = l.join(", ")
				}
				return de(t, this.p, e, i, this.clrs, this.dflt, r, this.pr, s, n)
			}, h.parse = function(t, e, i, r, n, a) {
				return this.parseComplex(t.style, this.format(Q(t, this.p, s, !1, this.dflt)), this.format(e), n, a)
			}, a.registerSpecialProp = function(t, e, i) {
				ve(t, {
					parser: function(t, r, s, n, a, o) {
						var l = new _e(t, s, 0, 0, a, 2, s, !1, i);
						return l.plugin = o, l.setRatio = e(t, r, n._tween, s), l
					},
					priority: i
				})
			}, a.useSVGTransformAttr = p;
			var xe, Te = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
				we = G("transform"),
				be = W + "transform",
				Pe = G("transformOrigin"),
				Se = null !== G("perspective"),
				Ce = Y.Transform = function() {
					this.perspective = parseFloat(a.defaultTransformPerspective) || 0, this.force3D = a.defaultForce3D !== !1 && Se ? a.defaultForce3D || "auto" : !1
				},
				Oe = window.SVGElement,
				ke = function(t, e, i) {
					var r, s = z.createElementNS("http://www.w3.org/2000/svg", t),
						n = /([a-z])([A-Z])/g;
					for (r in i) s.setAttributeNS(null, r.replace(n, "$1-$2").toLowerCase(), i[r]);
					return e.appendChild(s), s
				},
				Re = z.documentElement,
				Ae = function() {
					var t, e, i, r = d || /Android/i.test(B) && !window.chrome;
					return z.createElementNS && !r && (t = ke("svg", Re), e = ke("rect", t, {
						width: 100,
						height: 50,
						x: 100
					}), i = e.getBoundingClientRect().width, e.style[Pe] = "50% 50%", e.style[we] = "scaleX(0.5)", r = i === e.getBoundingClientRect().width && !(c && Se), Re.removeChild(t)), r
				}(),
				Me = function(t, e, i, r) {
					var s, n;
					r && (n = r.split(" ")).length || (s = t.getBBox(), e = re(e).split(" "), n = [(-1 !== e[0].indexOf("%") ? parseFloat(e[0]) / 100 * s.width : parseFloat(e[0])) + s.x, (-1 !== e[1].indexOf("%") ? parseFloat(e[1]) / 100 * s.height : parseFloat(e[1])) + s.y]), i.xOrigin = parseFloat(n[0]), i.yOrigin = parseFloat(n[1]), t.setAttribute("data-svg-origin", n.join(" "))
				},
				De = Y.getTransform = function(t, e, i, r) {
					if (t._gsTransform && i && !r) return t._gsTransform;
					var n, o, l, h, u, f, p, c, _, d, m = i ? t._gsTransform || new Ce : new Ce,
						g = 0 > m.scaleX,
						v = 2e-5,
						y = 1e5,
						x = Se ? parseFloat(Q(t, Pe, e, !1, "0 0 0").split(" ")[2]) || m.zOrigin || 0 : 0,
						T = parseFloat(a.defaultTransformPerspective) || 0;
					if (we ? o = Q(t, be, e, !0) : t.currentStyle && (o = t.currentStyle.filter.match(A), o = o && 4 === o.length ? [o[0].substr(4), Number(o[2].substr(4)), Number(o[1].substr(4)), o[3].substr(4), m.x || 0, m.y || 0].join(",") : ""), n = !o || "none" === o || "matrix(1, 0, 0, 1, 0, 0)" === o, m.svg = !!(Oe && "function" == typeof t.getBBox && t.getCTM && (!t.parentNode || t.parentNode.getBBox && t.parentNode.getCTM)), m.svg && (n && -1 !== (t.style[we] + "").indexOf("matrix") && (o = t.style[we], n = !1), Me(t, Q(t, Pe, s, !1, "50% 50%") + "", m, t.getAttribute("data-svg-origin")), xe = a.useSVGTransformAttr || Ae, l = t.getAttribute("transform"), n && l && -1 !== l.indexOf("matrix") && (o = l, n = 0)), !n) {
						for (l = (o || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [], h = l.length; --h > -1;) u = Number(l[h]), l[h] = (f = u - (u |= 0)) ? (0 | f * y + (0 > f ? -.5 : .5)) / y + u : u;
						if (16 === l.length) {
							var w, b, P, S, C, O = l[0],
								k = l[1],
								R = l[2],
								M = l[3],
								D = l[4],
								N = l[5],
								X = l[6],
								z = l[7],
								E = l[8],
								F = l[9],
								I = l[10],
								Y = l[12],
								B = l[13],
								U = l[14],
								j = l[11],
								V = Math.atan2(X, I);
							m.zOrigin && (U = -m.zOrigin, Y = E * U - l[12], B = F * U - l[13], U = I * U + m.zOrigin - l[14]), m.rotationX = V * L, V && (S = Math.cos(-V), C = Math.sin(-V), w = D * S + E * C, b = N * S + F * C, P = X * S + I * C, E = D * -C + E * S, F = N * -C + F * S, I = X * -C + I * S, j = z * -C + j * S, D = w, N = b, X = P), V = Math.atan2(E, I), m.rotationY = V * L, V && (S = Math.cos(-V), C = Math.sin(-V), w = O * S - E * C, b = k * S - F * C, P = R * S - I * C, F = k * C + F * S, I = R * C + I * S, j = M * C + j * S, O = w, k = b, R = P), V = Math.atan2(k, O), m.rotation = V * L, V && (S = Math.cos(-V), C = Math.sin(-V), O = O * S + D * C, b = k * S + N * C, N = k * -C + N * S, X = R * -C + X * S, k = b), m.rotationX && Math.abs(m.rotationX) + Math.abs(m.rotation) > 359.9 && (m.rotationX = m.rotation = 0, m.rotationY += 180), m.scaleX = (0 | Math.sqrt(O * O + k * k) * y + .5) / y, m.scaleY = (0 | Math.sqrt(N * N + F * F) * y + .5) / y, m.scaleZ = (0 | Math.sqrt(X * X + I * I) * y + .5) / y, m.skewX = 0, m.perspective = j ? 1 / (0 > j ? -j : j) : 0, m.x = Y, m.y = B, m.z = U, m.svg && (m.x -= m.xOrigin - (m.xOrigin * O - m.yOrigin * D), m.y -= m.yOrigin - (m.yOrigin * k - m.xOrigin * N))
						} else if (!(Se && !r && l.length && m.x === l[4] && m.y === l[5] && (m.rotationX || m.rotationY) || void 0 !== m.x && "none" === Q(t, "display", e))) {
							var W = l.length >= 6,
								q = W ? l[0] : 1,
								G = l[1] || 0,
								H = l[2] || 0,
								Z = W ? l[3] : 1;
							m.x = l[4] || 0, m.y = l[5] || 0, p = Math.sqrt(q * q + G * G), c = Math.sqrt(Z * Z + H * H), _ = q || G ? Math.atan2(G, q) * L : m.rotation || 0, d = H || Z ? Math.atan2(H, Z) * L + _ : m.skewX || 0, Math.abs(d) > 90 && 270 > Math.abs(d) && (g ? (p *= -1, d += 0 >= _ ? 180 : -180, _ += 0 >= _ ? 180 : -180) : (c *= -1, d += 0 >= d ? 180 : -180)), m.scaleX = p, m.scaleY = c, m.rotation = _, m.skewX = d, Se && (m.rotationX = m.rotationY = m.z = 0, m.perspective = T, m.scaleZ = 1), m.svg && (m.x -= m.xOrigin - (m.xOrigin * q - m.yOrigin * G), m.y -= m.yOrigin - (m.yOrigin * Z - m.xOrigin * H))
						}
						m.zOrigin = x;
						for (h in m) v > m[h] && m[h] > -v && (m[h] = 0)
					}
					return i && (t._gsTransform = m, m.svg && (xe && t.style[we] ? ze(t.style, we) : !xe && t.getAttribute("transform") && t.removeAttribute("transform"))), m
				},
				Ne = function(t) {
					var e, i, r = this.data,
						s = -r.rotation * N,
						n = s + r.skewX * N,
						a = 1e5,
						o = (0 | Math.cos(s) * r.scaleX * a) / a,
						l = (0 | Math.sin(s) * r.scaleX * a) / a,
						h = (0 | Math.sin(n) * -r.scaleY * a) / a,
						u = (0 | Math.cos(n) * r.scaleY * a) / a,
						f = this.t.style,
						p = this.t.currentStyle;
					if (p) {
						i = l, l = -h, h = -i, e = p.filter, f.filter = "";
						var c, _, m = this.t.offsetWidth,
							g = this.t.offsetHeight,
							v = "absolute" !== p.position,
							y = "progid:DXImageTransform.Microsoft.Matrix(M11=" + o + ", M12=" + l + ", M21=" + h + ", M22=" + u,
							w = r.x + m * r.xPercent / 100,
							b = r.y + g * r.yPercent / 100;
						if (null != r.ox && (c = (r.oxp ? .01 * m * r.ox : r.ox) - m / 2, _ = (r.oyp ? .01 * g * r.oy : r.oy) - g / 2, w += c - (c * o + _ * l), b += _ - (c * h + _ * u)), v ? (c = m / 2, _ = g / 2, y += ", Dx=" + (c - (c * o + _ * l) + w) + ", Dy=" + (_ - (c * h + _ * u) + b) + ")") : y += ", sizingMethod='auto expand')", f.filter = -1 !== e.indexOf("DXImageTransform.Microsoft.Matrix(") ? e.replace(M, y) : y + " " + e, (0 === t || 1 === t) && 1 === o && 0 === l && 0 === h && 1 === u && (v && -1 === y.indexOf("Dx=0, Dy=0") || T.test(e) && 100 !== parseFloat(RegExp.$1) || -1 === e.indexOf("gradient(" && e.indexOf("Alpha")) && f.removeAttribute("filter")), !v) {
							var P, S, C, O = 8 > d ? 1 : -1;
							for (c = r.ieOffsetX || 0, _ = r.ieOffsetY || 0, r.ieOffsetX = Math.round((m - ((0 > o ? -o : o) * m + (0 > l ? -l : l) * g)) / 2 + w), r.ieOffsetY = Math.round((g - ((0 > u ? -u : u) * g + (0 > h ? -h : h) * m)) / 2 + b), me = 0; 4 > me; me++) S = ee[me], P = p[S], i = -1 !== P.indexOf("px") ? parseFloat(P) : Z(this.t, S, parseFloat(P), P.replace(x, "")) || 0, C = i !== r[S] ? 2 > me ? -r.ieOffsetX : -r.ieOffsetY : 2 > me ? c - r.ieOffsetX : _ - r.ieOffsetY, f[S] = (r[S] = Math.round(i - C * (0 === me || 2 === me ? 1 : O))) + "px"
						}
					}
				},
				Le = Y.set3DTransformRatio = Y.setTransformRatio = function(t) {
					var e, i, r, s, n, a, o, l, h, u, f, p, _, d, m, g, v, y, x, T, w, b, P, S = this.data,
						C = this.t.style,
						O = S.rotation,
						k = S.rotationX,
						R = S.rotationY,
						A = S.scaleX,
						M = S.scaleY,
						D = S.scaleZ,
						L = S.x,
						X = S.y,
						z = S.z,
						E = S.svg,
						F = S.perspective,
						I = S.force3D;
					if (!(((1 !== t && 0 !== t || "auto" !== I || this.tween._totalTime !== this.tween._totalDuration && this.tween._totalTime) && I || z || F || R || k) && (!xe || !E) && Se)) return O || S.skewX || E ? (O *= N, b = S.skewX * N, P = 1e5, e = Math.cos(O) * A, s = Math.sin(O) * A, i = Math.sin(O - b) * -M, n = Math.cos(O - b) * M, b && "simple" === S.skewType && (v = Math.tan(b), v = Math.sqrt(1 + v * v), i *= v, n *= v, S.skewY && (e *= v, s *= v)), E && (L += S.xOrigin - (S.xOrigin * e + S.yOrigin * i), X += S.yOrigin - (S.xOrigin * s + S.yOrigin * n), d = 1e-6, d > L && L > -d && (L = 0), d > X && X > -d && (X = 0)), x = (0 | e * P) / P + "," + (0 | s * P) / P + "," + (0 | i * P) / P + "," + (0 | n * P) / P + "," + L + "," + X + ")", E && xe ? this.t.setAttribute("transform", "matrix(" + x) : C[we] = (S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) matrix(" : "matrix(") + x) : C[we] = (S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) matrix(" : "matrix(") + A + ",0,0," + M + "," + L + "," + X + ")", void 0;
					if (c && (d = 1e-4, d > A && A > -d && (A = D = 2e-5), d > M && M > -d && (M = D = 2e-5), !F || S.z || S.rotationX || S.rotationY || (F = 0)), O || S.skewX) O *= N, m = e = Math.cos(O), g = s = Math.sin(O), S.skewX && (O -= S.skewX * N, m = Math.cos(O), g = Math.sin(O), "simple" === S.skewType && (v = Math.tan(S.skewX * N), v = Math.sqrt(1 + v * v), m *= v, g *= v, S.skewY && (e *= v, s *= v))), i = -g, n = m;
					else {
						if (!(R || k || 1 !== D || F || E)) return C[we] = (S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) translate3d(" : "translate3d(") + L + "px," + X + "px," + z + "px)" + (1 !== A || 1 !== M ? " scale(" + A + "," + M + ")" : ""), void 0;
						e = n = 1, i = s = 0
					}
					h = 1, r = a = o = l = u = f = 0, p = F ? -1 / F : 0, _ = S.zOrigin, d = 1e-6, T = ",", w = "0", O = R * N, O && (m = Math.cos(O), g = Math.sin(O), o = -g, u = p * -g, r = e * g, a = s * g, h = m, p *= m, e *= m, s *= m), O = k * N, O && (m = Math.cos(O), g = Math.sin(O), v = i * m + r * g, y = n * m + a * g, l = h * g, f = p * g, r = i * -g + r * m, a = n * -g + a * m, h *= m, p *= m, i = v, n = y), 1 !== D && (r *= D, a *= D, h *= D, p *= D), 1 !== M && (i *= M, n *= M, l *= M, f *= M), 1 !== A && (e *= A, s *= A, o *= A, u *= A), (_ || E) && (_ && (L += r * -_, X += a * -_, z += h * -_ + _), E && (L += S.xOrigin - (S.xOrigin * e + S.yOrigin * i), X += S.yOrigin - (S.xOrigin * s + S.yOrigin * n)), d > L && L > -d && (L = w), d > X && X > -d && (X = w), d > z && z > -d && (z = 0)), x = S.xPercent || S.yPercent ? "translate(" + S.xPercent + "%," + S.yPercent + "%) matrix3d(" : "matrix3d(", x += (d > e && e > -d ? w : e) + T + (d > s && s > -d ? w : s) + T + (d > o && o > -d ? w : o), x += T + (d > u && u > -d ? w : u) + T + (d > i && i > -d ? w : i) + T + (d > n && n > -d ? w : n), k || R ? (x += T + (d > l && l > -d ? w : l) + T + (d > f && f > -d ? w : f) + T + (d > r && r > -d ? w : r), x += T + (d > a && a > -d ? w : a) + T + (d > h && h > -d ? w : h) + T + (d > p && p > -d ? w : p) + T) : x += ",0,0,0,0,1,0,", x += L + T + X + T + z + T + (F ? 1 + -z / F : 1) + ")", C[we] = x
				};
			h = Ce.prototype, h.x = h.y = h.z = h.skewX = h.skewY = h.rotation = h.rotationX = h.rotationY = h.zOrigin = h.xPercent = h.yPercent = 0, h.scaleX = h.scaleY = h.scaleZ = 1, ve("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent", {
				parser: function(t, e, i, r, n, o, l) {
					if (r._lastParsedTransform === l) return n;
					r._lastParsedTransform = l;
					var h, u, f, p, c, _, d, m = r._transform = De(t, s, !0, l.parseTransform),
						g = t.style,
						v = 1e-6,
						y = Te.length,
						x = l,
						T = {};
					if ("string" == typeof x.transform && we) f = F.style, f[we] = x.transform, f.display = "block", f.position = "absolute", z.body.appendChild(F), h = De(F, null, !1), z.body.removeChild(F);
					else if ("object" == typeof x) {
						if (h = {
								scaleX: ne(null != x.scaleX ? x.scaleX : x.scale, m.scaleX),
								scaleY: ne(null != x.scaleY ? x.scaleY : x.scale, m.scaleY),
								scaleZ: ne(x.scaleZ, m.scaleZ),
								x: ne(x.x, m.x),
								y: ne(x.y, m.y),
								z: ne(x.z, m.z),
								xPercent: ne(x.xPercent, m.xPercent),
								yPercent: ne(x.yPercent, m.yPercent),
								perspective: ne(x.transformPerspective, m.perspective)
							}, d = x.directionalRotation, null != d)
							if ("object" == typeof d)
								for (f in d) x[f] = d[f];
							else x.rotation = d;
							"string" == typeof x.x && -1 !== x.x.indexOf("%") && (h.x = 0, h.xPercent = ne(x.x, m.xPercent)), "string" == typeof x.y && -1 !== x.y.indexOf("%") && (h.y = 0, h.yPercent = ne(x.y, m.yPercent)), h.rotation = ae("rotation" in x ? x.rotation : "shortRotation" in x ? x.shortRotation + "_short" : "rotationZ" in x ? x.rotationZ : m.rotation, m.rotation, "rotation", T), Se && (h.rotationX = ae("rotationX" in x ? x.rotationX : "shortRotationX" in x ? x.shortRotationX + "_short" : m.rotationX || 0, m.rotationX, "rotationX", T), h.rotationY = ae("rotationY" in x ? x.rotationY : "shortRotationY" in x ? x.shortRotationY + "_short" : m.rotationY || 0, m.rotationY, "rotationY", T)), h.skewX = null == x.skewX ? m.skewX : ae(x.skewX, m.skewX), h.skewY = null == x.skewY ? m.skewY : ae(x.skewY, m.skewY), (u = h.skewY - m.skewY) && (h.skewX += u, h.rotation += u)
					}
					for (Se && null != x.force3D && (m.force3D = x.force3D, _ = !0), m.skewType = x.skewType || m.skewType || a.defaultSkewType, c = m.force3D || m.z || m.rotationX || m.rotationY || h.z || h.rotationX || h.rotationY || h.perspective, c || null == x.scale || (h.scaleZ = 1); --y > -1;) i = Te[y], p = h[i] - m[i], (p > v || -v > p || null != x[i] || null != X[i]) && (_ = !0, n = new _e(m, i, m[i], p, n), i in T && (n.e = T[i]), n.xs0 = 0, n.plugin = o, r._overwriteProps.push(n.n));
					return p = x.transformOrigin, m.svg && (p || x.svgOrigin) && (Me(t, re(p), h, x.svgOrigin), n = new _e(m, "xOrigin", m.xOrigin, h.xOrigin - m.xOrigin, n, -1, "transformOrigin"), n.b = m.xOrigin, n.e = n.xs0 = h.xOrigin, n = new _e(m, "yOrigin", m.yOrigin, h.yOrigin - m.yOrigin, n, -1, "transformOrigin"), n.b = m.yOrigin, n.e = n.xs0 = h.yOrigin, p = xe ? null : "0px 0px"), (p || Se && c && m.zOrigin) && (we ? (_ = !0, i = Pe, p = (p || Q(t, i, s, !1, "50% 50%")) + "", n = new _e(g, i, 0, 0, n, -1, "transformOrigin"), n.b = g[i], n.plugin = o, Se ? (f = m.zOrigin, p = p.split(" "), m.zOrigin = (p.length > 2 && (0 === f || "0px" !== p[2]) ? parseFloat(p[2]) : f) || 0, n.xs0 = n.e = p[0] + " " + (p[1] || "50%") + " 0px", n = new _e(m, "zOrigin", 0, 0, n, -1, n.n), n.b = f, n.xs0 = n.e = m.zOrigin) : n.xs0 = n.e = p) : re(p + "", m)), _ && (r._transformType = m.svg && xe || !c && 3 !== this._transformType ? 2 : 3), n
				},
				prefix: !0
			}), ve("boxShadow", {
				defaultValue: "0px 0px 0px 0px #999",
				prefix: !0,
				color: !0,
				multi: !0,
				keyword: "inset"
			}), ve("borderRadius", {
				defaultValue: "0px",
				parser: function(t, e, i, n, a) {
					e = this.format(e);
					var o, l, h, u, f, p, c, _, d, m, g, v, y, x, T, w, b = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
						P = t.style;
					for (d = parseFloat(t.offsetWidth), m = parseFloat(t.offsetHeight), o = e.split(" "), l = 0; b.length > l; l++) this.p.indexOf("border") && (b[l] = G(b[l])), f = u = Q(t, b[l], s, !1, "0px"), -1 !== f.indexOf(" ") && (u = f.split(" "), f = u[0], u = u[1]), p = h = o[l], c = parseFloat(f), v = f.substr((c + "").length), y = "=" === p.charAt(1), y ? (_ = parseInt(p.charAt(0) + "1", 10), p = p.substr(2), _ *= parseFloat(p), g = p.substr((_ + "").length - (0 > _ ? 1 : 0)) || "") : (_ = parseFloat(p), g = p.substr((_ + "").length)), "" === g && (g = r[i] || v), g !== v && (x = Z(t, "borderLeft", c, v), T = Z(t, "borderTop", c, v), "%" === g ? (f = 100 * (x / d) + "%", u = 100 * (T / m) + "%") : "em" === g ? (w = Z(t, "borderLeft", 1, "em"), f = x / w + "em", u = T / w + "em") : (f = x + "px", u = T + "px"), y && (p = parseFloat(f) + _ + g, h = parseFloat(u) + _ + g)), a = de(P, b[l], f + " " + u, p + " " + h, !1, "0px", a);
					return a
				},
				prefix: !0,
				formatter: fe("0px 0px 0px 0px", !1, !0)
			}), ve("backgroundPosition", {
				defaultValue: "0 0",
				parser: function(t, e, i, r, n, a) {
					var o, l, h, u, f, p, c = "background-position",
						_ = s || H(t, null),
						m = this.format((_ ? d ? _.getPropertyValue(c + "-x") + " " + _.getPropertyValue(c + "-y") : _.getPropertyValue(c) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"),
						g = this.format(e);
					if (-1 !== m.indexOf("%") != (-1 !== g.indexOf("%")) && (p = Q(t, "backgroundImage").replace(O, ""), p && "none" !== p)) {
						for (o = m.split(" "), l = g.split(" "), I.setAttribute("src", p), h = 2; --h > -1;) m = o[h], u = -1 !== m.indexOf("%"), u !== (-1 !== l[h].indexOf("%")) && (f = 0 === h ? t.offsetWidth - I.width : t.offsetHeight - I.height, o[h] = u ? parseFloat(m) / 100 * f + "px" : 100 * (parseFloat(m) / f) + "%");
						m = o.join(" ")
					}
					return this.parseComplex(t.style, m, g, n, a)
				},
				formatter: re
			}), ve("backgroundSize", {
				defaultValue: "0 0",
				formatter: re
			}), ve("perspective", {
				defaultValue: "0px",
				prefix: !0
			}), ve("perspectiveOrigin", {
				defaultValue: "50% 50%",
				prefix: !0
			}), ve("transformStyle", {
				prefix: !0
			}), ve("backfaceVisibility", {
				prefix: !0
			}), ve("userSelect", {
				prefix: !0
			}), ve("margin", {
				parser: pe("marginTop,marginRight,marginBottom,marginLeft")
			}), ve("padding", {
				parser: pe("paddingTop,paddingRight,paddingBottom,paddingLeft")
			}), ve("clip", {
				defaultValue: "rect(0px,0px,0px,0px)",
				parser: function(t, e, i, r, n, a) {
					var o, l, h;
					return 9 > d ? (l = t.currentStyle, h = 8 > d ? " " : ",", o = "rect(" + l.clipTop + h + l.clipRight + h + l.clipBottom + h + l.clipLeft + ")", e = this.format(e).split(",").join(h)) : (o = this.format(Q(t, this.p, s, !1, this.dflt)), e = this.format(e)), this.parseComplex(t.style, o, e, n, a)
				}
			}), ve("textShadow", {
				defaultValue: "0px 0px 0px #999",
				color: !0,
				multi: !0
			}), ve("autoRound,strictUnits", {
				parser: function(t, e, i, r, s) {
					return s
				}
			}), ve("border", {
				defaultValue: "0px solid #000",
				parser: function(t, e, i, r, n, a) {
					return this.parseComplex(t.style, this.format(Q(t, "borderTopWidth", s, !1, "0px") + " " + Q(t, "borderTopStyle", s, !1, "solid") + " " + Q(t, "borderTopColor", s, !1, "#000")), this.format(e), n, a)
				},
				color: !0,
				formatter: function(t) {
					var e = t.split(" ");
					return e[0] + " " + (e[1] || "solid") + " " + (t.match(ue) || ["#000"])[0]
				}
			}), ve("borderWidth", {
				parser: pe("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
			}), ve("float,cssFloat,styleFloat", {
				parser: function(t, e, i, r, s) {
					var n = t.style,
						a = "cssFloat" in n ? "cssFloat" : "styleFloat";
					return new _e(n, a, 0, 0, s, -1, i, !1, 0, n[a], e)
				}
			});
			var Xe = function(t) {
				var e, i = this.t,
					r = i.filter || Q(this.data, "filter") || "",
					s = 0 | this.s + this.c * t;
				100 === s && (-1 === r.indexOf("atrix(") && -1 === r.indexOf("radient(") && -1 === r.indexOf("oader(") ? (i.removeAttribute("filter"), e = !Q(this.data, "filter")) : (i.filter = r.replace(b, ""), e = !0)), e || (this.xn1 && (i.filter = r = r || "alpha(opacity=" + s + ")"), -1 === r.indexOf("pacity") ? 0 === s && this.xn1 || (i.filter = r + " alpha(opacity=" + s + ")") : i.filter = r.replace(T, "opacity=" + s))
			};
			ve("opacity,alpha,autoAlpha", {
				defaultValue: "1",
				parser: function(t, e, i, r, n, a) {
					var o = parseFloat(Q(t, "opacity", s, !1, "1")),
						l = t.style,
						h = "autoAlpha" === i;
					return "string" == typeof e && "=" === e.charAt(1) && (e = ("-" === e.charAt(0) ? -1 : 1) * parseFloat(e.substr(2)) + o), h && 1 === o && "hidden" === Q(t, "visibility", s) && 0 !== e && (o = 0), U ? n = new _e(l, "opacity", o, e - o, n) : (n = new _e(l, "opacity", 100 * o, 100 * (e - o), n), n.xn1 = h ? 1 : 0, l.zoom = 1, n.type = 2, n.b = "alpha(opacity=" + n.s + ")", n.e = "alpha(opacity=" + (n.s + n.c) + ")", n.data = t, n.plugin = a, n.setRatio = Xe), h && (n = new _e(l, "visibility", 0, 0, n, -1, null, !1, 0, 0 !== o ? "inherit" : "hidden", 0 === e ? "hidden" : "inherit"), n.xs0 = "inherit", r._overwriteProps.push(n.n), r._overwriteProps.push(i)), n
				}
			});
			var ze = function(t, e) {
					e && (t.removeProperty ? (("ms" === e.substr(0, 2) || "webkit" === e.substr(0, 6)) && (e = "-" + e), t.removeProperty(e.replace(S, "-$1").toLowerCase())) : t.removeAttribute(e))
				},
				Ee = function(t) {
					if (this.t._gsClassPT = this, 1 === t || 0 === t) {
						this.t.setAttribute("class", 0 === t ? this.b : this.e);
						for (var e = this.data, i = this.t.style; e;) e.v ? i[e.p] = e.v : ze(i, e.p), e = e._next;
						1 === t && this.t._gsClassPT === this && (this.t._gsClassPT = null)
					} else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
				};
			ve("className", {
				parser: function(t, e, r, n, a, o, l) {
					var h, u, f, p, c, _ = t.getAttribute("class") || "",
						d = t.style.cssText;
					if (a = n._classNamePT = new _e(t, r, 0, 0, a, 2), a.setRatio = Ee, a.pr = -11, i = !0, a.b = _, u = K(t, s), f = t._gsClassPT) {
						for (p = {}, c = f.data; c;) p[c.p] = 1, c = c._next;
						f.setRatio(1)
					}
					return t._gsClassPT = a, a.e = "=" !== e.charAt(1) ? e : _.replace(RegExp("\\s*\\b" + e.substr(2) + "\\b"), "") + ("+" === e.charAt(0) ? " " + e.substr(2) : ""), t.setAttribute("class", a.e), h = J(t, u, K(t), l, p), t.setAttribute("class", _), a.data = h.firstMPT, t.style.cssText = d, a = a.xfirst = n.parse(t, h.difs, a, o)
				}
			});
			var Fe = function(t) {
				if ((1 === t || 0 === t) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
					var e, i, r, s, n, a = this.t.style,
						o = l.transform.parse;
					if ("all" === this.e) a.cssText = "", s = !0;
					else
						for (e = this.e.split(" ").join("").split(","), r = e.length; --r > -1;) i = e[r], l[i] && (l[i].parse === o ? s = !0 : i = "transformOrigin" === i ? Pe : l[i].p), ze(a, i);
					s && (ze(a, we), n = this.t._gsTransform, n && (n.svg && this.t.removeAttribute("data-svg-origin"), delete this.t._gsTransform))
				}
			};
			for (ve("clearProps", {
					parser: function(t, e, r, s, n) {
						return n = new _e(t, r, 0, 0, n, 2), n.setRatio = Fe, n.e = e, n.pr = -10, n.data = s._tween, i = !0, n
					}
				}), h = "bezier,throwProps,physicsProps,physics2D".split(","), me = h.length; me--;) ye(h[me]);
			h = a.prototype, h._firstPT = h._lastParsedTransform = h._transform = null, h._onInitTween = function(t, e, o) {
				if (!t.nodeType) return !1;
				this._target = t, this._tween = o, this._vars = e, u = e.autoRound, i = !1, r = e.suffixMap || a.suffixMap, s = H(t, ""), n = this._overwriteProps;
				var h, c, d, m, g, v, y, x, T, b = t.style;
				if (f && "" === b.zIndex && (h = Q(t, "zIndex", s), ("auto" === h || "" === h) && this._addLazySet(b, "zIndex", 0)), "string" == typeof e && (m = b.cssText, h = K(t, s), b.cssText = m + ";" + e, h = J(t, h, K(t)).difs, !U && w.test(e) && (h.opacity = parseFloat(RegExp.$1)), e = h, b.cssText = m), this._firstPT = c = e.className ? l.className.parse(t, e.className, "className", this, null, null, e) : this.parse(t, e, null), this._transformType) {
					for (T = 3 === this._transformType, we ? p && (f = !0, "" === b.zIndex && (y = Q(t, "zIndex", s), ("auto" === y || "" === y) && this._addLazySet(b, "zIndex", 0)), _ && this._addLazySet(b, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (T ? "visible" : "hidden"))) : b.zoom = 1, d = c; d && d._next;) d = d._next;
					x = new _e(t, "transform", 0, 0, null, 2), this._linkCSSP(x, null, d), x.setRatio = we ? Le : Ne, x.data = this._transform || De(t, s, !0), x.tween = o, x.pr = -1, n.pop()
				}
				if (i) {
					for (; c;) {
						for (v = c._next, d = m; d && d.pr > c.pr;) d = d._next;
						(c._prev = d ? d._prev : g) ? c._prev._next = c: m = c, (c._next = d) ? d._prev = c : g = c, c = v
					}
					this._firstPT = m
				}
				return !0
			}, h.parse = function(t, e, i, n) {
				var a, o, h, f, p, c, _, d, m, g, v = t.style;
				for (a in e) c = e[a], o = l[a], o ? i = o.parse(t, c, a, this, i, n, e) : (p = Q(t, a, s) + "", m = "string" == typeof c, "color" === a || "fill" === a || "stroke" === a || -1 !== a.indexOf("Color") || m && P.test(c) ? (m || (c = he(c), c = (c.length > 3 ? "rgba(" : "rgb(") + c.join(",") + ")"), i = de(v, a, p, c, !0, "transparent", i, 0, n)) : !m || -1 === c.indexOf(" ") && -1 === c.indexOf(",") ? (h = parseFloat(p), _ = h || 0 === h ? p.substr((h + "").length) : "", ("" === p || "auto" === p) && ("width" === a || "height" === a ? (h = ie(t, a, s), _ = "px") : "left" === a || "top" === a ? (h = $(t, a, s), _ = "px") : (h = "opacity" !== a ? 0 : 1, _ = "")), g = m && "=" === c.charAt(1), g ? (f = parseInt(c.charAt(0) + "1", 10), c = c.substr(2), f *= parseFloat(c), d = c.replace(x, "")) : (f = parseFloat(c), d = m ? c.replace(x, "") : ""), "" === d && (d = a in r ? r[a] : _), c = f || 0 === f ? (g ? f + h : f) + d : e[a], _ !== d && "" !== d && (f || 0 === f) && h && (h = Z(t, a, h, _), "%" === d ? (h /= Z(t, a, 100, "%") / 100, e.strictUnits !== !0 && (p = h + "%")) : "em" === d ? h /= Z(t, a, 1, "em") : "px" !== d && (f = Z(t, a, f, d), d = "px"), g && (f || 0 === f) && (c = f + h + d)), g && (f += h), !h && 0 !== h || !f && 0 !== f ? void 0 !== v[a] && (c || "NaN" != c + "" && null != c) ? (i = new _e(v, a, f || h || 0, 0, i, -1, a, !1, 0, p, c), i.xs0 = "none" !== c || "display" !== a && -1 === a.indexOf("Style") ? c : p) : V("invalid " + a + " tween value: " + e[a]) : (i = new _e(v, a, h, f - h, i, 0, a, u !== !1 && ("px" === d || "zIndex" === a), 0, p, c), i.xs0 = d)) : i = de(v, a, p, c, !0, null, i, 0, n)), n && i && !i.plugin && (i.plugin = n);
				return i
			}, h.setRatio = function(t) {
				var e, i, r, s = this._firstPT,
					n = 1e-6;
				if (1 !== t || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
					if (t || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)
						for (; s;) {
							if (e = s.c * t + s.s, s.r ? e = Math.round(e) : n > e && e > -n && (e = 0), s.type)
								if (1 === s.type)
									if (r = s.l, 2 === r) s.t[s.p] = s.xs0 + e + s.xs1 + s.xn1 + s.xs2;
									else if (3 === r) s.t[s.p] = s.xs0 + e + s.xs1 + s.xn1 + s.xs2 + s.xn2 + s.xs3;
							else if (4 === r) s.t[s.p] = s.xs0 + e + s.xs1 + s.xn1 + s.xs2 + s.xn2 + s.xs3 + s.xn3 + s.xs4;
							else if (5 === r) s.t[s.p] = s.xs0 + e + s.xs1 + s.xn1 + s.xs2 + s.xn2 + s.xs3 + s.xn3 + s.xs4 + s.xn4 + s.xs5;
							else {
								for (i = s.xs0 + e + s.xs1, r = 1; s.l > r; r++) i += s["xn" + r] + s["xs" + (r + 1)];
								s.t[s.p] = i
							} else -1 === s.type ? s.t[s.p] = s.xs0 : s.setRatio && s.setRatio(t);
							else s.t[s.p] = e + s.xs0;
							s = s._next
						} else
							for (; s;) 2 !== s.type ? s.t[s.p] = s.b : s.setRatio(t), s = s._next;
					else
						for (; s;) 2 !== s.type ? s.t[s.p] = s.e : s.setRatio(t), s = s._next
			}, h._enableTransforms = function(t) {
				this._transform = this._transform || De(this._target, s, !0), this._transformType = this._transform.svg && xe || !t && 3 !== this._transformType ? 2 : 3
			};
			var Ie = function() {
				this.t[this.p] = this.e, this.data._linkCSSP(this, this._next, null, !0)
			};
			h._addLazySet = function(t, e, i) {
				var r = this._firstPT = new _e(t, e, 0, 0, this._firstPT, 2);
				r.e = i, r.setRatio = Ie, r.data = this
			}, h._linkCSSP = function(t, e, i, r) {
				return t && (e && (e._prev = t), t._next && (t._next._prev = t._prev), t._prev ? t._prev._next = t._next : this._firstPT === t && (this._firstPT = t._next, r = !0), i ? i._next = t : r || null !== this._firstPT || (this._firstPT = t), t._next = e, t._prev = i), t
			}, h._kill = function(e) {
				var i, r, s, n = e;
				if (e.autoAlpha || e.alpha) {
					n = {};
					for (r in e) n[r] = e[r];
					n.opacity = 1, n.autoAlpha && (n.visibility = 1)
				}
				return e.className && (i = this._classNamePT) && (s = i.xfirst, s && s._prev ? this._linkCSSP(s._prev, i._next, s._prev._prev) : s === this._firstPT && (this._firstPT = i._next), i._next && this._linkCSSP(i._next, i._next._next, s._prev), this._classNamePT = null), t.prototype._kill.call(this, n)
			};
			var Ye = function(t, e, i) {
				var r, s, n, a;
				if (t.slice)
					for (s = t.length; --s > -1;) Ye(t[s], e, i);
				else
					for (r = t.childNodes, s = r.length; --s > -1;) n = r[s], a = n.type, n.style && (e.push(K(n)), i && i.push(n)), 1 !== a && 9 !== a && 11 !== a || !n.childNodes.length || Ye(n, e, i)
			};
			return a.cascadeTo = function(t, i, r) {
				var s, n, a, o, l = e.to(t, i, r),
					h = [l],
					u = [],
					f = [],
					p = [],
					c = e._internals.reservedProps;
				for (t = l._targets || l.target, Ye(t, u, p), l.render(i, !0, !0), Ye(t, f), l.render(0, !0, !0), l._enabled(!0), s = p.length; --s > -1;)
					if (n = J(p[s], u[s], f[s]), n.firstMPT) {
						n = n.difs;
						for (a in r) c[a] && (n[a] = r[a]);
						o = {};
						for (a in n) o[a] = u[s][a];
						h.push(e.fromTo(p[s], i, o, n))
					}
				return h
			}, t.activate([a]), a
		}, !0)
	}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
	function(t) {
		"use strict";
		var e = function() {
			return (_gsScope.GreenSockGlobals || _gsScope)[t]
		};
		"function" == typeof define && define.amd ? define(["TweenLite"], e) : "undefined" != typeof module && module.exports && (require("../TweenLite.js"), module.exports = e())
	}("CSSPlugin");
/*!
 * VERSION: beta 1.15.2
 * DATE: 2015-01-27
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
	"use strict";
	_gsScope._gsDefine("easing.Back", ["easing.Ease"], function(t) {
		var e, i, s, r = _gsScope.GreenSockGlobals || _gsScope,
			n = r.com.greensock,
			a = 2 * Math.PI,
			o = Math.PI / 2,
			h = n._class,
			l = function(e, i) {
				var s = h("easing." + e, function() {}, !0),
					r = s.prototype = new t;
				return r.constructor = s, r.getRatio = i, s
			},
			_ = t.register || function() {},
			u = function(t, e, i, s) {
				var r = h("easing." + t, {
					easeOut: new e,
					easeIn: new i,
					easeInOut: new s
				}, !0);
				return _(r, t), r
			},
			c = function(t, e, i) {
				this.t = t, this.v = e, i && (this.next = i, i.prev = this, this.c = i.v - e, this.gap = i.t - t)
			},
			p = function(e, i) {
				var s = h("easing." + e, function(t) {
						this._p1 = t || 0 === t ? t : 1.70158, this._p2 = 1.525 * this._p1
					}, !0),
					r = s.prototype = new t;
				return r.constructor = s, r.getRatio = i, r.config = function(t) {
					return new s(t)
				}, s
			},
			f = u("Back", p("BackOut", function(t) {
				return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1
			}), p("BackIn", function(t) {
				return t * t * ((this._p1 + 1) * t - this._p1)
			}), p("BackInOut", function(t) {
				return 1 > (t *= 2) ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2)
			})),
			m = h("easing.SlowMo", function(t, e, i) {
				e = e || 0 === e ? e : .7, null == t ? t = .7 : t > 1 && (t = 1), this._p = 1 !== t ? e : 0, this._p1 = (1 - t) / 2, this._p2 = t, this._p3 = this._p1 + this._p2, this._calcEnd = i === !0
			}, !0),
			d = m.prototype = new t;
		return d.constructor = m, d.getRatio = function(t) {
			var e = t + (.5 - t) * this._p;
			return this._p1 > t ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t : e - (t = 1 - t / this._p1) * t * t * t * e : t > this._p3 ? this._calcEnd ? 1 - (t = (t - this._p3) / this._p1) * t : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t : this._calcEnd ? 1 : e
		}, m.ease = new m(.7, .7), d.config = m.config = function(t, e, i) {
			return new m(t, e, i)
		}, e = h("easing.SteppedEase", function(t) {
			t = t || 1, this._p1 = 1 / t, this._p2 = t + 1
		}, !0), d = e.prototype = new t, d.constructor = e, d.getRatio = function(t) {
			return 0 > t ? t = 0 : t >= 1 && (t = .999999999), (this._p2 * t >> 0) * this._p1
		}, d.config = e.config = function(t) {
			return new e(t)
		}, i = h("easing.RoughEase", function(e) {
			e = e || {};
			for (var i, s, r, n, a, o, h = e.taper || "none", l = [], _ = 0, u = 0 | (e.points || 20), p = u, f = e.randomize !== !1, m = e.clamp === !0, d = e.template instanceof t ? e.template : null, g = "number" == typeof e.strength ? .4 * e.strength : .4; --p > -1;) i = f ? Math.random() : 1 / u * p, s = d ? d.getRatio(i) : i, "none" === h ? r = g : "out" === h ? (n = 1 - i, r = n * n * g) : "in" === h ? r = i * i * g : .5 > i ? (n = 2 * i, r = .5 * n * n * g) : (n = 2 * (1 - i), r = .5 * n * n * g), f ? s += Math.random() * r - .5 * r : p % 2 ? s += .5 * r : s -= .5 * r, m && (s > 1 ? s = 1 : 0 > s && (s = 0)), l[_++] = {
				x: i,
				y: s
			};
			for (l.sort(function(t, e) {
					return t.x - e.x
				}), o = new c(1, 1, null), p = u; --p > -1;) a = l[p], o = new c(a.x, a.y, o);
			this._prev = new c(0, 0, 0 !== o.t ? o : o.next)
		}, !0), d = i.prototype = new t, d.constructor = i, d.getRatio = function(t) {
			var e = this._prev;
			if (t > e.t) {
				for (; e.next && t >= e.t;) e = e.next;
				e = e.prev
			} else
				for (; e.prev && e.t >= t;) e = e.prev;
			return this._prev = e, e.v + (t - e.t) / e.gap * e.c
		}, d.config = function(t) {
			return new i(t)
		}, i.ease = new i, u("Bounce", l("BounceOut", function(t) {
			return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
		}), l("BounceIn", function(t) {
			return 1 / 2.75 > (t = 1 - t) ? 1 - 7.5625 * t * t : 2 / 2.75 > t ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : 2.5 / 2.75 > t ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375)
		}), l("BounceInOut", function(t) {
			var e = .5 > t;
			return t = e ? 1 - 2 * t : 2 * t - 1, t = 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375, e ? .5 * (1 - t) : .5 * t + .5
		})), u("Circ", l("CircOut", function(t) {
			return Math.sqrt(1 - (t -= 1) * t)
		}), l("CircIn", function(t) {
			return -(Math.sqrt(1 - t * t) - 1)
		}), l("CircInOut", function(t) {
			return 1 > (t *= 2) ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
		})), s = function(e, i, s) {
			var r = h("easing." + e, function(t, e) {
					this._p1 = t >= 1 ? t : 1, this._p2 = (e || s) / (1 > t ? t : 1), this._p3 = this._p2 / a * (Math.asin(1 / this._p1) || 0), this._p2 = a / this._p2
				}, !0),
				n = r.prototype = new t;
			return n.constructor = r, n.getRatio = i, n.config = function(t, e) {
				return new r(t, e)
			}, r
		}, u("Elastic", s("ElasticOut", function(t) {
			return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * this._p2) + 1
		}, .3), s("ElasticIn", function(t) {
			return -(this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2))
		}, .3), s("ElasticInOut", function(t) {
			return 1 > (t *= 2) ? -.5 * this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) : .5 * this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) + 1
		}, .45)), u("Expo", l("ExpoOut", function(t) {
			return 1 - Math.pow(2, -10 * t)
		}), l("ExpoIn", function(t) {
			return Math.pow(2, 10 * (t - 1)) - .001
		}), l("ExpoInOut", function(t) {
			return 1 > (t *= 2) ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
		})), u("Sine", l("SineOut", function(t) {
			return Math.sin(t * o)
		}), l("SineIn", function(t) {
			return -Math.cos(t * o) + 1
		}), l("SineInOut", function(t) {
			return -.5 * (Math.cos(Math.PI * t) - 1)
		})), h("easing.EaseLookup", {
			find: function(e) {
				return t.map[e]
			}
		}, !0), _(r.SlowMo, "SlowMo", "ease,"), _(i, "RoughEase", "ease,"), _(e, "SteppedEase", "ease,"), f
	}, !0)
}), _gsScope._gsDefine && _gsScope._gsQueue.pop()();
/*!
 * VERSION: 0.9.8
 * DATE: 2015-03-12
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * ThrowPropsPlugin is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
		"use strict";
		_gsScope._gsDefine("plugins.ThrowPropsPlugin", ["plugins.TweenPlugin", "TweenLite", "easing.Ease", "utils.VelocityTracker"], function(t, e, i, r) {
			var s, n, o, a, l = function() {
					t.call(this, "throwProps"), this._overwriteProps.length = 0
				},
				h = 999999999999999,
				u = 1e-10,
				p = _gsScope._gsDefine.globals,
				f = !1,
				c = {
					x: 1,
					y: 1,
					z: 2,
					scale: 1,
					scaleX: 1,
					scaleY: 1,
					rotation: 1,
					rotationZ: 1,
					rotationX: 2,
					rotationY: 2,
					skewX: 1,
					skewY: 1,
					xPercent: 1,
					yPercent: 1
				},
				_ = function(t, e, i, r) {
					for (var s, n, o = e.length, a = 0, l = h; --o > -1;) s = e[o], n = s - t, 0 > n && (n = -n), l > n && s >= r && i >= s && (a = o, l = n);
					return e[a]
				},
				d = function(t, e, i, r) {
					if ("auto" === t.end) return t;
					i = isNaN(i) ? h : i, r = isNaN(r) ? -h : r;
					var s = "function" == typeof t.end ? t.end(e) : t.end instanceof Array ? _(e, t.end, i, r) : Number(t.end);
					return s > i ? s = i : r > s && (s = r), {
						max: s,
						min: s,
						unitFactor: t.unitFactor
					}
				},
				g = function(t, e, i) {
					for (var r in e) void 0 === t[r] && r !== i && (t[r] = e[r]);
					return t
				},
				m = l.calculateChange = function(t, r, s, n) {
					null == n && (n = .05);
					var o = r instanceof i ? r : r ? new i(r) : e.defaultEase;
					return s * n * t / o.getRatio(n)
				},
				v = l.calculateDuration = function(t, r, s, n, o) {
					o = o || .05;
					var a = n instanceof i ? n : n ? new i(n) : e.defaultEase;
					return Math.abs((r - t) * a.getRatio(o) / s / o)
				},
				y = l.calculateTweenDuration = function(t, s, n, o, a, h) {
					if ("string" == typeof t && (t = e.selector(t)), !t) return 0;
					null == n && (n = 10), null == o && (o = .2), null == a && (a = 1), t.length && (t = t[0] || t);
					var p, c, _, y, x, w, T, b, P, S, k = 0,
						C = 9999999999,
						O = s.throwProps || s,
						R = s.ease instanceof i ? s.ease : s.ease ? new i(s.ease) : e.defaultEase,
						A = isNaN(O.checkpoint) ? .05 : Number(O.checkpoint),
						M = isNaN(O.resistance) ? l.defaultResistance : Number(O.resistance);
					for (p in O) "resistance" !== p && "checkpoint" !== p && "preventOvershoot" !== p && (c = O[p], "object" != typeof c && (P = P || r.getByTarget(t), P && P.isTrackingProp(p) ? c = "number" == typeof c ? {
						velocity: c
					} : {
						velocity: P.getVelocity(p)
					} : (y = Number(c) || 0, _ = y * M > 0 ? y / M : y / -M)), "object" == typeof c && (void 0 !== c.velocity && "number" == typeof c.velocity ? y = Number(c.velocity) || 0 : (P = P || r.getByTarget(t), y = P && P.isTrackingProp(p) ? P.getVelocity(p) : 0), x = isNaN(c.resistance) ? M : Number(c.resistance), _ = y * x > 0 ? y / x : y / -x, w = "function" == typeof t[p] ? t[p.indexOf("set") || "function" != typeof t["get" + p.substr(3)] ? p : "get" + p.substr(3)]() : t[p] || 0, T = w + m(y, R, _, A), void 0 !== c.end && (c = d(c, T, c.max, c.min), (h || f) && (O[p] = g(c, O[p], "end"))), void 0 !== c.max && T > Number(c.max) + u ? (S = c.unitFactor || l.defaultUnitFactors[p] || 1, b = w > c.max && c.min !== c.max || y * S > -15 && 45 > y * S ? o + .1 * (n - o) : v(w, c.max, y, R, A), C > b + a && (C = b + a)) : void 0 !== c.min && Number(c.min) - u > T && (S = c.unitFactor || l.defaultUnitFactors[p] || 1, b = c.min > w && c.min !== c.max || y * S > -45 && 15 > y * S ? o + .1 * (n - o) : v(w, c.min, y, R, A), C > b + a && (C = b + a)), b > k && (k = b)), _ > k && (k = _));
					return k > C && (k = C), k > n ? n : o > k ? o : k
				},
				x = l.prototype = new t("throwProps");
			return x.constructor = l, l.version = "0.9.8", l.API = 2, l._autoCSS = !0, l.defaultResistance = 100, l.defaultUnitFactors = {
				time: 1e3,
				totalTime: 1e3
			}, l.track = function(t, e, i) {
				return r.track(t, e, i)
			}, l.untrack = function(t, e) {
				r.untrack(t, e)
			}, l.isTracking = function(t, e) {
				return r.isTracking(t, e)
			}, l.getVelocity = function(t, e) {
				var i = r.getByTarget(t);
				return i ? i.getVelocity(e) : 0 / 0
			}, l._cssRegister = function() {
				var t = p.com.greensock.plugins.CSSPlugin;
				if (t) {
					var e = t._internals,
						i = e._parseToProxy,
						o = e._setPluginRatio,
						a = e.CSSPropTween;
					e._registerComplexSpecialProp("throwProps", {
						parser: function(t, e, h, u, p, f) {
							f = new l;
							var _, d, g, m, v, y = {},
								x = {},
								w = {},
								T = {},
								b = {},
								P = {};
							n = {};
							for (g in e) "resistance" !== g && "preventOvershoot" !== g && (d = e[g], "object" == typeof d ? (void 0 !== d.velocity && "number" == typeof d.velocity ? y[g] = Number(d.velocity) || 0 : (v = v || r.getByTarget(t), y[g] = v && v.isTrackingProp(g) ? v.getVelocity(g) : 0), void 0 !== d.end && (T[g] = d.end), void 0 !== d.min && (x[g] = d.min), void 0 !== d.max && (w[g] = d.max), d.preventOvershoot && (P[g] = !0), void 0 !== d.resistance && (_ = !0, b[g] = d.resistance)) : "number" == typeof d ? y[g] = d : (v = v || r.getByTarget(t), y[g] = v && v.isTrackingProp(g) ? v.getVelocity(g) : d || 0), c[g] && u._enableTransforms(2 === c[g]));
							m = i(t, y, u, p, f), s = m.proxy, y = m.end;
							for (g in s) n[g] = {
								velocity: y[g],
								min: x[g],
								max: w[g],
								end: T[g],
								resistance: b[g],
								preventOvershoot: P[g]
							};
							return null != e.resistance && (n.resistance = e.resistance), e.preventOvershoot && (n.preventOvershoot = !0), p = new a(t, "throwProps", 0, 0, m.pt, 2), u._overwriteProps.pop(), p.plugin = f, p.setRatio = o, p.data = m, f._onInitTween(s, n, u._tween), p
						}
					})
				}
			}, l.to = function(t, i, r, l, h) {
				i.throwProps || (i = {
					throwProps: i
				}), 0 === h && (i.throwProps.preventOvershoot = !0), f = !0;
				var u = new e(t, 1, i);
				return u.render(0, !0, !0), u.vars.css ? (u.duration(y(s, {
					throwProps: n,
					ease: i.ease
				}, r, l, h)), u._delay && !u.vars.immediateRender ? u.invalidate() : o._onInitTween(s, a, u), f = !1, u) : (u.kill(), u = new e(t, y(t, i, r, l, h), i), f = !1, u)
			}, x._onInitTween = function(t, e, i) {
				this.target = t, this._props = [], o = this, a = e;
				var s, n, l, h, u, p, c, _, v, y = i._ease,
					x = isNaN(e.checkpoint) ? .05 : Number(e.checkpoint),
					w = i._duration,
					T = e.preventOvershoot,
					b = 0;
				for (s in e)
					if ("resistance" !== s && "checkpoint" !== s && "preventOvershoot" !== s) {
						if (n = e[s], "number" == typeof n) u = Number(n) || 0;
						else if ("object" != typeof n || isNaN(n.velocity)) {
							if (v = v || r.getByTarget(t), !v || !v.isTrackingProp(s)) throw "ERROR: No velocity was defined in the throwProps tween of " + t + " property: " + s;
							u = v.getVelocity(s)
						} else u = Number(n.velocity);
						p = m(u, y, w, x), _ = 0, h = "function" == typeof t[s], l = h ? t[s.indexOf("set") || "function" != typeof t["get" + s.substr(3)] ? s : "get" + s.substr(3)]() : t[s], "object" == typeof n && (c = l + p, void 0 !== n.end && (n = d(n, c, n.max, n.min), f && (e[s] = g(n, e[s], "end"))), void 0 !== n.max && c > Number(n.max) ? T || n.preventOvershoot ? p = n.max - l : _ = n.max - l - p : void 0 !== n.min && Number(n.min) > c && (T || n.preventOvershoot ? p = n.min - l : _ = n.min - l - p)), this._overwriteProps[b] = s, this._props[b++] = {
							p: s,
							s: l,
							c1: p,
							c2: _,
							f: h,
							r: !1
						}
					}
				return !0
			}, x._kill = function(e) {
				for (var i = this._props.length; --i > -1;) null != e[this._props[i].p] && this._props.splice(i, 1);
				return t.prototype._kill.call(this, e)
			}, x._roundProps = function(t, e) {
				for (var i = this._props, r = i.length; --r > -1;)(t[i[r]] || t.throwProps) && (i[r].r = e)
			}, x.setRatio = function(t) {
				for (var e, i, r = this._props.length; --r > -1;) e = this._props[r], i = e.s + e.c1 * t + e.c2 * t * t, e.r && (i = Math.round(i)), e.f ? this.target[e.p](i) : this.target[e.p] = i
			}, t.activate([l]), l
		}, !0), _gsScope._gsDefine("utils.VelocityTracker", ["TweenLite"], function(t) {
			var e, i, r, s, n = /([A-Z])/g,
				o = {},
				a = {
					x: 1,
					y: 1,
					z: 2,
					scale: 1,
					scaleX: 1,
					scaleY: 1,
					rotation: 1,
					rotationZ: 1,
					rotationX: 2,
					rotationY: 2,
					skewX: 1,
					skewY: 1,
					xPercent: 1,
					yPercent: 1
				},
				l = document.defaultView ? document.defaultView.getComputedStyle : function() {},
				h = function(t, e, i) {
					var r = (t._gsTransform || o)[e];
					return r || 0 === r ? r : (t.style[e] ? r = t.style[e] : (i = i || l(t, null)) ? r = i[e] || i.getPropertyValue(e) || i.getPropertyValue(e.replace(n, "-$1").toLowerCase()) : t.currentStyle && (r = t.currentStyle[e]), parseFloat(r) || 0)
				},
				u = t.ticker,
				p = function(t, e, i) {
					this.p = t, this.f = e, this.v1 = this.v2 = 0, this.t1 = this.t2 = u.time, this.css = !1, this.type = "", this._prev = null, i && (this._next = i, i._prev = this)
				},
				f = function() {
					var t, i, n = e,
						o = u.time;
					if (o - r >= .03)
						for (s = r, r = o; n;) {
							for (i = n._firstVP; i;) t = i.css ? h(n.target, i.p) : i.f ? n.target[i.p]() : n.target[i.p], (t !== i.v1 || o - i.t1 > .15) && (i.v2 = i.v1, i.v1 = t, i.t2 = i.t1, i.t1 = o), i = i._next;
							n = n._next
						}
				},
				c = function(t) {
					this._lookup = {}, this.target = t, this.elem = t.style && t.nodeType ? !0 : !1, i || (u.addEventListener("tick", f, null, !1, -100), r = s = u.time, i = !0), e && (this._next = e, e._prev = this), e = this
				},
				_ = c.getByTarget = function(t) {
					for (var i = e; i;) {
						if (i.target === t) return i;
						i = i._next
					}
				},
				d = c.prototype;
			return d.addProp = function(e, i) {
				if (!this._lookup[e]) {
					var r = this.target,
						s = "function" == typeof r[e],
						n = s ? this._altProp(e) : e,
						o = this._firstVP;
					this._firstVP = this._lookup[e] = this._lookup[n] = o = new p(n !== e && 0 === e.indexOf("set") ? n : e, s, o), o.css = this.elem && (void 0 !== this.target.style[o.p] || a[o.p]), o.css && a[o.p] && !r._gsTransform && t.set(r, {
						x: "+=0",
						overwrite: !1
					}), o.type = i || o.css && 0 === e.indexOf("rotation") ? "deg" : "", o.v1 = o.v2 = o.css ? h(r, o.p) : s ? r[o.p]() : r[o.p]
				}
			}, d.removeProp = function(t) {
				var e = this._lookup[t];
				e && (e._prev ? e._prev._next = e._next : e === this._firstVP && (this._firstVP = e._next), e._next && (e._next._prev = e._prev), this._lookup[t] = 0, e.f && (this._lookup[this._altProp(t)] = 0))
			}, d.isTrackingProp = function(t) {
				return this._lookup[t] instanceof p
			}, d.getVelocity = function(t) {
				var e, i, r, s = this._lookup[t],
					n = this.target;
				if (!s) throw "The velocity of " + t + " is not being tracked.";
				return e = s.css ? h(n, s.p) : s.f ? n[s.p]() : n[s.p], i = e - s.v2, ("rad" === s.type || "deg" === s.type) && (r = "rad" === s.type ? 2 * Math.PI : 360, i %= r, i !== i % (r / 2) && (i = 0 > i ? i + r : i - r)), i / (u.time - s.t2)
			}, d._altProp = function(t) {
				var e = t.substr(0, 3),
					i = ("get" === e ? "set" : "set" === e ? "get" : e) + t.substr(3);
				return "function" == typeof this.target[i] ? i : t
			}, c.getByTarget = function(i) {
				var r = e;
				for ("string" == typeof i && (i = t.selector(i)), i.length && i !== window && i[0] && i[0].style && !i.nodeType && (i = i[0]); r;) {
					if (r.target === i) return r;
					r = r._next
				}
			}, c.track = function(t, e, i) {
				var r = _(t),
					s = e.split(","),
					n = s.length;
				for (i = (i || "").split(","), r || (r = new c(t)); --n > -1;) r.addProp(s[n], i[n] || i[0]);
				return r
			}, c.untrack = function(t, i) {
				var r = _(t),
					s = (i || "").split(","),
					n = s.length;
				if (r) {
					for (; --n > -1;) r.removeProp(s[n]);
					r._firstVP && i || (r._prev ? r._prev._next = r._next : r === e && (e = r._next), r._next && (r._next._prev = r._prev))
				}
			}, c.isTracking = function(t, e) {
				var i = _(t);
				return i ? !e && i._firstVP ? !0 : i.isTrackingProp(e) : !1
			}, c
		}, !0)
	}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
	function(t) {
		"use strict";
		var e = function() {
			return (_gsScope.GreenSockGlobals || _gsScope)[t]
		};
		"function" == typeof define && define.amd ? define(["TweenLite"], e) : "undefined" != typeof module && module.exports && (require("../TweenLite.js"), module.exports = e())
	}("ThrowPropsPlugin");
/*!
 * VERSION: 1.16.1
 * DATE: 2015-03-13
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
		"use strict";
		_gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(t, e, i) {
			var s = function(t) {
					e.call(this, t), this._labels = {}, this.autoRemoveChildren = this.vars.autoRemoveChildren === !0, this.smoothChildTiming = this.vars.smoothChildTiming === !0, this._sortChildren = !0, this._onUpdate = this.vars.onUpdate;
					var i, s, r = this.vars;
					for (s in r) i = r[s], h(i) && -1 !== i.join("").indexOf("{self}") && (r[s] = this._swapSelfInParams(i));
					h(r.tweens) && this.add(r.tweens, 0, r.align, r.stagger)
				},
				r = 1e-10,
				n = i._internals,
				a = s._internals = {},
				o = n.isSelector,
				h = n.isArray,
				l = n.lazyTweens,
				_ = n.lazyRender,
				u = [],
				p = _gsScope._gsDefine.globals,
				f = function(t) {
					var e, i = {};
					for (e in t) i[e] = t[e];
					return i
				},
				c = a.pauseCallback = function(t, e, i, s) {
					var n, a = t._timeline,
						o = a._totalTime,
						h = t._startTime,
						l = 0 > t._rawPrevTime || 0 === t._rawPrevTime && a._reversed,
						_ = l ? 0 : r,
						p = l ? r : 0;
					if (e || !this._forcingPlayhead) {
						for (a.pause(h), n = t._prev; n && n._startTime === h;) n._rawPrevTime = p, n = n._prev;
						for (n = t._next; n && n._startTime === h;) n._rawPrevTime = _, n = n._next;
						e && e.apply(s || a, i || u), (this._forcingPlayhead || !a._paused) && a.seek(o)
					}
				},
				m = function(t) {
					var e, i = [],
						s = t.length;
					for (e = 0; e !== s; i.push(t[e++]));
					return i
				},
				d = s.prototype = new e;
			return s.version = "1.16.1", d.constructor = s, d.kill()._gc = d._forcingPlayhead = !1, d.to = function(t, e, s, r) {
				var n = s.repeat && p.TweenMax || i;
				return e ? this.add(new n(t, e, s), r) : this.set(t, s, r)
			}, d.from = function(t, e, s, r) {
				return this.add((s.repeat && p.TweenMax || i).from(t, e, s), r)
			}, d.fromTo = function(t, e, s, r, n) {
				var a = r.repeat && p.TweenMax || i;
				return e ? this.add(a.fromTo(t, e, s, r), n) : this.set(t, r, n)
			}, d.staggerTo = function(t, e, r, n, a, h, l, _) {
				var u, p = new s({
					onComplete: h,
					onCompleteParams: l,
					onCompleteScope: _,
					smoothChildTiming: this.smoothChildTiming
				});
				for ("string" == typeof t && (t = i.selector(t) || t), t = t || [], o(t) && (t = m(t)), n = n || 0, 0 > n && (t = m(t), t.reverse(), n *= -1), u = 0; t.length > u; u++) r.startAt && (r.startAt = f(r.startAt)), p.to(t[u], e, f(r), u * n);
				return this.add(p, a)
			}, d.staggerFrom = function(t, e, i, s, r, n, a, o) {
				return i.immediateRender = 0 != i.immediateRender, i.runBackwards = !0, this.staggerTo(t, e, i, s, r, n, a, o)
			}, d.staggerFromTo = function(t, e, i, s, r, n, a, o, h) {
				return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, this.staggerTo(t, e, s, r, n, a, o, h)
			}, d.call = function(t, e, s, r) {
				return this.add(i.delayedCall(0, t, e, s), r)
			}, d.set = function(t, e, s) {
				return s = this._parseTimeOrLabel(s, 0, !0), null == e.immediateRender && (e.immediateRender = s === this._time && !this._paused), this.add(new i(t, 0, e), s)
			}, s.exportRoot = function(t, e) {
				t = t || {}, null == t.smoothChildTiming && (t.smoothChildTiming = !0);
				var r, n, a = new s(t),
					o = a._timeline;
				for (null == e && (e = !0), o._remove(a, !0), a._startTime = 0, a._rawPrevTime = a._time = a._totalTime = o._time, r = o._first; r;) n = r._next, e && r instanceof i && r.target === r.vars.onComplete || a.add(r, r._startTime - r._delay), r = n;
				return o.add(a, 0), a
			}, d.add = function(r, n, a, o) {
				var l, _, u, p, f, c;
				if ("number" != typeof n && (n = this._parseTimeOrLabel(n, 0, !0, r)), !(r instanceof t)) {
					if (r instanceof Array || r && r.push && h(r)) {
						for (a = a || "normal", o = o || 0, l = n, _ = r.length, u = 0; _ > u; u++) h(p = r[u]) && (p = new s({
							tweens: p
						})), this.add(p, l), "string" != typeof p && "function" != typeof p && ("sequence" === a ? l = p._startTime + p.totalDuration() / p._timeScale : "start" === a && (p._startTime -= p.delay())), l += o;
						return this._uncache(!0)
					}
					if ("string" == typeof r) return this.addLabel(r, n);
					if ("function" != typeof r) throw "Cannot add " + r + " into the timeline; it is not a tween, timeline, function, or string.";
					r = i.delayedCall(0, r)
				}
				if (e.prototype.add.call(this, r, n), (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())
					for (f = this, c = f.rawTime() > r._startTime; f._timeline;) c && f._timeline.smoothChildTiming ? f.totalTime(f._totalTime, !0) : f._gc && f._enabled(!0, !1), f = f._timeline;
				return this
			}, d.remove = function(e) {
				if (e instanceof t) return this._remove(e, !1);
				if (e instanceof Array || e && e.push && h(e)) {
					for (var i = e.length; --i > -1;) this.remove(e[i]);
					return this
				}
				return "string" == typeof e ? this.removeLabel(e) : this.kill(null, e)
			}, d._remove = function(t, i) {
				e.prototype._remove.call(this, t, i);
				var s = this._last;
				return s ? this._time > s._startTime + s._totalDuration / s._timeScale && (this._time = this.duration(), this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this
			}, d.append = function(t, e) {
				return this.add(t, this._parseTimeOrLabel(null, e, !0, t))
			}, d.insert = d.insertMultiple = function(t, e, i, s) {
				return this.add(t, e || 0, i, s)
			}, d.appendMultiple = function(t, e, i, s) {
				return this.add(t, this._parseTimeOrLabel(null, e, !0, t), i, s)
			}, d.addLabel = function(t, e) {
				return this._labels[t] = this._parseTimeOrLabel(e), this
			}, d.addPause = function(t, e, s, r) {
				var n = i.delayedCall(0, c, ["{self}", e, s, r], this);
				return n.data = "isPause", this.add(n, t)
			}, d.removeLabel = function(t) {
				return delete this._labels[t], this
			}, d.getLabelTime = function(t) {
				return null != this._labels[t] ? this._labels[t] : -1
			}, d._parseTimeOrLabel = function(e, i, s, r) {
				var n;
				if (r instanceof t && r.timeline === this) this.remove(r);
				else if (r && (r instanceof Array || r.push && h(r)))
					for (n = r.length; --n > -1;) r[n] instanceof t && r[n].timeline === this && this.remove(r[n]);
				if ("string" == typeof i) return this._parseTimeOrLabel(i, s && "number" == typeof e && null == this._labels[i] ? e - this.duration() : 0, s);
				if (i = i || 0, "string" != typeof e || !isNaN(e) && null == this._labels[e]) null == e && (e = this.duration());
				else {
					if (n = e.indexOf("="), -1 === n) return null == this._labels[e] ? s ? this._labels[e] = this.duration() + i : i : this._labels[e] + i;
					i = parseInt(e.charAt(n - 1) + "1", 10) * Number(e.substr(n + 1)), e = n > 1 ? this._parseTimeOrLabel(e.substr(0, n - 1), 0, s) : this.duration()
				}
				return Number(e) + i
			}, d.seek = function(t, e) {
				return this.totalTime("number" == typeof t ? t : this._parseTimeOrLabel(t), e !== !1)
			}, d.stop = function() {
				return this.paused(!0)
			}, d.gotoAndPlay = function(t, e) {
				return this.play(t, e)
			}, d.gotoAndStop = function(t, e) {
				return this.pause(t, e)
			}, d.render = function(t, e, i) {
				this._gc && this._enabled(!0, !1);
				var s, n, a, o, h, p = this._dirty ? this.totalDuration() : this._totalDuration,
					f = this._time,
					c = this._startTime,
					m = this._timeScale,
					d = this._paused;
				if (t >= p) this._totalTime = this._time = p, this._reversed || this._hasPausedChild() || (n = !0, o = "onComplete", h = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 === t || 0 > this._rawPrevTime || this._rawPrevTime === r) && this._rawPrevTime !== t && this._first && (h = !0, this._rawPrevTime > r && (o = "onReverseComplete"))), this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r, t = p + 1e-4;
				else if (1e-7 > t)
					if (this._totalTime = this._time = 0, (0 !== f || 0 === this._duration && this._rawPrevTime !== r && (this._rawPrevTime > 0 || 0 > t && this._rawPrevTime >= 0)) && (o = "onReverseComplete", n = this._reversed), 0 > t) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (h = n = !0, o = "onReverseComplete") : this._rawPrevTime >= 0 && this._first && (h = !0), this._rawPrevTime = t;
					else {
						if (this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r, 0 === t && n)
							for (s = this._first; s && 0 === s._startTime;) s._duration || (n = !1), s = s._next;
						t = 0, this._initted || (h = !0)
					}
				else this._totalTime = this._time = this._rawPrevTime = t;
				if (this._time !== f && this._first || i || h) {
					if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== f && t > 0 && (this._active = !0), 0 === f && this.vars.onStart && 0 !== this._time && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || u)), this._time >= f)
						for (s = this._first; s && (a = s._next, !this._paused || d);)(s._active || s._startTime <= this._time && !s._paused && !s._gc) && (s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = a;
					else
						for (s = this._last; s && (a = s._prev, !this._paused || d);)(s._active || f >= s._startTime && !s._paused && !s._gc) && (s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = a;
					this._onUpdate && (e || (l.length && _(), this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || u))), o && (this._gc || (c === this._startTime || m !== this._timeScale) && (0 === this._time || p >= this.totalDuration()) && (n && (l.length && _(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[o] && this.vars[o].apply(this.vars[o + "Scope"] || this, this.vars[o + "Params"] || u)))
				}
			}, d._hasPausedChild = function() {
				for (var t = this._first; t;) {
					if (t._paused || t instanceof s && t._hasPausedChild()) return !0;
					t = t._next
				}
				return !1
			}, d.getChildren = function(t, e, s, r) {
				r = r || -9999999999;
				for (var n = [], a = this._first, o = 0; a;) r > a._startTime || (a instanceof i ? e !== !1 && (n[o++] = a) : (s !== !1 && (n[o++] = a), t !== !1 && (n = n.concat(a.getChildren(!0, e, s)), o = n.length))), a = a._next;
				return n
			}, d.getTweensOf = function(t, e) {
				var s, r, n = this._gc,
					a = [],
					o = 0;
				for (n && this._enabled(!0, !0), s = i.getTweensOf(t), r = s.length; --r > -1;)(s[r].timeline === this || e && this._contains(s[r])) && (a[o++] = s[r]);
				return n && this._enabled(!1, !0), a
			}, d.recent = function() {
				return this._recent
			}, d._contains = function(t) {
				for (var e = t.timeline; e;) {
					if (e === this) return !0;
					e = e.timeline
				}
				return !1
			}, d.shiftChildren = function(t, e, i) {
				i = i || 0;
				for (var s, r = this._first, n = this._labels; r;) r._startTime >= i && (r._startTime += t), r = r._next;
				if (e)
					for (s in n) n[s] >= i && (n[s] += t);
				return this._uncache(!0)
			}, d._kill = function(t, e) {
				if (!t && !e) return this._enabled(!1, !1);
				for (var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1), s = i.length, r = !1; --s > -1;) i[s]._kill(t, e) && (r = !0);
				return r
			}, d.clear = function(t) {
				var e = this.getChildren(!1, !0, !0),
					i = e.length;
				for (this._time = this._totalTime = 0; --i > -1;) e[i]._enabled(!1, !1);
				return t !== !1 && (this._labels = {}), this._uncache(!0)
			}, d.invalidate = function() {
				for (var e = this._first; e;) e.invalidate(), e = e._next;
				return t.prototype.invalidate.call(this)
			}, d._enabled = function(t, i) {
				if (t === this._gc)
					for (var s = this._first; s;) s._enabled(t, !0), s = s._next;
				return e.prototype._enabled.call(this, t, i)
			}, d.totalTime = function() {
				this._forcingPlayhead = !0;
				var e = t.prototype.totalTime.apply(this, arguments);
				return this._forcingPlayhead = !1, e
			}, d.duration = function(t) {
				return arguments.length ? (0 !== this.duration() && 0 !== t && this.timeScale(this._duration / t), this) : (this._dirty && this.totalDuration(), this._duration)
			}, d.totalDuration = function(t) {
				if (!arguments.length) {
					if (this._dirty) {
						for (var e, i, s = 0, r = this._last, n = 999999999999; r;) e = r._prev, r._dirty && r.totalDuration(), r._startTime > n && this._sortChildren && !r._paused ? this.add(r, r._startTime - r._delay) : n = r._startTime, 0 > r._startTime && !r._paused && (s -= r._startTime, this._timeline.smoothChildTiming && (this._startTime += r._startTime / this._timeScale), this.shiftChildren(-r._startTime, !1, -9999999999), n = 0), i = r._startTime + r._totalDuration / r._timeScale, i > s && (s = i), r = e;
						this._duration = this._totalDuration = s, this._dirty = !1
					}
					return this._totalDuration
				}
				return 0 !== this.totalDuration() && 0 !== t && this.timeScale(this._totalDuration / t), this
			}, d.paused = function(e) {
				if (!e)
					for (var i = this._first, s = this._time; i;) i._startTime === s && "isPause" === i.data && (i._rawPrevTime = 0), i = i._next;
				return t.prototype.paused.apply(this, arguments)
			}, d.usesFrames = function() {
				for (var e = this._timeline; e._timeline;) e = e._timeline;
				return e === t._rootFramesTimeline
			}, d.rawTime = function() {
				return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale
			}, s
		}, !0)
	}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
	function(t) {
		"use strict";
		var e = function() {
			return (_gsScope.GreenSockGlobals || _gsScope)[t]
		};
		"function" == typeof define && define.amd ? define(["TweenLite"], e) : "undefined" != typeof module && module.exports && (require("./TweenLite.js"), module.exports = e())
	}("TimelineLite");
/*!
 * VERSION: 1.16.1
 * DATE: 2015-03-13
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(function(t, e) {
	"use strict";
	var i = t.GreenSockGlobals = t.GreenSockGlobals || t;
	if (!i.TweenLite) {
		var s, r, n, a, o, l = function(t) {
				var e, s = t.split("."),
					r = i;
				for (e = 0; s.length > e; e++) r[s[e]] = r = r[s[e]] || {};
				return r
			},
			h = l("com.greensock"),
			_ = 1e-10,
			u = function(t) {
				var e, i = [],
					s = t.length;
				for (e = 0; e !== s; i.push(t[e++]));
				return i
			},
			m = function() {},
			f = function() {
				var t = Object.prototype.toString,
					e = t.call([]);
				return function(i) {
					return null != i && (i instanceof Array || "object" == typeof i && !!i.push && t.call(i) === e)
				}
			}(),
			c = {},
			p = function(s, r, n, a) {
				this.sc = c[s] ? c[s].sc : [], c[s] = this, this.gsClass = null, this.func = n;
				var o = [];
				this.check = function(h) {
					for (var _, u, m, f, d = r.length, v = d; --d > -1;)(_ = c[r[d]] || new p(r[d], [])).gsClass ? (o[d] = _.gsClass, v--) : h && _.sc.push(this);
					if (0 === v && n)
						for (u = ("com.greensock." + s).split("."), m = u.pop(), f = l(u.join("."))[m] = this.gsClass = n.apply(n, o), a && (i[m] = f, "function" == typeof define && define.amd ? define((t.GreenSockAMDPath ? t.GreenSockAMDPath + "/" : "") + s.split(".").pop(), [], function() {
								return f
							}) : s === e && "undefined" != typeof module && module.exports && (module.exports = f)), d = 0; this.sc.length > d; d++) this.sc[d].check()
				}, this.check(!0)
			},
			d = t._gsDefine = function(t, e, i, s) {
				return new p(t, e, i, s)
			},
			v = h._class = function(t, e, i) {
				return e = e || function() {}, d(t, [], function() {
					return e
				}, i), e
			};
		d.globals = i;
		var g = [0, 0, 1, 1],
			T = [],
			y = v("easing.Ease", function(t, e, i, s) {
				this._func = t, this._type = i || 0, this._power = s || 0, this._params = e ? g.concat(e) : g
			}, !0),
			w = y.map = {},
			P = y.register = function(t, e, i, s) {
				for (var r, n, a, o, l = e.split(","), _ = l.length, u = (i || "easeIn,easeOut,easeInOut").split(","); --_ > -1;)
					for (n = l[_], r = s ? v("easing." + n, null, !0) : h.easing[n] || {}, a = u.length; --a > -1;) o = u[a], w[n + "." + o] = w[o + n] = r[o] = t.getRatio ? t : t[o] || new t
			};
		for (n = y.prototype, n._calcEnd = !1, n.getRatio = function(t) {
				if (this._func) return this._params[0] = t, this._func.apply(null, this._params);
				var e = this._type,
					i = this._power,
					s = 1 === e ? 1 - t : 2 === e ? t : .5 > t ? 2 * t : 2 * (1 - t);
				return 1 === i ? s *= s : 2 === i ? s *= s * s : 3 === i ? s *= s * s * s : 4 === i && (s *= s * s * s * s), 1 === e ? 1 - s : 2 === e ? s : .5 > t ? s / 2 : 1 - s / 2
			}, s = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], r = s.length; --r > -1;) n = s[r] + ",Power" + r, P(new y(null, null, 1, r), n, "easeOut", !0), P(new y(null, null, 2, r), n, "easeIn" + (0 === r ? ",easeNone" : "")), P(new y(null, null, 3, r), n, "easeInOut");
		w.linear = h.easing.Linear.easeIn, w.swing = h.easing.Quad.easeInOut;
		var b = v("events.EventDispatcher", function(t) {
			this._listeners = {}, this._eventTarget = t || this
		});
		n = b.prototype, n.addEventListener = function(t, e, i, s, r) {
			r = r || 0;
			var n, l, h = this._listeners[t],
				_ = 0;
			for (null == h && (this._listeners[t] = h = []), l = h.length; --l > -1;) n = h[l], n.c === e && n.s === i ? h.splice(l, 1) : 0 === _ && r > n.pr && (_ = l + 1);
			h.splice(_, 0, {
				c: e,
				s: i,
				up: s,
				pr: r
			}), this !== a || o || a.wake()
		}, n.removeEventListener = function(t, e) {
			var i, s = this._listeners[t];
			if (s)
				for (i = s.length; --i > -1;)
					if (s[i].c === e) return s.splice(i, 1), void 0
		}, n.dispatchEvent = function(t) {
			var e, i, s, r = this._listeners[t];
			if (r)
				for (e = r.length, i = this._eventTarget; --e > -1;) s = r[e], s && (s.up ? s.c.call(s.s || i, {
					type: t,
					target: i
				}) : s.c.call(s.s || i))
		};
		var k = t.requestAnimationFrame,
			S = t.cancelAnimationFrame,
			A = Date.now || function() {
				return (new Date).getTime()
			},
			x = A();
		for (s = ["ms", "moz", "webkit", "o"], r = s.length; --r > -1 && !k;) k = t[s[r] + "RequestAnimationFrame"], S = t[s[r] + "CancelAnimationFrame"] || t[s[r] + "CancelRequestAnimationFrame"];
		v("Ticker", function(t, e) {
			var i, s, r, n, l, h = this,
				u = A(),
				f = e !== !1 && k,
				c = 500,
				p = 33,
				d = "tick",
				v = function(t) {
					var e, a, o = A() - x;
					o > c && (u += o - p), x += o, h.time = (x - u) / 1e3, e = h.time - l, (!i || e > 0 || t === !0) && (h.frame++, l += e + (e >= n ? .004 : n - e), a = !0), t !== !0 && (r = s(v)), a && h.dispatchEvent(d)
				};
			b.call(h), h.time = h.frame = 0, h.tick = function() {
				v(!0)
			}, h.lagSmoothing = function(t, e) {
				c = t || 1 / _, p = Math.min(e, c, 0)
			}, h.sleep = function() {
				null != r && (f && S ? S(r) : clearTimeout(r), s = m, r = null, h === a && (o = !1))
			}, h.wake = function() {
				null !== r ? h.sleep() : h.frame > 10 && (x = A() - c + 5), s = 0 === i ? m : f && k ? k : function(t) {
					return setTimeout(t, 0 | 1e3 * (l - h.time) + 1)
				}, h === a && (o = !0), v(2)
			}, h.fps = function(t) {
				return arguments.length ? (i = t, n = 1 / (i || 60), l = this.time + n, h.wake(), void 0) : i
			}, h.useRAF = function(t) {
				return arguments.length ? (h.sleep(), f = t, h.fps(i), void 0) : f
			}, h.fps(t), setTimeout(function() {
				f && 5 > h.frame && h.useRAF(!1)
			}, 1500)
		}), n = h.Ticker.prototype = new h.events.EventDispatcher, n.constructor = h.Ticker;
		var R = v("core.Animation", function(t, e) {
			if (this.vars = e = e || {}, this._duration = this._totalDuration = t || 0, this._delay = Number(e.delay) || 0, this._timeScale = 1, this._active = e.immediateRender === !0, this.data = e.data, this._reversed = e.reversed === !0, B) {
				o || a.wake();
				var i = this.vars.useFrames ? q : B;
				i.add(this, i._time), this.vars.paused && this.paused(!0)
			}
		});
		a = R.ticker = new h.Ticker, n = R.prototype, n._dirty = n._gc = n._initted = n._paused = !1, n._totalTime = n._time = 0, n._rawPrevTime = -1, n._next = n._last = n._onUpdate = n._timeline = n.timeline = null, n._paused = !1;
		var C = function() {
			o && A() - x > 2e3 && a.wake(), setTimeout(C, 2e3)
		};
		C(), n.play = function(t, e) {
			return null != t && this.seek(t, e), this.reversed(!1).paused(!1)
		}, n.pause = function(t, e) {
			return null != t && this.seek(t, e), this.paused(!0)
		}, n.resume = function(t, e) {
			return null != t && this.seek(t, e), this.paused(!1)
		}, n.seek = function(t, e) {
			return this.totalTime(Number(t), e !== !1)
		}, n.restart = function(t, e) {
			return this.reversed(!1).paused(!1).totalTime(t ? -this._delay : 0, e !== !1, !0)
		}, n.reverse = function(t, e) {
			return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1)
		}, n.render = function() {}, n.invalidate = function() {
			return this._time = this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(!0), this
		}, n.isActive = function() {
			var t, e = this._timeline,
				i = this._startTime;
			return !e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime()) >= i && i + this.totalDuration() / this._timeScale > t
		}, n._enabled = function(t, e) {
			return o || a.wake(), this._gc = !t, this._active = this.isActive(), e !== !0 && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)), !1
		}, n._kill = function() {
			return this._enabled(!1, !1)
		}, n.kill = function(t, e) {
			return this._kill(t, e), this
		}, n._uncache = function(t) {
			for (var e = t ? this : this.timeline; e;) e._dirty = !0, e = e.timeline;
			return this
		}, n._swapSelfInParams = function(t) {
			for (var e = t.length, i = t.concat(); --e > -1;) "{self}" === t[e] && (i[e] = this);
			return i
		}, n.eventCallback = function(t, e, i, s) {
			if ("on" === (t || "").substr(0, 2)) {
				var r = this.vars;
				if (1 === arguments.length) return r[t];
				null == e ? delete r[t] : (r[t] = e, r[t + "Params"] = f(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, r[t + "Scope"] = s), "onUpdate" === t && (this._onUpdate = e)
			}
			return this
		}, n.delay = function(t) {
			return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay), this._delay = t, this) : this._delay
		}, n.duration = function(t) {
			return arguments.length ? (this._duration = this._totalDuration = t, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0), this) : (this._dirty = !1, this._duration)
		}, n.totalDuration = function(t) {
			return this._dirty = !1, arguments.length ? this.duration(t) : this._totalDuration
		}, n.time = function(t, e) {
			return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(t > this._duration ? this._duration : t, e)) : this._time
		}, n.totalTime = function(t, e, i) {
			if (o || a.wake(), !arguments.length) return this._totalTime;
			if (this._timeline) {
				if (0 > t && !i && (t += this.totalDuration()), this._timeline.smoothChildTiming) {
					this._dirty && this.totalDuration();
					var s = this._totalDuration,
						r = this._timeline;
					if (t > s && !i && (t = s), this._startTime = (this._paused ? this._pauseTime : r._time) - (this._reversed ? s - t : t) / this._timeScale, r._dirty || this._uncache(!1), r._timeline)
						for (; r._timeline;) r._timeline._time !== (r._startTime + r._totalTime) / r._timeScale && r.totalTime(r._totalTime, !0), r = r._timeline
				}
				this._gc && this._enabled(!0, !1), (this._totalTime !== t || 0 === this._duration) && (this.render(t, e, !1), z.length && $())
			}
			return this
		}, n.progress = n.totalProgress = function(t, e) {
			return arguments.length ? this.totalTime(this.duration() * t, e) : this._time / this.duration()
		}, n.startTime = function(t) {
			return arguments.length ? (t !== this._startTime && (this._startTime = t, this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)), this) : this._startTime
		}, n.endTime = function(t) {
			return this._startTime + (0 != t ? this.totalDuration() : this.duration()) / this._timeScale
		}, n.timeScale = function(t) {
			if (!arguments.length) return this._timeScale;
			if (t = t || _, this._timeline && this._timeline.smoothChildTiming) {
				var e = this._pauseTime,
					i = e || 0 === e ? e : this._timeline.totalTime();
				this._startTime = i - (i - this._startTime) * this._timeScale / t
			}
			return this._timeScale = t, this._uncache(!1)
		}, n.reversed = function(t) {
			return arguments.length ? (t != this._reversed && (this._reversed = t, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
		}, n.paused = function(t) {
			if (!arguments.length) return this._paused;
			var e, i, s = this._timeline;
			return t != this._paused && s && (o || t || a.wake(), e = s.rawTime(), i = e - this._pauseTime, !t && s.smoothChildTiming && (this._startTime += i, this._uncache(!1)), this._pauseTime = t ? e : null, this._paused = t, this._active = this.isActive(), !t && 0 !== i && this._initted && this.duration() && this.render(s.smoothChildTiming ? this._totalTime : (e - this._startTime) / this._timeScale, !0, !0)), this._gc && !t && this._enabled(!0, !1), this
		};
		var D = v("core.SimpleTimeline", function(t) {
			R.call(this, 0, t), this.autoRemoveChildren = this.smoothChildTiming = !0
		});
		n = D.prototype = new R, n.constructor = D, n.kill()._gc = !1, n._first = n._last = n._recent = null, n._sortChildren = !1, n.add = n.insert = function(t, e) {
			var i, s;
			if (t._startTime = Number(e || 0) + t._delay, t._paused && this !== t._timeline && (t._pauseTime = t._startTime + (this.rawTime() - t._startTime) / t._timeScale), t.timeline && t.timeline._remove(t, !0), t.timeline = t._timeline = this, t._gc && t._enabled(!0, !0), i = this._last, this._sortChildren)
				for (s = t._startTime; i && i._startTime > s;) i = i._prev;
			return i ? (t._next = i._next, i._next = t) : (t._next = this._first, this._first = t), t._next ? t._next._prev = t : this._last = t, t._prev = i, this._recent = t, this._timeline && this._uncache(!0), this
		}, n._remove = function(t, e) {
			return t.timeline === this && (e || t._enabled(!1, !0), t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next), t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev), t._next = t._prev = t.timeline = null, t === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this
		}, n.render = function(t, e, i) {
			var s, r = this._first;
			for (this._totalTime = this._time = this._rawPrevTime = t; r;) s = r._next, (r._active || t >= r._startTime && !r._paused) && (r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (t - r._startTime) * r._timeScale, e, i) : r.render((t - r._startTime) * r._timeScale, e, i)), r = s
		}, n.rawTime = function() {
			return o || a.wake(), this._totalTime
		};
		var I = v("TweenLite", function(e, i, s) {
				if (R.call(this, i, s), this.render = I.prototype.render, null == e) throw "Cannot tween a null target.";
				this.target = e = "string" != typeof e ? e : I.selector(e) || e;
				var r, n, a, o = e.jquery || e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType),
					l = this.vars.overwrite;
				if (this._overwrite = l = null == l ? Q[I.defaultOverwrite] : "number" == typeof l ? l >> 0 : Q[l], (o || e instanceof Array || e.push && f(e)) && "number" != typeof e[0])
					for (this._targets = a = u(e), this._propLookup = [], this._siblings = [], r = 0; a.length > r; r++) n = a[r], n ? "string" != typeof n ? n.length && n !== t && n[0] && (n[0] === t || n[0].nodeType && n[0].style && !n.nodeType) ? (a.splice(r--, 1), this._targets = a = a.concat(u(n))) : (this._siblings[r] = K(n, this, !1), 1 === l && this._siblings[r].length > 1 && J(n, this, null, 1, this._siblings[r])) : (n = a[r--] = I.selector(n), "string" == typeof n && a.splice(r + 1, 1)) : a.splice(r--, 1);
				else this._propLookup = {}, this._siblings = K(e, this, !1), 1 === l && this._siblings.length > 1 && J(e, this, null, 1, this._siblings);
				(this.vars.immediateRender || 0 === i && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -_, this.render(-this._delay))
			}, !0),
			E = function(e) {
				return e && e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType)
			},
			O = function(t, e) {
				var i, s = {};
				for (i in t) G[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!U[i] || U[i] && U[i]._autoCSS) || (s[i] = t[i], delete t[i]);
				t.css = s
			};
		n = I.prototype = new R, n.constructor = I, n.kill()._gc = !1, n.ratio = 0, n._firstPT = n._targets = n._overwrittenProps = n._startAt = null, n._notifyPluginsOfEnabled = n._lazy = !1, I.version = "1.16.1", I.defaultEase = n._ease = new y(null, null, 1, 1), I.defaultOverwrite = "auto", I.ticker = a, I.autoSleep = 120, I.lagSmoothing = function(t, e) {
			a.lagSmoothing(t, e)
		}, I.selector = t.$ || t.jQuery || function(e) {
			var i = t.$ || t.jQuery;
			return i ? (I.selector = i, i(e)) : "undefined" == typeof document ? e : document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById("#" === e.charAt(0) ? e.substr(1) : e)
		};
		var z = [],
			L = {},
			N = I._internals = {
				isArray: f,
				isSelector: E,
				lazyTweens: z
			},
			U = I._plugins = {},
			F = N.tweenLookup = {},
			j = 0,
			G = N.reservedProps = {
				ease: 1,
				delay: 1,
				overwrite: 1,
				onComplete: 1,
				onCompleteParams: 1,
				onCompleteScope: 1,
				useFrames: 1,
				runBackwards: 1,
				startAt: 1,
				onUpdate: 1,
				onUpdateParams: 1,
				onUpdateScope: 1,
				onStart: 1,
				onStartParams: 1,
				onStartScope: 1,
				onReverseComplete: 1,
				onReverseCompleteParams: 1,
				onReverseCompleteScope: 1,
				onRepeat: 1,
				onRepeatParams: 1,
				onRepeatScope: 1,
				easeParams: 1,
				yoyo: 1,
				immediateRender: 1,
				repeat: 1,
				repeatDelay: 1,
				data: 1,
				paused: 1,
				reversed: 1,
				autoCSS: 1,
				lazy: 1,
				onOverwrite: 1
			},
			Q = {
				none: 0,
				all: 1,
				auto: 2,
				concurrent: 3,
				allOnStart: 4,
				preexisting: 5,
				"true": 1,
				"false": 0
			},
			q = R._rootFramesTimeline = new D,
			B = R._rootTimeline = new D,
			M = 30,
			$ = N.lazyRender = function() {
				var t, e = z.length;
				for (L = {}; --e > -1;) t = z[e], t && t._lazy !== !1 && (t.render(t._lazy[0], t._lazy[1], !0), t._lazy = !1);
				z.length = 0
			};
		B._startTime = a.time, q._startTime = a.frame, B._active = q._active = !0, setTimeout($, 1), R._updateRoot = I.render = function() {
			var t, e, i;
			if (z.length && $(), B.render((a.time - B._startTime) * B._timeScale, !1, !1), q.render((a.frame - q._startTime) * q._timeScale, !1, !1), z.length && $(), a.frame >= M) {
				M = a.frame + (parseInt(I.autoSleep, 10) || 120);
				for (i in F) {
					for (e = F[i].tweens, t = e.length; --t > -1;) e[t]._gc && e.splice(t, 1);
					0 === e.length && delete F[i]
				}
				if (i = B._first, (!i || i._paused) && I.autoSleep && !q._first && 1 === a._listeners.tick.length) {
					for (; i && i._paused;) i = i._next;
					i || a.sleep()
				}
			}
		}, a.addEventListener("tick", R._updateRoot);
		var K = function(t, e, i) {
				var s, r, n = t._gsTweenID;
				if (F[n || (t._gsTweenID = n = "t" + j++)] || (F[n] = {
						target: t,
						tweens: []
					}), e && (s = F[n].tweens, s[r = s.length] = e, i))
					for (; --r > -1;) s[r] === e && s.splice(r, 1);
				return F[n].tweens
			},
			H = function(t, e, i, s) {
				var r, n, a = t.vars.onOverwrite;
				return a && (r = a(t, e, i, s)), a = I.onOverwrite, a && (n = a(t, e, i, s)), r !== !1 && n !== !1
			},
			J = function(t, e, i, s, r) {
				var n, a, o, l;
				if (1 === s || s >= 4) {
					for (l = r.length, n = 0; l > n; n++)
						if ((o = r[n]) !== e) o._gc || H(o, e) && o._enabled(!1, !1) && (a = !0);
						else if (5 === s) break;
					return a
				}
				var h, u = e._startTime + _,
					m = [],
					f = 0,
					c = 0 === e._duration;
				for (n = r.length; --n > -1;)(o = r[n]) === e || o._gc || o._paused || (o._timeline !== e._timeline ? (h = h || V(e, 0, c), 0 === V(o, h, c) && (m[f++] = o)) : u >= o._startTime && o._startTime + o.totalDuration() / o._timeScale > u && ((c || !o._initted) && 2e-10 >= u - o._startTime || (m[f++] = o)));
				for (n = f; --n > -1;)
					if (o = m[n], 2 === s && o._kill(i, t, e) && (a = !0), 2 !== s || !o._firstPT && o._initted) {
						if (2 !== s && !H(o, e)) continue;
						o._enabled(!1, !1) && (a = !0)
					}
				return a
			},
			V = function(t, e, i) {
				for (var s = t._timeline, r = s._timeScale, n = t._startTime; s._timeline;) {
					if (n += s._startTime, r *= s._timeScale, s._paused) return -100;
					s = s._timeline
				}
				return n /= r, n > e ? n - e : i && n === e || !t._initted && 2 * _ > n - e ? _ : (n += t.totalDuration() / t._timeScale / r) > e + _ ? 0 : n - e - _
			};
		n._init = function() {
			var t, e, i, s, r, n = this.vars,
				a = this._overwrittenProps,
				o = this._duration,
				l = !!n.immediateRender,
				h = n.ease;
			if (n.startAt) {
				this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), r = {};
				for (s in n.startAt) r[s] = n.startAt[s];
				if (r.overwrite = !1, r.immediateRender = !0, r.lazy = l && n.lazy !== !1, r.startAt = r.delay = null, this._startAt = I.to(this.target, 0, r), l)
					if (this._time > 0) this._startAt = null;
					else if (0 !== o) return
			} else if (n.runBackwards && 0 !== o)
				if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null;
				else {
					0 !== this._time && (l = !1), i = {};
					for (s in n) G[s] && "autoCSS" !== s || (i[s] = n[s]);
					if (i.overwrite = 0, i.data = "isFromStart", i.lazy = l && n.lazy !== !1, i.immediateRender = l, this._startAt = I.to(this.target, 0, i), l) {
						if (0 === this._time) return
					} else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null)
				}
			if (this._ease = h = h ? h instanceof y ? h : "function" == typeof h ? new y(h, n.easeParams) : w[h] || I.defaultEase : I.defaultEase, n.easeParams instanceof Array && h.config && (this._ease = h.config.apply(h, n.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
				for (t = this._targets.length; --t > -1;) this._initProps(this._targets[t], this._propLookup[t] = {}, this._siblings[t], a ? a[t] : null) && (e = !0);
			else e = this._initProps(this.target, this._propLookup, this._siblings, a);
			if (e && I._onPluginEvent("_onInitAllProps", this), a && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), n.runBackwards)
				for (i = this._firstPT; i;) i.s += i.c, i.c = -i.c, i = i._next;
			this._onUpdate = n.onUpdate, this._initted = !0
		}, n._initProps = function(e, i, s, r) {
			var n, a, o, l, h, _;
			if (null == e) return !1;
			L[e._gsTweenID] && $(), this.vars.css || e.style && e !== t && e.nodeType && U.css && this.vars.autoCSS !== !1 && O(this.vars, e);
			for (n in this.vars) {
				if (_ = this.vars[n], G[n]) _ && (_ instanceof Array || _.push && f(_)) && -1 !== _.join("").indexOf("{self}") && (this.vars[n] = _ = this._swapSelfInParams(_, this));
				else if (U[n] && (l = new U[n])._onInitTween(e, this.vars[n], this)) {
					for (this._firstPT = h = {
							_next: this._firstPT,
							t: l,
							p: "setRatio",
							s: 0,
							c: 1,
							f: !0,
							n: n,
							pg: !0,
							pr: l._priority
						}, a = l._overwriteProps.length; --a > -1;) i[l._overwriteProps[a]] = this._firstPT;
					(l._priority || l._onInitAllProps) && (o = !0), (l._onDisable || l._onEnable) && (this._notifyPluginsOfEnabled = !0)
				} else this._firstPT = i[n] = h = {
					_next: this._firstPT,
					t: e,
					p: n,
					f: "function" == typeof e[n],
					n: n,
					pg: !1,
					pr: 0
				}, h.s = h.f ? e[n.indexOf("set") || "function" != typeof e["get" + n.substr(3)] ? n : "get" + n.substr(3)]() : parseFloat(e[n]), h.c = "string" == typeof _ && "=" === _.charAt(1) ? parseInt(_.charAt(0) + "1", 10) * Number(_.substr(2)) : Number(_) - h.s || 0;
				h && h._next && (h._next._prev = h)
			}
			return r && this._kill(r, e) ? this._initProps(e, i, s, r) : this._overwrite > 1 && this._firstPT && s.length > 1 && J(e, this, i, this._overwrite, s) ? (this._kill(i, e), this._initProps(e, i, s, r)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (L[e._gsTweenID] = !0), o)
		}, n.render = function(t, e, i) {
			var s, r, n, a, o = this._time,
				l = this._duration,
				h = this._rawPrevTime;
			if (t >= l) this._totalTime = this._time = l, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (s = !0, r = "onComplete", i = i || this._timeline.autoRemoveChildren), 0 === l && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (0 === t || 0 > h || h === _ && "isPause" !== this.data) && h !== t && (i = !0, h > _ && (r = "onReverseComplete")), this._rawPrevTime = a = !e || t || h === t ? t : _);
			else if (1e-7 > t) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== o || 0 === l && h > 0) && (r = "onReverseComplete", s = this._reversed), 0 > t && (this._active = !1, 0 === l && (this._initted || !this.vars.lazy || i) && (h >= 0 && (h !== _ || "isPause" !== this.data) && (i = !0), this._rawPrevTime = a = !e || t || h === t ? t : _)), this._initted || (i = !0);
			else if (this._totalTime = this._time = t, this._easeType) {
				var u = t / l,
					m = this._easeType,
					f = this._easePower;
				(1 === m || 3 === m && u >= .5) && (u = 1 - u), 3 === m && (u *= 2), 1 === f ? u *= u : 2 === f ? u *= u * u : 3 === f ? u *= u * u * u : 4 === f && (u *= u * u * u * u), this.ratio = 1 === m ? 1 - u : 2 === m ? u : .5 > t / l ? u / 2 : 1 - u / 2
			} else this.ratio = this._ease.getRatio(t / l);
			if (this._time !== o || i) {
				if (!this._initted) {
					if (this._init(), !this._initted || this._gc) return;
					if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = o, this._rawPrevTime = h, z.push(this), this._lazy = [t, e], void 0;
					this._time && !s ? this.ratio = this._ease.getRatio(this._time / l) : s && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
				}
				for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== o && t >= 0 && (this._active = !0), 0 === o && (this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : r || (r = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === l) && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || T))), n = this._firstPT; n;) n.f ? n.t[n.p](n.c * this.ratio + n.s) : n.t[n.p] = n.c * this.ratio + n.s, n = n._next;
				this._onUpdate && (0 > t && this._startAt && t !== -1e-4 && this._startAt.render(t, e, i), e || (this._time !== o || s) && this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || T)), r && (!this._gc || i) && (0 > t && this._startAt && !this._onUpdate && t !== -1e-4 && this._startAt.render(t, e, i), s && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[r] && this.vars[r].apply(this.vars[r + "Scope"] || this, this.vars[r + "Params"] || T), 0 === l && this._rawPrevTime === _ && a !== _ && (this._rawPrevTime = 0))
			}
		}, n._kill = function(t, e, i) {
			if ("all" === t && (t = null), null == t && (null == e || e === this.target)) return this._lazy = !1, this._enabled(!1, !1);
			e = "string" != typeof e ? e || this._targets || this.target : I.selector(e) || e;
			var s, r, n, a, o, l, h, _, u;
			if ((f(e) || E(e)) && "number" != typeof e[0])
				for (s = e.length; --s > -1;) this._kill(t, e[s]) && (l = !0);
			else {
				if (this._targets) {
					for (s = this._targets.length; --s > -1;)
						if (e === this._targets[s]) {
							o = this._propLookup[s] || {}, this._overwrittenProps = this._overwrittenProps || [], r = this._overwrittenProps[s] = t ? this._overwrittenProps[s] || {} : "all";
							break
						}
				} else {
					if (e !== this.target) return !1;
					o = this._propLookup, r = this._overwrittenProps = t ? this._overwrittenProps || {} : "all"
				}
				if (o) {
					if (h = t || o, _ = t !== r && "all" !== r && t !== o && ("object" != typeof t || !t._tempKill), i && (I.onOverwrite || this.vars.onOverwrite)) {
						for (n in h) o[n] && (u || (u = []), u.push(n));
						if (!H(this, i, e, u)) return !1
					}
					for (n in h)(a = o[n]) && (a.pg && a.t._kill(h) && (l = !0), a.pg && 0 !== a.t._overwriteProps.length || (a._prev ? a._prev._next = a._next : a === this._firstPT && (this._firstPT = a._next), a._next && (a._next._prev = a._prev), a._next = a._prev = null), delete o[n]), _ && (r[n] = 1);
					!this._firstPT && this._initted && this._enabled(!1, !1)
				}
			}
			return l
		}, n.invalidate = function() {
			return this._notifyPluginsOfEnabled && I._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], R.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -_, this.render(-this._delay)), this
		}, n._enabled = function(t, e) {
			if (o || a.wake(), t && this._gc) {
				var i, s = this._targets;
				if (s)
					for (i = s.length; --i > -1;) this._siblings[i] = K(s[i], this, !0);
				else this._siblings = K(this.target, this, !0)
			}
			return R.prototype._enabled.call(this, t, e), this._notifyPluginsOfEnabled && this._firstPT ? I._onPluginEvent(t ? "_onEnable" : "_onDisable", this) : !1
		}, I.to = function(t, e, i) {
			return new I(t, e, i)
		}, I.from = function(t, e, i) {
			return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new I(t, e, i)
		}, I.fromTo = function(t, e, i, s) {
			return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new I(t, e, s)
		}, I.delayedCall = function(t, e, i, s, r) {
			return new I(e, 0, {
				delay: t,
				onComplete: e,
				onCompleteParams: i,
				onCompleteScope: s,
				onReverseComplete: e,
				onReverseCompleteParams: i,
				onReverseCompleteScope: s,
				immediateRender: !1,
				lazy: !1,
				useFrames: r,
				overwrite: 0
			})
		}, I.set = function(t, e) {
			return new I(t, 0, e)
		}, I.getTweensOf = function(t, e) {
			if (null == t) return [];
			t = "string" != typeof t ? t : I.selector(t) || t;
			var i, s, r, n;
			if ((f(t) || E(t)) && "number" != typeof t[0]) {
				for (i = t.length, s = []; --i > -1;) s = s.concat(I.getTweensOf(t[i], e));
				for (i = s.length; --i > -1;)
					for (n = s[i], r = i; --r > -1;) n === s[r] && s.splice(i, 1)
			} else
				for (s = K(t).concat(), i = s.length; --i > -1;)(s[i]._gc || e && !s[i].isActive()) && s.splice(i, 1);
			return s
		}, I.killTweensOf = I.killDelayedCallsTo = function(t, e, i) {
			"object" == typeof e && (i = e, e = !1);
			for (var s = I.getTweensOf(t, e), r = s.length; --r > -1;) s[r]._kill(i, t)
		};
		var W = v("plugins.TweenPlugin", function(t, e) {
			this._overwriteProps = (t || "").split(","), this._propName = this._overwriteProps[0], this._priority = e || 0, this._super = W.prototype
		}, !0);
		if (n = W.prototype, W.version = "1.10.1", W.API = 2, n._firstPT = null, n._addTween = function(t, e, i, s, r, n) {
				var a, o;
				return null != s && (a = "number" == typeof s || "=" !== s.charAt(1) ? Number(s) - i : parseInt(s.charAt(0) + "1", 10) * Number(s.substr(2))) ? (this._firstPT = o = {
					_next: this._firstPT,
					t: t,
					p: e,
					s: i,
					c: a,
					f: "function" == typeof t[e],
					n: r || e,
					r: n
				}, o._next && (o._next._prev = o), o) : void 0
			}, n.setRatio = function(t) {
				for (var e, i = this._firstPT, s = 1e-6; i;) e = i.c * t + i.s, i.r ? e = Math.round(e) : s > e && e > -s && (e = 0), i.f ? i.t[i.p](e) : i.t[i.p] = e, i = i._next
			}, n._kill = function(t) {
				var e, i = this._overwriteProps,
					s = this._firstPT;
				if (null != t[this._propName]) this._overwriteProps = [];
				else
					for (e = i.length; --e > -1;) null != t[i[e]] && i.splice(e, 1);
				for (; s;) null != t[s.n] && (s._next && (s._next._prev = s._prev), s._prev ? (s._prev._next = s._next, s._prev = null) : this._firstPT === s && (this._firstPT = s._next)), s = s._next;
				return !1
			}, n._roundProps = function(t, e) {
				for (var i = this._firstPT; i;)(t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")]) && (i.r = e), i = i._next
			}, I._onPluginEvent = function(t, e) {
				var i, s, r, n, a, o = e._firstPT;
				if ("_onInitAllProps" === t) {
					for (; o;) {
						for (a = o._next, s = r; s && s.pr > o.pr;) s = s._next;
						(o._prev = s ? s._prev : n) ? o._prev._next = o: r = o, (o._next = s) ? s._prev = o : n = o, o = a
					}
					o = e._firstPT = r
				}
				for (; o;) o.pg && "function" == typeof o.t[t] && o.t[t]() && (i = !0), o = o._next;
				return i
			}, W.activate = function(t) {
				for (var e = t.length; --e > -1;) t[e].API === W.API && (U[(new t[e])._propName] = t[e]);
				return !0
			}, d.plugin = function(t) {
				if (!(t && t.propName && t.init && t.API)) throw "illegal plugin definition.";
				var e, i = t.propName,
					s = t.priority || 0,
					r = t.overwriteProps,
					n = {
						init: "_onInitTween",
						set: "setRatio",
						kill: "_kill",
						round: "_roundProps",
						initAll: "_onInitAllProps"
					},
					a = v("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function() {
						W.call(this, i, s), this._overwriteProps = r || []
					}, t.global === !0),
					o = a.prototype = new W(i);
				o.constructor = a, a.API = t.API;
				for (e in n) "function" == typeof t[e] && (o[n[e]] = t[e]);
				return a.version = t.version, W.activate([a]), a
			}, s = t._gsQueue) {
			for (r = 0; s.length > r; r++) s[r]();
			for (n in c) c[n].func || t.console.log("GSAP encountered missing dependency: com.greensock." + n)
		}
		o = !1
	}
})("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenLite");
/*!
 * VERSION: 0.0.5
 * DATE: 2015-05-19
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * DrawSVGPlugin is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
	"use strict";

	function getDistance(x1, y1, x2, y2) {
		x2 = parseFloat(x2) - parseFloat(x1);
		y2 = parseFloat(y2) - parseFloat(y1);
		return Math.sqrt(x2 * x2 + y2 * y2);
	}

	function unwrap(element) {
		if (typeof(element) === "string" || !element.nodeType) {
			element = _gsScope.TweenLite.selector(element);
			if (element.length) {
				element = element[0];
			}
		}
		return element;
	}

	function parse(value, length, defaultStart) {
		var i = value.indexOf(" "),
			s, e;
		if (i === -1) {
			s = defaultStart !== undefined ? defaultStart + "" : value;
			e = value;
		} else {
			s = value.substr(0, i);
			e = value.substr(i + 1);
		}
		s = (s.indexOf("%") !== -1) ? (parseFloat(s) / 100) * length : parseFloat(s);
		e = (e.indexOf("%") !== -1) ? (parseFloat(e) / 100) * length : parseFloat(e);
		return (s > e) ? [e, s] : [s, e];
	}

	function getLength(element) {
		if (!element) {
			return 0;
		}
		element = unwrap(element);
		var type = element.tagName.toLowerCase(),
			length, bbox, points, point, prevPoint, i, rx, ry;
		if (type === "path") {
			prevPoint = element.style.strokeDasharray;
			element.style.strokeDasharray = "none";
			length = element.getTotalLength() || 0;
			element.style.strokeDasharray = prevPoint;
		} else if (type === "rect") {
			bbox = element.getBBox();
			length = (bbox.width + bbox.height) * 2;
		} else if (type === "circle") {
			length = Math.PI * 2 * parseFloat(element.getAttribute("r"));
		} else if (type === "line") {
			length = getDistance(element.getAttribute("x1"), element.getAttribute("y1"), element.getAttribute("x2"), element.getAttribute("y2"));
		} else if (type === "polyline" || type === "polygon") {
			points = element.getAttribute("points").split(" ");
			length = 0;
			prevPoint = points[0].split(",");
			if (type === "polygon") {
				points.push(points[0]);
				if (points[0].indexOf(",") === -1) {
					points.push(points[1]);
				}
			}
			for (i = 1; i < points.length; i++) {
				point = points[i].split(",");
				if (point.length === 1) {
					point[1] = points[i++];
				}
				if (point.length === 2) {
					length += getDistance(prevPoint[0], prevPoint[1], point[0], point[1]) || 0;
					prevPoint = point;
				}
			}
		} else if (type === "ellipse") {
			rx = parseFloat(element.getAttribute("rx"));
			ry = parseFloat(element.getAttribute("ry"));
			length = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
		}
		return length || 0;
	}
	var _getComputedStyle = document.defaultView ? document.defaultView.getComputedStyle : function() {},
		DrawSVGPlugin;

	function getPosition(element, length) {
		if (!element) {
			return [0, 0];
		}
		element = unwrap(element);
		length = length || (getLength(element) + 1);
		var cs = _getComputedStyle(element),
			dash = cs.strokeDasharray || "",
			offset = parseFloat(cs.strokeDashoffset),
			i = dash.indexOf(",");
		if (i < 0) {
			i = dash.indexOf(" ");
		}
		dash = (i < 0) ? length : parseFloat(dash.substr(0, i)) || 0.00001;
		if (dash > length) {
			dash = length;
		}
		return [Math.max(0, -offset), dash - offset];
	}
	DrawSVGPlugin = _gsScope._gsDefine.plugin({
		propName: "drawSVG",
		API: 2,
		version: "0.0.5",
		global: true,
		overwriteProps: ["drawSVG"],
		init: function(target, value, tween) {
			if (!target.getBBox) {
				return false;
			}
			var length = getLength(target) + 1,
				start, end, overage;
			this._style = target.style;
			if (value === true || value === "true") {
				value = "0 100%";
			} else if (!value) {
				value = "0 0";
			} else if ((value + "").indexOf(" ") === -1) {
				value = "0 " + value;
			}
			start = getPosition(target, length);
			end = parse(value, length, start[0]);
			this._length = length + 10;
			if (start[0] === 0 && end[0] === 0) {
				overage = Math.max(0.00001, end[1] - length);
				this._dash = length + overage;
				this._offset = length - start[1] + overage;
				this._addTween(this, "_offset", this._offset, length - end[1] + overage, "drawSVG");
			} else {
				this._dash = (start[1] - start[0]) || 0.000001;
				this._offset = -start[0];
				this._addTween(this, "_dash", this._dash, (end[1] - end[0]) || 0.00001, "drawSVG");
				this._addTween(this, "_offset", this._offset, -end[0], "drawSVG");
			}
			return true;
		},
		set: function(ratio) {
			if (this._firstPT) {
				this._super.setRatio.call(this, ratio);
				this._style.strokeDashoffset = this._offset;
				this._style.strokeDasharray = ((ratio === 1 || ratio === 0) && this._offset < 0.001 && this._length - this._dash <= 10) ? "none" : this._dash + "px," + this._length + "px";
			}
		}
	});
	DrawSVGPlugin.getLength = getLength;
	DrawSVGPlugin.getPosition = getPosition;
});
if (_gsScope._gsDefine) {
	_gsScope._gsQueue.pop()();
};
/*! PhotoSwipe - v4.1.0 - 2015-08-14
 * http://photoswipe.com
 * Copyright (c) 2015 Dmitry Semenov; */
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.PhotoSwipe = factory();
	}
})(this, function() {
	'use strict';
	var PhotoSwipe = function(template, UiClass, items, options) {
		var framework = {
			features: null,
			bind: function(target, type, listener, unbind) {
				var methodName = (unbind ? 'remove' : 'add') + 'EventListener';
				type = type.split(' ');
				for (var i = 0; i < type.length; i++) {
					if (type[i]) {
						target[methodName](type[i], listener, false);
					}
				}
			},
			isArray: function(obj) {
				return (obj instanceof Array);
			},
			createEl: function(classes, tag) {
				var el = document.createElement(tag || 'div');
				if (classes) {
					el.className = classes;
				}
				return el;
			},
			getScrollY: function() {
				var yOffset = window.pageYOffset;
				return yOffset !== undefined ? yOffset : document.documentElement.scrollTop;
			},
			unbind: function(target, type, listener) {
				framework.bind(target, type, listener, true);
			},
			removeClass: function(el, className) {
				var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
				el.className = el.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			},
			addClass: function(el, className) {
				if (!framework.hasClass(el, className)) {
					el.className += (el.className ? ' ' : '') + className;
				}
			},
			hasClass: function(el, className) {
				return el.className && new RegExp('(^|\\s)' + className + '(\\s|$)').test(el.className);
			},
			getChildByClass: function(parentEl, childClassName) {
				var node = parentEl.firstChild;
				while (node) {
					if (framework.hasClass(node, childClassName)) {
						return node;
					}
					node = node.nextSibling;
				}
			},
			arraySearch: function(array, value, key) {
				var i = array.length;
				while (i--) {
					if (array[i][key] === value) {
						return i;
					}
				}
				return -1;
			},
			extend: function(o1, o2, preventOverwrite) {
				for (var prop in o2) {
					if (o2.hasOwnProperty(prop)) {
						if (preventOverwrite && o1.hasOwnProperty(prop)) {
							continue;
						}
						o1[prop] = o2[prop];
					}
				}
			},
			easing: {
				sine: {
					out: function(k) {
						return Math.sin(k * (Math.PI / 2));
					},
					inOut: function(k) {
						return -(Math.cos(Math.PI * k) - 1) / 2;
					}
				},
				cubic: {
					out: function(k) {
						return --k * k * k + 1;
					}
				}
			},
			detectFeatures: function() {
				if (framework.features) {
					return framework.features;
				}
				var helperEl = framework.createEl(),
					helperStyle = helperEl.style,
					vendor = '',
					features = {};
				features.oldIE = document.all && !document.addEventListener;
				features.touch = 'ontouchstart' in window;
				if (window.requestAnimationFrame) {
					features.raf = window.requestAnimationFrame;
					features.caf = window.cancelAnimationFrame;
				}
				features.pointerEvent = navigator.pointerEnabled || navigator.msPointerEnabled;
				if (!features.pointerEvent) {
					var ua = navigator.userAgent;
					if (/iP(hone|od)/.test(navigator.platform)) {
						var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
						if (v && v.length > 0) {
							v = parseInt(v[1], 10);
							if (v >= 1 && v < 8) {
								features.isOldIOSPhone = true;
							}
						}
					}
					var match = ua.match(/Android\s([0-9\.]*)/);
					var androidversion = match ? match[1] : 0;
					androidversion = parseFloat(androidversion);
					if (androidversion >= 1) {
						if (androidversion < 4.4) {
							features.isOldAndroid = true;
						}
						features.androidVersion = androidversion;
					}
					features.isMobileOpera = /opera mini|opera mobi/i.test(ua);
				}
				var styleChecks = ['transform', 'perspective', 'animationName'],
					vendors = ['', 'webkit', 'Moz', 'ms', 'O'],
					styleCheckItem, styleName;
				for (var i = 0; i < 4; i++) {
					vendor = vendors[i];
					for (var a = 0; a < 3; a++) {
						styleCheckItem = styleChecks[a];
						styleName = vendor + (vendor ? styleCheckItem.charAt(0).toUpperCase() + styleCheckItem.slice(1) : styleCheckItem);
						if (!features[styleCheckItem] && styleName in helperStyle) {
							features[styleCheckItem] = styleName;
						}
					}
					if (vendor && !features.raf) {
						vendor = vendor.toLowerCase();
						features.raf = window[vendor + 'RequestAnimationFrame'];
						if (features.raf) {
							features.caf = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
						}
					}
				}
				if (!features.raf) {
					var lastTime = 0;
					features.raf = function(fn) {
						var currTime = new Date().getTime();
						var timeToCall = Math.max(0, 16 - (currTime - lastTime));
						var id = window.setTimeout(function() {
							fn(currTime + timeToCall);
						}, timeToCall);
						lastTime = currTime + timeToCall;
						return id;
					};
					features.caf = function(id) {
						clearTimeout(id);
					};
				}
				features.svg = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
				framework.features = features;
				return features;
			}
		};
		framework.detectFeatures();
		if (framework.features.oldIE) {
			framework.bind = function(target, type, listener, unbind) {
				type = type.split(' ');
				var methodName = (unbind ? 'detach' : 'attach') + 'Event',
					evName, _handleEv = function() {
						listener.handleEvent.call(listener);
					};
				for (var i = 0; i < type.length; i++) {
					evName = type[i];
					if (evName) {
						if (typeof listener === 'object' && listener.handleEvent) {
							if (!unbind) {
								listener['oldIE' + evName] = _handleEv;
							} else {
								if (!listener['oldIE' + evName]) {
									return false;
								}
							}
							target[methodName]('on' + evName, listener['oldIE' + evName]);
						} else {
							target[methodName]('on' + evName, listener);
						}
					}
				}
			};
		}
		var self = this;
		var DOUBLE_TAP_RADIUS = 25,
			NUM_HOLDERS = 3;
		var _options = {
			allowPanToNext: true,
			spacing: 0.12,
			bgOpacity: 1,
			mouseUsed: false,
			loop: true,
			pinchToClose: true,
			closeOnScroll: true,
			closeOnVerticalDrag: true,
			verticalDragRange: 0.75,
			hideAnimationDuration: 333,
			showAnimationDuration: 333,
			showHideOpacity: false,
			focus: true,
			escKey: true,
			arrowKeys: true,
			mainScrollEndFriction: 0.35,
			panEndFriction: 0.35,
			isClickableElement: function(el) {
				return el.tagName === 'A';
			},
			getDoubleTapZoom: function(isMouseClick, item) {
				if (isMouseClick) {
					return 1;
				} else {
					return item.initialZoomLevel < 0.7 ? 1 : 1.33;
				}
			},
			maxSpreadZoom: 1.33,
			modal: true,
			scaleMode: 'fit'
		};
		framework.extend(_options, options);
		var _getEmptyPoint = function() {
			return {
				x: 0,
				y: 0
			};
		};
		var _isOpen, _isDestroying, _closedByScroll, _currentItemIndex, _containerStyle, _containerShiftIndex, _currPanDist = _getEmptyPoint(),
			_startPanOffset = _getEmptyPoint(),
			_panOffset = _getEmptyPoint(),
			_upMoveEvents, _downEvents, _globalEventHandlers, _viewportSize = {},
			_currZoomLevel, _startZoomLevel, _translatePrefix, _translateSufix, _updateSizeInterval, _itemsNeedUpdate, _currPositionIndex = 0,
			_offset = {},
			_slideSize = _getEmptyPoint(),
			_itemHolders, _prevItemIndex, _indexDiff = 0,
			_dragStartEvent, _dragMoveEvent, _dragEndEvent, _dragCancelEvent, _transformKey, _pointerEventEnabled, _isFixedPosition = true,
			_likelyTouchDevice, _modules = [],
			_requestAF, _cancelAF, _initalClassName, _initalWindowScrollY, _oldIE, _currentWindowScrollY, _features, _windowVisibleSize = {},
			_renderMaxResolution = false,
			_registerModule = function(name, module) {
				framework.extend(self, module.publicMethods);
				_modules.push(name);
			},
			_getLoopedId = function(index) {
				var numSlides = _getNumItems();
				if (index > numSlides - 1) {
					return index - numSlides;
				} else if (index < 0) {
					return numSlides + index;
				}
				return index;
			},
			_listeners = {},
			_listen = function(name, fn) {
				if (!_listeners[name]) {
					_listeners[name] = [];
				}
				return _listeners[name].push(fn);
			},
			_shout = function(name) {
				var listeners = _listeners[name];
				if (listeners) {
					var args = Array.prototype.slice.call(arguments);
					args.shift();
					for (var i = 0; i < listeners.length; i++) {
						listeners[i].apply(self, args);
					}
				}
			},
			_getCurrentTime = function() {
				return new Date().getTime();
			},
			_applyBgOpacity = function(opacity) {
				_bgOpacity = opacity;
				self.bg.style.opacity = opacity * _options.bgOpacity;
			},
			_applyZoomTransform = function(styleObj, x, y, zoom, item) {
				if (!_renderMaxResolution || (item && item !== self.currItem)) {
					zoom = zoom / (item ? item.fitRatio : self.currItem.fitRatio);
				}
				styleObj[_transformKey] = _translatePrefix + x + 'px, ' + y + 'px' + _translateSufix + ' scale(' + zoom + ')';
			},
			_applyCurrentZoomPan = function(allowRenderResolution) {
				if (_currZoomElementStyle) {
					if (allowRenderResolution) {
						if (_currZoomLevel > self.currItem.fitRatio) {
							if (!_renderMaxResolution) {
								_setImageSize(self.currItem, false, true);
								_renderMaxResolution = true;
							}
						} else {
							if (_renderMaxResolution) {
								_setImageSize(self.currItem);
								_renderMaxResolution = false;
							}
						}
					}
					_applyZoomTransform(_currZoomElementStyle, _panOffset.x, _panOffset.y, _currZoomLevel);
				}
			},
			_applyZoomPanToItem = function(item) {
				if (item.container) {
					_applyZoomTransform(item.container.style, item.initialPosition.x, item.initialPosition.y, item.initialZoomLevel, item);
				}
			},
			_setTranslateX = function(x, elStyle) {
				elStyle[_transformKey] = _translatePrefix + x + 'px, 0px' + _translateSufix;
			},
			_moveMainScroll = function(x, dragging) {
				if (!_options.loop && dragging) {
					var newSlideIndexOffset = _currentItemIndex + (_slideSize.x * _currPositionIndex - x) / _slideSize.x,
						delta = Math.round(x - _mainScrollPos.x);
					if ((newSlideIndexOffset < 0 && delta > 0) || (newSlideIndexOffset >= _getNumItems() - 1 && delta < 0)) {
						x = _mainScrollPos.x + delta * _options.mainScrollEndFriction;
					}
				}
				_mainScrollPos.x = x;
				_setTranslateX(x, _containerStyle);
			},
			_calculatePanOffset = function(axis, zoomLevel) {
				var m = _midZoomPoint[axis] - _offset[axis];
				return _startPanOffset[axis] + _currPanDist[axis] + m - m * (zoomLevel / _startZoomLevel);
			},
			_equalizePoints = function(p1, p2) {
				p1.x = p2.x;
				p1.y = p2.y;
				if (p2.id) {
					p1.id = p2.id;
				}
			},
			_roundPoint = function(p) {
				p.x = Math.round(p.x);
				p.y = Math.round(p.y);
			},
			_mouseMoveTimeout = null,
			_onFirstMouseMove = function() {
				if (_mouseMoveTimeout) {
					framework.unbind(document, 'mousemove', _onFirstMouseMove);
					framework.addClass(template, 'pswp--has_mouse');
					_options.mouseUsed = true;
					_shout('mouseUsed');
				}
				_mouseMoveTimeout = setTimeout(function() {
					_mouseMoveTimeout = null;
				}, 100);
			},
			_bindEvents = function() {
				framework.bind(document, 'keydown', self);
				if (_features.transform) {
					framework.bind(self.scrollWrap, 'click', self);
				}
				if (!_options.mouseUsed) {
					framework.bind(document, 'mousemove', _onFirstMouseMove);
				}
				framework.bind(window, 'resize scroll', self);
				_shout('bindEvents');
			},
			_unbindEvents = function() {
				framework.unbind(window, 'resize', self);
				framework.unbind(window, 'scroll', _globalEventHandlers.scroll);
				framework.unbind(document, 'keydown', self);
				framework.unbind(document, 'mousemove', _onFirstMouseMove);
				if (_features.transform) {
					framework.unbind(self.scrollWrap, 'click', self);
				}
				if (_isDragging) {
					framework.unbind(window, _upMoveEvents, self);
				}
				_shout('unbindEvents');
			},
			_calculatePanBounds = function(zoomLevel, update) {
				var bounds = _calculateItemSize(self.currItem, _viewportSize, zoomLevel);
				if (update) {
					_currPanBounds = bounds;
				}
				return bounds;
			},
			_getMinZoomLevel = function(item) {
				if (!item) {
					item = self.currItem;
				}
				return item.initialZoomLevel;
			},
			_getMaxZoomLevel = function(item) {
				if (!item) {
					item = self.currItem;
				}
				return item.w > 0 ? _options.maxSpreadZoom : 1;
			},
			_modifyDestPanOffset = function(axis, destPanBounds, destPanOffset, destZoomLevel) {
				if (destZoomLevel === self.currItem.initialZoomLevel) {
					destPanOffset[axis] = self.currItem.initialPosition[axis];
					return true;
				} else {
					destPanOffset[axis] = _calculatePanOffset(axis, destZoomLevel);
					if (destPanOffset[axis] > destPanBounds.min[axis]) {
						destPanOffset[axis] = destPanBounds.min[axis];
						return true;
					} else if (destPanOffset[axis] < destPanBounds.max[axis]) {
						destPanOffset[axis] = destPanBounds.max[axis];
						return true;
					}
				}
				return false;
			},
			_setupTransforms = function() {
				if (_transformKey) {
					var allow3dTransform = _features.perspective && !_likelyTouchDevice;
					_translatePrefix = 'translate' + (allow3dTransform ? '3d(' : '(');
					_translateSufix = _features.perspective ? ', 0px)' : ')';
					return;
				}
				_transformKey = 'left';
				framework.addClass(template, 'pswp--ie');
				_setTranslateX = function(x, elStyle) {
					elStyle.left = x + 'px';
				};
				_applyZoomPanToItem = function(item) {
					var zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
						s = item.container.style,
						w = zoomRatio * item.w,
						h = zoomRatio * item.h;
					s.width = w + 'px';
					s.height = h + 'px';
					s.left = item.initialPosition.x + 'px';
					s.top = item.initialPosition.y + 'px';
				};
				_applyCurrentZoomPan = function() {
					if (_currZoomElementStyle) {
						var s = _currZoomElementStyle,
							item = self.currItem,
							zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
							w = zoomRatio * item.w,
							h = zoomRatio * item.h;
						s.width = w + 'px';
						s.height = h + 'px';
						s.left = _panOffset.x + 'px';
						s.top = _panOffset.y + 'px';
					}
				};
			},
			_onKeyDown = function(e) {
				var keydownAction = '';
				if (_options.escKey && e.keyCode === 27) {
					keydownAction = 'close';
				} else if (_options.arrowKeys) {
					if (e.keyCode === 37) {
						keydownAction = 'prev';
					} else if (e.keyCode === 39) {
						keydownAction = 'next';
					}
				}
				if (keydownAction) {
					if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
						if (e.preventDefault) {
							e.preventDefault();
						} else {
							e.returnValue = false;
						}
						self[keydownAction]();
					}
				}
			},
			_onGlobalClick = function(e) {
				if (!e) {
					return;
				}
				if (_moved || _zoomStarted || _mainScrollAnimating || _verticalDragInitiated) {
					e.preventDefault();
					e.stopPropagation();
				}
			},
			_updatePageScrollOffset = function() {
				self.setScrollOffset(0, framework.getScrollY());
			};
		var _animations = {},
			_numAnimations = 0,
			_stopAnimation = function(name) {
				if (_animations[name]) {
					if (_animations[name].raf) {
						_cancelAF(_animations[name].raf);
					}
					_numAnimations--;
					delete _animations[name];
				}
			},
			_registerStartAnimation = function(name) {
				if (_animations[name]) {
					_stopAnimation(name);
				}
				if (!_animations[name]) {
					_numAnimations++;
					_animations[name] = {};
				}
			},
			_stopAllAnimations = function() {
				for (var prop in _animations) {
					if (_animations.hasOwnProperty(prop)) {
						_stopAnimation(prop);
					}
				}
			},
			_animateProp = function(name, b, endProp, d, easingFn, onUpdate, onComplete) {
				var startAnimTime = _getCurrentTime(),
					t;
				_registerStartAnimation(name);
				var animloop = function() {
					if (_animations[name]) {
						t = _getCurrentTime() - startAnimTime;
						if (t >= d) {
							_stopAnimation(name);
							onUpdate(endProp);
							if (onComplete) {
								onComplete();
							}
							return;
						}
						onUpdate((endProp - b) * easingFn(t / d) + b);
						_animations[name].raf = _requestAF(animloop);
					}
				};
				animloop();
			};
		var publicMethods = {
			shout: _shout,
			listen: _listen,
			viewportSize: _viewportSize,
			options: _options,
			isMainScrollAnimating: function() {
				return _mainScrollAnimating;
			},
			getZoomLevel: function() {
				return _currZoomLevel;
			},
			getCurrentIndex: function() {
				return _currentItemIndex;
			},
			isDragging: function() {
				return _isDragging;
			},
			isZooming: function() {
				return _isZooming;
			},
			setScrollOffset: function(x, y) {
				_offset.x = x;
				_currentWindowScrollY = _offset.y = y;
				_shout('updateScrollOffset', _offset);
			},
			applyZoomPan: function(zoomLevel, panX, panY, allowRenderResolution) {
				_panOffset.x = panX;
				_panOffset.y = panY;
				_currZoomLevel = zoomLevel;
				_applyCurrentZoomPan(allowRenderResolution);
			},
			init: function() {
				if (_isOpen || _isDestroying) {
					return;
				}
				var i;
				self.framework = framework;
				self.template = template;
				self.bg = framework.getChildByClass(template, 'pswp__bg');
				_initalClassName = template.className;
				_isOpen = true;
				_features = framework.detectFeatures();
				_requestAF = _features.raf;
				_cancelAF = _features.caf;
				_transformKey = _features.transform;
				_oldIE = _features.oldIE;
				self.scrollWrap = framework.getChildByClass(template, 'pswp__scroll-wrap');
				self.container = framework.getChildByClass(self.scrollWrap, 'pswp__container');
				_containerStyle = self.container.style;
				self.itemHolders = _itemHolders = [{
					el: self.container.children[0],
					wrap: 0,
					index: -1
				}, {
					el: self.container.children[1],
					wrap: 0,
					index: -1
				}, {
					el: self.container.children[2],
					wrap: 0,
					index: -1
				}];
				_itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'none';
				_setupTransforms();
				_globalEventHandlers = {
					resize: self.updateSize,
					scroll: _updatePageScrollOffset,
					keydown: _onKeyDown,
					click: _onGlobalClick
				};
				var oldPhone = _features.isOldIOSPhone || _features.isOldAndroid || _features.isMobileOpera;
				if (!_features.animationName || !_features.transform || oldPhone) {
					_options.showAnimationDuration = _options.hideAnimationDuration = 0;
				}
				for (i = 0; i < _modules.length; i++) {
					self['init' + _modules[i]]();
				}
				if (UiClass) {
					var ui = self.ui = new UiClass(self, framework);
					ui.init();
				}
				_shout('firstUpdate');
				_currentItemIndex = _currentItemIndex || _options.index || 0;
				if (isNaN(_currentItemIndex) || _currentItemIndex < 0 || _currentItemIndex >= _getNumItems()) {
					_currentItemIndex = 0;
				}
				self.currItem = _getItemAt(_currentItemIndex);
				if (_features.isOldIOSPhone || _features.isOldAndroid) {
					_isFixedPosition = false;
				}
				template.setAttribute('aria-hidden', 'false');
				if (_options.modal) {
					if (!_isFixedPosition) {
						template.style.position = 'absolute';
						template.style.top = framework.getScrollY() + 'px';
					} else {
						template.style.position = 'fixed';
					}
				}
				if (_currentWindowScrollY === undefined) {
					_shout('initialLayout');
					_currentWindowScrollY = _initalWindowScrollY = framework.getScrollY();
				}
				var rootClasses = 'pswp--open ';
				if (_options.mainClass) {
					rootClasses += _options.mainClass + ' ';
				}
				if (_options.showHideOpacity) {
					rootClasses += 'pswp--animate_opacity ';
				}
				rootClasses += _likelyTouchDevice ? 'pswp--touch' : 'pswp--notouch';
				rootClasses += _features.animationName ? ' pswp--css_animation' : '';
				rootClasses += _features.svg ? ' pswp--svg' : '';
				framework.addClass(template, rootClasses);
				self.updateSize();
				_containerShiftIndex = -1;
				_indexDiff = null;
				for (i = 0; i < NUM_HOLDERS; i++) {
					_setTranslateX((i + _containerShiftIndex) * _slideSize.x, _itemHolders[i].el.style);
				}
				if (!_oldIE) {
					framework.bind(self.scrollWrap, _downEvents, self);
				}
				_listen('initialZoomInEnd', function() {
					self.setContent(_itemHolders[0], _currentItemIndex - 1);
					self.setContent(_itemHolders[2], _currentItemIndex + 1);
					_itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'block';
					if (_options.focus) {
						template.focus();
					}
					_bindEvents();
				});
				self.setContent(_itemHolders[1], _currentItemIndex);
				self.updateCurrItem();
				_shout('afterInit');
				if (!_isFixedPosition) {
					_updateSizeInterval = setInterval(function() {
						if (!_numAnimations && !_isDragging && !_isZooming && (_currZoomLevel === self.currItem.initialZoomLevel)) {
							self.updateSize();
						}
					}, 1000);
				}
				framework.addClass(template, 'pswp--visible');
			},
			close: function() {
				if (!_isOpen) {
					return;
				}
				_isOpen = false;
				_isDestroying = true;
				_shout('close');
				_unbindEvents();
				_showOrHide(self.currItem, null, true, self.destroy);
			},
			destroy: function() {
				_shout('destroy');
				if (_showOrHideTimeout) {
					clearTimeout(_showOrHideTimeout);
				}
				template.setAttribute('aria-hidden', 'true');
				template.className = _initalClassName;
				if (_updateSizeInterval) {
					clearInterval(_updateSizeInterval);
				}
				framework.unbind(self.scrollWrap, _downEvents, self);
				framework.unbind(window, 'scroll', self);
				_stopDragUpdateLoop();
				_stopAllAnimations();
				_listeners = null;
			},
			panTo: function(x, y, force) {
				if (!force) {
					if (x > _currPanBounds.min.x) {
						x = _currPanBounds.min.x;
					} else if (x < _currPanBounds.max.x) {
						x = _currPanBounds.max.x;
					}
					if (y > _currPanBounds.min.y) {
						y = _currPanBounds.min.y;
					} else if (y < _currPanBounds.max.y) {
						y = _currPanBounds.max.y;
					}
				}
				_panOffset.x = x;
				_panOffset.y = y;
				_applyCurrentZoomPan();
			},
			handleEvent: function(e) {
				e = e || window.event;
				if (_globalEventHandlers[e.type]) {
					_globalEventHandlers[e.type](e);
				}
			},
			goTo: function(index) {
				index = _getLoopedId(index);
				var diff = index - _currentItemIndex;
				_indexDiff = diff;
				_currentItemIndex = index;
				self.currItem = _getItemAt(_currentItemIndex);
				_currPositionIndex -= diff;
				_moveMainScroll(_slideSize.x * _currPositionIndex);
				_stopAllAnimations();
				_mainScrollAnimating = false;
				self.updateCurrItem();
			},
			next: function() {
				self.goTo(_currentItemIndex + 1);
			},
			prev: function() {
				self.goTo(_currentItemIndex - 1);
			},
			updateCurrZoomItem: function(emulateSetContent) {
				if (emulateSetContent) {
					_shout('beforeChange', 0);
				}
				if (_itemHolders[1].el.children.length) {
					var zoomElement = _itemHolders[1].el.children[0];
					if (framework.hasClass(zoomElement, 'pswp__zoom-wrap')) {
						_currZoomElementStyle = zoomElement.style;
					} else {
						_currZoomElementStyle = null;
					}
				} else {
					_currZoomElementStyle = null;
				}
				_currPanBounds = self.currItem.bounds;
				_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel;
				_panOffset.x = _currPanBounds.center.x;
				_panOffset.y = _currPanBounds.center.y;
				if (emulateSetContent) {
					_shout('afterChange');
				}
			},
			invalidateCurrItems: function() {
				_itemsNeedUpdate = true;
				for (var i = 0; i < NUM_HOLDERS; i++) {
					if (_itemHolders[i].item) {
						_itemHolders[i].item.needsUpdate = true;
					}
				}
			},
			updateCurrItem: function(beforeAnimation) {
				if (_indexDiff === 0) {
					return;
				}
				var diffAbs = Math.abs(_indexDiff),
					tempHolder;
				if (beforeAnimation && diffAbs < 2) {
					return;
				}
				self.currItem = _getItemAt(_currentItemIndex);
				_renderMaxResolution = false;
				_shout('beforeChange', _indexDiff);
				if (diffAbs >= NUM_HOLDERS) {
					_containerShiftIndex += _indexDiff + (_indexDiff > 0 ? -NUM_HOLDERS : NUM_HOLDERS);
					diffAbs = NUM_HOLDERS;
				}
				for (var i = 0; i < diffAbs; i++) {
					if (_indexDiff > 0) {
						tempHolder = _itemHolders.shift();
						_itemHolders[NUM_HOLDERS - 1] = tempHolder;
						_containerShiftIndex++;
						_setTranslateX((_containerShiftIndex + 2) * _slideSize.x, tempHolder.el.style);
						self.setContent(tempHolder, _currentItemIndex - diffAbs + i + 1 + 1);
					} else {
						tempHolder = _itemHolders.pop();
						_itemHolders.unshift(tempHolder);
						_containerShiftIndex--;
						_setTranslateX(_containerShiftIndex * _slideSize.x, tempHolder.el.style);
						self.setContent(tempHolder, _currentItemIndex + diffAbs - i - 1 - 1);
					}
				}
				if (_currZoomElementStyle && Math.abs(_indexDiff) === 1) {
					var prevItem = _getItemAt(_prevItemIndex);
					if (prevItem.initialZoomLevel !== _currZoomLevel) {
						_calculateItemSize(prevItem, _viewportSize);
						_setImageSize(prevItem);
						_applyZoomPanToItem(prevItem);
					}
				}
				_indexDiff = 0;
				self.updateCurrZoomItem();
				_prevItemIndex = _currentItemIndex;
				_shout('afterChange');
			},
			updateSize: function(force) {
				if (!_isFixedPosition && _options.modal) {
					var windowScrollY = framework.getScrollY();
					if (_currentWindowScrollY !== windowScrollY) {
						template.style.top = windowScrollY + 'px';
						_currentWindowScrollY = windowScrollY;
					}
					if (!force && _windowVisibleSize.x === window.innerWidth && _windowVisibleSize.y === window.innerHeight) {
						return;
					}
					_windowVisibleSize.x = window.innerWidth;
					_windowVisibleSize.y = window.innerHeight;
					template.style.height = _windowVisibleSize.y + 'px';
				}
				_viewportSize.x = self.scrollWrap.clientWidth;
				_viewportSize.y = self.scrollWrap.clientHeight;
				_updatePageScrollOffset();
				_slideSize.x = _viewportSize.x + Math.round(_viewportSize.x * _options.spacing);
				_slideSize.y = _viewportSize.y;
				_moveMainScroll(_slideSize.x * _currPositionIndex);
				_shout('beforeResize');
				if (_containerShiftIndex !== undefined) {
					var holder, item, hIndex;
					for (var i = 0; i < NUM_HOLDERS; i++) {
						holder = _itemHolders[i];
						_setTranslateX((i + _containerShiftIndex) * _slideSize.x, holder.el.style);
						hIndex = _currentItemIndex + i - 1;
						if (_options.loop && _getNumItems() > 2) {
							hIndex = _getLoopedId(hIndex);
						}
						item = _getItemAt(hIndex);
						if (item && (_itemsNeedUpdate || item.needsUpdate || !item.bounds)) {
							self.cleanSlide(item);
							self.setContent(holder, hIndex);
							if (i === 1) {
								self.currItem = item;
								self.updateCurrZoomItem(true);
							}
							item.needsUpdate = false;
						} else if (holder.index === -1 && hIndex >= 0) {
							self.setContent(holder, hIndex);
						}
						if (item && item.container) {
							_calculateItemSize(item, _viewportSize);
							_setImageSize(item);
							_applyZoomPanToItem(item);
						}
					}
					_itemsNeedUpdate = false;
				}
				_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel;
				_currPanBounds = self.currItem.bounds;
				if (_currPanBounds) {
					_panOffset.x = _currPanBounds.center.x;
					_panOffset.y = _currPanBounds.center.y;
					_applyCurrentZoomPan(true);
				}
				_shout('resize');
			},
			zoomTo: function(destZoomLevel, centerPoint, speed, easingFn, updateFn) {
				if (centerPoint) {
					_startZoomLevel = _currZoomLevel;
					_midZoomPoint.x = Math.abs(centerPoint.x) - _panOffset.x;
					_midZoomPoint.y = Math.abs(centerPoint.y) - _panOffset.y;
					_equalizePoints(_startPanOffset, _panOffset);
				}
				var destPanBounds = _calculatePanBounds(destZoomLevel, false),
					destPanOffset = {};
				_modifyDestPanOffset('x', destPanBounds, destPanOffset, destZoomLevel);
				_modifyDestPanOffset('y', destPanBounds, destPanOffset, destZoomLevel);
				var initialZoomLevel = _currZoomLevel;
				var initialPanOffset = {
					x: _panOffset.x,
					y: _panOffset.y
				};
				_roundPoint(destPanOffset);
				var onUpdate = function(now) {
					if (now === 1) {
						_currZoomLevel = destZoomLevel;
						_panOffset.x = destPanOffset.x;
						_panOffset.y = destPanOffset.y;
					} else {
						_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
						_panOffset.x = (destPanOffset.x - initialPanOffset.x) * now + initialPanOffset.x;
						_panOffset.y = (destPanOffset.y - initialPanOffset.y) * now + initialPanOffset.y;
					}
					if (updateFn) {
						updateFn(now);
					}
					_applyCurrentZoomPan(now === 1);
				};
				if (speed) {
					_animateProp('customZoomTo', 0, 1, speed, easingFn || framework.easing.sine.inOut, onUpdate);
				} else {
					onUpdate(1);
				}
			}
		};
		var MIN_SWIPE_DISTANCE = 30,
			DIRECTION_CHECK_OFFSET = 10;
		var _gestureStartTime, _gestureCheckSpeedTime, p = {},
			p2 = {},
			delta = {},
			_currPoint = {},
			_startPoint = {},
			_currPointers = [],
			_startMainScrollPos = {},
			_releaseAnimData, _posPoints = [],
			_tempPoint = {},
			_isZoomingIn, _verticalDragInitiated, _oldAndroidTouchEndTimeout, _currZoomedItemIndex = 0,
			_centerPoint = _getEmptyPoint(),
			_lastReleaseTime = 0,
			_isDragging, _isMultitouch, _zoomStarted, _moved, _dragAnimFrame, _mainScrollShifted, _currentPoints, _isZooming, _currPointsDistance, _startPointsDistance, _currPanBounds, _mainScrollPos = _getEmptyPoint(),
			_currZoomElementStyle, _mainScrollAnimating, _midZoomPoint = _getEmptyPoint(),
			_currCenterPoint = _getEmptyPoint(),
			_direction, _isFirstMove, _opacityChanged, _bgOpacity, _wasOverInitialZoom, _isEqualPoints = function(p1, p2) {
				return p1.x === p2.x && p1.y === p2.y;
			},
			_isNearbyPoints = function(touch0, touch1) {
				return Math.abs(touch0.x - touch1.x) < DOUBLE_TAP_RADIUS && Math.abs(touch0.y - touch1.y) < DOUBLE_TAP_RADIUS;
			},
			_calculatePointsDistance = function(p1, p2) {
				_tempPoint.x = Math.abs(p1.x - p2.x);
				_tempPoint.y = Math.abs(p1.y - p2.y);
				return Math.sqrt(_tempPoint.x * _tempPoint.x + _tempPoint.y * _tempPoint.y);
			},
			_stopDragUpdateLoop = function() {
				if (_dragAnimFrame) {
					_cancelAF(_dragAnimFrame);
					_dragAnimFrame = null;
				}
			},
			_dragUpdateLoop = function() {
				if (_isDragging) {
					_dragAnimFrame = _requestAF(_dragUpdateLoop);
					_renderMovement();
				}
			},
			_canPan = function() {
				return !(_options.scaleMode === 'fit' && _currZoomLevel === self.currItem.initialZoomLevel);
			},
			_closestElement = function(el, fn) {
				if (!el) {
					return false;
				}
				if (el.className && el.className.indexOf('pswp__scroll-wrap') > -1) {
					return false;
				}
				if (fn(el)) {
					return el;
				}
				return _closestElement(el.parentNode, fn);
			},
			_preventObj = {},
			_preventDefaultEventBehaviour = function(e, isDown) {
				_preventObj.prevent = !_closestElement(e.target, _options.isClickableElement);
				_shout('preventDragEvent', e, isDown, _preventObj);
				return _preventObj.prevent;
			},
			_convertTouchToPoint = function(touch, p) {
				p.x = touch.pageX;
				p.y = touch.pageY;
				p.id = touch.identifier;
				return p;
			},
			_findCenterOfPoints = function(p1, p2, pCenter) {
				pCenter.x = (p1.x + p2.x) * 0.5;
				pCenter.y = (p1.y + p2.y) * 0.5;
			},
			_pushPosPoint = function(time, x, y) {
				if (time - _gestureCheckSpeedTime > 50) {
					var o = _posPoints.length > 2 ? _posPoints.shift() : {};
					o.x = x;
					o.y = y;
					_posPoints.push(o);
					_gestureCheckSpeedTime = time;
				}
			},
			_calculateVerticalDragOpacityRatio = function() {
				var yOffset = _panOffset.y - self.currItem.initialPosition.y;
				return 1 - Math.abs(yOffset / (_viewportSize.y / 2));
			},
			_ePoint1 = {},
			_ePoint2 = {},
			_tempPointsArr = [],
			_tempCounter, _getTouchPoints = function(e) {
				while (_tempPointsArr.length > 0) {
					_tempPointsArr.pop();
				}
				if (!_pointerEventEnabled) {
					if (e.type.indexOf('touch') > -1) {
						if (e.touches && e.touches.length > 0) {
							_tempPointsArr[0] = _convertTouchToPoint(e.touches[0], _ePoint1);
							if (e.touches.length > 1) {
								_tempPointsArr[1] = _convertTouchToPoint(e.touches[1], _ePoint2);
							}
						}
					} else {
						_ePoint1.x = e.pageX;
						_ePoint1.y = e.pageY;
						_ePoint1.id = '';
						_tempPointsArr[0] = _ePoint1;
					}
				} else {
					_tempCounter = 0;
					_currPointers.forEach(function(p) {
						if (_tempCounter === 0) {
							_tempPointsArr[0] = p;
						} else if (_tempCounter === 1) {
							_tempPointsArr[1] = p;
						}
						_tempCounter++;
					});
				}
				return _tempPointsArr;
			},
			_panOrMoveMainScroll = function(axis, delta) {
				var panFriction, overDiff = 0,
					newOffset = _panOffset[axis] + delta[axis],
					startOverDiff, dir = delta[axis] > 0,
					newMainScrollPosition = _mainScrollPos.x + delta.x,
					mainScrollDiff = _mainScrollPos.x - _startMainScrollPos.x,
					newPanPos, newMainScrollPos;
				if (newOffset > _currPanBounds.min[axis] || newOffset < _currPanBounds.max[axis]) {
					panFriction = _options.panEndFriction;
				} else {
					panFriction = 1;
				}
				newOffset = _panOffset[axis] + delta[axis] * panFriction;
				if (_options.allowPanToNext || _currZoomLevel === self.currItem.initialZoomLevel) {
					if (!_currZoomElementStyle) {
						newMainScrollPos = newMainScrollPosition;
					} else if (_direction === 'h' && axis === 'x' && !_zoomStarted) {
						if (dir) {
							if (newOffset > _currPanBounds.min[axis]) {
								panFriction = _options.panEndFriction;
								overDiff = _currPanBounds.min[axis] - newOffset;
								startOverDiff = _currPanBounds.min[axis] - _startPanOffset[axis];
							}
							if ((startOverDiff <= 0 || mainScrollDiff < 0) && _getNumItems() > 1) {
								newMainScrollPos = newMainScrollPosition;
								if (mainScrollDiff < 0 && newMainScrollPosition > _startMainScrollPos.x) {
									newMainScrollPos = _startMainScrollPos.x;
								}
							} else {
								if (_currPanBounds.min.x !== _currPanBounds.max.x) {
									newPanPos = newOffset;
								}
							}
						} else {
							if (newOffset < _currPanBounds.max[axis]) {
								panFriction = _options.panEndFriction;
								overDiff = newOffset - _currPanBounds.max[axis];
								startOverDiff = _startPanOffset[axis] - _currPanBounds.max[axis];
							}
							if ((startOverDiff <= 0 || mainScrollDiff > 0) && _getNumItems() > 1) {
								newMainScrollPos = newMainScrollPosition;
								if (mainScrollDiff > 0 && newMainScrollPosition < _startMainScrollPos.x) {
									newMainScrollPos = _startMainScrollPos.x;
								}
							} else {
								if (_currPanBounds.min.x !== _currPanBounds.max.x) {
									newPanPos = newOffset;
								}
							}
						}
					}
					if (axis === 'x') {
						if (newMainScrollPos !== undefined) {
							_moveMainScroll(newMainScrollPos, true);
							if (newMainScrollPos === _startMainScrollPos.x) {
								_mainScrollShifted = false;
							} else {
								_mainScrollShifted = true;
							}
						}
						if (_currPanBounds.min.x !== _currPanBounds.max.x) {
							if (newPanPos !== undefined) {
								_panOffset.x = newPanPos;
							} else if (!_mainScrollShifted) {
								_panOffset.x += delta.x * panFriction;
							}
						}
						return newMainScrollPos !== undefined;
					}
				}
				if (!_mainScrollAnimating) {
					if (!_mainScrollShifted) {
						if (_currZoomLevel > self.currItem.fitRatio) {
							_panOffset[axis] += delta[axis] * panFriction;
						}
					}
				}
			},
			_onDragStart = function(e) {
				if (e.type === 'mousedown' && e.button > 0) {
					return;
				}
				if (_initialZoomRunning) {
					e.preventDefault();
					return;
				}
				if (_oldAndroidTouchEndTimeout && e.type === 'mousedown') {
					return;
				}
				if (_preventDefaultEventBehaviour(e, true)) {
					e.preventDefault();
				}
				_shout('pointerDown');
				if (_pointerEventEnabled) {
					var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
					if (pointerIndex < 0) {
						pointerIndex = _currPointers.length;
					}
					_currPointers[pointerIndex] = {
						x: e.pageX,
						y: e.pageY,
						id: e.pointerId
					};
				}
				var startPointsList = _getTouchPoints(e),
					numPoints = startPointsList.length;
				_currentPoints = null;
				_stopAllAnimations();
				if (!_isDragging || numPoints === 1) {
					_isDragging = _isFirstMove = true;
					framework.bind(window, _upMoveEvents, self);
					_isZoomingIn = _wasOverInitialZoom = _opacityChanged = _verticalDragInitiated = _mainScrollShifted = _moved = _isMultitouch = _zoomStarted = false;
					_direction = null;
					_shout('firstTouchStart', startPointsList);
					_equalizePoints(_startPanOffset, _panOffset);
					_currPanDist.x = _currPanDist.y = 0;
					_equalizePoints(_currPoint, startPointsList[0]);
					_equalizePoints(_startPoint, _currPoint);
					_startMainScrollPos.x = _slideSize.x * _currPositionIndex;
					_posPoints = [{
						x: _currPoint.x,
						y: _currPoint.y
					}];
					_gestureCheckSpeedTime = _gestureStartTime = _getCurrentTime();
					_calculatePanBounds(_currZoomLevel, true);
					_stopDragUpdateLoop();
					_dragUpdateLoop();
				}
				if (!_isZooming && numPoints > 1 && !_mainScrollAnimating && !_mainScrollShifted) {
					_startZoomLevel = _currZoomLevel;
					_zoomStarted = false;
					_isZooming = _isMultitouch = true;
					_currPanDist.y = _currPanDist.x = 0;
					_equalizePoints(_startPanOffset, _panOffset);
					_equalizePoints(p, startPointsList[0]);
					_equalizePoints(p2, startPointsList[1]);
					_findCenterOfPoints(p, p2, _currCenterPoint);
					_midZoomPoint.x = Math.abs(_currCenterPoint.x) - _panOffset.x;
					_midZoomPoint.y = Math.abs(_currCenterPoint.y) - _panOffset.y;
					_currPointsDistance = _startPointsDistance = _calculatePointsDistance(p, p2);
				}
			},
			_onDragMove = function(e) {
				e.preventDefault();
				if (_pointerEventEnabled) {
					var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
					if (pointerIndex > -1) {
						var p = _currPointers[pointerIndex];
						p.x = e.pageX;
						p.y = e.pageY;
					}
				}
				if (_isDragging) {
					var touchesList = _getTouchPoints(e);
					if (!_direction && !_moved && !_isZooming) {
						if (_mainScrollPos.x !== _slideSize.x * _currPositionIndex) {
							_direction = 'h';
						} else {
							var diff = Math.abs(touchesList[0].x - _currPoint.x) - Math.abs(touchesList[0].y - _currPoint.y);
							if (Math.abs(diff) >= DIRECTION_CHECK_OFFSET) {
								_direction = diff > 0 ? 'h' : 'v';
								_currentPoints = touchesList;
							}
						}
					} else {
						_currentPoints = touchesList;
					}
				}
			},
			_renderMovement = function() {
				if (!_currentPoints) {
					return;
				}
				var numPoints = _currentPoints.length;
				if (numPoints === 0) {
					return;
				}
				_equalizePoints(p, _currentPoints[0]);
				delta.x = p.x - _currPoint.x;
				delta.y = p.y - _currPoint.y;
				if (_isZooming && numPoints > 1) {
					_currPoint.x = p.x;
					_currPoint.y = p.y;
					if (!delta.x && !delta.y && _isEqualPoints(_currentPoints[1], p2)) {
						return;
					}
					_equalizePoints(p2, _currentPoints[1]);
					if (!_zoomStarted) {
						_zoomStarted = true;
						_shout('zoomGestureStarted');
					}
					var pointsDistance = _calculatePointsDistance(p, p2);
					var zoomLevel = _calculateZoomLevel(pointsDistance);
					if (zoomLevel > self.currItem.initialZoomLevel + self.currItem.initialZoomLevel / 15) {
						_wasOverInitialZoom = true;
					}
					var zoomFriction = 1,
						minZoomLevel = _getMinZoomLevel(),
						maxZoomLevel = _getMaxZoomLevel();
					if (zoomLevel < minZoomLevel) {
						if (_options.pinchToClose && !_wasOverInitialZoom && _startZoomLevel <= self.currItem.initialZoomLevel) {
							var minusDiff = minZoomLevel - zoomLevel;
							var percent = 1 - minusDiff / (minZoomLevel / 1.2);
							_applyBgOpacity(percent);
							_shout('onPinchClose', percent);
							_opacityChanged = true;
						} else {
							zoomFriction = (minZoomLevel - zoomLevel) / minZoomLevel;
							if (zoomFriction > 1) {
								zoomFriction = 1;
							}
							zoomLevel = minZoomLevel - zoomFriction * (minZoomLevel / 3);
						}
					} else if (zoomLevel > maxZoomLevel) {
						zoomFriction = (zoomLevel - maxZoomLevel) / (minZoomLevel * 6);
						if (zoomFriction > 1) {
							zoomFriction = 1;
						}
						zoomLevel = maxZoomLevel + zoomFriction * minZoomLevel;
					}
					if (zoomFriction < 0) {
						zoomFriction = 0;
					}
					_currPointsDistance = pointsDistance;
					_findCenterOfPoints(p, p2, _centerPoint);
					_currPanDist.x += _centerPoint.x - _currCenterPoint.x;
					_currPanDist.y += _centerPoint.y - _currCenterPoint.y;
					_equalizePoints(_currCenterPoint, _centerPoint);
					_panOffset.x = _calculatePanOffset('x', zoomLevel);
					_panOffset.y = _calculatePanOffset('y', zoomLevel);
					_isZoomingIn = zoomLevel > _currZoomLevel;
					_currZoomLevel = zoomLevel;
					_applyCurrentZoomPan();
				} else {
					if (!_direction) {
						return;
					}
					if (_isFirstMove) {
						_isFirstMove = false;
						if (Math.abs(delta.x) >= DIRECTION_CHECK_OFFSET) {
							delta.x -= _currentPoints[0].x - _startPoint.x;
						}
						if (Math.abs(delta.y) >= DIRECTION_CHECK_OFFSET) {
							delta.y -= _currentPoints[0].y - _startPoint.y;
						}
					}
					_currPoint.x = p.x;
					_currPoint.y = p.y;
					if (delta.x === 0 && delta.y === 0) {
						return;
					}
					if (_direction === 'v' && _options.closeOnVerticalDrag) {
						if (!_canPan()) {
							_currPanDist.y += delta.y;
							_panOffset.y += delta.y;
							var opacityRatio = _calculateVerticalDragOpacityRatio();
							_verticalDragInitiated = true;
							_shout('onVerticalDrag', opacityRatio);
							_applyBgOpacity(opacityRatio);
							_applyCurrentZoomPan();
							return;
						}
					}
					_pushPosPoint(_getCurrentTime(), p.x, p.y);
					_moved = true;
					_currPanBounds = self.currItem.bounds;
					var mainScrollChanged = _panOrMoveMainScroll('x', delta);
					if (!mainScrollChanged) {
						_panOrMoveMainScroll('y', delta);
						_roundPoint(_panOffset);
						_applyCurrentZoomPan();
					}
				}
			},
			_onDragRelease = function(e) {
				if (_features.isOldAndroid) {
					if (_oldAndroidTouchEndTimeout && e.type === 'mouseup') {
						return;
					}
					if (e.type.indexOf('touch') > -1) {
						clearTimeout(_oldAndroidTouchEndTimeout);
						_oldAndroidTouchEndTimeout = setTimeout(function() {
							_oldAndroidTouchEndTimeout = 0;
						}, 600);
					}
				}
				_shout('pointerUp');
				if (_preventDefaultEventBehaviour(e, false)) {
					e.preventDefault();
				}
				var releasePoint;
				if (_pointerEventEnabled) {
					var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
					if (pointerIndex > -1) {
						releasePoint = _currPointers.splice(pointerIndex, 1)[0];
						if (navigator.pointerEnabled) {
							releasePoint.type = e.pointerType || 'mouse';
						} else {
							var MSPOINTER_TYPES = {
								4: 'mouse',
								2: 'touch',
								3: 'pen'
							};
							releasePoint.type = MSPOINTER_TYPES[e.pointerType];
							if (!releasePoint.type) {
								releasePoint.type = e.pointerType || 'mouse';
							}
						}
					}
				}
				var touchList = _getTouchPoints(e),
					gestureType, numPoints = touchList.length;
				if (e.type === 'mouseup') {
					numPoints = 0;
				}
				if (numPoints === 2) {
					_currentPoints = null;
					return true;
				}
				if (numPoints === 1) {
					_equalizePoints(_startPoint, touchList[0]);
				}
				if (numPoints === 0 && !_direction && !_mainScrollAnimating) {
					if (!releasePoint) {
						if (e.type === 'mouseup') {
							releasePoint = {
								x: e.pageX,
								y: e.pageY,
								type: 'mouse'
							};
						} else if (e.changedTouches && e.changedTouches[0]) {
							releasePoint = {
								x: e.changedTouches[0].pageX,
								y: e.changedTouches[0].pageY,
								type: 'touch'
							};
						}
					}
					_shout('touchRelease', e, releasePoint);
				}
				var releaseTimeDiff = -1;
				if (numPoints === 0) {
					_isDragging = false;
					framework.unbind(window, _upMoveEvents, self);
					_stopDragUpdateLoop();
					if (_isZooming) {
						releaseTimeDiff = 0;
					} else if (_lastReleaseTime !== -1) {
						releaseTimeDiff = _getCurrentTime() - _lastReleaseTime;
					}
				}
				_lastReleaseTime = numPoints === 1 ? _getCurrentTime() : -1;
				if (releaseTimeDiff !== -1 && releaseTimeDiff < 150) {
					gestureType = 'zoom';
				} else {
					gestureType = 'swipe';
				}
				if (_isZooming && numPoints < 2) {
					_isZooming = false;
					if (numPoints === 1) {
						gestureType = 'zoomPointerUp';
					}
					_shout('zoomGestureEnded');
				}
				_currentPoints = null;
				if (!_moved && !_zoomStarted && !_mainScrollAnimating && !_verticalDragInitiated) {
					return;
				}
				_stopAllAnimations();
				if (!_releaseAnimData) {
					_releaseAnimData = _initDragReleaseAnimationData();
				}
				_releaseAnimData.calculateSwipeSpeed('x');
				if (_verticalDragInitiated) {
					var opacityRatio = _calculateVerticalDragOpacityRatio();
					if (opacityRatio < _options.verticalDragRange) {
						self.close();
					} else {
						var initalPanY = _panOffset.y,
							initialBgOpacity = _bgOpacity;
						_animateProp('verticalDrag', 0, 1, 300, framework.easing.cubic.out, function(now) {
							_panOffset.y = (self.currItem.initialPosition.y - initalPanY) * now + initalPanY;
							_applyBgOpacity((1 - initialBgOpacity) * now + initialBgOpacity);
							_applyCurrentZoomPan();
						});
						_shout('onVerticalDrag', 1);
					}
					return;
				}
				if ((_mainScrollShifted || _mainScrollAnimating) && numPoints === 0) {
					var itemChanged = _finishSwipeMainScrollGesture(gestureType, _releaseAnimData);
					if (itemChanged) {
						return;
					}
					gestureType = 'zoomPointerUp';
				}
				if (_mainScrollAnimating) {
					return;
				}
				if (gestureType !== 'swipe') {
					_completeZoomGesture();
					return;
				}
				if (!_mainScrollShifted && _currZoomLevel > self.currItem.fitRatio) {
					_completePanGesture(_releaseAnimData);
				}
			},
			_initDragReleaseAnimationData = function() {
				var lastFlickDuration, tempReleasePos;
				var s = {
					lastFlickOffset: {},
					lastFlickDist: {},
					lastFlickSpeed: {},
					slowDownRatio: {},
					slowDownRatioReverse: {},
					speedDecelerationRatio: {},
					speedDecelerationRatioAbs: {},
					distanceOffset: {},
					backAnimDestination: {},
					backAnimStarted: {},
					calculateSwipeSpeed: function(axis) {
						if (_posPoints.length > 1) {
							lastFlickDuration = _getCurrentTime() - _gestureCheckSpeedTime + 50;
							tempReleasePos = _posPoints[_posPoints.length - 2][axis];
						} else {
							lastFlickDuration = _getCurrentTime() - _gestureStartTime;
							tempReleasePos = _startPoint[axis];
						}
						s.lastFlickOffset[axis] = _currPoint[axis] - tempReleasePos;
						s.lastFlickDist[axis] = Math.abs(s.lastFlickOffset[axis]);
						if (s.lastFlickDist[axis] > 20) {
							s.lastFlickSpeed[axis] = s.lastFlickOffset[axis] / lastFlickDuration;
						} else {
							s.lastFlickSpeed[axis] = 0;
						}
						if (Math.abs(s.lastFlickSpeed[axis]) < 0.1) {
							s.lastFlickSpeed[axis] = 0;
						}
						s.slowDownRatio[axis] = 0.95;
						s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis];
						s.speedDecelerationRatio[axis] = 1;
					},
					calculateOverBoundsAnimOffset: function(axis, speed) {
						if (!s.backAnimStarted[axis]) {
							if (_panOffset[axis] > _currPanBounds.min[axis]) {
								s.backAnimDestination[axis] = _currPanBounds.min[axis];
							} else if (_panOffset[axis] < _currPanBounds.max[axis]) {
								s.backAnimDestination[axis] = _currPanBounds.max[axis];
							}
							if (s.backAnimDestination[axis] !== undefined) {
								s.slowDownRatio[axis] = 0.7;
								s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis];
								if (s.speedDecelerationRatioAbs[axis] < 0.05) {
									s.lastFlickSpeed[axis] = 0;
									s.backAnimStarted[axis] = true;
									_animateProp('bounceZoomPan' + axis, _panOffset[axis], s.backAnimDestination[axis], speed || 300, framework.easing.sine.out, function(pos) {
										_panOffset[axis] = pos;
										_applyCurrentZoomPan();
									});
								}
							}
						}
					},
					calculateAnimOffset: function(axis) {
						if (!s.backAnimStarted[axis]) {
							s.speedDecelerationRatio[axis] = s.speedDecelerationRatio[axis] * (s.slowDownRatio[axis] + s.slowDownRatioReverse[axis] - s.slowDownRatioReverse[axis] * s.timeDiff / 10);
							s.speedDecelerationRatioAbs[axis] = Math.abs(s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis]);
							s.distanceOffset[axis] = s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis] * s.timeDiff;
							_panOffset[axis] += s.distanceOffset[axis];
						}
					},
					panAnimLoop: function() {
						if (_animations.zoomPan) {
							_animations.zoomPan.raf = _requestAF(s.panAnimLoop);
							s.now = _getCurrentTime();
							s.timeDiff = s.now - s.lastNow;
							s.lastNow = s.now;
							s.calculateAnimOffset('x');
							s.calculateAnimOffset('y');
							_applyCurrentZoomPan();
							s.calculateOverBoundsAnimOffset('x');
							s.calculateOverBoundsAnimOffset('y');
							if (s.speedDecelerationRatioAbs.x < 0.05 && s.speedDecelerationRatioAbs.y < 0.05) {
								_panOffset.x = Math.round(_panOffset.x);
								_panOffset.y = Math.round(_panOffset.y);
								_applyCurrentZoomPan();
								_stopAnimation('zoomPan');
								return;
							}
						}
					}
				};
				return s;
			},
			_completePanGesture = function(animData) {
				animData.calculateSwipeSpeed('y');
				_currPanBounds = self.currItem.bounds;
				animData.backAnimDestination = {};
				animData.backAnimStarted = {};
				if (Math.abs(animData.lastFlickSpeed.x) <= 0.05 && Math.abs(animData.lastFlickSpeed.y) <= 0.05) {
					animData.speedDecelerationRatioAbs.x = animData.speedDecelerationRatioAbs.y = 0;
					animData.calculateOverBoundsAnimOffset('x');
					animData.calculateOverBoundsAnimOffset('y');
					return true;
				}
				_registerStartAnimation('zoomPan');
				animData.lastNow = _getCurrentTime();
				animData.panAnimLoop();
			},
			_finishSwipeMainScrollGesture = function(gestureType, _releaseAnimData) {
				var itemChanged;
				if (!_mainScrollAnimating) {
					_currZoomedItemIndex = _currentItemIndex;
				}
				var itemsDiff;
				if (gestureType === 'swipe') {
					var totalShiftDist = _currPoint.x - _startPoint.x,
						isFastLastFlick = _releaseAnimData.lastFlickDist.x < 10;
					if (totalShiftDist > MIN_SWIPE_DISTANCE && (isFastLastFlick || _releaseAnimData.lastFlickOffset.x > 20)) {
						itemsDiff = -1;
					} else if (totalShiftDist < -MIN_SWIPE_DISTANCE && (isFastLastFlick || _releaseAnimData.lastFlickOffset.x < -20)) {
						itemsDiff = 1;
					}
				}
				var nextCircle;
				if (itemsDiff) {
					_currentItemIndex += itemsDiff;
					if (_currentItemIndex < 0) {
						_currentItemIndex = _options.loop ? _getNumItems() - 1 : 0;
						nextCircle = true;
					} else if (_currentItemIndex >= _getNumItems()) {
						_currentItemIndex = _options.loop ? 0 : _getNumItems() - 1;
						nextCircle = true;
					}
					if (!nextCircle || _options.loop) {
						_indexDiff += itemsDiff;
						_currPositionIndex -= itemsDiff;
						itemChanged = true;
					}
				}
				var animateToX = _slideSize.x * _currPositionIndex;
				var animateToDist = Math.abs(animateToX - _mainScrollPos.x);
				var finishAnimDuration;
				if (!itemChanged && animateToX > _mainScrollPos.x !== _releaseAnimData.lastFlickSpeed.x > 0) {
					finishAnimDuration = 333;
				} else {
					finishAnimDuration = Math.abs(_releaseAnimData.lastFlickSpeed.x) > 0 ? animateToDist / Math.abs(_releaseAnimData.lastFlickSpeed.x) : 333;
					finishAnimDuration = Math.min(finishAnimDuration, 400);
					finishAnimDuration = Math.max(finishAnimDuration, 250);
				}
				if (_currZoomedItemIndex === _currentItemIndex) {
					itemChanged = false;
				}
				_mainScrollAnimating = true;
				_shout('mainScrollAnimStart');
				_animateProp('mainScroll', _mainScrollPos.x, animateToX, finishAnimDuration, framework.easing.cubic.out, _moveMainScroll, function() {
					_stopAllAnimations();
					_mainScrollAnimating = false;
					_currZoomedItemIndex = -1;
					if (itemChanged || _currZoomedItemIndex !== _currentItemIndex) {
						self.updateCurrItem();
					}
					_shout('mainScrollAnimComplete');
				});
				if (itemChanged) {
					self.updateCurrItem(true);
				}
				return itemChanged;
			},
			_calculateZoomLevel = function(touchesDistance) {
				return 1 / _startPointsDistance * touchesDistance * _startZoomLevel;
			},
			_completeZoomGesture = function() {
				var destZoomLevel = _currZoomLevel,
					minZoomLevel = _getMinZoomLevel(),
					maxZoomLevel = _getMaxZoomLevel();
				if (_currZoomLevel < minZoomLevel) {
					destZoomLevel = minZoomLevel;
				} else if (_currZoomLevel > maxZoomLevel) {
					destZoomLevel = maxZoomLevel;
				}
				var destOpacity = 1,
					onUpdate, initialOpacity = _bgOpacity;
				if (_opacityChanged && !_isZoomingIn && !_wasOverInitialZoom && _currZoomLevel < minZoomLevel) {
					self.close();
					return true;
				}
				if (_opacityChanged) {
					onUpdate = function(now) {
						_applyBgOpacity((destOpacity - initialOpacity) * now + initialOpacity);
					};
				}
				self.zoomTo(destZoomLevel, 0, 200, framework.easing.cubic.out, onUpdate);
				return true;
			};
		_registerModule('Gestures', {
			publicMethods: {
				initGestures: function() {
					var addEventNames = function(pref, down, move, up, cancel) {
						_dragStartEvent = pref + down;
						_dragMoveEvent = pref + move;
						_dragEndEvent = pref + up;
						if (cancel) {
							_dragCancelEvent = pref + cancel;
						} else {
							_dragCancelEvent = '';
						}
					};
					_pointerEventEnabled = _features.pointerEvent;
					if (_pointerEventEnabled && _features.touch) {
						_features.touch = false;
					}
					if (_pointerEventEnabled) {
						if (navigator.pointerEnabled) {
							addEventNames('pointer', 'down', 'move', 'up', 'cancel');
						} else {
							addEventNames('MSPointer', 'Down', 'Move', 'Up', 'Cancel');
						}
					} else if (_features.touch) {
						addEventNames('touch', 'start', 'move', 'end', 'cancel');
						_likelyTouchDevice = true;
					} else {
						addEventNames('mouse', 'down', 'move', 'up');
					}
					_upMoveEvents = _dragMoveEvent + ' ' + _dragEndEvent + ' ' + _dragCancelEvent;
					_downEvents = _dragStartEvent;
					if (_pointerEventEnabled && !_likelyTouchDevice) {
						_likelyTouchDevice = (navigator.maxTouchPoints > 1) || (navigator.msMaxTouchPoints > 1);
					}
					self.likelyTouchDevice = _likelyTouchDevice;
					_globalEventHandlers[_dragStartEvent] = _onDragStart;
					_globalEventHandlers[_dragMoveEvent] = _onDragMove;
					_globalEventHandlers[_dragEndEvent] = _onDragRelease;
					if (_dragCancelEvent) {
						_globalEventHandlers[_dragCancelEvent] = _globalEventHandlers[_dragEndEvent];
					}
					if (_features.touch) {
						_downEvents += ' mousedown';
						_upMoveEvents += ' mousemove mouseup';
						_globalEventHandlers.mousedown = _globalEventHandlers[_dragStartEvent];
						_globalEventHandlers.mousemove = _globalEventHandlers[_dragMoveEvent];
						_globalEventHandlers.mouseup = _globalEventHandlers[_dragEndEvent];
					}
					if (!_likelyTouchDevice) {
						_options.allowPanToNext = false;
					}
				}
			}
		});
		var _showOrHideTimeout, _showOrHide = function(item, img, out, completeFn) {
			if (_showOrHideTimeout) {
				clearTimeout(_showOrHideTimeout);
			}
			_initialZoomRunning = true;
			_initialContentSet = true;
			var thumbBounds;
			if (item.initialLayout) {
				thumbBounds = item.initialLayout;
				item.initialLayout = null;
			} else {
				thumbBounds = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
			}
			var duration = out ? _options.hideAnimationDuration : _options.showAnimationDuration;
			var onComplete = function() {
				_stopAnimation('initialZoom');
				if (!out) {
					_applyBgOpacity(1);
					if (img) {
						img.style.display = 'block';
					}
					framework.addClass(template, 'pswp--animated-in');
					_shout('initialZoom' + (out ? 'OutEnd' : 'InEnd'));
				} else {
					self.template.removeAttribute('style');
					self.bg.removeAttribute('style');
				}
				if (completeFn) {
					completeFn();
				}
				_initialZoomRunning = false;
			};
			if (!duration || !thumbBounds || thumbBounds.x === undefined) {
				_shout('initialZoom' + (out ? 'Out' : 'In'));
				_currZoomLevel = item.initialZoomLevel;
				_equalizePoints(_panOffset, item.initialPosition);
				_applyCurrentZoomPan();
				template.style.opacity = out ? 0 : 1;
				_applyBgOpacity(1);
				if (duration) {
					setTimeout(function() {
						onComplete();
					}, duration);
				} else {
					onComplete();
				}
				return;
			}
			var startAnimation = function() {
				var closeWithRaf = _closedByScroll,
					fadeEverything = !self.currItem.src || self.currItem.loadError || _options.showHideOpacity;
				if (item.miniImg) {
					item.miniImg.style.webkitBackfaceVisibility = 'hidden';
				}
				if (!out) {
					_currZoomLevel = thumbBounds.w / item.w;
					_panOffset.x = thumbBounds.x;
					_panOffset.y = thumbBounds.y - _initalWindowScrollY;
					self[fadeEverything ? 'template' : 'bg'].style.opacity = 0.001;
					_applyCurrentZoomPan();
				}
				_registerStartAnimation('initialZoom');
				if (out && !closeWithRaf) {
					framework.removeClass(template, 'pswp--animated-in');
					framework.addClass(template, 'pswp--animated-out');
				}
				if (fadeEverything) {
					if (out) {
						framework[(closeWithRaf ? 'remove' : 'add') + 'Class'](template, 'pswp--animate_opacity');
					} else {
						setTimeout(function() {
							framework.addClass(template, 'pswp--animate_opacity');
						}, 30);
					}
				}
				_showOrHideTimeout = setTimeout(function() {
					_shout('initialZoom' + (out ? 'Out' : 'In'));
					if (!out) {
						_currZoomLevel = item.initialZoomLevel;
						_equalizePoints(_panOffset, item.initialPosition);
						_applyCurrentZoomPan();
						_applyBgOpacity(1);
						if (fadeEverything) {
							template.style.opacity = 1;
						} else {
							_applyBgOpacity(1);
						}
						_showOrHideTimeout = setTimeout(onComplete, duration + 20);
					} else {
						var destZoomLevel = thumbBounds.w / item.w,
							initialPanOffset = {
								x: _panOffset.x,
								y: _panOffset.y
							},
							initialZoomLevel = _currZoomLevel,
							initalBgOpacity = _bgOpacity,
							onUpdate = function(now) {
								if (now === 1) {
									_currZoomLevel = destZoomLevel;
									_panOffset.x = thumbBounds.x;
									_panOffset.y = thumbBounds.y - _currentWindowScrollY;
								} else {
									_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
									_panOffset.x = (thumbBounds.x - initialPanOffset.x) * now + initialPanOffset.x;
									_panOffset.y = (thumbBounds.y - _currentWindowScrollY - initialPanOffset.y) * now + initialPanOffset.y;
								}
								_applyCurrentZoomPan();
								if (fadeEverything) {
									template.style.opacity = 1 - now;
								} else {
									_applyBgOpacity(initalBgOpacity - now * initalBgOpacity);
								}
							};
						if (closeWithRaf) {
							_animateProp('initialZoom', 0, 1, duration, framework.easing.cubic.out, onUpdate, onComplete);
						} else {
							onUpdate(1);
							_showOrHideTimeout = setTimeout(onComplete, duration + 20);
						}
					}
				}, out ? 25 : 90);
			};
			startAnimation();
		};
		var _items, _tempPanAreaSize = {},
			_imagesToAppendPool = [],
			_initialContentSet, _initialZoomRunning, _controllerDefaultOptions = {
				index: 0,
				errorMsg: '<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
				forceProgressiveLoading: false,
				preload: [1, 1],
				getNumItemsFn: function() {
					return _items.length;
				}
			};
		var _getItemAt, _getNumItems, _initialIsLoop, _getZeroBounds = function() {
				return {
					center: {
						x: 0,
						y: 0
					},
					max: {
						x: 0,
						y: 0
					},
					min: {
						x: 0,
						y: 0
					}
				};
			},
			_calculateSingleItemPanBounds = function(item, realPanElementW, realPanElementH) {
				var bounds = item.bounds;
				bounds.center.x = Math.round((_tempPanAreaSize.x - realPanElementW) / 2);
				bounds.center.y = Math.round((_tempPanAreaSize.y - realPanElementH) / 2) + item.vGap.top;
				bounds.max.x = (realPanElementW > _tempPanAreaSize.x) ? Math.round(_tempPanAreaSize.x - realPanElementW) : bounds.center.x;
				bounds.max.y = (realPanElementH > _tempPanAreaSize.y) ? Math.round(_tempPanAreaSize.y - realPanElementH) + item.vGap.top : bounds.center.y;
				bounds.min.x = (realPanElementW > _tempPanAreaSize.x) ? 0 : bounds.center.x;
				bounds.min.y = (realPanElementH > _tempPanAreaSize.y) ? item.vGap.top : bounds.center.y;
			},
			_calculateItemSize = function(item, viewportSize, zoomLevel) {
				if (item.src && !item.loadError) {
					var isInitial = !zoomLevel;
					if (isInitial) {
						if (!item.vGap) {
							item.vGap = {
								top: 0,
								bottom: 0
							};
						}
						_shout('parseVerticalMargin', item);
					}
					_tempPanAreaSize.x = viewportSize.x;
					_tempPanAreaSize.y = viewportSize.y - item.vGap.top - item.vGap.bottom;
					if (isInitial) {
						var hRatio = _tempPanAreaSize.x / item.w;
						var vRatio = _tempPanAreaSize.y / item.h;
						item.fitRatio = hRatio < vRatio ? hRatio : vRatio;
						var scaleMode = _options.scaleMode;
						if (scaleMode === 'orig') {
							zoomLevel = 1;
						} else if (scaleMode === 'fit') {
							zoomLevel = item.fitRatio;
						}
						if (zoomLevel > 1) {
							zoomLevel = 1;
						}
						item.initialZoomLevel = zoomLevel;
						if (!item.bounds) {
							item.bounds = _getZeroBounds();
						}
					}
					if (!zoomLevel) {
						return;
					}
					_calculateSingleItemPanBounds(item, item.w * zoomLevel, item.h * zoomLevel);
					if (isInitial && zoomLevel === item.initialZoomLevel) {
						item.initialPosition = item.bounds.center;
					}
					return item.bounds;
				} else {
					item.w = item.h = 0;
					item.initialZoomLevel = item.fitRatio = 1;
					item.bounds = _getZeroBounds();
					item.initialPosition = item.bounds.center;
					return item.bounds;
				}
				return false;
			},
			_appendImage = function(index, item, baseDiv, img, preventAnimation, keepPlaceholder) {
				if (item.loadError) {
					return;
				}
				if (img) {
					item.imageAppended = true;
					_setImageSize(item, img, (item === self.currItem && _renderMaxResolution));
					baseDiv.appendChild(img);
					if (keepPlaceholder) {
						setTimeout(function() {
							if (item && item.loaded && item.placeholder) {
								item.placeholder.style.display = 'none';
								item.placeholder = null;
							}
						}, 500);
					}
				}
			},
			_preloadImage = function(item) {
				item.loading = true;
				item.loaded = false;
				var img = item.img = framework.createEl('pswp__img', 'img');
				var onComplete = function() {
					item.loading = false;
					item.loaded = true;
					if (item.loadComplete) {
						item.loadComplete(item);
					} else {
						item.img = null;
					}
					img.onload = img.onerror = null;
					img = null;
				};
				img.onload = onComplete;
				img.onerror = function() {
					item.loadError = true;
					onComplete();
				};
				img.src = item.src;
				return img;
			},
			_checkForError = function(item, cleanUp) {
				if (item.src && item.loadError && item.container) {
					if (cleanUp) {
						item.container.innerHTML = '';
					}
					item.container.innerHTML = _options.errorMsg.replace('%url%', item.src);
					return true;
				}
			},
			_setImageSize = function(item, img, maxRes) {
				if (!item.src) {
					return;
				}
				if (!img) {
					img = item.container.lastChild;
				}
				var w = maxRes ? item.w : Math.round(item.w * item.fitRatio),
					h = maxRes ? item.h : Math.round(item.h * item.fitRatio);
				if (item.placeholder && !item.loaded) {
					item.placeholder.style.width = w + 'px';
					item.placeholder.style.height = h + 'px';
				}
				img.style.width = w + 'px';
				img.style.height = h + 'px';
			},
			_appendImagesPool = function() {
				if (_imagesToAppendPool.length) {
					var poolItem;
					for (var i = 0; i < _imagesToAppendPool.length; i++) {
						poolItem = _imagesToAppendPool[i];
						if (poolItem.holder.index === poolItem.index) {
							_appendImage(poolItem.index, poolItem.item, poolItem.baseDiv, poolItem.img, false, poolItem.clearPlaceholder);
						}
					}
					_imagesToAppendPool = [];
				}
			};
		_registerModule('Controller', {
			publicMethods: {
				lazyLoadItem: function(index) {
					index = _getLoopedId(index);
					var item = _getItemAt(index);
					if (!item || ((item.loaded || item.loading) && !_itemsNeedUpdate)) {
						return;
					}
					_shout('gettingData', index, item);
					if (!item.src) {
						return;
					}
					_preloadImage(item);
				},
				initController: function() {
					framework.extend(_options, _controllerDefaultOptions, true);
					self.items = _items = items;
					_getItemAt = self.getItemAt;
					_getNumItems = _options.getNumItemsFn;
					_initialIsLoop = _options.loop;
					if (_getNumItems() < 3) {
						_options.loop = false;
					}
					_listen('beforeChange', function(diff) {
						var p = _options.preload,
							isNext = diff === null ? true : (diff >= 0),
							preloadBefore = Math.min(p[0], _getNumItems()),
							preloadAfter = Math.min(p[1], _getNumItems()),
							i;
						for (i = 1; i <= (isNext ? preloadAfter : preloadBefore); i++) {
							self.lazyLoadItem(_currentItemIndex + i);
						}
						for (i = 1; i <= (isNext ? preloadBefore : preloadAfter); i++) {
							self.lazyLoadItem(_currentItemIndex - i);
						}
					});
					_listen('initialLayout', function() {
						self.currItem.initialLayout = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
					});
					_listen('mainScrollAnimComplete', _appendImagesPool);
					_listen('initialZoomInEnd', _appendImagesPool);
					_listen('destroy', function() {
						var item;
						for (var i = 0; i < _items.length; i++) {
							item = _items[i];
							if (item.container) {
								item.container = null;
							}
							if (item.placeholder) {
								item.placeholder = null;
							}
							if (item.img) {
								item.img = null;
							}
							if (item.preloader) {
								item.preloader = null;
							}
							if (item.loadError) {
								item.loaded = item.loadError = false;
							}
						}
						_imagesToAppendPool = null;
					});
				},
				getItemAt: function(index) {
					if (index >= 0) {
						return _items[index] !== undefined ? _items[index] : false;
					}
					return false;
				},
				allowProgressiveImg: function() {
					return _options.forceProgressiveLoading || !_likelyTouchDevice || _options.mouseUsed || screen.width > 1200;
				},
				setContent: function(holder, index) {
					if (_options.loop) {
						index = _getLoopedId(index);
					}
					var prevItem = self.getItemAt(holder.index);
					if (prevItem) {
						prevItem.container = null;
					}
					var item = self.getItemAt(index),
						img;
					if (!item) {
						holder.el.innerHTML = '';
						return;
					}
					_shout('gettingData', index, item);
					holder.index = index;
					holder.item = item;
					var baseDiv = item.container = framework.createEl('pswp__zoom-wrap');
					if (!item.src && item.html) {
						if (item.html.tagName) {
							baseDiv.appendChild(item.html);
						} else {
							baseDiv.innerHTML = item.html;
						}
					}
					_checkForError(item);
					_calculateItemSize(item, _viewportSize);
					if (item.src && !item.loadError && !item.loaded) {
						item.loadComplete = function(item) {
							if (!_isOpen) {
								return;
							}
							if (holder && holder.index === index) {
								if (_checkForError(item, true)) {
									item.loadComplete = item.img = null;
									_calculateItemSize(item, _viewportSize);
									_applyZoomPanToItem(item);
									if (holder.index === _currentItemIndex) {
										self.updateCurrZoomItem();
									}
									return;
								}
								if (!item.imageAppended) {
									if (_features.transform && (_mainScrollAnimating || _initialZoomRunning)) {
										_imagesToAppendPool.push({
											item: item,
											baseDiv: baseDiv,
											img: item.img,
											index: index,
											holder: holder,
											clearPlaceholder: true
										});
									} else {
										_appendImage(index, item, baseDiv, item.img, _mainScrollAnimating || _initialZoomRunning, true);
									}
								} else {
									if (!_initialZoomRunning && item.placeholder) {
										item.placeholder.style.display = 'none';
										item.placeholder = null;
									}
								}
							}
							item.loadComplete = null;
							item.img = null;
							_shout('imageLoadComplete', index, item);
						};
						if (framework.features.transform) {
							var placeholderClassName = 'pswp__img pswp__img--placeholder';
							placeholderClassName += (item.msrc ? '' : ' pswp__img--placeholder--blank');
							var placeholder = framework.createEl(placeholderClassName, item.msrc ? 'img' : '');
							if (item.msrc) {
								placeholder.src = item.msrc;
							}
							_setImageSize(item, placeholder);
							baseDiv.appendChild(placeholder);
							item.placeholder = placeholder;
						}
						if (!item.loading) {
							_preloadImage(item);
						}
						if (self.allowProgressiveImg()) {
							if (!_initialContentSet && _features.transform) {
								_imagesToAppendPool.push({
									item: item,
									baseDiv: baseDiv,
									img: item.img,
									index: index,
									holder: holder
								});
							} else {
								_appendImage(index, item, baseDiv, item.img, true, true);
							}
						}
					} else if (item.src && !item.loadError) {
						img = framework.createEl('pswp__img', 'img');
						img.style.opacity = 1;
						img.src = item.src;
						_setImageSize(item, img);
						_appendImage(index, item, baseDiv, img, true);
					}
					if (!_initialContentSet && index === _currentItemIndex) {
						_currZoomElementStyle = baseDiv.style;
						_showOrHide(item, (img || item.img));
					} else {
						_applyZoomPanToItem(item);
					}
					holder.el.innerHTML = '';
					holder.el.appendChild(baseDiv);
				},
				cleanSlide: function(item) {
					if (item.img) {
						item.img.onload = item.img.onerror = null;
					}
					item.loaded = item.loading = item.img = item.imageAppended = false;
				}
			}
		});
		var tapTimer, tapReleasePoint = {},
			_dispatchTapEvent = function(origEvent, releasePoint, pointerType) {
				var e = document.createEvent('CustomEvent'),
					eDetail = {
						origEvent: origEvent,
						target: origEvent.target,
						releasePoint: releasePoint,
						pointerType: pointerType || 'touch'
					};
				e.initCustomEvent('pswpTap', true, true, eDetail);
				origEvent.target.dispatchEvent(e);
			};
		_registerModule('Tap', {
			publicMethods: {
				initTap: function() {
					_listen('firstTouchStart', self.onTapStart);
					_listen('touchRelease', self.onTapRelease);
					_listen('destroy', function() {
						tapReleasePoint = {};
						tapTimer = null;
					});
				},
				onTapStart: function(touchList) {
					if (touchList.length > 1) {
						clearTimeout(tapTimer);
						tapTimer = null;
					}
				},
				onTapRelease: function(e, releasePoint) {
					if (!releasePoint) {
						return;
					}
					if (!_moved && !_isMultitouch && !_numAnimations) {
						var p0 = releasePoint;
						if (tapTimer) {
							clearTimeout(tapTimer);
							tapTimer = null;
							if (_isNearbyPoints(p0, tapReleasePoint)) {
								_shout('doubleTap', p0);
								return;
							}
						}
						if (releasePoint.type === 'mouse') {
							_dispatchTapEvent(e, releasePoint, 'mouse');
							return;
						}
						var clickedTagName = e.target.tagName.toUpperCase();
						if (clickedTagName === 'BUTTON' || framework.hasClass(e.target, 'pswp__single-tap')) {
							_dispatchTapEvent(e, releasePoint);
							return;
						}
						_equalizePoints(tapReleasePoint, p0);
						tapTimer = setTimeout(function() {
							_dispatchTapEvent(e, releasePoint);
							tapTimer = null;
						}, 300);
					}
				}
			}
		});
		var _wheelDelta;
		_registerModule('DesktopZoom', {
			publicMethods: {
				initDesktopZoom: function() {
					if (_oldIE) {
						return;
					}
					if (_likelyTouchDevice) {
						_listen('mouseUsed', function() {
							self.setupDesktopZoom();
						});
					} else {
						self.setupDesktopZoom(true);
					}
				},
				setupDesktopZoom: function(onInit) {
					_wheelDelta = {};
					var events = 'wheel mousewheel DOMMouseScroll';
					_listen('bindEvents', function() {
						framework.bind(template, events, self.handleMouseWheel);
					});
					_listen('unbindEvents', function() {
						if (_wheelDelta) {
							framework.unbind(template, events, self.handleMouseWheel);
						}
					});
					self.mouseZoomedIn = false;
					var hasDraggingClass, updateZoomable = function() {
							if (self.mouseZoomedIn) {
								framework.removeClass(template, 'pswp--zoomed-in');
								self.mouseZoomedIn = false;
							}
							if (_currZoomLevel < 1) {
								framework.addClass(template, 'pswp--zoom-allowed');
							} else {
								framework.removeClass(template, 'pswp--zoom-allowed');
							}
							removeDraggingClass();
						},
						removeDraggingClass = function() {
							if (hasDraggingClass) {
								framework.removeClass(template, 'pswp--dragging');
								hasDraggingClass = false;
							}
						};
					_listen('resize', updateZoomable);
					_listen('afterChange', updateZoomable);
					_listen('pointerDown', function() {
						if (self.mouseZoomedIn) {
							hasDraggingClass = true;
							framework.addClass(template, 'pswp--dragging');
						}
					});
					_listen('pointerUp', removeDraggingClass);
					if (!onInit) {
						updateZoomable();
					}
				},
				handleMouseWheel: function(e) {
					if (_currZoomLevel <= self.currItem.fitRatio) {
						if (_options.modal) {
							if (!_options.closeOnScroll || _numAnimations || _isDragging) {
								e.preventDefault();
							} else if (_transformKey && Math.abs(e.deltaY) > 2) {
								_closedByScroll = true;
								self.close();
							}
						}
						return true;
					}
					e.stopPropagation();
					_wheelDelta.x = 0;
					if ('deltaX' in e) {
						if (e.deltaMode === 1) {
							_wheelDelta.x = e.deltaX * 18;
							_wheelDelta.y = e.deltaY * 18;
						} else {
							_wheelDelta.x = e.deltaX;
							_wheelDelta.y = e.deltaY;
						}
					} else if ('wheelDelta' in e) {
						if (e.wheelDeltaX) {
							_wheelDelta.x = -0.16 * e.wheelDeltaX;
						}
						if (e.wheelDeltaY) {
							_wheelDelta.y = -0.16 * e.wheelDeltaY;
						} else {
							_wheelDelta.y = -0.16 * e.wheelDelta;
						}
					} else if ('detail' in e) {
						_wheelDelta.y = e.detail;
					} else {
						return;
					}
					_calculatePanBounds(_currZoomLevel, true);
					var newPanX = _panOffset.x - _wheelDelta.x,
						newPanY = _panOffset.y - _wheelDelta.y;
					if (_options.modal || (newPanX <= _currPanBounds.min.x && newPanX >= _currPanBounds.max.x && newPanY <= _currPanBounds.min.y && newPanY >= _currPanBounds.max.y)) {
						e.preventDefault();
					}
					self.panTo(newPanX, newPanY);
				},
				toggleDesktopZoom: function(centerPoint) {
					centerPoint = centerPoint || {
						x: _viewportSize.x / 2 + _offset.x,
						y: _viewportSize.y / 2 + _offset.y
					};
					var doubleTapZoomLevel = _options.getDoubleTapZoom(true, self.currItem);
					var zoomOut = _currZoomLevel === doubleTapZoomLevel;
					self.mouseZoomedIn = !zoomOut;
					self.zoomTo(zoomOut ? self.currItem.initialZoomLevel : doubleTapZoomLevel, centerPoint, 333);
					framework[(!zoomOut ? 'add' : 'remove') + 'Class'](template, 'pswp--zoomed-in');
				}
			}
		});
		var _historyDefaultOptions = {
			history: true,
			galleryUID: 1
		};
		var _historyUpdateTimeout, _hashChangeTimeout, _hashAnimCheckTimeout, _hashChangedByScript, _hashChangedByHistory, _hashReseted, _initialHash, _historyChanged, _closedFromURL, _urlChangedOnce, _windowLoc, _supportsPushState, _getHash = function() {
				return _windowLoc.hash.substring(1);
			},
			_cleanHistoryTimeouts = function() {
				if (_historyUpdateTimeout) {
					clearTimeout(_historyUpdateTimeout);
				}
				if (_hashAnimCheckTimeout) {
					clearTimeout(_hashAnimCheckTimeout);
				}
			},
			_parseItemIndexFromURL = function() {
				var hash = _getHash(),
					params = {};
				if (hash.length < 5) {
					return params;
				}
				var i, vars = hash.split('&');
				for (i = 0; i < vars.length; i++) {
					if (!vars[i]) {
						continue;
					}
					var pair = vars[i].split('=');
					if (pair.length < 2) {
						continue;
					}
					params[pair[0]] = pair[1];
				}
				if (_options.galleryPIDs) {
					var searchfor = params.pid;
					params.pid = 0;
					for (i = 0; i < _items.length; i++) {
						if (_items[i].pid === searchfor) {
							params.pid = i;
							break;
						}
					}
				} else {
					params.pid = parseInt(params.pid, 10) - 1;
				}
				if (params.pid < 0) {
					params.pid = 0;
				}
				return params;
			},
			_updateHash = function() {
				if (_hashAnimCheckTimeout) {
					clearTimeout(_hashAnimCheckTimeout);
				}
				if (_numAnimations || _isDragging) {
					_hashAnimCheckTimeout = setTimeout(_updateHash, 500);
					return;
				}
				if (_hashChangedByScript) {
					clearTimeout(_hashChangeTimeout);
				} else {
					_hashChangedByScript = true;
				}
				var pid = (_currentItemIndex + 1);
				var item = _getItemAt(_currentItemIndex);
				if (item.hasOwnProperty('pid')) {
					pid = item.pid;
				}
				var newHash = _initialHash + '&' + 'gid=' + _options.galleryUID + '&' + 'pid=' + pid;
				if (!_historyChanged) {
					if (_windowLoc.hash.indexOf(newHash) === -1) {
						_urlChangedOnce = true;
					}
				}
				var newURL = _windowLoc.href.split('#')[0] + '#' + newHash;
				if (_supportsPushState) {
					if ('#' + newHash !== window.location.hash) {
						history[_historyChanged ? 'replaceState' : 'pushState']('', document.title, newURL);
					}
				} else {
					if (_historyChanged) {
						_windowLoc.replace(newURL);
					} else {
						_windowLoc.hash = newHash;
					}
				}
				_historyChanged = true;
				_hashChangeTimeout = setTimeout(function() {
					_hashChangedByScript = false;
				}, 60);
			};
		_registerModule('History', {
			publicMethods: {
				initHistory: function() {
					framework.extend(_options, _historyDefaultOptions, true);
					if (!_options.history) {
						return;
					}
					_windowLoc = window.location;
					_urlChangedOnce = false;
					_closedFromURL = false;
					_historyChanged = false;
					_initialHash = _getHash();
					_supportsPushState = ('pushState' in history);
					if (_initialHash.indexOf('gid=') > -1) {
						_initialHash = _initialHash.split('&gid=')[0];
						_initialHash = _initialHash.split('?gid=')[0];
					}
					_listen('afterChange', self.updateURL);
					_listen('unbindEvents', function() {
						framework.unbind(window, 'hashchange', self.onHashChange);
					});
					var returnToOriginal = function() {
						_hashReseted = true;
						if (!_closedFromURL) {
							if (_urlChangedOnce) {
								history.back();
							} else {
								if (_initialHash) {
									_windowLoc.hash = _initialHash;
								} else {
									if (_supportsPushState) {
										history.pushState('', document.title, _windowLoc.pathname + _windowLoc.search);
									} else {
										_windowLoc.hash = '';
									}
								}
							}
						}
						_cleanHistoryTimeouts();
					};
					_listen('unbindEvents', function() {
						if (_closedByScroll) {
							returnToOriginal();
						}
					});
					_listen('destroy', function() {
						if (!_hashReseted) {
							returnToOriginal();
						}
					});
					_listen('firstUpdate', function() {
						_currentItemIndex = _parseItemIndexFromURL().pid;
					});
					var index = _initialHash.indexOf('pid=');
					if (index > -1) {
						_initialHash = _initialHash.substring(0, index);
						if (_initialHash.slice(-1) === '&') {
							_initialHash = _initialHash.slice(0, -1);
						}
					}
					setTimeout(function() {
						if (_isOpen) {
							framework.bind(window, 'hashchange', self.onHashChange);
						}
					}, 40);
				},
				onHashChange: function() {
					if (_getHash() === _initialHash) {
						_closedFromURL = true;
						self.close();
						return;
					}
					if (!_hashChangedByScript) {
						_hashChangedByHistory = true;
						self.goTo(_parseItemIndexFromURL().pid);
						_hashChangedByHistory = false;
					}
				},
				updateURL: function() {
					_cleanHistoryTimeouts();
					if (_hashChangedByHistory) {
						return;
					}
					if (!_historyChanged) {
						_updateHash();
					} else {
						_historyUpdateTimeout = setTimeout(_updateHash, 800);
					}
				}
			}
		});
		framework.extend(self, publicMethods);
	};
	return PhotoSwipe;
});
/*! PhotoSwipe Default UI - 4.1.0 - 2015-07-11
 * http://photoswipe.com
 * Copyright (c) 2015 Dmitry Semenov; */
! function(a, b) {
	"function" == typeof define && define.amd ? define(b) : "object" == typeof exports ? module.exports = b() : a.PhotoSwipeUI_Default = b()
}(this, function() {
	"use strict";
	var a = function(a, b) {
		var c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v = this,
			w = !1,
			x = !0,
			y = !0,
			z = {
				barsSize: {
					top: 44,
					bottom: "auto"
				},
				closeElClasses: ["item", "caption", "zoom-wrap", "ui", "top-bar"],
				timeToIdle: 4e3,
				timeToIdleOutside: 1e3,
				loadingIndicatorDelay: 1e3,
				addCaptionHTMLFn: function(a, b) {
					return a.title ? (b.children[0].innerHTML = a.title, !0) : (b.children[0].innerHTML = "", !1)
				},
				closeEl: !0,
				captionEl: !0,
				fullscreenEl: !0,
				zoomEl: !0,
				shareEl: !0,
				counterEl: !0,
				arrowEl: !0,
				preloaderEl: !0,
				tapToClose: !1,
				tapToToggleControls: !0,
				clickToCloseNonZoomable: !0,
				shareButtons: [{
					id: "facebook",
					label: "Share on Facebook",
					url: "https://www.facebook.com/sharer/sharer.php?u={{url}}"
				}, {
					id: "twitter",
					label: "Tweet",
					url: "https://twitter.com/intent/tweet?text={{text}}&url={{url}}"
				}, {
					id: "pinterest",
					label: "Pin it",
					url: "http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}"
				}, {
					id: "download",
					label: "Download image",
					url: "{{raw_image_url}}",
					download: !0
				}],
				getImageURLForShare: function() {
					return a.currItem.src || ""
				},
				getPageURLForShare: function() {
					return window.location.href
				},
				getTextForShare: function() {
					return a.currItem.title || ""
				},
				indexIndicatorSep: " / "
			},
			A = function(a) {
				if (r) return !0;
				a = a || window.event, q.timeToIdle && q.mouseUsed && !k && K();
				for (var c, d, e = a.target || a.srcElement, f = e.className, g = 0; g < S.length; g++) c = S[g], c.onTap && f.indexOf("pswp__" + c.name) > -1 && (c.onTap(), d = !0);
				if (d) {
					a.stopPropagation && a.stopPropagation(), r = !0;
					var h = b.features.isOldAndroid ? 600 : 30;
					s = setTimeout(function() {
						r = !1
					}, h)
				}
			},
			B = function() {
				return !a.likelyTouchDevice || q.mouseUsed || screen.width > 1200
			},
			C = function(a, c, d) {
				b[(d ? "add" : "remove") + "Class"](a, "pswp__" + c)
			},
			D = function() {
				var a = 1 === q.getNumItemsFn();
				a !== p && (C(d, "ui--one-slide", a), p = a)
			},
			E = function() {
				C(i, "share-modal--hidden", y)
			},
			F = function() {
				return y = !y, y ? (b.removeClass(i, "pswp__share-modal--fade-in"), setTimeout(function() {
					y && E()
				}, 300)) : (E(), setTimeout(function() {
					y || b.addClass(i, "pswp__share-modal--fade-in")
				}, 30)), y || H(), !1
			},
			G = function(b) {
				b = b || window.event;
				var c = b.target || b.srcElement;
				return a.shout("shareLinkClick", b, c), c.href ? c.hasAttribute("download") ? !0 : (window.open(c.href, "pswp_share", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left=" + (window.screen ? Math.round(screen.width / 2 - 275) : 100)), y || F(), !1) : !1
			},
			H = function() {
				for (var a, b, c, d, e, f = "", g = 0; g < q.shareButtons.length; g++) a = q.shareButtons[g], c = q.getImageURLForShare(a), d = q.getPageURLForShare(a), e = q.getTextForShare(a), b = a.url.replace("{{url}}", encodeURIComponent(d)).replace("{{image_url}}", encodeURIComponent(c)).replace("{{raw_image_url}}", c).replace("{{text}}", encodeURIComponent(e)), f += '<a href="' + b + '" target="_blank" class="pswp__share--' + a.id + '"' + (a.download ? "download" : "") + ">" + a.label + "</a>", q.parseShareButtonOut && (f = q.parseShareButtonOut(a, f));
				i.children[0].innerHTML = f, i.children[0].onclick = G
			},
			I = function(a) {
				for (var c = 0; c < q.closeElClasses.length; c++)
					if (b.hasClass(a, "pswp__" + q.closeElClasses[c])) return !0
			},
			J = 0,
			K = function() {
				clearTimeout(u), J = 0, k && v.setIdle(!1)
			},
			L = function(a) {
				a = a ? a : window.event;
				var b = a.relatedTarget || a.toElement;
				b && "HTML" !== b.nodeName || (clearTimeout(u), u = setTimeout(function() {
					v.setIdle(!0)
				}, q.timeToIdleOutside))
			},
			M = function() {
				q.fullscreenEl && (c || (c = v.getFullscreenAPI()), c ? (b.bind(document, c.eventK, v.updateFullscreen), v.updateFullscreen(), b.addClass(a.template, "pswp--supports-fs")) : b.removeClass(a.template, "pswp--supports-fs"))
			},
			N = function() {
				q.preloaderEl && (O(!0), l("beforeChange", function() {
					clearTimeout(o), o = setTimeout(function() {
						a.currItem && a.currItem.loading ? (!a.allowProgressiveImg() || a.currItem.img && !a.currItem.img.naturalWidth) && O(!1) : O(!0)
					}, q.loadingIndicatorDelay)
				}), l("imageLoadComplete", function(b, c) {
					a.currItem === c && O(!0)
				}))
			},
			O = function(a) {
				n !== a && (C(m, "preloader--active", !a), n = a)
			},
			P = function(a) {
				var c = a.vGap;
				if (B()) {
					var g = q.barsSize;
					if (q.captionEl && "auto" === g.bottom)
						if (f || (f = b.createEl("pswp__caption pswp__caption--fake"), f.appendChild(b.createEl("pswp__caption__center")), d.insertBefore(f, e), b.addClass(d, "pswp__ui--fit")), q.addCaptionHTMLFn(a, f, !0)) {
							var h = f.clientHeight;
							c.bottom = parseInt(h, 10) || 44
						} else c.bottom = g.top;
					else c.bottom = "auto" === g.bottom ? 0 : g.bottom;
					c.top = g.top
				} else c.top = c.bottom = 0
			},
			Q = function() {
				q.timeToIdle && l("mouseUsed", function() {
					b.bind(document, "mousemove", K), b.bind(document, "mouseout", L), t = setInterval(function() {
						J++, 2 === J && v.setIdle(!0)
					}, q.timeToIdle / 2)
				})
			},
			R = function() {
				l("onVerticalDrag", function(a) {
					x && .95 > a ? v.hideControls() : !x && a >= .95 && v.showControls()
				});
				var a;
				l("onPinchClose", function(b) {
					x && .9 > b ? (v.hideControls(), a = !0) : a && !x && b > .9 && v.showControls()
				}), l("zoomGestureEnded", function() {
					a = !1, a && !x && v.showControls()
				})
			},
			S = [{
				name: "caption",
				option: "captionEl",
				onInit: function(a) {
					e = a
				}
			}, {
				name: "share-modal",
				option: "shareEl",
				onInit: function(a) {
					i = a
				},
				onTap: function() {
					F()
				}
			}, {
				name: "button--share",
				option: "shareEl",
				onInit: function(a) {
					h = a
				},
				onTap: function() {
					F()
				}
			}, {
				name: "button--zoom",
				option: "zoomEl",
				onTap: a.toggleDesktopZoom
			}, {
				name: "counter",
				option: "counterEl",
				onInit: function(a) {
					g = a
				}
			}, {
				name: "button--close",
				option: "closeEl",
				onTap: a.close
			}, {
				name: "button--arrow--left",
				option: "arrowEl",
				onTap: a.prev
			}, {
				name: "button--arrow--right",
				option: "arrowEl",
				onTap: a.next
			}, {
				name: "button--fs",
				option: "fullscreenEl",
				onTap: function() {
					c.isFullscreen() ? c.exit() : c.enter()
				}
			}, {
				name: "preloader",
				option: "preloaderEl",
				onInit: function(a) {
					m = a
				}
			}],
			T = function() {
				var a, c, e, f = function(d) {
					if (d)
						for (var f = d.length, g = 0; f > g; g++) {
							a = d[g], c = a.className;
							for (var h = 0; h < S.length; h++) e = S[h], c.indexOf("pswp__" + e.name) > -1 && (q[e.option] ? (b.removeClass(a, "pswp__element--disabled"), e.onInit && e.onInit(a)) : b.addClass(a, "pswp__element--disabled"))
						}
				};
				f(d.children);
				var g = b.getChildByClass(d, "pswp__top-bar");
				g && f(g.children)
			};
		v.init = function() {
			b.extend(a.options, z, !0), q = a.options, d = b.getChildByClass(a.scrollWrap, "pswp__ui"), l = a.listen, R(), l("beforeChange", v.update), l("doubleTap", function(b) {
				var c = a.currItem.initialZoomLevel;
				a.getZoomLevel() !== c ? a.zoomTo(c, b, 333) : a.zoomTo(q.getDoubleTapZoom(!1, a.currItem), b, 333)
			}), l("preventDragEvent", function(a, b, c) {
				var d = a.target || a.srcElement;
				d && d.className && a.type.indexOf("mouse") > -1 && (d.className.indexOf("__caption") > 0 || /(SMALL|STRONG|EM)/i.test(d.tagName)) && (c.prevent = !1)
			}), l("bindEvents", function() {
				b.bind(d, "pswpTap click", A), b.bind(a.scrollWrap, "pswpTap", v.onGlobalTap), a.likelyTouchDevice || b.bind(a.scrollWrap, "mouseover", v.onMouseOver)
			}), l("unbindEvents", function() {
				y || F(), t && clearInterval(t), b.unbind(document, "mouseout", L), b.unbind(document, "mousemove", K), b.unbind(d, "pswpTap click", A), b.unbind(a.scrollWrap, "pswpTap", v.onGlobalTap), b.unbind(a.scrollWrap, "mouseover", v.onMouseOver), c && (b.unbind(document, c.eventK, v.updateFullscreen), c.isFullscreen() && (q.hideAnimationDuration = 0, c.exit()), c = null)
			}), l("destroy", function() {
				q.captionEl && (f && d.removeChild(f), b.removeClass(e, "pswp__caption--empty")), i && (i.children[0].onclick = null), b.removeClass(d, "pswp__ui--over-close"), b.addClass(d, "pswp__ui--hidden"), v.setIdle(!1)
			}), q.showAnimationDuration || b.removeClass(d, "pswp__ui--hidden"), l("initialZoomIn", function() {
				q.showAnimationDuration && b.removeClass(d, "pswp__ui--hidden")
			}), l("initialZoomOut", function() {
				b.addClass(d, "pswp__ui--hidden")
			}), l("parseVerticalMargin", P), T(), q.shareEl && h && i && (y = !0), D(), Q(), M(), N()
		}, v.setIdle = function(a) {
			k = a, C(d, "ui--idle", a)
		}, v.update = function() {
			x && a.currItem ? (v.updateIndexIndicator(), q.captionEl && (q.addCaptionHTMLFn(a.currItem, e), C(e, "caption--empty", !a.currItem.title)), w = !0) : w = !1, y || F(), D()
		}, v.updateFullscreen = function(d) {
			d && setTimeout(function() {
				a.setScrollOffset(0, b.getScrollY())
			}, 50), b[(c.isFullscreen() ? "add" : "remove") + "Class"](a.template, "pswp--fs")
		}, v.updateIndexIndicator = function() {
			q.counterEl && (g.innerHTML = a.getCurrentIndex() + 1 + q.indexIndicatorSep + q.getNumItemsFn())
		}, v.onGlobalTap = function(c) {
			c = c || window.event;
			var d = c.target || c.srcElement;
			if (!r)
				if (c.detail && "mouse" === c.detail.pointerType) {
					if (I(d)) return void a.close();
					b.hasClass(d, "pswp__img") && (1 === a.getZoomLevel() && a.getZoomLevel() <= a.currItem.fitRatio ? q.clickToCloseNonZoomable && a.close() : a.toggleDesktopZoom(c.detail.releasePoint))
				} else if (q.tapToToggleControls && (x ? v.hideControls() : v.showControls()), q.tapToClose && (b.hasClass(d, "pswp__img") || I(d))) return void a.close()
		}, v.onMouseOver = function(a) {
			a = a || window.event;
			var b = a.target || a.srcElement;
			C(d, "ui--over-close", I(b))
		}, v.hideControls = function() {
			b.addClass(d, "pswp__ui--hidden"), x = !1
		}, v.showControls = function() {
			x = !0, w || v.update(), b.removeClass(d, "pswp__ui--hidden")
		}, v.supportsFullscreen = function() {
			var a = document;
			return !!(a.exitFullscreen || a.mozCancelFullScreen || a.webkitExitFullscreen || a.msExitFullscreen)
		}, v.getFullscreenAPI = function() {
			var b, c = document.documentElement,
				d = "fullscreenchange";
			return c.requestFullscreen ? b = {
				enterK: "requestFullscreen",
				exitK: "exitFullscreen",
				elementK: "fullscreenElement",
				eventK: d
			} : c.mozRequestFullScreen ? b = {
				enterK: "mozRequestFullScreen",
				exitK: "mozCancelFullScreen",
				elementK: "mozFullScreenElement",
				eventK: "moz" + d
			} : c.webkitRequestFullscreen ? b = {
				enterK: "webkitRequestFullscreen",
				exitK: "webkitExitFullscreen",
				elementK: "webkitFullscreenElement",
				eventK: "webkit" + d
			} : c.msRequestFullscreen && (b = {
				enterK: "msRequestFullscreen",
				exitK: "msExitFullscreen",
				elementK: "msFullscreenElement",
				eventK: "MSFullscreenChange"
			}), b && (b.enter = function() {
				return j = q.closeOnScroll, q.closeOnScroll = !1, "webkitRequestFullscreen" !== this.enterK ? a.template[this.enterK]() : void a.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT)
			}, b.exit = function() {
				return q.closeOnScroll = j, document[this.exitK]()
			}, b.isFullscreen = function() {
				return document[this.elementK]
			}), b
		}
	};
	return a
});
var app = app || {};
app.something = function(arg) {}
app.imgSize = function(selector, resize, scroll) {
	var timer;
	$(selector).each(function(i, e) {
		var $this = $(this),
			width = $this.outerWidth(),
			height = $this.outerHeight();
		if ($this.next('.size-tooltip').length) {
			$this.next('.size-tooltip').html(width + ' x ' + height);
		} else {
			$this.parent().append('<div class="size-tooltip">' + width + ' x ' + height + '</div>');
		}
	});
	if (resize) {
		$window.resize(function(event) {
			clearTimeout(timer);
			timer = setTimeout(function() {
				civa.imgSize(selector, true);
			}, 300);
		});
	}
	if (scroll) {
		$window.scroll(function(event) {
			clearTimeout(timer);
			timer = setTimeout(function() {
				civa.imgSize(selector, resize, true);
			}, 300);
		});
	}
};
var app = app || {};
var nav = nav || {};
var home = home || {};
var design = design || {};
var researchk = researchk || {};
var research = research || {};
var designk = designk || {};
var details = details || {};
var $document = $(document),
	$window = $(window),
	$htmlBody = $('html, body'),
	$html = $('html'),
	$body = $('body'),
	windowWidth = window.innerWidth,
	windowHeight = window.innerHeight,
	$page = $('#page'),
	$detailsLeftArrow = $('.design-arrows .left-arrow'),
	$detailsRightArrow = $('.design-arrows .right-arrow'),
	$container = $('.container'),
	$pageName = $('.page-name'),
	pageTitle, $projetFiltres = $('.design-filter'),
	$closeBtnText = $('#close-text'),
	$menuLabel = $('#menu-label'),
	$menuArrow = $('.arrow-icon'),
	$menuArrowLine = $('.arrow-line-icon'),
	$squareLoad = $('.square-loading'),
	$squareSVG = $('.svg-square'),
	$squareRect = $('.svg-square rect'),
	isIE = Detectizr.browser.name === 'ie',
	isIE9 = isIE && Detectizr.browser.major === '9',
	resizeTimer;
var $menu = $('#menu'),
	$navItemTarget = $('#menu-btn'),
	$navItems = $('.menu-option'),
	$navTrigger = $('#menu-btn, .menu-small'),
	$closeBtn = $('#close-btn');
app.vars = {
	url: '',
	parent: '',
	child: '',
	oldParent: '',
	oldChild: '',
	loadComplete: false,
	firstLoad: true,
	checkPosition: true
}
app.frameAnimation = function(direction) {
	var $frame = $('.frame'),
		$frameBorder = $('.frame-border'),
		timeLineFrame = new TimelineLite({
			onReverseComplete: app.rewindFrame
		});
	if (direction == 'play') {
		timeLineFrame.to($frame, 1, {
			css: {
				className: "+=is-shown"
			},
			ease: Back.easeOut
		}).to($frameBorder, .35, {
			opacity: .8
		});
	}
	if (direction == 'reverse') {
		timeLineFrame.set($frameBorder, {
			opacity: 0
		}).to($frame, 1, {
			css: {
				className: "-=is-shown"
			},
			ease: Back.easeOut
		});
	}
	app.rewindFrame = function() {
		$window.trigger('frameIsClosed');
	}
	if (navigator.userAgent.match(/iPad/i)) {
		$frameBorder.hide();
	}
}
app.init = function(parent, child) {
	app.vars.parent = parent;
	app.vars.oldParent = parent;
	app.vars.child = child;
	app.vars.oldChild = child;
	$('a[href="#"]').on('click', function(e) {
		if (!isIE9) {
			e.preventDefault();
		}
	});
	nav.init();
	if (!isIE9) {
		History.Adapter.bind($window, 'statechange', function(event) {
			var currentHash = History.getState().url;
			var condition = app.vars.url.replace(window.location.origin, '') != currentHash.replace(window.location.origin, '');
			if (condition) app.loadPage(currentHash);
		});
	}
	app.initLoader();
	app.responsive();
	app.vars.firstLoad = false;
	$closeBtn.bind('click', app.closeBtnState);
	$closeBtn.unbind('click', nav.animate);
	if ($body.hasClass('first-load')) {
		app.initLoader();
		TweenLite.set($body, {
			css: {
				className: "-=first-load"
			},
			delay: 1
		});
		TweenLite.set($menuLabel, {
			opacity: 0,
			y: '300%'
		});
		TweenLite.set($menuArrowLine, {
			opacity: 0,
			y: '300%'
		});
		TweenLite.set($menuArrow, {
			opacity: 0,
			y: '50%'
		});
		TweenLite.set($('#option1 .svg-circle'), {
			scale: '0'
		});
		TweenLite.to($menuLabel, .6, {
			opacity: 1,
			y: '0%',
			ease: Back.easeOut,
			delay: 1.02
		});
		TweenLite.to($menuArrow, .4, {
			opacity: 1,
			y: '0%',
			ease: Back.easeOut,
			delay: 1.02
		});
		TweenLite.to($menuArrowLine, .4, {
			opacity: 1,
			y: '0%',
			ease: Back.easeOut,
			delay: 1.02
		});
		TweenLite.to($('#option1 .svg-circle'), .4, {
			scale: '1',
			ease: Back.easeOut,
			delay: .96
		});
	}
};
app.getImagesToLoad = function(container) {
	var images = [];
	container.find('img[data-src]').filter(function() {
		var img = this;
		if (img !== undefined && $.inArray(img, images) === -1) images.push(img);
	});
	return images;
}
app.initLoader = function() {
	if (app.vars.parent == '' && !$body.hasClass('first-load')) return false;
	app.onLoadStart();
	var toLoad = app.getImagesToLoad($('.new')),
		innerDraw = 0,
		condition = $html.hasClass('safari') || $html.hasClass('ios') && window.devicePixelRatio >= 2;
	if (condition && windowWidth > 480) {
		innerDraw = 2.15;
	}
	if (condition && windowWidth < 481) {
		innerDraw = 2.6;
	}
	TweenLite.set($squareLoad, {
		opacity: 1
	});
	TweenLite.set($squareSVG, {
		display: 'block'
	});
	TweenLite.set($squareRect, {
		drawSVG: innerDraw + '% ' + innerDraw + '%'
	});
	if (toLoad.length == 0) {
		TweenLite.to($squareRect, 1, {
			drawSVG: innerDraw + '% ' + (100 + innerDraw) + '%',
			ease: Circ.easeInOut,
			onComplete: function() {
				TweenLite.to($squareLoad, .4, {
					opacity: 0
				});
				app.vars.loadComplete = true;
				app.onLoadComplete();
			}
		});
	} else {
		var loader = new app.imagesLoader({
			data: toLoad,
			attr: 'data-src',
			onImageLoad: function(image, percentage) {
				var src = toLoad[image.__index].getAttribute('data-src');
				toLoad[image.__index].setAttribute('src', src);
				TweenLite.to($squareRect, 1, {
					drawSVG: innerDraw + '% ' + (percentage + innerDraw) + '%',
					ease: Circ.easeInOut,
					onComplete: function() {
						if (percentage === 100) {
							loader.onComplete();
						}
					}
				});
			},
			onComplete: function() {
				$('.no-load').each(function(index, el) {
					var source = $(this).data('original');
					$(this).attr('src', source).removeAttr('data-original').removeClass('no-load');
				});
			}
		});
	}
}
app.imagesLoader = function(options) {
	'use strict';
	var o = options;
	o.data = o.data || [];
	o.attr = o.attr || 'src';
	o.onImageLoad = o.onImageLoad || function() {};
	o.onComplete = o.onComplete || function() {};
	var images = [];
	var imagesLoaded = 0;
	var totalImages = o.data.length;
	for (var i = 0; i < totalImages; i++) {
		var src = o.data[i] ? o.data[i].getAttribute(o.attr) : '';
		images[i] = new Image();
		images[i].__index = i;
		images[i].onload = function() {
			imagesLoaded++;
			var percentage = Math.round(100 / totalImages * imagesLoaded);
			o.onImageLoad(this, percentage);
			if (this.__index + 1 < totalImages) {
				var nextImage = this.__index + 1;
				images[nextImage].src = o.data[nextImage] ? o.data[nextImage].getAttribute(o.attr) : '';
			}
			if (imagesLoaded === totalImages) {
				o.onComplete();
			}
		}
	}
	images[0].src = src;
	return this;
};
app.imagesLoader.prototype.onComplete = function() {
	TweenLite.to($squareLoad, .6, {
		opacity: 0,
		ease: Expo.easeOut
	});
	app.vars.loadComplete = true;
	app.onLoadComplete();
}
app.onBeforeLoad = function() {
	var $leftCol = $('.old').find('.leftCol'),
		$rightCol = $('.old').find('.rightCol');
	TweenLite.to($('.h-line'), .4, {
		scaleY: '0'
	});
	TweenLite.to($('.svg-scroll-text'), .4, {
		y: '-100%'
	});
	TweenLite.to($closeBtn, .4, {
		opacity: 0,
		y: '100%',
		pointerEvents: 'none'
	});
	TweenLite.to($('.arrow-down'), .4, {
		opacity: 0,
		y: '-100%'
	});
	TweenLite.to($menuLabel, .4, {
		opacity: 0,
		y: '300%'
	});
	TweenLite.to($menuArrowLine, .4, {
		opacity: 0,
		y: '300%'
	});
	TweenLite.to($menuArrow, .4, {
		opacity: 0,
		y: '50%'
	});
	if (app.vars.parent != 'design' || app.vars.parent == 'design' && app.vars.child != 'in-situe' && app.vars.child != 'imprime' && app.vars.child != 'ecran' && app.vars.child != '') {
		TweenLite.to($projetFiltres, .4, {
			opacity: 0,
			pointerEvents: 'none'
		})
	}
	if (!app.vars.child || app.vars.child && app.vars.oldChild) {
		TweenLite.to($detailsLeftArrow, .4, {
			opacity: 0,
			x: '200%',
			ease: Expo.easeOut
		});
		TweenLite.to($detailsRightArrow, .4, {
			opacity: 0,
			x: '-200%',
			ease: Expo.easeOut
		});
	}
	TweenLite.to($pageName, .4, {
		opacity: 0,
		y: windowWidth < 981 ? '0%' : '100%'
	});
	if (windowWidth < 981) {
		TweenLite.to($('.menu-small'), .4, {
			opacity: 0
		});
	}
	TweenLite.set($('.frame-border'), {
		opacity: 0
	});
	TweenLite.to($leftCol, .7, {
		y: windowWidth < 981 ? windowHeight : -2 * windowHeight,
		opacity: 0,
		ease: Power2.easeIn
	});
	TweenLite.to($rightCol, .7, {
		y: 2 * windowHeight,
		opacity: 0,
		ease: Power2.easeIn,
		onComplete: function() {
			$('.container').not('.new').remove();;
			$window.trigger('onBeforeLoadComplete');
		}
	});
	if (app.vars.oldChild && app.vars.oldChild != 'in-situ' && app.vars.oldChild != 'imprime' && app.vars.oldChild != 'ecran') {
		TweenLite.to($('.details-leftcol'), .3, {
			opacity: 0
		});
	}
	TweenLite.set($('#menu-btn'), {
		pointerEvents: 'none'
	});
}
app.onLoadStart = function() {
	$container.addClass('new');
	var $leftCol = $('.container').find('.leftCol'),
		$rightCol = $('.container').find('.rightCol');
	TweenLite.set($leftCol, {
		y: 2 * windowHeight,
		opacity: 0
	});
	TweenLite.set($rightCol, {
		y: windowWidth < 981 ? windowHeight : -2 * windowHeight,
		opacity: 0
	});
	if (app.vars.child) {
		$leftCol.css('display', 'table');
		$rightCol.css('display', 'table');
	} else {
		$leftCol.show();
		$rightCol.show();
	}
	if (!isIE9 && pageTitle) {
		$('.text-input').html(pageTitle);
	}
	if (app.vars.child) {
		$closeBtnText.html('Retour');
	} else {
		$closeBtnText.html('Close');
	}
}
app.onLoadComplete = function() {
	$htmlBody.scrollTop(0);
	var $leftCol = $('.container').find('.leftCol'),
		$rightCol = $('.container').find('.rightCol');
	TweenLite.to($leftCol, .8, {
		y: '0%',
		delay: .8,
		opacity: 1,
		ease: Expo.easeOut
	});
	TweenLite.to($rightCol, .8, {
		y: '0%',
		delay: .8,
		opacity: 1,
		ease: Expo.easeOut
	});
	if (app.vars.parent != 'design' || app.vars.parent == 'design' && app.vars.child != '') {
		if (app.vars.child != 'in-situ' && app.vars.child != 'imprime' && app.vars.child != 'ecran') {
			TweenLite.to($('.h-line-top'), .6, {
				scaleY: '1',
				ease: Back.easeOut,
				delay: 1
			});
		}
	}
	TweenLite.to($('.h-line-bottom'), .6, {
		scaleY: '1',
		ease: Back.easeOut,
		delay: 1
	});
	TweenLite.to($('.svg-scroll-text'), .6, {
		y: '0%',
		ease: Expo.easeOut,
		delay: 1
	});
	TweenLite.to($menuLabel, .6, {
		opacity: 1,
		y: '0%',
		ease: Back.easeOut,
		delay: 1.2
	});
	TweenLite.to($menuArrow, .4, {
		opacity: 1,
		y: '0%',
		ease: Back.easeOut,
		delay: 1.2
	});
	TweenLite.to($menuArrowLine, .4, {
		opacity: 1,
		y: '0%',
		ease: Back.easeOut,
		delay: 1.2
	});
	if (app.vars.parent) {
		TweenLite.to($closeBtn, .4, {
			opacity: 1,
			y: '0%',
			pointerEvents: 'auto',
			ease: Back.easeOut,
			delay: 1.3
		});
	}
	TweenLite.to($('.arrow-down'), .4, {
		opacity: 1,
		y: '0%',
		ease: Back.easeOut,
		delay: 1.3
	});
	TweenLite.to($pageName, .6, {
		opacity: 1,
		y: '0%',
		ease: Back.easeOut,
		delay: 1.3
	});
	if (windowWidth < 981) {
		TweenLite.to($('.menu-small'), .6, {
			opacity: 1,
			ease: Back.easeOut,
			delay: 1.3
		});
	}
	if (app.vars.parent == 'design' && app.vars.child == '' || app.vars.parent == 'design' && app.vars.child == 'in-situ' || app.vars.parent == 'design' && app.vars.child == 'imprime' || app.vars.parent == 'design' && app.vars.child == 'ecran') {
		TweenLite.to($projetFiltres, .4, {
			opacity: 1,
			pointerEvents: 'auto',
			ease: Expo.easeOut,
			delay: 1.5
		})
	}
	if (app.vars.child && app.vars.child != 'in-situ' && app.vars.child != 'imprime' && app.vars.child != 'ecran') {
		TweenLite.to($detailsLeftArrow, .4, {
			opacity: 1,
			x: '0%',
			ease: Expo.easeOut,
			delay: 1.7
		});
		TweenLite.to($detailsRightArrow, .4, {
			opacity: 1,
			x: '0%',
			ease: Expo.easeOut,
			delay: 1.7
		});
		TweenLite.to($('.details-leftcol'), .8, {
			opacity: 1,
			delay: 1.2
		});
	}
	TweenLite.set($('#menu-btn'), {
		pointerEvents: 'auto'
	});
	app.hasMethod('kill', app.vars.oldParent);
	app.hasMethod('init', app.vars.parent);
	if (app.vars.parent) app.frameAnimation('play');
}
app.loadPage = function(url) {
	app.vars.loadComplete = false;
	if (!isIE9) {
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'HTML',
			success: function(data, textStatus, jqXHR) {
				app.vars.url = url;
				History.pushState({}, '', url);
				app.parseDom(data);
				app.onBeforeLoad();
				$window.unbind('onBeforeLoadComplete');
				$window.bind('onBeforeLoadComplete', function() {
					app.initLoader();
				})
			}
		});
	}
};
app.parseDom = function(data) {
	var html = $.trim(String(data).replace(/<\!DOCTYPE[^>]*>/i, '').replace(/<(html|head|body|title|meta)([\s\>])/gi, '<div class="document-$1"$2').replace(/<\/(html|head|body|title|meta)\>/gi, '</div>').replace('container', 'container new'));
	var content = $(html).find('.container').wrap('<div/>').parent().html();
	app.vars.oldParent = app.vars.parent;
	app.vars.oldChild = app.vars.child;
	app.vars.parent = $(content).data('parent');
	app.vars.child = $(content).data('child');
	setTimeout(function() {
		if (app.vars.parent == '') {
			$body.addClass('home');
		} else {
			$body.removeClass('home');
		}
		$body.removeClass('design research a-propos researchk').addClass(app.vars.parent);
	}, windowWidth < 981 ? 800 : 0);
	if (typeof $window._gaq !== 'undefined') {
		$window._gaq.push(['_trackPageview', app.vars.url]);
	}
	document.title = $(html).find('.document-title:first').text();
	if (app.vars.parent) {
		$body.addClass('is-closed');
	}
	$(content).appendTo($page)
	$('.container').eq(0).addClass('old').removeClass('new');
	$('.container').eq(1).addClass('new');
};
app.hasMethod = function(method, page) {
	if (page == '') page = 'home';
	var functionName = eval(app.camelCase(page) + '.' + method);
	if (typeof functionName != 'undefined' && $.isFunction(functionName)) return functionName();
}
app.camelCase = function(string) {
	return string.toLowerCase().replace(/-(.)/g, function(match, group1) {
		return group1.toUpperCase();
	});
};
nav.itemTarget = {
	top: $navItemTarget.offset().top,
	left: $navItemTarget.offset().left,
	width: $navItemTarget.outerWidth(),
	height: $navItemTarget.outerHeight()
};
nav.init = function() {
	$navTrigger.on('click', function(event) {
		nav.animate();

	});
	var drag = Draggable.create($navItems, {
		bounds: $menu,
		throwProps: true,
		edgeResistance: 0,
		throwResistance: 1200,
		zIndexBoost: false,
		cursor: '-webkit-grab',
		snap: function(endValue) {
			return Math.round(endValue);
		},
		onDragStart: dragStart,
		onPress: dragStart,
		onRelease: dragEnd,
		onDragEnd: dragEnd,
		onDrag: function() {
			var position = this.target.getBoundingClientRect(),
				$target = this.target;
			$target = $($target);
			if (position.top + position.height > nav.itemTarget.top && position.top < nav.itemTarget.height + nav.itemTarget.top && position.left + position.width > nav.itemTarget.left && position.left < nav.itemTarget.width + nav.itemTarget.left && app.vars.checkPosition) {
				$navItemTarget.addClass('on-target');
				$target.addClass('on-target');
			} else {
				$navItemTarget.removeClass('on-target');
				$target.removeClass('on-target');
			}
		},
		onThrowUpdate: function() {
			nav.checkPos(this);
		}
	});

	function dragStart() {
		var target = this.target;
		target = $(target).data('url').slice('1', '-1');
		$navItemTarget.addClass(target);
		$menuLabel.addClass('drop');
		app.vars.checkPosition = true;
		$menuArrow.addClass('is-dragged');
	}

	function dragEnd() {
		setTimeout(function() {
			$menuLabel.removeClass('drop');
			$menuArrow.removeClass('is-dragged');
			$navItemTarget.attr('class', 'menu-btn');
		}, 700);
	}
}
nav.animate = function(direction) {
	var direction = $body.hasClass('is-active') ? 'close' : 'open';
	if (direction == 'open') {
		$closeBtn.bind('click', nav.animate);
		$closeBtn.unbind('click', app.closeBtnState);
		$menuLabel.removeClass('drop');
		$body.addClass('is-active');
		if (app.vars.parent) {
			app.frameAnimation('reverse');
			$body.removeClass('is-closed');
			TweenLite.to($closeBtn, .4, {
				opacity: 1,
				pointerEvents: 'auto'
			});
		}
		$closeBtnText.html('Close');
		if (app.vars.parent == 'design' && app.vars.child == '' || app.vars.parent == 'design' && app.vars.child == 'in-situ' || app.vars.parent == 'design' && app.vars.child == 'imprime' || app.vars.parent == 'design' && app.vars.child == 'ecran') {
			TweenLite.to($projetFiltres, .4, {
				opacity: 1,
				pointerEvents: 'auto'
			})
		}
	} else {
		$closeBtn.bind('click', app.closeBtnState);
		$closeBtn.unbind('click', nav.animate);
		$body.removeClass('is-active');
		if (app.vars.parent) {
			app.frameAnimation('play');
			$body.addClass('is-closed');
		}
		if (app.vars.child) {
			$closeBtnText.html('Retour');
		} else {
			$closeBtnText.html('Fermer');
		}
		if (app.vars.parent == 'design' && app.vars.child == '' || app.vars.parent == 'design' && app.vars.child == 'in-situ' || app.vars.parent == 'design' && app.vars.child == 'imprime' || app.vars.parent == 'design' && app.vars.child == 'ecran') {
			TweenLite.to($projetFiltres, 1, {
				opacity: 1,
				pointerEvents: 'auto',
				delay: 1
			})
		}
	}
	$('.menu-option').each(function(i, e) {
		var $this = $(this),
			width = $menu.width(),
			height = $menu.height();
		if (direction == 'open') {
			var x = i === 1 || i === 2 ?  -Math.pow(-1, (i)) * width / 9 : -Math.pow(-1, (i + 1)) * width / 3,
				y = height/3;
			x = Math.round(x);
			y = Math.round(y);
			$this.removeClass('is-black');
			TweenLite.to(this, 0.8, {
				delay: i / 10,
				x: x,
				y: y,
				ease: Back.easeOut,
				onComplete: function() {}
			});
		} else {
			TweenLite.to(this, 0.8, {
				delay: 0.2 / (i + 1),
				x: 0,
				y: 0,
				ease: Back.easeIn,
				onComplete: function() {
					$this.addClass('is-black');
				}
			});
		};
	});
}
nav.checkPos = function(item) {
	var position = item._eventTarget.getBoundingClientRect();
	if (position.top + position.height > nav.itemTarget.top && position.top < nav.itemTarget.height + nav.itemTarget.top && position.left + position.width > nav.itemTarget.left && position.left < nav.itemTarget.width + nav.itemTarget.left && app.vars.checkPosition) {
		$(item._eventTarget).removeClass('on-target');
		TweenLite.to($navItems, .6, {
			x: 0,
			y: 0
		});
		$body.removeClass('is-active').addClass('is-closed');
		$closeBtn.unbind('click', nav.animate);
		$closeBtn.bind('click', app.closeBtnState);
		app.frameAnim = function() {}
		if ($(item.target).data('url') == window.location.pathname) {
			app.frameAnimation('play');
		} else {
			var url = $(item.target).data('url');
			if (!isIE9) {
				History.pushState(null, null, url);
				pageTitle = $(item.target).data('title');
			} else {
				window.location.href = url;
				app.vars.checkPosition = false;
			}
		}
		app.vars.checkPosition = false;
	}
}
app.closeBtnState = function() {
	var segments = window.location.pathname;
	segments = segments.substring(0, 1) == '/' ? segments.substring(1) : segments;
	segments = segments.substring(segments.length - 1, segments.length) == '/' ? segments.substring(0, segments.length - 1) : segments;
	if (segments.match(/\//)) {
		segments = segments.split("/");
		segments = segments[0];
		if (isIE9) {
			window.location.href = '/' + segments + '/';
		} else {
			app.loadPage('/' + segments + '/');
			if (segments == 'design') {
				$projetFiltres.find('li').removeClass('active');
				$projetFiltres.find('li:first-child').addClass('active');
			}
		}
	} else {
		if (isIE9) {
			window.location.href = '/';
			$body.removeClass('is-closed');
			$('.menu-option').addClass('is-black');
		} else {
			var bodyClass = $body.attr('class').toString().replace('is-closed', '');
			$html.addClass(bodyClass);
			app.loadPage('/');
			TweenLite.to($menuLabel, .6, {
				opacity: 1,
				y: '0%',
				ease: Back.easeOut,
				delay: 1.2
			});
			TweenLite.to($menuArrow, .4, {
				opacity: 1,
				y: '0%',
				ease: Back.easeOut,
				delay: 1.2
			});
			TweenLite.to($menuArrowLine, .4, {
				opacity: 1,
				y: '0%',
				ease: Back.easeOut,
				delay: 1.2
			});
			TweenLite.set($('.frame-border'), {
				opacity: 0
			})
			TweenLite.to($('.frame'), 1, {
				css: {
					className: "-=is-shown"
				},
				ease: Back.easeOut,
				delay: .6
			});
			setTimeout(function() {
				$body.removeClass('is-closed');
				$html.removeClass(bodyClass);
				$('.menu-option').addClass('is-black');
				TweenLite.set($('#menu-btn'), {
					pointerEvents: 'auto'
				});
			}, 1000);
		}
	}
}
app.initNavigationProjet = function() {
	if ($('.new').data('prev') == '') {
		TweenLite.set($detailsLeftArrow, {
			display: 'none'
		});
	} else {
		TweenLite.set($detailsLeftArrow, {
			display: 'block'
		});
	}
	if ($('.new').data('next') == '') {
		TweenLite.set($detailsRightArrow, {
			display: 'none'
		});
	} else {
		TweenLite.set($detailsRightArrow, {
			display: 'block'
		});
	}
	$('.design-arrows .left-arrow').unbind('click');
	$('.design-arrows .left-arrow').on('click', function(event) {
		if (!isIE9) {
			event.preventDefault();
			app.loadPage($('.new').data('prev'));
		} else {
			window.location.href($('.new').data('prev'));
		}
		return false;
	});
	$('.design-arrows .right-arrow').unbind('click');
	$('.design-arrows .right-arrow').on('click', function(event) {
		if (!isIE9) {
			event.preventDefault();
			app.loadPage($('.new').data('next'));
		} else {
			window.location.href($('.new').data('next'));
		}
		return false;
	});
	$('.design-arrows a').on('click', function(e) {
		return true;
	});
}
design.init = function() {
	if (!app.vars.child || app.vars.child == 'in-situ' || app.vars.child == 'imprime' || app.vars.child == 'ecran') {
		app.responsive();
		if (!isIE) {
			app.differScroll();
		}
	} else {
		app.initNavigationProjet();
		initPhotoSwipeFromDOM('.img-lightbox');
	}
	var $projetEvent = $('.projet-cover a, .filtre');
	$projetEvent.unbind('click');
	$projetEvent.on('click', function(event) {
		var $this = $(this);
		if ($this.hasClass('filtre')) {
			$projetFiltres.find('li').removeClass('active');
			$projetFiltres.find('#' + $(this).data('filtre')).addClass('active');
		}
		if (!isIE9) {
			event.preventDefault();
			app.loadPage($(this).attr('href'));
		} else {
			window.location.href($(this).attr('href'));
		}
		return false;
	});
}
research.init = function() {
	initPhotoSwipeFromDOM('.img-lightbox');
	if (!isIE) {
		app.differScroll();
	}
}
researchk.init = function() {
	if (!app.vars.child && !isIE) {
		app.differScroll();
	} else {
		app.initNavigationProjet();
		initPhotoSwipeFromDOM('.img-lightbox');
	}
	$('.projet-cover a').on('click', function(event) {
		if (!isIE9) {
			event.preventDefault();
		}
		app.loadPage($(this).attr('href'));
		return false;
	});
}
app.differScroll = function() {
	var $leftCol = $('#leftContent'),
		$rightCol = $('#rightContent'),
		leftHeight = $leftCol.height(),
		rightHeight = $rightCol.height(),
		heightDiff = leftHeight > rightHeight ? leftHeight - rightHeight : rightHeight - leftHeight,
		$smallCol = leftHeight > rightHeight ? $rightCol : $leftCol;
	if (windowWidth > 980) {
		$(window).on('scroll', function() {
			var $this = $(this),
				scrollTop = $this.scrollTop(),
				ratio = $document.height() - windowHeight;
			TweenLite.set($smallCol, {
				y: heightDiff * scrollTop / ratio
			});
		});
	}
}
$window.on('resize', function() {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		app.resize();
	}, 100);
});
app.responsive = function() {
	if (windowWidth > 1919) {
		$squareRect.attr({
			'width': '10em',
			'height': '10em'
		});
	}
	if (windowWidth < 1920) {
		$squareRect.attr({
			'width': '9em',
			'height': '9em'
		});
		if ($html.hasClass('safari') && windowWidth > 1199) {
			$squareRect.attr({
				'width': '9.3em',
				'height': '9.3em'
			});
		}
	}
}
app.resize = function() {
	windowWidth = window.innerWidth, windowHeight = window.innerHeight, nav.itemTarget = {
		top: $navItemTarget.offset().top,
		left: $navItemTarget.offset().left,
		width: $navItemTarget.outerWidth(),
		height: $navItemTarget.outerHeight()
	};
	app.responsive();
}
var initPhotoSwipeFromDOM = function(gallerySelector) {
	var parseThumbnailElements = function(el) {
		var thumbElements = el.childNodes,
			numNodes = thumbElements.length,
			items = [],
			el, childElements, thumbnailEl, size, item;
		for (var i = 0; i < numNodes; i++) {
			el = thumbElements[i];
			if (el.nodeType !== 1) {
				continue;
			}
			childElements = el.children;
			size = el.getAttribute('data-size').split('x');
			item = {
				src: el.getAttribute('href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10)
			};
			item.el = el;
			if (childElements.length > 0) {
				item.msrc = childElements[0].getAttribute('src');
				if (childElements.length > 1) item.title = childElements[1].innerHTML;
			}
			var mediumSrc = el.getAttribute('data-med');
			if (mediumSrc) {
				size = el.getAttribute('data-med-size').split('x');
				item.m = {
					src: mediumSrc,
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10)
				};
			}
			item.o = {
				src: item.src,
				w: item.w,
				h: item.h
			};
			items.push(item);
		}
		return items;
	};
	var closest = function closest(el, fn) {
		return el && (fn(el) ? el : closest(el.parentNode, fn));
	};
	var onThumbnailsClick = function(e) {
		e = e || window.event;
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		var eTarget = e.target || e.srcElement;
		var clickedListItem = closest(eTarget, function(el) {
			return el.tagName === 'A';
		});
		if (!clickedListItem) {
			return;
		}
		var clickedGallery = clickedListItem.parentNode;
		var childNodes = clickedListItem.parentNode.childNodes,
			numChildNodes = childNodes.length,
			nodeIndex = 0,
			index;
		for (var i = 0; i < numChildNodes; i++) {
			if (childNodes[i].nodeType !== 1) {
				continue;
			}
			if (childNodes[i] === clickedListItem) {
				index = nodeIndex;
				break;
			}
			nodeIndex++;
		}
		if (index >= 0) {
			openPhotoSwipe(index, clickedGallery);
		}
		return false;
	};
	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
			params = {};
		if (hash.length < 5) {
			return params;
		}
		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if (!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');
			if (pair.length < 2) {
				continue;
			}
			params[pair[0]] = pair[1];
		}
		if (params.gid) {
			params.gid = parseInt(params.gid, 10);
		}
		if (!params.hasOwnProperty('pid')) {
			return params;
		}
		params.pid = parseInt(params.pid, 10);
		return params;
	};
	var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
		var pswpElement = document.querySelectorAll('.pswp')[0],
			gallery, options, items;
		items = parseThumbnailElements(galleryElement);
		options = {
			index: index,
			galleryUID: galleryElement.getAttribute('data-pswp-uid'),
			getThumbBoundsFn: function(index) {
				var thumbnail = items[index].el.children[0],
					pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
					rect = thumbnail.getBoundingClientRect();
				return {
					x: rect.left,
					y: rect.top + pageYScroll,
					w: rect.width
				};
			},
			addCaptionHTMLFn: function(item, captionEl, isFake) {
				if (!item.title) {
					captionEl.children[0].innerText = '';
					return false;
				}
				captionEl.children[0].innerHTML = item.title + '<br/><small>Photo: ' + item.author + '</small>';
				return true;
			},
			shareEl: false,
			loop: false,
			history: false
		};
		if (disableAnimation) {
			options.showAnimationDuration = 0;
		}
		app.vars.gallery = gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
		var realViewportWidth, useLargeImages = false,
			firstResize = true,
			imageSrcWillChange;
		gallery.listen('beforeResize', function() {
			var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
			dpiRatio = Math.min(dpiRatio, 2.5);
			realViewportWidth = gallery.viewportSize.x * dpiRatio;
			if (realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200) {
				if (!useLargeImages) {
					useLargeImages = true;
					imageSrcWillChange = true;
				}
			} else {
				if (useLargeImages) {
					useLargeImages = false;
					imageSrcWillChange = true;
				}
			}
			if (imageSrcWillChange && !firstResize) {
				gallery.invalidateCurrItems();
			}
			if (firstResize) {
				firstResize = false;
			}
			imageSrcWillChange = false;
		});
		gallery.listen('gettingData', function(index, item) {
			if (useLargeImages) {
				item.src = item.o.src;
				item.w = item.o.w;
				item.h = item.o.h;
			} else {
				item.src = item.m.src;
				item.w = item.m.w;
				item.h = item.m.h;
			}
		});
		gallery.listen('afterChange', function() {
			var currentIndex = gallery.getCurrentIndex();
			if (currentIndex == 0) {
				$('.pswp__button--arrow--left').addClass('is-hidden');
			} else {
				$('.pswp__button--arrow--left').removeClass('is-hidden');
			}
			if ((currentIndex + 1) == app.vars.gallery.items.length) {
				$('.pswp__button--arrow--right').addClass('is-hidden');
			} else {
				$('.pswp__button--arrow--right').removeClass('is-hidden');
			}
		});
		gallery.init();
	};
	var galleryElements = document.querySelectorAll(gallerySelector);
	for (var i = 0, l = galleryElements.length; i < l; i++) {
		galleryElements[i].setAttribute('data-pswp-uid', i + 1);
		galleryElements[i].onclick = onThumbnailsClick;
	}
	var hashData = photoswipeParseHash();
	if (hashData.pid > 0 && hashData.gid > 0) {
		openPhotoSwipe(hashData.pid - 1, galleryElements[hashData.gid - 1], true);
	}
};