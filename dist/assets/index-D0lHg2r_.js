function qc(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const l in r)
        if (l !== "default" && !(l in e)) {
          const i = Object.getOwnPropertyDescriptor(r, l);
          i &&
            Object.defineProperty(
              e,
              l,
              i.get ? i : { enumerable: !0, get: () => r[l] },
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
  );
}
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const l of document.querySelectorAll('link[rel="modulepreload"]')) r(l);
  new MutationObserver((l) => {
    for (const i of l)
      if (i.type === "childList")
        for (const o of i.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && r(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(l) {
    const i = {};
    return (
      l.integrity && (i.integrity = l.integrity),
      l.referrerPolicy && (i.referrerPolicy = l.referrerPolicy),
      l.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : l.crossOrigin === "anonymous"
          ? (i.credentials = "omit")
          : (i.credentials = "same-origin"),
      i
    );
  }
  function r(l) {
    if (l.ep) return;
    l.ep = !0;
    const i = n(l);
    fetch(l.href, i);
  }
})();
function ed(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var Pa = { exports: {} },
  xl = {},
  _a = { exports: {} },
  I = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var fr = Symbol.for("react.element"),
  td = Symbol.for("react.portal"),
  nd = Symbol.for("react.fragment"),
  rd = Symbol.for("react.strict_mode"),
  ld = Symbol.for("react.profiler"),
  id = Symbol.for("react.provider"),
  od = Symbol.for("react.context"),
  sd = Symbol.for("react.forward_ref"),
  ad = Symbol.for("react.suspense"),
  ud = Symbol.for("react.memo"),
  cd = Symbol.for("react.lazy"),
  as = Symbol.iterator;
function dd(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (as && e[as]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var Ta = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  La = Object.assign,
  Ra = {};
function kn(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = Ra),
    (this.updater = n || Ta));
}
kn.prototype.isReactComponent = {};
kn.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
kn.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function za() {}
za.prototype = kn.prototype;
function fo(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = Ra),
    (this.updater = n || Ta));
}
var po = (fo.prototype = new za());
po.constructor = fo;
La(po, kn.prototype);
po.isPureReactComponent = !0;
var us = Array.isArray,
  Oa = Object.prototype.hasOwnProperty,
  mo = { current: null },
  Ia = { key: !0, ref: !0, __self: !0, __source: !0 };
function Da(e, t, n) {
  var r,
    l = {},
    i = null,
    o = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (o = t.ref),
    t.key !== void 0 && (i = "" + t.key),
    t))
      Oa.call(t, r) && !Ia.hasOwnProperty(r) && (l[r] = t[r]);
  var s = arguments.length - 2;
  if (s === 1) l.children = n;
  else if (1 < s) {
    for (var u = Array(s), c = 0; c < s; c++) u[c] = arguments[c + 2];
    l.children = u;
  }
  if (e && e.defaultProps)
    for (r in ((s = e.defaultProps), s)) l[r] === void 0 && (l[r] = s[r]);
  return {
    $$typeof: fr,
    type: e,
    key: i,
    ref: o,
    props: l,
    _owner: mo.current,
  };
}
function fd(e, t) {
  return {
    $$typeof: fr,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function ho(e) {
  return typeof e == "object" && e !== null && e.$$typeof === fr;
}
function pd(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var cs = /\/+/g;
function Ul(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? pd("" + e.key)
    : t.toString(36);
}
function Mr(e, t, n, r, l) {
  var i = typeof e;
  (i === "undefined" || i === "boolean") && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else
    switch (i) {
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case fr:
          case td:
            o = !0;
        }
    }
  if (o)
    return (
      (o = e),
      (l = l(o)),
      (e = r === "" ? "." + Ul(o, 0) : r),
      us(l)
        ? ((n = ""),
          e != null && (n = e.replace(cs, "$&/") + "/"),
          Mr(l, t, n, "", function (c) {
            return c;
          }))
        : l != null &&
          (ho(l) &&
            (l = fd(
              l,
              n +
                (!l.key || (o && o.key === l.key)
                  ? ""
                  : ("" + l.key).replace(cs, "$&/") + "/") +
                e,
            )),
          t.push(l)),
      1
    );
  if (((o = 0), (r = r === "" ? "." : r + ":"), us(e)))
    for (var s = 0; s < e.length; s++) {
      i = e[s];
      var u = r + Ul(i, s);
      o += Mr(i, t, n, u, l);
    }
  else if (((u = dd(e)), typeof u == "function"))
    for (e = u.call(e), s = 0; !(i = e.next()).done; )
      ((i = i.value), (u = r + Ul(i, s++)), (o += Mr(i, t, n, u, l)));
  else if (i === "object")
    throw (
      (t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead.",
      )
    );
  return o;
}
function xr(e, t, n) {
  if (e == null) return e;
  var r = [],
    l = 0;
  return (
    Mr(e, r, "", "", function (i) {
      return t.call(n, i, l++);
    }),
    r
  );
}
function md(e) {
  if (e._status === -1) {
    var t = e._result;
    ((t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = n));
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t)));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var de = { current: null },
  Fr = { transition: null },
  hd = {
    ReactCurrentDispatcher: de,
    ReactCurrentBatchConfig: Fr,
    ReactCurrentOwner: mo,
  };
function Ma() {
  throw Error("act(...) is not supported in production builds of React.");
}
I.Children = {
  map: xr,
  forEach: function (e, t, n) {
    xr(
      e,
      function () {
        t.apply(this, arguments);
      },
      n,
    );
  },
  count: function (e) {
    var t = 0;
    return (
      xr(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      xr(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!ho(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
I.Component = kn;
I.Fragment = nd;
I.Profiler = ld;
I.PureComponent = fo;
I.StrictMode = rd;
I.Suspense = ad;
I.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = hd;
I.act = Ma;
I.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var r = La({}, e.props),
    l = e.key,
    i = e.ref,
    o = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((i = t.ref), (o = mo.current)),
      t.key !== void 0 && (l = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var s = e.type.defaultProps;
    for (u in t)
      Oa.call(t, u) &&
        !Ia.hasOwnProperty(u) &&
        (r[u] = t[u] === void 0 && s !== void 0 ? s[u] : t[u]);
  }
  var u = arguments.length - 2;
  if (u === 1) r.children = n;
  else if (1 < u) {
    s = Array(u);
    for (var c = 0; c < u; c++) s[c] = arguments[c + 2];
    r.children = s;
  }
  return { $$typeof: fr, type: e.type, key: l, ref: i, props: r, _owner: o };
};
I.createContext = function (e) {
  return (
    (e = {
      $$typeof: od,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: id, _context: e }),
    (e.Consumer = e)
  );
};
I.createElement = Da;
I.createFactory = function (e) {
  var t = Da.bind(null, e);
  return ((t.type = e), t);
};
I.createRef = function () {
  return { current: null };
};
I.forwardRef = function (e) {
  return { $$typeof: sd, render: e };
};
I.isValidElement = ho;
I.lazy = function (e) {
  return { $$typeof: cd, _payload: { _status: -1, _result: e }, _init: md };
};
I.memo = function (e, t) {
  return { $$typeof: ud, type: e, compare: t === void 0 ? null : t };
};
I.startTransition = function (e) {
  var t = Fr.transition;
  Fr.transition = {};
  try {
    e();
  } finally {
    Fr.transition = t;
  }
};
I.unstable_act = Ma;
I.useCallback = function (e, t) {
  return de.current.useCallback(e, t);
};
I.useContext = function (e) {
  return de.current.useContext(e);
};
I.useDebugValue = function () {};
I.useDeferredValue = function (e) {
  return de.current.useDeferredValue(e);
};
I.useEffect = function (e, t) {
  return de.current.useEffect(e, t);
};
I.useId = function () {
  return de.current.useId();
};
I.useImperativeHandle = function (e, t, n) {
  return de.current.useImperativeHandle(e, t, n);
};
I.useInsertionEffect = function (e, t) {
  return de.current.useInsertionEffect(e, t);
};
I.useLayoutEffect = function (e, t) {
  return de.current.useLayoutEffect(e, t);
};
I.useMemo = function (e, t) {
  return de.current.useMemo(e, t);
};
I.useReducer = function (e, t, n) {
  return de.current.useReducer(e, t, n);
};
I.useRef = function (e) {
  return de.current.useRef(e);
};
I.useState = function (e) {
  return de.current.useState(e);
};
I.useSyncExternalStore = function (e, t, n) {
  return de.current.useSyncExternalStore(e, t, n);
};
I.useTransition = function () {
  return de.current.useTransition();
};
I.version = "18.3.1";
_a.exports = I;
var N = _a.exports;
const Fa = ed(N),
  gd = qc({ __proto__: null, default: Fa }, [N]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var vd = N,
  yd = Symbol.for("react.element"),
  xd = Symbol.for("react.fragment"),
  wd = Object.prototype.hasOwnProperty,
  kd = vd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  Sd = { key: !0, ref: !0, __self: !0, __source: !0 };
function Ua(e, t, n) {
  var r,
    l = {},
    i = null,
    o = null;
  (n !== void 0 && (i = "" + n),
    t.key !== void 0 && (i = "" + t.key),
    t.ref !== void 0 && (o = t.ref));
  for (r in t) wd.call(t, r) && !Sd.hasOwnProperty(r) && (l[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) l[r] === void 0 && (l[r] = t[r]);
  return {
    $$typeof: yd,
    type: e,
    key: i,
    ref: o,
    props: l,
    _owner: kd.current,
  };
}
xl.Fragment = xd;
xl.jsx = Ua;
xl.jsxs = Ua;
Pa.exports = xl;
var a = Pa.exports,
  pi = {},
  $a = { exports: {} },
  Ne = {},
  Aa = { exports: {} },
  Ba = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(P, g) {
    var S = P.length;
    P.push(g);
    e: for (; 0 < S; ) {
      var R = (S - 1) >>> 1,
        D = P[R];
      if (0 < l(D, g)) ((P[R] = g), (P[S] = D), (S = R));
      else break e;
    }
  }
  function n(P) {
    return P.length === 0 ? null : P[0];
  }
  function r(P) {
    if (P.length === 0) return null;
    var g = P[0],
      S = P.pop();
    if (S !== g) {
      P[0] = S;
      e: for (var R = 0, D = P.length, pe = D >>> 1; R < pe; ) {
        var be = 2 * (R + 1) - 1,
          Kt = P[be],
          B = be + 1,
          yr = P[B];
        if (0 > l(Kt, S))
          B < D && 0 > l(yr, Kt)
            ? ((P[R] = yr), (P[B] = S), (R = B))
            : ((P[R] = Kt), (P[be] = S), (R = be));
        else if (B < D && 0 > l(yr, S)) ((P[R] = yr), (P[B] = S), (R = B));
        else break e;
      }
    }
    return g;
  }
  function l(P, g) {
    var S = P.sortIndex - g.sortIndex;
    return S !== 0 ? S : P.id - g.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var i = performance;
    e.unstable_now = function () {
      return i.now();
    };
  } else {
    var o = Date,
      s = o.now();
    e.unstable_now = function () {
      return o.now() - s;
    };
  }
  var u = [],
    c = [],
    h = 1,
    p = null,
    v = 3,
    k = !1,
    y = !1,
    w = !1,
    C = typeof setTimeout == "function" ? setTimeout : null,
    f = typeof clearTimeout == "function" ? clearTimeout : null,
    d = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function m(P) {
    for (var g = n(c); g !== null; ) {
      if (g.callback === null) r(c);
      else if (g.startTime <= P)
        (r(c), (g.sortIndex = g.expirationTime), t(u, g));
      else break;
      g = n(c);
    }
  }
  function x(P) {
    if (((w = !1), m(P), !y))
      if (n(u) !== null) ((y = !0), Qt(j));
      else {
        var g = n(c);
        g !== null && bt(x, g.startTime - P);
      }
  }
  function j(P, g) {
    ((y = !1), w && ((w = !1), f(z), (z = -1)), (k = !0));
    var S = v;
    try {
      for (
        m(g), p = n(u);
        p !== null && (!(p.expirationTime > g) || (P && !xe()));

      ) {
        var R = p.callback;
        if (typeof R == "function") {
          ((p.callback = null), (v = p.priorityLevel));
          var D = R(p.expirationTime <= g);
          ((g = e.unstable_now()),
            typeof D == "function" ? (p.callback = D) : p === n(u) && r(u),
            m(g));
        } else r(u);
        p = n(u);
      }
      if (p !== null) var pe = !0;
      else {
        var be = n(c);
        (be !== null && bt(x, be.startTime - g), (pe = !1));
      }
      return pe;
    } finally {
      ((p = null), (v = S), (k = !1));
    }
  }
  var T = !1,
    L = null,
    z = -1,
    F = 5,
    O = -1;
  function xe() {
    return !(e.unstable_now() - O < F);
  }
  function lt() {
    if (L !== null) {
      var P = e.unstable_now();
      O = P;
      var g = !0;
      try {
        g = L(!0, P);
      } finally {
        g ? _t() : ((T = !1), (L = null));
      }
    } else T = !1;
  }
  var _t;
  if (typeof d == "function")
    _t = function () {
      d(lt);
    };
  else if (typeof MessageChannel < "u") {
    var it = new MessageChannel(),
      Fl = it.port2;
    ((it.port1.onmessage = lt),
      (_t = function () {
        Fl.postMessage(null);
      }));
  } else
    _t = function () {
      C(lt, 0);
    };
  function Qt(P) {
    ((L = P), T || ((T = !0), _t()));
  }
  function bt(P, g) {
    z = C(function () {
      P(e.unstable_now());
    }, g);
  }
  ((e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (P) {
      P.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      y || k || ((y = !0), Qt(j));
    }),
    (e.unstable_forceFrameRate = function (P) {
      0 > P || 125 < P
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (F = 0 < P ? Math.floor(1e3 / P) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return v;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(u);
    }),
    (e.unstable_next = function (P) {
      switch (v) {
        case 1:
        case 2:
        case 3:
          var g = 3;
          break;
        default:
          g = v;
      }
      var S = v;
      v = g;
      try {
        return P();
      } finally {
        v = S;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (P, g) {
      switch (P) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          P = 3;
      }
      var S = v;
      v = P;
      try {
        return g();
      } finally {
        v = S;
      }
    }),
    (e.unstable_scheduleCallback = function (P, g, S) {
      var R = e.unstable_now();
      switch (
        (typeof S == "object" && S !== null
          ? ((S = S.delay), (S = typeof S == "number" && 0 < S ? R + S : R))
          : (S = R),
        P)
      ) {
        case 1:
          var D = -1;
          break;
        case 2:
          D = 250;
          break;
        case 5:
          D = 1073741823;
          break;
        case 4:
          D = 1e4;
          break;
        default:
          D = 5e3;
      }
      return (
        (D = S + D),
        (P = {
          id: h++,
          callback: g,
          priorityLevel: P,
          startTime: S,
          expirationTime: D,
          sortIndex: -1,
        }),
        S > R
          ? ((P.sortIndex = S),
            t(c, P),
            n(u) === null &&
              P === n(c) &&
              (w ? (f(z), (z = -1)) : (w = !0), bt(x, S - R)))
          : ((P.sortIndex = D), t(u, P), y || k || ((y = !0), Qt(j))),
        P
      );
    }),
    (e.unstable_shouldYield = xe),
    (e.unstable_wrapCallback = function (P) {
      var g = v;
      return function () {
        var S = v;
        v = g;
        try {
          return P.apply(this, arguments);
        } finally {
          v = S;
        }
      };
    }));
})(Ba);
Aa.exports = Ba;
var Ed = Aa.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Nd = N,
  Ee = Ed;
function E(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var Wa = new Set(),
  Kn = {};
function Bt(e, t) {
  (mn(e, t), mn(e + "Capture", t));
}
function mn(e, t) {
  for (Kn[e] = t, e = 0; e < t.length; e++) Wa.add(t[e]);
}
var qe = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  mi = Object.prototype.hasOwnProperty,
  jd =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  ds = {},
  fs = {};
function Cd(e) {
  return mi.call(fs, e)
    ? !0
    : mi.call(ds, e)
      ? !1
      : jd.test(e)
        ? (fs[e] = !0)
        : ((ds[e] = !0), !1);
}
function Pd(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
          ? !n.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function _d(e, t, n, r) {
  if (t === null || typeof t > "u" || Pd(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function fe(e, t, n, r, l, i, o) {
  ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = l),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = i),
    (this.removeEmptyString = o));
}
var le = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    le[e] = new fe(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  le[t] = new fe(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  le[e] = new fe(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  le[e] = new fe(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    le[e] = new fe(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  le[e] = new fe(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  le[e] = new fe(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  le[e] = new fe(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  le[e] = new fe(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var go = /[\-:]([a-z])/g;
function vo(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(go, vo);
    le[t] = new fe(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(go, vo);
    le[t] = new fe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(go, vo);
  le[t] = new fe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  le[e] = new fe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
le.xlinkHref = new fe(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  le[e] = new fe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function yo(e, t, n, r) {
  var l = le.hasOwnProperty(t) ? le[t] : null;
  (l !== null
    ? l.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (_d(t, n, l, r) && (n = null),
    r || l === null
      ? Cd(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : l.mustUseProperty
        ? (e[l.propertyName] = n === null ? (l.type === 3 ? !1 : "") : n)
        : ((t = l.attributeName),
          (r = l.attributeNamespace),
          n === null
            ? e.removeAttribute(t)
            : ((l = l.type),
              (n = l === 3 || (l === 4 && n === !0) ? "" : "" + n),
              r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var rt = Nd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  wr = Symbol.for("react.element"),
  Yt = Symbol.for("react.portal"),
  Xt = Symbol.for("react.fragment"),
  xo = Symbol.for("react.strict_mode"),
  hi = Symbol.for("react.profiler"),
  Va = Symbol.for("react.provider"),
  Ha = Symbol.for("react.context"),
  wo = Symbol.for("react.forward_ref"),
  gi = Symbol.for("react.suspense"),
  vi = Symbol.for("react.suspense_list"),
  ko = Symbol.for("react.memo"),
  st = Symbol.for("react.lazy"),
  Qa = Symbol.for("react.offscreen"),
  ps = Symbol.iterator;
function jn(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (ps && e[ps]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var K = Object.assign,
  $l;
function In(e) {
  if ($l === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      $l = (t && t[1]) || "";
    }
  return (
    `
` +
    $l +
    e
  );
}
var Al = !1;
function Bl(e, t) {
  if (!e || Al) return "";
  Al = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (c) {
          var r = c;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (c) {
          r = c;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (c) {
        r = c;
      }
      e();
    }
  } catch (c) {
    if (c && r && typeof c.stack == "string") {
      for (
        var l = c.stack.split(`
`),
          i = r.stack.split(`
`),
          o = l.length - 1,
          s = i.length - 1;
        1 <= o && 0 <= s && l[o] !== i[s];

      )
        s--;
      for (; 1 <= o && 0 <= s; o--, s--)
        if (l[o] !== i[s]) {
          if (o !== 1 || s !== 1)
            do
              if ((o--, s--, 0 > s || l[o] !== i[s])) {
                var u =
                  `
` + l[o].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    u.includes("<anonymous>") &&
                    (u = u.replace("<anonymous>", e.displayName)),
                  u
                );
              }
            while (1 <= o && 0 <= s);
          break;
        }
    }
  } finally {
    ((Al = !1), (Error.prepareStackTrace = n));
  }
  return (e = e ? e.displayName || e.name : "") ? In(e) : "";
}
function Td(e) {
  switch (e.tag) {
    case 5:
      return In(e.type);
    case 16:
      return In("Lazy");
    case 13:
      return In("Suspense");
    case 19:
      return In("SuspenseList");
    case 0:
    case 2:
    case 15:
      return ((e = Bl(e.type, !1)), e);
    case 11:
      return ((e = Bl(e.type.render, !1)), e);
    case 1:
      return ((e = Bl(e.type, !0)), e);
    default:
      return "";
  }
}
function yi(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Xt:
      return "Fragment";
    case Yt:
      return "Portal";
    case hi:
      return "Profiler";
    case xo:
      return "StrictMode";
    case gi:
      return "Suspense";
    case vi:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Ha:
        return (e.displayName || "Context") + ".Consumer";
      case Va:
        return (e._context.displayName || "Context") + ".Provider";
      case wo:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case ko:
        return (
          (t = e.displayName || null),
          t !== null ? t : yi(e.type) || "Memo"
        );
      case st:
        ((t = e._payload), (e = e._init));
        try {
          return yi(e(t));
        } catch {}
    }
  return null;
}
function Ld(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return yi(t);
    case 8:
      return t === xo ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function Et(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function ba(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function Rd(e) {
  var t = ba(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var l = n.get,
      i = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return l.call(this);
        },
        set: function (o) {
          ((r = "" + o), i.call(this, o));
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (o) {
          r = "" + o;
        },
        stopTracking: function () {
          ((e._valueTracker = null), delete e[t]);
        },
      }
    );
  }
}
function kr(e) {
  e._valueTracker || (e._valueTracker = Rd(e));
}
function Ka(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = ba(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function Gr(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function xi(e, t) {
  var n = t.checked;
  return K({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function ms(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  ((n = Et(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    }));
}
function Ga(e, t) {
  ((t = t.checked), t != null && yo(e, "checked", t, !1));
}
function wi(e, t) {
  Ga(e, t);
  var n = Et(t.value),
    r = t.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  (t.hasOwnProperty("value")
    ? ki(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && ki(e, t.type, Et(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked));
}
function hs(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (
      !(
        (r !== "submit" && r !== "reset") ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    ((t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t));
  }
  ((n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n));
}
function ki(e, t, n) {
  (t !== "number" || Gr(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var Dn = Array.isArray;
function an(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
    for (n = 0; n < e.length; n++)
      ((l = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== l && (e[n].selected = l),
        l && r && (e[n].defaultSelected = !0));
  } else {
    for (n = "" + Et(n), t = null, l = 0; l < e.length; l++) {
      if (e[l].value === n) {
        ((e[l].selected = !0), r && (e[l].defaultSelected = !0));
        return;
      }
      t !== null || e[l].disabled || (t = e[l]);
    }
    t !== null && (t.selected = !0);
  }
}
function Si(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(E(91));
  return K({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function gs(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(E(92));
      if (Dn(n)) {
        if (1 < n.length) throw Error(E(93));
        n = n[0];
      }
      t = n;
    }
    (t == null && (t = ""), (n = t));
  }
  e._wrapperState = { initialValue: Et(n) };
}
function Ya(e, t) {
  var n = Et(t.value),
    r = Et(t.defaultValue);
  (n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r));
}
function vs(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Xa(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Ei(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? Xa(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var Sr,
  Za = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, l) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, l);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        Sr = Sr || document.createElement("div"),
          Sr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = Sr.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Gn(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Un = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  zd = ["Webkit", "ms", "Moz", "O"];
Object.keys(Un).forEach(function (e) {
  zd.forEach(function (t) {
    ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (Un[t] = Un[e]));
  });
});
function Ja(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (Un.hasOwnProperty(e) && Un[e])
      ? ("" + t).trim()
      : t + "px";
}
function qa(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        l = Ja(n, t[n], r);
      (n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : (e[n] = l));
    }
}
var Od = K(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
);
function Ni(e, t) {
  if (t) {
    if (Od[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(E(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(E(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(E(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(E(62));
  }
}
function ji(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var Ci = null;
function So(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var Pi = null,
  un = null,
  cn = null;
function ys(e) {
  if ((e = hr(e))) {
    if (typeof Pi != "function") throw Error(E(280));
    var t = e.stateNode;
    t && ((t = Nl(t)), Pi(e.stateNode, e.type, t));
  }
}
function eu(e) {
  un ? (cn ? cn.push(e) : (cn = [e])) : (un = e);
}
function tu() {
  if (un) {
    var e = un,
      t = cn;
    if (((cn = un = null), ys(e), t)) for (e = 0; e < t.length; e++) ys(t[e]);
  }
}
function nu(e, t) {
  return e(t);
}
function ru() {}
var Wl = !1;
function lu(e, t, n) {
  if (Wl) return e(t, n);
  Wl = !0;
  try {
    return nu(e, t, n);
  } finally {
    ((Wl = !1), (un !== null || cn !== null) && (ru(), tu()));
  }
}
function Yn(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = Nl(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      ((r = !r.disabled) ||
        ((e = e.type),
        (r = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !r));
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(E(231, t, typeof n));
  return n;
}
var _i = !1;
if (qe)
  try {
    var Cn = {};
    (Object.defineProperty(Cn, "passive", {
      get: function () {
        _i = !0;
      },
    }),
      window.addEventListener("test", Cn, Cn),
      window.removeEventListener("test", Cn, Cn));
  } catch {
    _i = !1;
  }
function Id(e, t, n, r, l, i, o, s, u) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, c);
  } catch (h) {
    this.onError(h);
  }
}
var $n = !1,
  Yr = null,
  Xr = !1,
  Ti = null,
  Dd = {
    onError: function (e) {
      (($n = !0), (Yr = e));
    },
  };
function Md(e, t, n, r, l, i, o, s, u) {
  (($n = !1), (Yr = null), Id.apply(Dd, arguments));
}
function Fd(e, t, n, r, l, i, o, s, u) {
  if ((Md.apply(this, arguments), $n)) {
    if ($n) {
      var c = Yr;
      (($n = !1), (Yr = null));
    } else throw Error(E(198));
    Xr || ((Xr = !0), (Ti = c));
  }
}
function Wt(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function iu(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function xs(e) {
  if (Wt(e) !== e) throw Error(E(188));
}
function Ud(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = Wt(e)), t === null)) throw Error(E(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var l = n.return;
    if (l === null) break;
    var i = l.alternate;
    if (i === null) {
      if (((r = l.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (l.child === i.child) {
      for (i = l.child; i; ) {
        if (i === n) return (xs(l), e);
        if (i === r) return (xs(l), t);
        i = i.sibling;
      }
      throw Error(E(188));
    }
    if (n.return !== r.return) ((n = l), (r = i));
    else {
      for (var o = !1, s = l.child; s; ) {
        if (s === n) {
          ((o = !0), (n = l), (r = i));
          break;
        }
        if (s === r) {
          ((o = !0), (r = l), (n = i));
          break;
        }
        s = s.sibling;
      }
      if (!o) {
        for (s = i.child; s; ) {
          if (s === n) {
            ((o = !0), (n = i), (r = l));
            break;
          }
          if (s === r) {
            ((o = !0), (r = i), (n = l));
            break;
          }
          s = s.sibling;
        }
        if (!o) throw Error(E(189));
      }
    }
    if (n.alternate !== r) throw Error(E(190));
  }
  if (n.tag !== 3) throw Error(E(188));
  return n.stateNode.current === n ? e : t;
}
function ou(e) {
  return ((e = Ud(e)), e !== null ? su(e) : null);
}
function su(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = su(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var au = Ee.unstable_scheduleCallback,
  ws = Ee.unstable_cancelCallback,
  $d = Ee.unstable_shouldYield,
  Ad = Ee.unstable_requestPaint,
  Y = Ee.unstable_now,
  Bd = Ee.unstable_getCurrentPriorityLevel,
  Eo = Ee.unstable_ImmediatePriority,
  uu = Ee.unstable_UserBlockingPriority,
  Zr = Ee.unstable_NormalPriority,
  Wd = Ee.unstable_LowPriority,
  cu = Ee.unstable_IdlePriority,
  wl = null,
  He = null;
function Vd(e) {
  if (He && typeof He.onCommitFiberRoot == "function")
    try {
      He.onCommitFiberRoot(wl, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var Fe = Math.clz32 ? Math.clz32 : bd,
  Hd = Math.log,
  Qd = Math.LN2;
function bd(e) {
  return ((e >>>= 0), e === 0 ? 32 : (31 - ((Hd(e) / Qd) | 0)) | 0);
}
var Er = 64,
  Nr = 4194304;
function Mn(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function Jr(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    l = e.suspendedLanes,
    i = e.pingedLanes,
    o = n & 268435455;
  if (o !== 0) {
    var s = o & ~l;
    s !== 0 ? (r = Mn(s)) : ((i &= o), i !== 0 && (r = Mn(i)));
  } else ((o = n & ~l), o !== 0 ? (r = Mn(o)) : i !== 0 && (r = Mn(i)));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & l) &&
    ((l = r & -r), (i = t & -t), l >= i || (l === 16 && (i & 4194240) !== 0))
  )
    return t;
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      ((n = 31 - Fe(t)), (l = 1 << n), (r |= e[n]), (t &= ~l));
  return r;
}
function Kd(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Gd(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      l = e.expirationTimes,
      i = e.pendingLanes;
    0 < i;

  ) {
    var o = 31 - Fe(i),
      s = 1 << o,
      u = l[o];
    (u === -1
      ? (!(s & n) || s & r) && (l[o] = Kd(s, t))
      : u <= t && (e.expiredLanes |= s),
      (i &= ~s));
  }
}
function Li(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function du() {
  var e = Er;
  return ((Er <<= 1), !(Er & 4194240) && (Er = 64), e);
}
function Vl(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function pr(e, t, n) {
  ((e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - Fe(t)),
    (e[t] = n));
}
function Yd(e, t) {
  var n = e.pendingLanes & ~t;
  ((e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements));
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var l = 31 - Fe(n),
      i = 1 << l;
    ((t[l] = 0), (r[l] = -1), (e[l] = -1), (n &= ~i));
  }
}
function No(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - Fe(n),
      l = 1 << r;
    ((l & t) | (e[r] & t) && (e[r] |= t), (n &= ~l));
  }
}
var U = 0;
function fu(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1
  );
}
var pu,
  jo,
  mu,
  hu,
  gu,
  Ri = !1,
  jr = [],
  mt = null,
  ht = null,
  gt = null,
  Xn = new Map(),
  Zn = new Map(),
  ut = [],
  Xd =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function ks(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      mt = null;
      break;
    case "dragenter":
    case "dragleave":
      ht = null;
      break;
    case "mouseover":
    case "mouseout":
      gt = null;
      break;
    case "pointerover":
    case "pointerout":
      Xn.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Zn.delete(t.pointerId);
  }
}
function Pn(e, t, n, r, l, i) {
  return e === null || e.nativeEvent !== i
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: i,
        targetContainers: [l],
      }),
      t !== null && ((t = hr(t)), t !== null && jo(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      l !== null && t.indexOf(l) === -1 && t.push(l),
      e);
}
function Zd(e, t, n, r, l) {
  switch (t) {
    case "focusin":
      return ((mt = Pn(mt, e, t, n, r, l)), !0);
    case "dragenter":
      return ((ht = Pn(ht, e, t, n, r, l)), !0);
    case "mouseover":
      return ((gt = Pn(gt, e, t, n, r, l)), !0);
    case "pointerover":
      var i = l.pointerId;
      return (Xn.set(i, Pn(Xn.get(i) || null, e, t, n, r, l)), !0);
    case "gotpointercapture":
      return (
        (i = l.pointerId),
        Zn.set(i, Pn(Zn.get(i) || null, e, t, n, r, l)),
        !0
      );
  }
  return !1;
}
function vu(e) {
  var t = Rt(e.target);
  if (t !== null) {
    var n = Wt(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = iu(n)), t !== null)) {
          ((e.blockedOn = t),
            gu(e.priority, function () {
              mu(n);
            }));
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Ur(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = zi(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      ((Ci = r), n.target.dispatchEvent(r), (Ci = null));
    } else return ((t = hr(n)), t !== null && jo(t), (e.blockedOn = n), !1);
    t.shift();
  }
  return !0;
}
function Ss(e, t, n) {
  Ur(e) && n.delete(t);
}
function Jd() {
  ((Ri = !1),
    mt !== null && Ur(mt) && (mt = null),
    ht !== null && Ur(ht) && (ht = null),
    gt !== null && Ur(gt) && (gt = null),
    Xn.forEach(Ss),
    Zn.forEach(Ss));
}
function _n(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Ri ||
      ((Ri = !0),
      Ee.unstable_scheduleCallback(Ee.unstable_NormalPriority, Jd)));
}
function Jn(e) {
  function t(l) {
    return _n(l, e);
  }
  if (0 < jr.length) {
    _n(jr[0], e);
    for (var n = 1; n < jr.length; n++) {
      var r = jr[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    mt !== null && _n(mt, e),
      ht !== null && _n(ht, e),
      gt !== null && _n(gt, e),
      Xn.forEach(t),
      Zn.forEach(t),
      n = 0;
    n < ut.length;
    n++
  )
    ((r = ut[n]), r.blockedOn === e && (r.blockedOn = null));
  for (; 0 < ut.length && ((n = ut[0]), n.blockedOn === null); )
    (vu(n), n.blockedOn === null && ut.shift());
}
var dn = rt.ReactCurrentBatchConfig,
  qr = !0;
function qd(e, t, n, r) {
  var l = U,
    i = dn.transition;
  dn.transition = null;
  try {
    ((U = 1), Co(e, t, n, r));
  } finally {
    ((U = l), (dn.transition = i));
  }
}
function ef(e, t, n, r) {
  var l = U,
    i = dn.transition;
  dn.transition = null;
  try {
    ((U = 4), Co(e, t, n, r));
  } finally {
    ((U = l), (dn.transition = i));
  }
}
function Co(e, t, n, r) {
  if (qr) {
    var l = zi(e, t, n, r);
    if (l === null) (ql(e, t, r, el, n), ks(e, r));
    else if (Zd(l, e, t, n, r)) r.stopPropagation();
    else if ((ks(e, r), t & 4 && -1 < Xd.indexOf(e))) {
      for (; l !== null; ) {
        var i = hr(l);
        if (
          (i !== null && pu(i),
          (i = zi(e, t, n, r)),
          i === null && ql(e, t, r, el, n),
          i === l)
        )
          break;
        l = i;
      }
      l !== null && r.stopPropagation();
    } else ql(e, t, r, null, n);
  }
}
var el = null;
function zi(e, t, n, r) {
  if (((el = null), (e = So(r)), (e = Rt(e)), e !== null))
    if (((t = Wt(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = iu(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return ((el = e), null);
}
function yu(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (Bd()) {
        case Eo:
          return 1;
        case uu:
          return 4;
        case Zr:
        case Wd:
          return 16;
        case cu:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var dt = null,
  Po = null,
  $r = null;
function xu() {
  if ($r) return $r;
  var e,
    t = Po,
    n = t.length,
    r,
    l = "value" in dt ? dt.value : dt.textContent,
    i = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++);
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === l[i - r]; r++);
  return ($r = l.slice(e, 1 < r ? 1 - r : void 0));
}
function Ar(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Cr() {
  return !0;
}
function Es() {
  return !1;
}
function je(e) {
  function t(n, r, l, i, o) {
    ((this._reactName = n),
      (this._targetInst = l),
      (this.type = r),
      (this.nativeEvent = i),
      (this.target = o),
      (this.currentTarget = null));
    for (var s in e)
      e.hasOwnProperty(s) && ((n = e[s]), (this[s] = n ? n(i) : i[s]));
    return (
      (this.isDefaultPrevented = (
        i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
      )
        ? Cr
        : Es),
      (this.isPropagationStopped = Es),
      this
    );
  }
  return (
    K(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = Cr));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = Cr));
      },
      persist: function () {},
      isPersistent: Cr,
    }),
    t
  );
}
var Sn = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  _o = je(Sn),
  mr = K({}, Sn, { view: 0, detail: 0 }),
  tf = je(mr),
  Hl,
  Ql,
  Tn,
  kl = K({}, mr, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: To,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== Tn &&
            (Tn && e.type === "mousemove"
              ? ((Hl = e.screenX - Tn.screenX), (Ql = e.screenY - Tn.screenY))
              : (Ql = Hl = 0),
            (Tn = e)),
          Hl);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : Ql;
    },
  }),
  Ns = je(kl),
  nf = K({}, kl, { dataTransfer: 0 }),
  rf = je(nf),
  lf = K({}, mr, { relatedTarget: 0 }),
  bl = je(lf),
  of = K({}, Sn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  sf = je(of),
  af = K({}, Sn, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  uf = je(af),
  cf = K({}, Sn, { data: 0 }),
  js = je(cf),
  df = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  ff = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  pf = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function mf(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = pf[e]) ? !!t[e] : !1;
}
function To() {
  return mf;
}
var hf = K({}, mr, {
    key: function (e) {
      if (e.key) {
        var t = df[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = Ar(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? ff[e.keyCode] || "Unidentified"
          : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: To,
    charCode: function (e) {
      return e.type === "keypress" ? Ar(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? Ar(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  gf = je(hf),
  vf = K({}, kl, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  Cs = je(vf),
  yf = K({}, mr, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: To,
  }),
  xf = je(yf),
  wf = K({}, Sn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  kf = je(wf),
  Sf = K({}, kl, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
          ? -e.wheelDeltaY
          : "wheelDelta" in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  Ef = je(Sf),
  Nf = [9, 13, 27, 32],
  Lo = qe && "CompositionEvent" in window,
  An = null;
qe && "documentMode" in document && (An = document.documentMode);
var jf = qe && "TextEvent" in window && !An,
  wu = qe && (!Lo || (An && 8 < An && 11 >= An)),
  Ps = " ",
  _s = !1;
function ku(e, t) {
  switch (e) {
    case "keyup":
      return Nf.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Su(e) {
  return ((e = e.detail), typeof e == "object" && "data" in e ? e.data : null);
}
var Zt = !1;
function Cf(e, t) {
  switch (e) {
    case "compositionend":
      return Su(t);
    case "keypress":
      return t.which !== 32 ? null : ((_s = !0), Ps);
    case "textInput":
      return ((e = t.data), e === Ps && _s ? null : e);
    default:
      return null;
  }
}
function Pf(e, t) {
  if (Zt)
    return e === "compositionend" || (!Lo && ku(e, t))
      ? ((e = xu()), ($r = Po = dt = null), (Zt = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return wu && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var _f = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function Ts(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!_f[e.type] : t === "textarea";
}
function Eu(e, t, n, r) {
  (eu(r),
    (t = tl(t, "onChange")),
    0 < t.length &&
      ((n = new _o("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t })));
}
var Bn = null,
  qn = null;
function Tf(e) {
  Iu(e, 0);
}
function Sl(e) {
  var t = en(e);
  if (Ka(t)) return e;
}
function Lf(e, t) {
  if (e === "change") return t;
}
var Nu = !1;
if (qe) {
  var Kl;
  if (qe) {
    var Gl = "oninput" in document;
    if (!Gl) {
      var Ls = document.createElement("div");
      (Ls.setAttribute("oninput", "return;"),
        (Gl = typeof Ls.oninput == "function"));
    }
    Kl = Gl;
  } else Kl = !1;
  Nu = Kl && (!document.documentMode || 9 < document.documentMode);
}
function Rs() {
  Bn && (Bn.detachEvent("onpropertychange", ju), (qn = Bn = null));
}
function ju(e) {
  if (e.propertyName === "value" && Sl(qn)) {
    var t = [];
    (Eu(t, qn, e, So(e)), lu(Tf, t));
  }
}
function Rf(e, t, n) {
  e === "focusin"
    ? (Rs(), (Bn = t), (qn = n), Bn.attachEvent("onpropertychange", ju))
    : e === "focusout" && Rs();
}
function zf(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return Sl(qn);
}
function Of(e, t) {
  if (e === "click") return Sl(t);
}
function If(e, t) {
  if (e === "input" || e === "change") return Sl(t);
}
function Df(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var $e = typeof Object.is == "function" ? Object.is : Df;
function er(e, t) {
  if ($e(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var l = n[r];
    if (!mi.call(t, l) || !$e(e[l], t[l])) return !1;
  }
  return !0;
}
function zs(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Os(e, t) {
  var n = zs(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t))
        return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = zs(n);
  }
}
function Cu(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? Cu(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function Pu() {
  for (var e = window, t = Gr(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Gr(e.document);
  }
  return t;
}
function Ro(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function Mf(e) {
  var t = Pu(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    Cu(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && Ro(n)) {
      if (
        ((t = r.start),
        (e = r.end),
        e === void 0 && (e = t),
        "selectionStart" in n)
      )
        ((n.selectionStart = t),
          (n.selectionEnd = Math.min(e, n.value.length)));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var l = n.textContent.length,
          i = Math.min(r.start, l);
        ((r = r.end === void 0 ? i : Math.min(r.end, l)),
          !e.extend && i > r && ((l = r), (r = i), (i = l)),
          (l = Os(n, i)));
        var o = Os(n, r);
        l &&
          o &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== l.node ||
            e.anchorOffset !== l.offset ||
            e.focusNode !== o.node ||
            e.focusOffset !== o.offset) &&
          ((t = t.createRange()),
          t.setStart(l.node, l.offset),
          e.removeAllRanges(),
          i > r
            ? (e.addRange(t), e.extend(o.node, o.offset))
            : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      ((e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top));
  }
}
var Ff = qe && "documentMode" in document && 11 >= document.documentMode,
  Jt = null,
  Oi = null,
  Wn = null,
  Ii = !1;
function Is(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Ii ||
    Jt == null ||
    Jt !== Gr(r) ||
    ((r = Jt),
    "selectionStart" in r && Ro(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (Wn && er(Wn, r)) ||
      ((Wn = r),
      (r = tl(Oi, "onSelect")),
      0 < r.length &&
        ((t = new _o("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = Jt))));
}
function Pr(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var qt = {
    animationend: Pr("Animation", "AnimationEnd"),
    animationiteration: Pr("Animation", "AnimationIteration"),
    animationstart: Pr("Animation", "AnimationStart"),
    transitionend: Pr("Transition", "TransitionEnd"),
  },
  Yl = {},
  _u = {};
qe &&
  ((_u = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete qt.animationend.animation,
    delete qt.animationiteration.animation,
    delete qt.animationstart.animation),
  "TransitionEvent" in window || delete qt.transitionend.transition);
function El(e) {
  if (Yl[e]) return Yl[e];
  if (!qt[e]) return e;
  var t = qt[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in _u) return (Yl[e] = t[n]);
  return e;
}
var Tu = El("animationend"),
  Lu = El("animationiteration"),
  Ru = El("animationstart"),
  zu = El("transitionend"),
  Ou = new Map(),
  Ds =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function jt(e, t) {
  (Ou.set(e, t), Bt(t, [e]));
}
for (var Xl = 0; Xl < Ds.length; Xl++) {
  var Zl = Ds[Xl],
    Uf = Zl.toLowerCase(),
    $f = Zl[0].toUpperCase() + Zl.slice(1);
  jt(Uf, "on" + $f);
}
jt(Tu, "onAnimationEnd");
jt(Lu, "onAnimationIteration");
jt(Ru, "onAnimationStart");
jt("dblclick", "onDoubleClick");
jt("focusin", "onFocus");
jt("focusout", "onBlur");
jt(zu, "onTransitionEnd");
mn("onMouseEnter", ["mouseout", "mouseover"]);
mn("onMouseLeave", ["mouseout", "mouseover"]);
mn("onPointerEnter", ["pointerout", "pointerover"]);
mn("onPointerLeave", ["pointerout", "pointerover"]);
Bt(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
Bt(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
Bt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Bt(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
Bt(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
Bt(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var Fn =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  Af = new Set("cancel close invalid load scroll toggle".split(" ").concat(Fn));
function Ms(e, t, n) {
  var r = e.type || "unknown-event";
  ((e.currentTarget = n), Fd(r, t, void 0, e), (e.currentTarget = null));
}
function Iu(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      l = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (t)
        for (var o = r.length - 1; 0 <= o; o--) {
          var s = r[o],
            u = s.instance,
            c = s.currentTarget;
          if (((s = s.listener), u !== i && l.isPropagationStopped())) break e;
          (Ms(l, s, c), (i = u));
        }
      else
        for (o = 0; o < r.length; o++) {
          if (
            ((s = r[o]),
            (u = s.instance),
            (c = s.currentTarget),
            (s = s.listener),
            u !== i && l.isPropagationStopped())
          )
            break e;
          (Ms(l, s, c), (i = u));
        }
    }
  }
  if (Xr) throw ((e = Ti), (Xr = !1), (Ti = null), e);
}
function W(e, t) {
  var n = t[$i];
  n === void 0 && (n = t[$i] = new Set());
  var r = e + "__bubble";
  n.has(r) || (Du(t, e, 2, !1), n.add(r));
}
function Jl(e, t, n) {
  var r = 0;
  (t && (r |= 4), Du(n, e, r, t));
}
var _r = "_reactListening" + Math.random().toString(36).slice(2);
function tr(e) {
  if (!e[_r]) {
    ((e[_r] = !0),
      Wa.forEach(function (n) {
        n !== "selectionchange" && (Af.has(n) || Jl(n, !1, e), Jl(n, !0, e));
      }));
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[_r] || ((t[_r] = !0), Jl("selectionchange", !1, t));
  }
}
function Du(e, t, n, r) {
  switch (yu(t)) {
    case 1:
      var l = qd;
      break;
    case 4:
      l = ef;
      break;
    default:
      l = Co;
  }
  ((n = l.bind(null, t, n, e)),
    (l = void 0),
    !_i ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (l = !0),
    r
      ? l !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: l })
        : e.addEventListener(t, n, !0)
      : l !== void 0
        ? e.addEventListener(t, n, { passive: l })
        : e.addEventListener(t, n, !1));
}
function ql(e, t, n, r, l) {
  var i = r;
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var s = r.stateNode.containerInfo;
        if (s === l || (s.nodeType === 8 && s.parentNode === l)) break;
        if (o === 4)
          for (o = r.return; o !== null; ) {
            var u = o.tag;
            if (
              (u === 3 || u === 4) &&
              ((u = o.stateNode.containerInfo),
              u === l || (u.nodeType === 8 && u.parentNode === l))
            )
              return;
            o = o.return;
          }
        for (; s !== null; ) {
          if (((o = Rt(s)), o === null)) return;
          if (((u = o.tag), u === 5 || u === 6)) {
            r = i = o;
            continue e;
          }
          s = s.parentNode;
        }
      }
      r = r.return;
    }
  lu(function () {
    var c = i,
      h = So(n),
      p = [];
    e: {
      var v = Ou.get(e);
      if (v !== void 0) {
        var k = _o,
          y = e;
        switch (e) {
          case "keypress":
            if (Ar(n) === 0) break e;
          case "keydown":
          case "keyup":
            k = gf;
            break;
          case "focusin":
            ((y = "focus"), (k = bl));
            break;
          case "focusout":
            ((y = "blur"), (k = bl));
            break;
          case "beforeblur":
          case "afterblur":
            k = bl;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k = Ns;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k = rf;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k = xf;
            break;
          case Tu:
          case Lu:
          case Ru:
            k = sf;
            break;
          case zu:
            k = kf;
            break;
          case "scroll":
            k = tf;
            break;
          case "wheel":
            k = Ef;
            break;
          case "copy":
          case "cut":
          case "paste":
            k = uf;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k = Cs;
        }
        var w = (t & 4) !== 0,
          C = !w && e === "scroll",
          f = w ? (v !== null ? v + "Capture" : null) : v;
        w = [];
        for (var d = c, m; d !== null; ) {
          m = d;
          var x = m.stateNode;
          if (
            (m.tag === 5 &&
              x !== null &&
              ((m = x),
              f !== null && ((x = Yn(d, f)), x != null && w.push(nr(d, x, m)))),
            C)
          )
            break;
          d = d.return;
        }
        0 < w.length &&
          ((v = new k(v, y, null, n, h)), p.push({ event: v, listeners: w }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((v = e === "mouseover" || e === "pointerover"),
          (k = e === "mouseout" || e === "pointerout"),
          v &&
            n !== Ci &&
            (y = n.relatedTarget || n.fromElement) &&
            (Rt(y) || y[et]))
        )
          break e;
        if (
          (k || v) &&
          ((v =
            h.window === h
              ? h
              : (v = h.ownerDocument)
                ? v.defaultView || v.parentWindow
                : window),
          k
            ? ((y = n.relatedTarget || n.toElement),
              (k = c),
              (y = y ? Rt(y) : null),
              y !== null &&
                ((C = Wt(y)), y !== C || (y.tag !== 5 && y.tag !== 6)) &&
                (y = null))
            : ((k = null), (y = c)),
          k !== y)
        ) {
          if (
            ((w = Ns),
            (x = "onMouseLeave"),
            (f = "onMouseEnter"),
            (d = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((w = Cs),
              (x = "onPointerLeave"),
              (f = "onPointerEnter"),
              (d = "pointer")),
            (C = k == null ? v : en(k)),
            (m = y == null ? v : en(y)),
            (v = new w(x, d + "leave", k, n, h)),
            (v.target = C),
            (v.relatedTarget = m),
            (x = null),
            Rt(h) === c &&
              ((w = new w(f, d + "enter", y, n, h)),
              (w.target = m),
              (w.relatedTarget = C),
              (x = w)),
            (C = x),
            k && y)
          )
            t: {
              for (w = k, f = y, d = 0, m = w; m; m = Gt(m)) d++;
              for (m = 0, x = f; x; x = Gt(x)) m++;
              for (; 0 < d - m; ) ((w = Gt(w)), d--);
              for (; 0 < m - d; ) ((f = Gt(f)), m--);
              for (; d--; ) {
                if (w === f || (f !== null && w === f.alternate)) break t;
                ((w = Gt(w)), (f = Gt(f)));
              }
              w = null;
            }
          else w = null;
          (k !== null && Fs(p, v, k, w, !1),
            y !== null && C !== null && Fs(p, C, y, w, !0));
        }
      }
      e: {
        if (
          ((v = c ? en(c) : window),
          (k = v.nodeName && v.nodeName.toLowerCase()),
          k === "select" || (k === "input" && v.type === "file"))
        )
          var j = Lf;
        else if (Ts(v))
          if (Nu) j = If;
          else {
            j = zf;
            var T = Rf;
          }
        else
          (k = v.nodeName) &&
            k.toLowerCase() === "input" &&
            (v.type === "checkbox" || v.type === "radio") &&
            (j = Of);
        if (j && (j = j(e, c))) {
          Eu(p, j, n, h);
          break e;
        }
        (T && T(e, v, c),
          e === "focusout" &&
            (T = v._wrapperState) &&
            T.controlled &&
            v.type === "number" &&
            ki(v, "number", v.value));
      }
      switch (((T = c ? en(c) : window), e)) {
        case "focusin":
          (Ts(T) || T.contentEditable === "true") &&
            ((Jt = T), (Oi = c), (Wn = null));
          break;
        case "focusout":
          Wn = Oi = Jt = null;
          break;
        case "mousedown":
          Ii = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          ((Ii = !1), Is(p, n, h));
          break;
        case "selectionchange":
          if (Ff) break;
        case "keydown":
        case "keyup":
          Is(p, n, h);
      }
      var L;
      if (Lo)
        e: {
          switch (e) {
            case "compositionstart":
              var z = "onCompositionStart";
              break e;
            case "compositionend":
              z = "onCompositionEnd";
              break e;
            case "compositionupdate":
              z = "onCompositionUpdate";
              break e;
          }
          z = void 0;
        }
      else
        Zt
          ? ku(e, n) && (z = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (z = "onCompositionStart");
      (z &&
        (wu &&
          n.locale !== "ko" &&
          (Zt || z !== "onCompositionStart"
            ? z === "onCompositionEnd" && Zt && (L = xu())
            : ((dt = h),
              (Po = "value" in dt ? dt.value : dt.textContent),
              (Zt = !0))),
        (T = tl(c, z)),
        0 < T.length &&
          ((z = new js(z, e, null, n, h)),
          p.push({ event: z, listeners: T }),
          L ? (z.data = L) : ((L = Su(n)), L !== null && (z.data = L)))),
        (L = jf ? Cf(e, n) : Pf(e, n)) &&
          ((c = tl(c, "onBeforeInput")),
          0 < c.length &&
            ((h = new js("onBeforeInput", "beforeinput", null, n, h)),
            p.push({ event: h, listeners: c }),
            (h.data = L))));
    }
    Iu(p, t);
  });
}
function nr(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function tl(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var l = e,
      i = l.stateNode;
    (l.tag === 5 &&
      i !== null &&
      ((l = i),
      (i = Yn(e, n)),
      i != null && r.unshift(nr(e, i, l)),
      (i = Yn(e, t)),
      i != null && r.push(nr(e, i, l))),
      (e = e.return));
  }
  return r;
}
function Gt(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Fs(e, t, n, r, l) {
  for (var i = t._reactName, o = []; n !== null && n !== r; ) {
    var s = n,
      u = s.alternate,
      c = s.stateNode;
    if (u !== null && u === r) break;
    (s.tag === 5 &&
      c !== null &&
      ((s = c),
      l
        ? ((u = Yn(n, i)), u != null && o.unshift(nr(n, u, s)))
        : l || ((u = Yn(n, i)), u != null && o.push(nr(n, u, s)))),
      (n = n.return));
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var Bf = /\r\n?/g,
  Wf = /\u0000|\uFFFD/g;
function Us(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      Bf,
      `
`,
    )
    .replace(Wf, "");
}
function Tr(e, t, n) {
  if (((t = Us(t)), Us(e) !== t && n)) throw Error(E(425));
}
function nl() {}
var Di = null,
  Mi = null;
function Fi(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var Ui = typeof setTimeout == "function" ? setTimeout : void 0,
  Vf = typeof clearTimeout == "function" ? clearTimeout : void 0,
  $s = typeof Promise == "function" ? Promise : void 0,
  Hf =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof $s < "u"
        ? function (e) {
            return $s.resolve(null).then(e).catch(Qf);
          }
        : Ui;
function Qf(e) {
  setTimeout(function () {
    throw e;
  });
}
function ei(e, t) {
  var n = t,
    r = 0;
  do {
    var l = n.nextSibling;
    if ((e.removeChild(n), l && l.nodeType === 8))
      if (((n = l.data), n === "/$")) {
        if (r === 0) {
          (e.removeChild(l), Jn(t));
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = l;
  } while (n);
  Jn(t);
}
function vt(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function As(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var En = Math.random().toString(36).slice(2),
  Ve = "__reactFiber$" + En,
  rr = "__reactProps$" + En,
  et = "__reactContainer$" + En,
  $i = "__reactEvents$" + En,
  bf = "__reactListeners$" + En,
  Kf = "__reactHandles$" + En;
function Rt(e) {
  var t = e[Ve];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[et] || n[Ve])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = As(e); e !== null; ) {
          if ((n = e[Ve])) return n;
          e = As(e);
        }
      return t;
    }
    ((e = n), (n = e.parentNode));
  }
  return null;
}
function hr(e) {
  return (
    (e = e[Ve] || e[et]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function en(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(E(33));
}
function Nl(e) {
  return e[rr] || null;
}
var Ai = [],
  tn = -1;
function Ct(e) {
  return { current: e };
}
function V(e) {
  0 > tn || ((e.current = Ai[tn]), (Ai[tn] = null), tn--);
}
function A(e, t) {
  (tn++, (Ai[tn] = e.current), (e.current = t));
}
var Nt = {},
  ae = Ct(Nt),
  ge = Ct(!1),
  Mt = Nt;
function hn(e, t) {
  var n = e.type.contextTypes;
  if (!n) return Nt;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var l = {},
    i;
  for (i in n) l[i] = t[i];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = l)),
    l
  );
}
function ve(e) {
  return ((e = e.childContextTypes), e != null);
}
function rl() {
  (V(ge), V(ae));
}
function Bs(e, t, n) {
  if (ae.current !== Nt) throw Error(E(168));
  (A(ae, t), A(ge, n));
}
function Mu(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in t)) throw Error(E(108, Ld(e) || "Unknown", l));
  return K({}, n, r);
}
function ll(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Nt),
    (Mt = ae.current),
    A(ae, e),
    A(ge, ge.current),
    !0
  );
}
function Ws(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(E(169));
  (n
    ? ((e = Mu(e, t, Mt)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      V(ge),
      V(ae),
      A(ae, e))
    : V(ge),
    A(ge, n));
}
var Ye = null,
  jl = !1,
  ti = !1;
function Fu(e) {
  Ye === null ? (Ye = [e]) : Ye.push(e);
}
function Gf(e) {
  ((jl = !0), Fu(e));
}
function Pt() {
  if (!ti && Ye !== null) {
    ti = !0;
    var e = 0,
      t = U;
    try {
      var n = Ye;
      for (U = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      ((Ye = null), (jl = !1));
    } catch (l) {
      throw (Ye !== null && (Ye = Ye.slice(e + 1)), au(Eo, Pt), l);
    } finally {
      ((U = t), (ti = !1));
    }
  }
  return null;
}
var nn = [],
  rn = 0,
  il = null,
  ol = 0,
  Pe = [],
  _e = 0,
  Ft = null,
  Xe = 1,
  Ze = "";
function Tt(e, t) {
  ((nn[rn++] = ol), (nn[rn++] = il), (il = e), (ol = t));
}
function Uu(e, t, n) {
  ((Pe[_e++] = Xe), (Pe[_e++] = Ze), (Pe[_e++] = Ft), (Ft = e));
  var r = Xe;
  e = Ze;
  var l = 32 - Fe(r) - 1;
  ((r &= ~(1 << l)), (n += 1));
  var i = 32 - Fe(t) + l;
  if (30 < i) {
    var o = l - (l % 5);
    ((i = (r & ((1 << o) - 1)).toString(32)),
      (r >>= o),
      (l -= o),
      (Xe = (1 << (32 - Fe(t) + l)) | (n << l) | r),
      (Ze = i + e));
  } else ((Xe = (1 << i) | (n << l) | r), (Ze = e));
}
function zo(e) {
  e.return !== null && (Tt(e, 1), Uu(e, 1, 0));
}
function Oo(e) {
  for (; e === il; )
    ((il = nn[--rn]), (nn[rn] = null), (ol = nn[--rn]), (nn[rn] = null));
  for (; e === Ft; )
    ((Ft = Pe[--_e]),
      (Pe[_e] = null),
      (Ze = Pe[--_e]),
      (Pe[_e] = null),
      (Xe = Pe[--_e]),
      (Pe[_e] = null));
}
var Se = null,
  ke = null,
  H = !1,
  Me = null;
function $u(e, t) {
  var n = Te(5, null, null, 0);
  ((n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
}
function Vs(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (Se = e), (ke = vt(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (Se = e), (ke = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = Ft !== null ? { id: Xe, overflow: Ze } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = Te(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (Se = e),
            (ke = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function Bi(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Wi(e) {
  if (H) {
    var t = ke;
    if (t) {
      var n = t;
      if (!Vs(e, t)) {
        if (Bi(e)) throw Error(E(418));
        t = vt(n.nextSibling);
        var r = Se;
        t && Vs(e, t)
          ? $u(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (H = !1), (Se = e));
      }
    } else {
      if (Bi(e)) throw Error(E(418));
      ((e.flags = (e.flags & -4097) | 2), (H = !1), (Se = e));
    }
  }
}
function Hs(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  Se = e;
}
function Lr(e) {
  if (e !== Se) return !1;
  if (!H) return (Hs(e), (H = !0), !1);
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !Fi(e.type, e.memoizedProps))),
    t && (t = ke))
  ) {
    if (Bi(e)) throw (Au(), Error(E(418)));
    for (; t; ) ($u(e, t), (t = vt(t.nextSibling)));
  }
  if ((Hs(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(E(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              ke = vt(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      ke = null;
    }
  } else ke = Se ? vt(e.stateNode.nextSibling) : null;
  return !0;
}
function Au() {
  for (var e = ke; e; ) e = vt(e.nextSibling);
}
function gn() {
  ((ke = Se = null), (H = !1));
}
function Io(e) {
  Me === null ? (Me = [e]) : Me.push(e);
}
var Yf = rt.ReactCurrentBatchConfig;
function Ln(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(E(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(E(147, e));
      var l = r,
        i = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === i
        ? t.ref
        : ((t = function (o) {
            var s = l.refs;
            o === null ? delete s[i] : (s[i] = o);
          }),
          (t._stringRef = i),
          t);
    }
    if (typeof e != "string") throw Error(E(284));
    if (!n._owner) throw Error(E(290, e));
  }
  return e;
}
function Rr(e, t) {
  throw (
    (e = Object.prototype.toString.call(t)),
    Error(
      E(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e,
      ),
    )
  );
}
function Qs(e) {
  var t = e._init;
  return t(e._payload);
}
function Bu(e) {
  function t(f, d) {
    if (e) {
      var m = f.deletions;
      m === null ? ((f.deletions = [d]), (f.flags |= 16)) : m.push(d);
    }
  }
  function n(f, d) {
    if (!e) return null;
    for (; d !== null; ) (t(f, d), (d = d.sibling));
    return null;
  }
  function r(f, d) {
    for (f = new Map(); d !== null; )
      (d.key !== null ? f.set(d.key, d) : f.set(d.index, d), (d = d.sibling));
    return f;
  }
  function l(f, d) {
    return ((f = kt(f, d)), (f.index = 0), (f.sibling = null), f);
  }
  function i(f, d, m) {
    return (
      (f.index = m),
      e
        ? ((m = f.alternate),
          m !== null
            ? ((m = m.index), m < d ? ((f.flags |= 2), d) : m)
            : ((f.flags |= 2), d))
        : ((f.flags |= 1048576), d)
    );
  }
  function o(f) {
    return (e && f.alternate === null && (f.flags |= 2), f);
  }
  function s(f, d, m, x) {
    return d === null || d.tag !== 6
      ? ((d = ai(m, f.mode, x)), (d.return = f), d)
      : ((d = l(d, m)), (d.return = f), d);
  }
  function u(f, d, m, x) {
    var j = m.type;
    return j === Xt
      ? h(f, d, m.props.children, x, m.key)
      : d !== null &&
          (d.elementType === j ||
            (typeof j == "object" &&
              j !== null &&
              j.$$typeof === st &&
              Qs(j) === d.type))
        ? ((x = l(d, m.props)), (x.ref = Ln(f, d, m)), (x.return = f), x)
        : ((x = Kr(m.type, m.key, m.props, null, f.mode, x)),
          (x.ref = Ln(f, d, m)),
          (x.return = f),
          x);
  }
  function c(f, d, m, x) {
    return d === null ||
      d.tag !== 4 ||
      d.stateNode.containerInfo !== m.containerInfo ||
      d.stateNode.implementation !== m.implementation
      ? ((d = ui(m, f.mode, x)), (d.return = f), d)
      : ((d = l(d, m.children || [])), (d.return = f), d);
  }
  function h(f, d, m, x, j) {
    return d === null || d.tag !== 7
      ? ((d = Dt(m, f.mode, x, j)), (d.return = f), d)
      : ((d = l(d, m)), (d.return = f), d);
  }
  function p(f, d, m) {
    if ((typeof d == "string" && d !== "") || typeof d == "number")
      return ((d = ai("" + d, f.mode, m)), (d.return = f), d);
    if (typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case wr:
          return (
            (m = Kr(d.type, d.key, d.props, null, f.mode, m)),
            (m.ref = Ln(f, null, d)),
            (m.return = f),
            m
          );
        case Yt:
          return ((d = ui(d, f.mode, m)), (d.return = f), d);
        case st:
          var x = d._init;
          return p(f, x(d._payload), m);
      }
      if (Dn(d) || jn(d))
        return ((d = Dt(d, f.mode, m, null)), (d.return = f), d);
      Rr(f, d);
    }
    return null;
  }
  function v(f, d, m, x) {
    var j = d !== null ? d.key : null;
    if ((typeof m == "string" && m !== "") || typeof m == "number")
      return j !== null ? null : s(f, d, "" + m, x);
    if (typeof m == "object" && m !== null) {
      switch (m.$$typeof) {
        case wr:
          return m.key === j ? u(f, d, m, x) : null;
        case Yt:
          return m.key === j ? c(f, d, m, x) : null;
        case st:
          return ((j = m._init), v(f, d, j(m._payload), x));
      }
      if (Dn(m) || jn(m)) return j !== null ? null : h(f, d, m, x, null);
      Rr(f, m);
    }
    return null;
  }
  function k(f, d, m, x, j) {
    if ((typeof x == "string" && x !== "") || typeof x == "number")
      return ((f = f.get(m) || null), s(d, f, "" + x, j));
    if (typeof x == "object" && x !== null) {
      switch (x.$$typeof) {
        case wr:
          return (
            (f = f.get(x.key === null ? m : x.key) || null),
            u(d, f, x, j)
          );
        case Yt:
          return (
            (f = f.get(x.key === null ? m : x.key) || null),
            c(d, f, x, j)
          );
        case st:
          var T = x._init;
          return k(f, d, m, T(x._payload), j);
      }
      if (Dn(x) || jn(x)) return ((f = f.get(m) || null), h(d, f, x, j, null));
      Rr(d, x);
    }
    return null;
  }
  function y(f, d, m, x) {
    for (
      var j = null, T = null, L = d, z = (d = 0), F = null;
      L !== null && z < m.length;
      z++
    ) {
      L.index > z ? ((F = L), (L = null)) : (F = L.sibling);
      var O = v(f, L, m[z], x);
      if (O === null) {
        L === null && (L = F);
        break;
      }
      (e && L && O.alternate === null && t(f, L),
        (d = i(O, d, z)),
        T === null ? (j = O) : (T.sibling = O),
        (T = O),
        (L = F));
    }
    if (z === m.length) return (n(f, L), H && Tt(f, z), j);
    if (L === null) {
      for (; z < m.length; z++)
        ((L = p(f, m[z], x)),
          L !== null &&
            ((d = i(L, d, z)),
            T === null ? (j = L) : (T.sibling = L),
            (T = L)));
      return (H && Tt(f, z), j);
    }
    for (L = r(f, L); z < m.length; z++)
      ((F = k(L, f, z, m[z], x)),
        F !== null &&
          (e && F.alternate !== null && L.delete(F.key === null ? z : F.key),
          (d = i(F, d, z)),
          T === null ? (j = F) : (T.sibling = F),
          (T = F)));
    return (
      e &&
        L.forEach(function (xe) {
          return t(f, xe);
        }),
      H && Tt(f, z),
      j
    );
  }
  function w(f, d, m, x) {
    var j = jn(m);
    if (typeof j != "function") throw Error(E(150));
    if (((m = j.call(m)), m == null)) throw Error(E(151));
    for (
      var T = (j = null), L = d, z = (d = 0), F = null, O = m.next();
      L !== null && !O.done;
      z++, O = m.next()
    ) {
      L.index > z ? ((F = L), (L = null)) : (F = L.sibling);
      var xe = v(f, L, O.value, x);
      if (xe === null) {
        L === null && (L = F);
        break;
      }
      (e && L && xe.alternate === null && t(f, L),
        (d = i(xe, d, z)),
        T === null ? (j = xe) : (T.sibling = xe),
        (T = xe),
        (L = F));
    }
    if (O.done) return (n(f, L), H && Tt(f, z), j);
    if (L === null) {
      for (; !O.done; z++, O = m.next())
        ((O = p(f, O.value, x)),
          O !== null &&
            ((d = i(O, d, z)),
            T === null ? (j = O) : (T.sibling = O),
            (T = O)));
      return (H && Tt(f, z), j);
    }
    for (L = r(f, L); !O.done; z++, O = m.next())
      ((O = k(L, f, z, O.value, x)),
        O !== null &&
          (e && O.alternate !== null && L.delete(O.key === null ? z : O.key),
          (d = i(O, d, z)),
          T === null ? (j = O) : (T.sibling = O),
          (T = O)));
    return (
      e &&
        L.forEach(function (lt) {
          return t(f, lt);
        }),
      H && Tt(f, z),
      j
    );
  }
  function C(f, d, m, x) {
    if (
      (typeof m == "object" &&
        m !== null &&
        m.type === Xt &&
        m.key === null &&
        (m = m.props.children),
      typeof m == "object" && m !== null)
    ) {
      switch (m.$$typeof) {
        case wr:
          e: {
            for (var j = m.key, T = d; T !== null; ) {
              if (T.key === j) {
                if (((j = m.type), j === Xt)) {
                  if (T.tag === 7) {
                    (n(f, T.sibling),
                      (d = l(T, m.props.children)),
                      (d.return = f),
                      (f = d));
                    break e;
                  }
                } else if (
                  T.elementType === j ||
                  (typeof j == "object" &&
                    j !== null &&
                    j.$$typeof === st &&
                    Qs(j) === T.type)
                ) {
                  (n(f, T.sibling),
                    (d = l(T, m.props)),
                    (d.ref = Ln(f, T, m)),
                    (d.return = f),
                    (f = d));
                  break e;
                }
                n(f, T);
                break;
              } else t(f, T);
              T = T.sibling;
            }
            m.type === Xt
              ? ((d = Dt(m.props.children, f.mode, x, m.key)),
                (d.return = f),
                (f = d))
              : ((x = Kr(m.type, m.key, m.props, null, f.mode, x)),
                (x.ref = Ln(f, d, m)),
                (x.return = f),
                (f = x));
          }
          return o(f);
        case Yt:
          e: {
            for (T = m.key; d !== null; ) {
              if (d.key === T)
                if (
                  d.tag === 4 &&
                  d.stateNode.containerInfo === m.containerInfo &&
                  d.stateNode.implementation === m.implementation
                ) {
                  (n(f, d.sibling),
                    (d = l(d, m.children || [])),
                    (d.return = f),
                    (f = d));
                  break e;
                } else {
                  n(f, d);
                  break;
                }
              else t(f, d);
              d = d.sibling;
            }
            ((d = ui(m, f.mode, x)), (d.return = f), (f = d));
          }
          return o(f);
        case st:
          return ((T = m._init), C(f, d, T(m._payload), x));
      }
      if (Dn(m)) return y(f, d, m, x);
      if (jn(m)) return w(f, d, m, x);
      Rr(f, m);
    }
    return (typeof m == "string" && m !== "") || typeof m == "number"
      ? ((m = "" + m),
        d !== null && d.tag === 6
          ? (n(f, d.sibling), (d = l(d, m)), (d.return = f), (f = d))
          : (n(f, d), (d = ai(m, f.mode, x)), (d.return = f), (f = d)),
        o(f))
      : n(f, d);
  }
  return C;
}
var vn = Bu(!0),
  Wu = Bu(!1),
  sl = Ct(null),
  al = null,
  ln = null,
  Do = null;
function Mo() {
  Do = ln = al = null;
}
function Fo(e) {
  var t = sl.current;
  (V(sl), (e._currentValue = t));
}
function Vi(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function fn(e, t) {
  ((al = e),
    (Do = ln = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && (he = !0), (e.firstContext = null)));
}
function Re(e) {
  var t = e._currentValue;
  if (Do !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), ln === null)) {
      if (al === null) throw Error(E(308));
      ((ln = e), (al.dependencies = { lanes: 0, firstContext: e }));
    } else ln = ln.next = e;
  return t;
}
var zt = null;
function Uo(e) {
  zt === null ? (zt = [e]) : zt.push(e);
}
function Vu(e, t, n, r) {
  var l = t.interleaved;
  return (
    l === null ? ((n.next = n), Uo(t)) : ((n.next = l.next), (l.next = n)),
    (t.interleaved = n),
    tt(e, r)
  );
}
function tt(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    ((e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return));
  return n.tag === 3 ? n.stateNode : null;
}
var at = !1;
function $o(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function Hu(e, t) {
  ((e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      }));
}
function Je(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function yt(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), M & 2)) {
    var l = r.pending;
    return (
      l === null ? (t.next = t) : ((t.next = l.next), (l.next = t)),
      (r.pending = t),
      tt(e, n)
    );
  }
  return (
    (l = r.interleaved),
    l === null ? ((t.next = t), Uo(r)) : ((t.next = l.next), (l.next = t)),
    (r.interleaved = t),
    tt(e, n)
  );
}
function Br(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), No(e, n));
  }
}
function bs(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var l = null,
      i = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var o = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        (i === null ? (l = i = o) : (i = i.next = o), (n = n.next));
      } while (n !== null);
      i === null ? (l = i = t) : (i = i.next = t);
    } else l = i = t;
    ((n = {
      baseState: r.baseState,
      firstBaseUpdate: l,
      lastBaseUpdate: i,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n));
    return;
  }
  ((e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t));
}
function ul(e, t, n, r) {
  var l = e.updateQueue;
  at = !1;
  var i = l.firstBaseUpdate,
    o = l.lastBaseUpdate,
    s = l.shared.pending;
  if (s !== null) {
    l.shared.pending = null;
    var u = s,
      c = u.next;
    ((u.next = null), o === null ? (i = c) : (o.next = c), (o = u));
    var h = e.alternate;
    h !== null &&
      ((h = h.updateQueue),
      (s = h.lastBaseUpdate),
      s !== o &&
        (s === null ? (h.firstBaseUpdate = c) : (s.next = c),
        (h.lastBaseUpdate = u)));
  }
  if (i !== null) {
    var p = l.baseState;
    ((o = 0), (h = c = u = null), (s = i));
    do {
      var v = s.lane,
        k = s.eventTime;
      if ((r & v) === v) {
        h !== null &&
          (h = h.next =
            {
              eventTime: k,
              lane: 0,
              tag: s.tag,
              payload: s.payload,
              callback: s.callback,
              next: null,
            });
        e: {
          var y = e,
            w = s;
          switch (((v = t), (k = n), w.tag)) {
            case 1:
              if (((y = w.payload), typeof y == "function")) {
                p = y.call(k, p, v);
                break e;
              }
              p = y;
              break e;
            case 3:
              y.flags = (y.flags & -65537) | 128;
            case 0:
              if (
                ((y = w.payload),
                (v = typeof y == "function" ? y.call(k, p, v) : y),
                v == null)
              )
                break e;
              p = K({}, p, v);
              break e;
            case 2:
              at = !0;
          }
        }
        s.callback !== null &&
          s.lane !== 0 &&
          ((e.flags |= 64),
          (v = l.effects),
          v === null ? (l.effects = [s]) : v.push(s));
      } else
        ((k = {
          eventTime: k,
          lane: v,
          tag: s.tag,
          payload: s.payload,
          callback: s.callback,
          next: null,
        }),
          h === null ? ((c = h = k), (u = p)) : (h = h.next = k),
          (o |= v));
      if (((s = s.next), s === null)) {
        if (((s = l.shared.pending), s === null)) break;
        ((v = s),
          (s = v.next),
          (v.next = null),
          (l.lastBaseUpdate = v),
          (l.shared.pending = null));
      }
    } while (!0);
    if (
      (h === null && (u = p),
      (l.baseState = u),
      (l.firstBaseUpdate = c),
      (l.lastBaseUpdate = h),
      (t = l.shared.interleaved),
      t !== null)
    ) {
      l = t;
      do ((o |= l.lane), (l = l.next));
      while (l !== t);
    } else i === null && (l.shared.lanes = 0);
    (($t |= o), (e.lanes = o), (e.memoizedState = p));
  }
}
function Ks(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        l = r.callback;
      if (l !== null) {
        if (((r.callback = null), (r = n), typeof l != "function"))
          throw Error(E(191, l));
        l.call(r);
      }
    }
}
var gr = {},
  Qe = Ct(gr),
  lr = Ct(gr),
  ir = Ct(gr);
function Ot(e) {
  if (e === gr) throw Error(E(174));
  return e;
}
function Ao(e, t) {
  switch ((A(ir, t), A(lr, e), A(Qe, gr), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Ei(null, "");
      break;
    default:
      ((e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = Ei(t, e)));
  }
  (V(Qe), A(Qe, t));
}
function yn() {
  (V(Qe), V(lr), V(ir));
}
function Qu(e) {
  Ot(ir.current);
  var t = Ot(Qe.current),
    n = Ei(t, e.type);
  t !== n && (A(lr, e), A(Qe, n));
}
function Bo(e) {
  lr.current === e && (V(Qe), V(lr));
}
var Q = Ct(0);
function cl(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      ((t.child.return = t), (t = t.child));
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    ((t.sibling.return = t.return), (t = t.sibling));
  }
  return null;
}
var ni = [];
function Wo() {
  for (var e = 0; e < ni.length; e++)
    ni[e]._workInProgressVersionPrimary = null;
  ni.length = 0;
}
var Wr = rt.ReactCurrentDispatcher,
  ri = rt.ReactCurrentBatchConfig,
  Ut = 0,
  b = null,
  J = null,
  ee = null,
  dl = !1,
  Vn = !1,
  or = 0,
  Xf = 0;
function ie() {
  throw Error(E(321));
}
function Vo(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!$e(e[n], t[n])) return !1;
  return !0;
}
function Ho(e, t, n, r, l, i) {
  if (
    ((Ut = i),
    (b = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (Wr.current = e === null || e.memoizedState === null ? ep : tp),
    (e = n(r, l)),
    Vn)
  ) {
    i = 0;
    do {
      if (((Vn = !1), (or = 0), 25 <= i)) throw Error(E(301));
      ((i += 1),
        (ee = J = null),
        (t.updateQueue = null),
        (Wr.current = np),
        (e = n(r, l)));
    } while (Vn);
  }
  if (
    ((Wr.current = fl),
    (t = J !== null && J.next !== null),
    (Ut = 0),
    (ee = J = b = null),
    (dl = !1),
    t)
  )
    throw Error(E(300));
  return e;
}
function Qo() {
  var e = or !== 0;
  return ((or = 0), e);
}
function We() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return (ee === null ? (b.memoizedState = ee = e) : (ee = ee.next = e), ee);
}
function ze() {
  if (J === null) {
    var e = b.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = J.next;
  var t = ee === null ? b.memoizedState : ee.next;
  if (t !== null) ((ee = t), (J = e));
  else {
    if (e === null) throw Error(E(310));
    ((J = e),
      (e = {
        memoizedState: J.memoizedState,
        baseState: J.baseState,
        baseQueue: J.baseQueue,
        queue: J.queue,
        next: null,
      }),
      ee === null ? (b.memoizedState = ee = e) : (ee = ee.next = e));
  }
  return ee;
}
function sr(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function li(e) {
  var t = ze(),
    n = t.queue;
  if (n === null) throw Error(E(311));
  n.lastRenderedReducer = e;
  var r = J,
    l = r.baseQueue,
    i = n.pending;
  if (i !== null) {
    if (l !== null) {
      var o = l.next;
      ((l.next = i.next), (i.next = o));
    }
    ((r.baseQueue = l = i), (n.pending = null));
  }
  if (l !== null) {
    ((i = l.next), (r = r.baseState));
    var s = (o = null),
      u = null,
      c = i;
    do {
      var h = c.lane;
      if ((Ut & h) === h)
        (u !== null &&
          (u = u.next =
            {
              lane: 0,
              action: c.action,
              hasEagerState: c.hasEagerState,
              eagerState: c.eagerState,
              next: null,
            }),
          (r = c.hasEagerState ? c.eagerState : e(r, c.action)));
      else {
        var p = {
          lane: h,
          action: c.action,
          hasEagerState: c.hasEagerState,
          eagerState: c.eagerState,
          next: null,
        };
        (u === null ? ((s = u = p), (o = r)) : (u = u.next = p),
          (b.lanes |= h),
          ($t |= h));
      }
      c = c.next;
    } while (c !== null && c !== i);
    (u === null ? (o = r) : (u.next = s),
      $e(r, t.memoizedState) || (he = !0),
      (t.memoizedState = r),
      (t.baseState = o),
      (t.baseQueue = u),
      (n.lastRenderedState = r));
  }
  if (((e = n.interleaved), e !== null)) {
    l = e;
    do ((i = l.lane), (b.lanes |= i), ($t |= i), (l = l.next));
    while (l !== e);
  } else l === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function ii(e) {
  var t = ze(),
    n = t.queue;
  if (n === null) throw Error(E(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    l = n.pending,
    i = t.memoizedState;
  if (l !== null) {
    n.pending = null;
    var o = (l = l.next);
    do ((i = e(i, o.action)), (o = o.next));
    while (o !== l);
    ($e(i, t.memoizedState) || (he = !0),
      (t.memoizedState = i),
      t.baseQueue === null && (t.baseState = i),
      (n.lastRenderedState = i));
  }
  return [i, r];
}
function bu() {}
function Ku(e, t) {
  var n = b,
    r = ze(),
    l = t(),
    i = !$e(r.memoizedState, l);
  if (
    (i && ((r.memoizedState = l), (he = !0)),
    (r = r.queue),
    bo(Xu.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || i || (ee !== null && ee.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      ar(9, Yu.bind(null, n, r, l, t), void 0, null),
      te === null)
    )
      throw Error(E(349));
    Ut & 30 || Gu(n, t, l);
  }
  return l;
}
function Gu(e, t, n) {
  ((e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = b.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (b.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
}
function Yu(e, t, n, r) {
  ((t.value = n), (t.getSnapshot = r), Zu(t) && Ju(e));
}
function Xu(e, t, n) {
  return n(function () {
    Zu(t) && Ju(e);
  });
}
function Zu(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !$e(e, n);
  } catch {
    return !0;
  }
}
function Ju(e) {
  var t = tt(e, 1);
  t !== null && Ue(t, e, 1, -1);
}
function Gs(e) {
  var t = We();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: sr,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = qf.bind(null, b, e)),
    [t.memoizedState, e]
  );
}
function ar(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = b.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (b.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function qu() {
  return ze().memoizedState;
}
function Vr(e, t, n, r) {
  var l = We();
  ((b.flags |= e),
    (l.memoizedState = ar(1 | t, n, void 0, r === void 0 ? null : r)));
}
function Cl(e, t, n, r) {
  var l = ze();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (J !== null) {
    var o = J.memoizedState;
    if (((i = o.destroy), r !== null && Vo(r, o.deps))) {
      l.memoizedState = ar(t, n, i, r);
      return;
    }
  }
  ((b.flags |= e), (l.memoizedState = ar(1 | t, n, i, r)));
}
function Ys(e, t) {
  return Vr(8390656, 8, e, t);
}
function bo(e, t) {
  return Cl(2048, 8, e, t);
}
function ec(e, t) {
  return Cl(4, 2, e, t);
}
function tc(e, t) {
  return Cl(4, 4, e, t);
}
function nc(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function rc(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null),
    Cl(4, 4, nc.bind(null, t, e), n)
  );
}
function Ko() {}
function lc(e, t) {
  var n = ze();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Vo(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function ic(e, t) {
  var n = ze();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Vo(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function oc(e, t, n) {
  return Ut & 21
    ? ($e(n, t) || ((n = du()), (b.lanes |= n), ($t |= n), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), (he = !0)), (e.memoizedState = n));
}
function Zf(e, t) {
  var n = U;
  ((U = n !== 0 && 4 > n ? n : 4), e(!0));
  var r = ri.transition;
  ri.transition = {};
  try {
    (e(!1), t());
  } finally {
    ((U = n), (ri.transition = r));
  }
}
function sc() {
  return ze().memoizedState;
}
function Jf(e, t, n) {
  var r = wt(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    ac(e))
  )
    uc(t, n);
  else if (((n = Vu(e, t, n, r)), n !== null)) {
    var l = ce();
    (Ue(n, e, r, l), cc(n, t, r));
  }
}
function qf(e, t, n) {
  var r = wt(e),
    l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (ac(e)) uc(t, l);
  else {
    var i = e.alternate;
    if (
      e.lanes === 0 &&
      (i === null || i.lanes === 0) &&
      ((i = t.lastRenderedReducer), i !== null)
    )
      try {
        var o = t.lastRenderedState,
          s = i(o, n);
        if (((l.hasEagerState = !0), (l.eagerState = s), $e(s, o))) {
          var u = t.interleaved;
          (u === null
            ? ((l.next = l), Uo(t))
            : ((l.next = u.next), (u.next = l)),
            (t.interleaved = l));
          return;
        }
      } catch {
      } finally {
      }
    ((n = Vu(e, t, l, r)),
      n !== null && ((l = ce()), Ue(n, e, r, l), cc(n, t, r)));
  }
}
function ac(e) {
  var t = e.alternate;
  return e === b || (t !== null && t === b);
}
function uc(e, t) {
  Vn = dl = !0;
  var n = e.pending;
  (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t));
}
function cc(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), No(e, n));
  }
}
var fl = {
    readContext: Re,
    useCallback: ie,
    useContext: ie,
    useEffect: ie,
    useImperativeHandle: ie,
    useInsertionEffect: ie,
    useLayoutEffect: ie,
    useMemo: ie,
    useReducer: ie,
    useRef: ie,
    useState: ie,
    useDebugValue: ie,
    useDeferredValue: ie,
    useTransition: ie,
    useMutableSource: ie,
    useSyncExternalStore: ie,
    useId: ie,
    unstable_isNewReconciler: !1,
  },
  ep = {
    readContext: Re,
    useCallback: function (e, t) {
      return ((We().memoizedState = [e, t === void 0 ? null : t]), e);
    },
    useContext: Re,
    useEffect: Ys,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        Vr(4194308, 4, nc.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return Vr(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return Vr(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = We();
      return (
        (t = t === void 0 ? null : t),
        (e = e()),
        (n.memoizedState = [e, t]),
        e
      );
    },
    useReducer: function (e, t, n) {
      var r = We();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = Jf.bind(null, b, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = We();
      return ((e = { current: e }), (t.memoizedState = e));
    },
    useState: Gs,
    useDebugValue: Ko,
    useDeferredValue: function (e) {
      return (We().memoizedState = e);
    },
    useTransition: function () {
      var e = Gs(!1),
        t = e[0];
      return ((e = Zf.bind(null, e[1])), (We().memoizedState = e), [t, e]);
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = b,
        l = We();
      if (H) {
        if (n === void 0) throw Error(E(407));
        n = n();
      } else {
        if (((n = t()), te === null)) throw Error(E(349));
        Ut & 30 || Gu(r, t, n);
      }
      l.memoizedState = n;
      var i = { value: n, getSnapshot: t };
      return (
        (l.queue = i),
        Ys(Xu.bind(null, r, i, e), [e]),
        (r.flags |= 2048),
        ar(9, Yu.bind(null, r, i, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = We(),
        t = te.identifierPrefix;
      if (H) {
        var n = Ze,
          r = Xe;
        ((n = (r & ~(1 << (32 - Fe(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = or++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":"));
      } else ((n = Xf++), (t = ":" + t + "r" + n.toString(32) + ":"));
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  tp = {
    readContext: Re,
    useCallback: lc,
    useContext: Re,
    useEffect: bo,
    useImperativeHandle: rc,
    useInsertionEffect: ec,
    useLayoutEffect: tc,
    useMemo: ic,
    useReducer: li,
    useRef: qu,
    useState: function () {
      return li(sr);
    },
    useDebugValue: Ko,
    useDeferredValue: function (e) {
      var t = ze();
      return oc(t, J.memoizedState, e);
    },
    useTransition: function () {
      var e = li(sr)[0],
        t = ze().memoizedState;
      return [e, t];
    },
    useMutableSource: bu,
    useSyncExternalStore: Ku,
    useId: sc,
    unstable_isNewReconciler: !1,
  },
  np = {
    readContext: Re,
    useCallback: lc,
    useContext: Re,
    useEffect: bo,
    useImperativeHandle: rc,
    useInsertionEffect: ec,
    useLayoutEffect: tc,
    useMemo: ic,
    useReducer: ii,
    useRef: qu,
    useState: function () {
      return ii(sr);
    },
    useDebugValue: Ko,
    useDeferredValue: function (e) {
      var t = ze();
      return J === null ? (t.memoizedState = e) : oc(t, J.memoizedState, e);
    },
    useTransition: function () {
      var e = ii(sr)[0],
        t = ze().memoizedState;
      return [e, t];
    },
    useMutableSource: bu,
    useSyncExternalStore: Ku,
    useId: sc,
    unstable_isNewReconciler: !1,
  };
function Ie(e, t) {
  if (e && e.defaultProps) {
    ((t = K({}, t)), (e = e.defaultProps));
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function Hi(e, t, n, r) {
  ((t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : K({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n));
}
var Pl = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Wt(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = ce(),
      l = wt(e),
      i = Je(r, l);
    ((i.payload = t),
      n != null && (i.callback = n),
      (t = yt(e, i, l)),
      t !== null && (Ue(t, e, l, r), Br(t, e, l)));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = ce(),
      l = wt(e),
      i = Je(r, l);
    ((i.tag = 1),
      (i.payload = t),
      n != null && (i.callback = n),
      (t = yt(e, i, l)),
      t !== null && (Ue(t, e, l, r), Br(t, e, l)));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = ce(),
      r = wt(e),
      l = Je(n, r);
    ((l.tag = 2),
      t != null && (l.callback = t),
      (t = yt(e, l, r)),
      t !== null && (Ue(t, e, r, n), Br(t, e, r)));
  },
};
function Xs(e, t, n, r, l, i, o) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, i, o)
      : t.prototype && t.prototype.isPureReactComponent
        ? !er(n, r) || !er(l, i)
        : !0
  );
}
function dc(e, t, n) {
  var r = !1,
    l = Nt,
    i = t.contextType;
  return (
    typeof i == "object" && i !== null
      ? (i = Re(i))
      : ((l = ve(t) ? Mt : ae.current),
        (r = t.contextTypes),
        (i = (r = r != null) ? hn(e, l) : Nt)),
    (t = new t(n, i)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Pl),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = l),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    t
  );
}
function Zs(e, t, n, r) {
  ((e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Pl.enqueueReplaceState(t, t.state, null));
}
function Qi(e, t, n, r) {
  var l = e.stateNode;
  ((l.props = n), (l.state = e.memoizedState), (l.refs = {}), $o(e));
  var i = t.contextType;
  (typeof i == "object" && i !== null
    ? (l.context = Re(i))
    : ((i = ve(t) ? Mt : ae.current), (l.context = hn(e, i))),
    (l.state = e.memoizedState),
    (i = t.getDerivedStateFromProps),
    typeof i == "function" && (Hi(e, t, i, n), (l.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof l.getSnapshotBeforeUpdate == "function" ||
      (typeof l.UNSAFE_componentWillMount != "function" &&
        typeof l.componentWillMount != "function") ||
      ((t = l.state),
      typeof l.componentWillMount == "function" && l.componentWillMount(),
      typeof l.UNSAFE_componentWillMount == "function" &&
        l.UNSAFE_componentWillMount(),
      t !== l.state && Pl.enqueueReplaceState(l, l.state, null),
      ul(e, n, l, r),
      (l.state = e.memoizedState)),
    typeof l.componentDidMount == "function" && (e.flags |= 4194308));
}
function xn(e, t) {
  try {
    var n = "",
      r = t;
    do ((n += Td(r)), (r = r.return));
    while (r);
    var l = n;
  } catch (i) {
    l =
      `
Error generating stack: ` +
      i.message +
      `
` +
      i.stack;
  }
  return { value: e, source: t, stack: l, digest: null };
}
function oi(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function bi(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var rp = typeof WeakMap == "function" ? WeakMap : Map;
function fc(e, t, n) {
  ((n = Je(-1, n)), (n.tag = 3), (n.payload = { element: null }));
  var r = t.value;
  return (
    (n.callback = function () {
      (ml || ((ml = !0), (no = r)), bi(e, t));
    }),
    n
  );
}
function pc(e, t, n) {
  ((n = Je(-1, n)), (n.tag = 3));
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var l = t.value;
    ((n.payload = function () {
      return r(l);
    }),
      (n.callback = function () {
        bi(e, t);
      }));
  }
  var i = e.stateNode;
  return (
    i !== null &&
      typeof i.componentDidCatch == "function" &&
      (n.callback = function () {
        (bi(e, t),
          typeof r != "function" &&
            (xt === null ? (xt = new Set([this])) : xt.add(this)));
        var o = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: o !== null ? o : "",
        });
      }),
    n
  );
}
function Js(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new rp();
    var l = new Set();
    r.set(t, l);
  } else ((l = r.get(t)), l === void 0 && ((l = new Set()), r.set(t, l)));
  l.has(n) || (l.add(n), (e = vp.bind(null, e, t, n)), t.then(e, e));
}
function qs(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function ea(e, t, n, r, l) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = l), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = Je(-1, 1)), (t.tag = 2), yt(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var lp = rt.ReactCurrentOwner,
  he = !1;
function ue(e, t, n, r) {
  t.child = e === null ? Wu(t, null, n, r) : vn(t, e.child, n, r);
}
function ta(e, t, n, r, l) {
  n = n.render;
  var i = t.ref;
  return (
    fn(t, l),
    (r = Ho(e, t, n, r, i, l)),
    (n = Qo()),
    e !== null && !he
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~l),
        nt(e, t, l))
      : (H && n && zo(t), (t.flags |= 1), ue(e, t, r, l), t.child)
  );
}
function na(e, t, n, r, l) {
  if (e === null) {
    var i = n.type;
    return typeof i == "function" &&
      !ts(i) &&
      i.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = i), mc(e, t, i, r, l))
      : ((e = Kr(n.type, null, r, t, t.mode, l)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((i = e.child), !(e.lanes & l))) {
    var o = i.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : er), n(o, r) && e.ref === t.ref)
    )
      return nt(e, t, l);
  }
  return (
    (t.flags |= 1),
    (e = kt(i, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function mc(e, t, n, r, l) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (er(i, r) && e.ref === t.ref)
      if (((he = !1), (t.pendingProps = r = i), (e.lanes & l) !== 0))
        e.flags & 131072 && (he = !0);
      else return ((t.lanes = e.lanes), nt(e, t, l));
  }
  return Ki(e, t, n, r, l);
}
function hc(e, t, n) {
  var r = t.pendingProps,
    l = r.children,
    i = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if (!(t.mode & 1))
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        A(sn, we),
        (we |= n));
    else {
      if (!(n & 1073741824))
        return (
          (e = i !== null ? i.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          A(sn, we),
          (we |= e),
          null
        );
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = i !== null ? i.baseLanes : n),
        A(sn, we),
        (we |= r));
    }
  else
    (i !== null ? ((r = i.baseLanes | n), (t.memoizedState = null)) : (r = n),
      A(sn, we),
      (we |= r));
  return (ue(e, t, l, n), t.child);
}
function gc(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function Ki(e, t, n, r, l) {
  var i = ve(n) ? Mt : ae.current;
  return (
    (i = hn(t, i)),
    fn(t, l),
    (n = Ho(e, t, n, r, i, l)),
    (r = Qo()),
    e !== null && !he
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~l),
        nt(e, t, l))
      : (H && r && zo(t), (t.flags |= 1), ue(e, t, n, l), t.child)
  );
}
function ra(e, t, n, r, l) {
  if (ve(n)) {
    var i = !0;
    ll(t);
  } else i = !1;
  if ((fn(t, l), t.stateNode === null))
    (Hr(e, t), dc(t, n, r), Qi(t, n, r, l), (r = !0));
  else if (e === null) {
    var o = t.stateNode,
      s = t.memoizedProps;
    o.props = s;
    var u = o.context,
      c = n.contextType;
    typeof c == "object" && c !== null
      ? (c = Re(c))
      : ((c = ve(n) ? Mt : ae.current), (c = hn(t, c)));
    var h = n.getDerivedStateFromProps,
      p =
        typeof h == "function" ||
        typeof o.getSnapshotBeforeUpdate == "function";
    (p ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((s !== r || u !== c) && Zs(t, o, r, c)),
      (at = !1));
    var v = t.memoizedState;
    ((o.state = v),
      ul(t, r, o, l),
      (u = t.memoizedState),
      s !== r || v !== u || ge.current || at
        ? (typeof h == "function" && (Hi(t, n, h, r), (u = t.memoizedState)),
          (s = at || Xs(t, n, s, r, v, u, c))
            ? (p ||
                (typeof o.UNSAFE_componentWillMount != "function" &&
                  typeof o.componentWillMount != "function") ||
                (typeof o.componentWillMount == "function" &&
                  o.componentWillMount(),
                typeof o.UNSAFE_componentWillMount == "function" &&
                  o.UNSAFE_componentWillMount()),
              typeof o.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = u)),
          (o.props = r),
          (o.state = u),
          (o.context = c),
          (r = s))
        : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1)));
  } else {
    ((o = t.stateNode),
      Hu(e, t),
      (s = t.memoizedProps),
      (c = t.type === t.elementType ? s : Ie(t.type, s)),
      (o.props = c),
      (p = t.pendingProps),
      (v = o.context),
      (u = n.contextType),
      typeof u == "object" && u !== null
        ? (u = Re(u))
        : ((u = ve(n) ? Mt : ae.current), (u = hn(t, u))));
    var k = n.getDerivedStateFromProps;
    ((h =
      typeof k == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function") ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((s !== p || v !== u) && Zs(t, o, r, u)),
      (at = !1),
      (v = t.memoizedState),
      (o.state = v),
      ul(t, r, o, l));
    var y = t.memoizedState;
    s !== p || v !== y || ge.current || at
      ? (typeof k == "function" && (Hi(t, n, k, r), (y = t.memoizedState)),
        (c = at || Xs(t, n, c, r, v, y, u) || !1)
          ? (h ||
              (typeof o.UNSAFE_componentWillUpdate != "function" &&
                typeof o.componentWillUpdate != "function") ||
              (typeof o.componentWillUpdate == "function" &&
                o.componentWillUpdate(r, y, u),
              typeof o.UNSAFE_componentWillUpdate == "function" &&
                o.UNSAFE_componentWillUpdate(r, y, u)),
            typeof o.componentDidUpdate == "function" && (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof o.componentDidUpdate != "function" ||
              (s === e.memoizedProps && v === e.memoizedState) ||
              (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != "function" ||
              (s === e.memoizedProps && v === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = y)),
        (o.props = r),
        (o.state = y),
        (o.context = u),
        (r = c))
      : (typeof o.componentDidUpdate != "function" ||
          (s === e.memoizedProps && v === e.memoizedState) ||
          (t.flags |= 4),
        typeof o.getSnapshotBeforeUpdate != "function" ||
          (s === e.memoizedProps && v === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return Gi(e, t, n, r, i, l);
}
function Gi(e, t, n, r, l, i) {
  gc(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return (l && Ws(t, n, !1), nt(e, t, i));
  ((r = t.stateNode), (lp.current = t));
  var s =
    o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && o
      ? ((t.child = vn(t, e.child, null, i)), (t.child = vn(t, null, s, i)))
      : ue(e, t, s, i),
    (t.memoizedState = r.state),
    l && Ws(t, n, !0),
    t.child
  );
}
function vc(e) {
  var t = e.stateNode;
  (t.pendingContext
    ? Bs(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && Bs(e, t.context, !1),
    Ao(e, t.containerInfo));
}
function la(e, t, n, r, l) {
  return (gn(), Io(l), (t.flags |= 256), ue(e, t, n, r), t.child);
}
var Yi = { dehydrated: null, treeContext: null, retryLane: 0 };
function Xi(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function yc(e, t, n) {
  var r = t.pendingProps,
    l = Q.current,
    i = !1,
    o = (t.flags & 128) !== 0,
    s;
  if (
    ((s = o) ||
      (s = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0),
    s
      ? ((i = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (l |= 1),
    A(Q, l & 1),
    e === null)
  )
    return (
      Wi(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1
            ? e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((o = r.children),
          (e = r.fallback),
          i
            ? ((r = t.mode),
              (i = t.child),
              (o = { mode: "hidden", children: o }),
              !(r & 1) && i !== null
                ? ((i.childLanes = 0), (i.pendingProps = o))
                : (i = Ll(o, r, 0, null)),
              (e = Dt(e, r, n, null)),
              (i.return = t),
              (e.return = t),
              (i.sibling = e),
              (t.child = i),
              (t.child.memoizedState = Xi(n)),
              (t.memoizedState = Yi),
              e)
            : Go(t, o))
    );
  if (((l = e.memoizedState), l !== null && ((s = l.dehydrated), s !== null)))
    return ip(e, t, o, r, s, l, n);
  if (i) {
    ((i = r.fallback), (o = t.mode), (l = e.child), (s = l.sibling));
    var u = { mode: "hidden", children: r.children };
    return (
      !(o & 1) && t.child !== l
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = u),
          (t.deletions = null))
        : ((r = kt(l, u)), (r.subtreeFlags = l.subtreeFlags & 14680064)),
      s !== null ? (i = kt(s, i)) : ((i = Dt(i, o, n, null)), (i.flags |= 2)),
      (i.return = t),
      (r.return = t),
      (r.sibling = i),
      (t.child = r),
      (r = i),
      (i = t.child),
      (o = e.child.memoizedState),
      (o =
        o === null
          ? Xi(n)
          : {
              baseLanes: o.baseLanes | n,
              cachePool: null,
              transitions: o.transitions,
            }),
      (i.memoizedState = o),
      (i.childLanes = e.childLanes & ~n),
      (t.memoizedState = Yi),
      r
    );
  }
  return (
    (i = e.child),
    (e = i.sibling),
    (r = kt(i, { mode: "visible", children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function Go(e, t) {
  return (
    (t = Ll({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function zr(e, t, n, r) {
  return (
    r !== null && Io(r),
    vn(t, e.child, null, n),
    (e = Go(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function ip(e, t, n, r, l, i, o) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = oi(Error(E(422)))), zr(e, t, o, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((i = r.fallback),
          (l = t.mode),
          (r = Ll({ mode: "visible", children: r.children }, l, 0, null)),
          (i = Dt(i, l, o, null)),
          (i.flags |= 2),
          (r.return = t),
          (i.return = t),
          (r.sibling = i),
          (t.child = r),
          t.mode & 1 && vn(t, e.child, null, o),
          (t.child.memoizedState = Xi(o)),
          (t.memoizedState = Yi),
          i);
  if (!(t.mode & 1)) return zr(e, t, o, null);
  if (l.data === "$!") {
    if (((r = l.nextSibling && l.nextSibling.dataset), r)) var s = r.dgst;
    return (
      (r = s),
      (i = Error(E(419))),
      (r = oi(i, r, void 0)),
      zr(e, t, o, r)
    );
  }
  if (((s = (o & e.childLanes) !== 0), he || s)) {
    if (((r = te), r !== null)) {
      switch (o & -o) {
        case 4:
          l = 2;
          break;
        case 16:
          l = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          l = 32;
          break;
        case 536870912:
          l = 268435456;
          break;
        default:
          l = 0;
      }
      ((l = l & (r.suspendedLanes | o) ? 0 : l),
        l !== 0 &&
          l !== i.retryLane &&
          ((i.retryLane = l), tt(e, l), Ue(r, e, l, -1)));
    }
    return (es(), (r = oi(Error(E(421)))), zr(e, t, o, r));
  }
  return l.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = yp.bind(null, e)),
      (l._reactRetry = t),
      null)
    : ((e = i.treeContext),
      (ke = vt(l.nextSibling)),
      (Se = t),
      (H = !0),
      (Me = null),
      e !== null &&
        ((Pe[_e++] = Xe),
        (Pe[_e++] = Ze),
        (Pe[_e++] = Ft),
        (Xe = e.id),
        (Ze = e.overflow),
        (Ft = t)),
      (t = Go(t, r.children)),
      (t.flags |= 4096),
      t);
}
function ia(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  (r !== null && (r.lanes |= t), Vi(e.return, t, n));
}
function si(e, t, n, r, l) {
  var i = e.memoizedState;
  i === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: l,
      })
    : ((i.isBackwards = t),
      (i.rendering = null),
      (i.renderingStartTime = 0),
      (i.last = r),
      (i.tail = n),
      (i.tailMode = l));
}
function xc(e, t, n) {
  var r = t.pendingProps,
    l = r.revealOrder,
    i = r.tail;
  if ((ue(e, t, r.children, n), (r = Q.current), r & 2))
    ((r = (r & 1) | 2), (t.flags |= 128));
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && ia(e, n, t);
        else if (e.tag === 19) ia(e, n, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    r &= 1;
  }
  if ((A(Q, r), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; )
          ((e = n.alternate),
            e !== null && cl(e) === null && (l = n),
            (n = n.sibling));
        ((n = l),
          n === null
            ? ((l = t.child), (t.child = null))
            : ((l = n.sibling), (n.sibling = null)),
          si(t, !1, l, n, i));
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (((e = l.alternate), e !== null && cl(e) === null)) {
            t.child = l;
            break;
          }
          ((e = l.sibling), (l.sibling = n), (n = l), (l = e));
        }
        si(t, !0, n, null, i);
        break;
      case "together":
        si(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function Hr(e, t) {
  !(t.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function nt(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    ($t |= t.lanes),
    !(n & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(E(153));
  if (t.child !== null) {
    for (
      e = t.child, n = kt(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;

    )
      ((e = e.sibling),
        (n = n.sibling = kt(e, e.pendingProps)),
        (n.return = t));
    n.sibling = null;
  }
  return t.child;
}
function op(e, t, n) {
  switch (t.tag) {
    case 3:
      (vc(t), gn());
      break;
    case 5:
      Qu(t);
      break;
    case 1:
      ve(t.type) && ll(t);
      break;
    case 4:
      Ao(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        l = t.memoizedProps.value;
      (A(sl, r._currentValue), (r._currentValue = l));
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (A(Q, Q.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
            ? yc(e, t, n)
            : (A(Q, Q.current & 1),
              (e = nt(e, t, n)),
              e !== null ? e.sibling : null);
      A(Q, Q.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return xc(e, t, n);
        t.flags |= 128;
      }
      if (
        ((l = t.memoizedState),
        l !== null &&
          ((l.rendering = null), (l.tail = null), (l.lastEffect = null)),
        A(Q, Q.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return ((t.lanes = 0), hc(e, t, n));
  }
  return nt(e, t, n);
}
var wc, Zi, kc, Sc;
wc = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      ((n.child.return = n), (n = n.child));
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    ((n.sibling.return = n.return), (n = n.sibling));
  }
};
Zi = function () {};
kc = function (e, t, n, r) {
  var l = e.memoizedProps;
  if (l !== r) {
    ((e = t.stateNode), Ot(Qe.current));
    var i = null;
    switch (n) {
      case "input":
        ((l = xi(e, l)), (r = xi(e, r)), (i = []));
        break;
      case "select":
        ((l = K({}, l, { value: void 0 })),
          (r = K({}, r, { value: void 0 })),
          (i = []));
        break;
      case "textarea":
        ((l = Si(e, l)), (r = Si(e, r)), (i = []));
        break;
      default:
        typeof l.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = nl);
    }
    Ni(n, r);
    var o;
    n = null;
    for (c in l)
      if (!r.hasOwnProperty(c) && l.hasOwnProperty(c) && l[c] != null)
        if (c === "style") {
          var s = l[c];
          for (o in s) s.hasOwnProperty(o) && (n || (n = {}), (n[o] = ""));
        } else
          c !== "dangerouslySetInnerHTML" &&
            c !== "children" &&
            c !== "suppressContentEditableWarning" &&
            c !== "suppressHydrationWarning" &&
            c !== "autoFocus" &&
            (Kn.hasOwnProperty(c)
              ? i || (i = [])
              : (i = i || []).push(c, null));
    for (c in r) {
      var u = r[c];
      if (
        ((s = l != null ? l[c] : void 0),
        r.hasOwnProperty(c) && u !== s && (u != null || s != null))
      )
        if (c === "style")
          if (s) {
            for (o in s)
              !s.hasOwnProperty(o) ||
                (u && u.hasOwnProperty(o)) ||
                (n || (n = {}), (n[o] = ""));
            for (o in u)
              u.hasOwnProperty(o) &&
                s[o] !== u[o] &&
                (n || (n = {}), (n[o] = u[o]));
          } else (n || (i || (i = []), i.push(c, n)), (n = u));
        else
          c === "dangerouslySetInnerHTML"
            ? ((u = u ? u.__html : void 0),
              (s = s ? s.__html : void 0),
              u != null && s !== u && (i = i || []).push(c, u))
            : c === "children"
              ? (typeof u != "string" && typeof u != "number") ||
                (i = i || []).push(c, "" + u)
              : c !== "suppressContentEditableWarning" &&
                c !== "suppressHydrationWarning" &&
                (Kn.hasOwnProperty(c)
                  ? (u != null && c === "onScroll" && W("scroll", e),
                    i || s === u || (i = []))
                  : (i = i || []).push(c, u));
    }
    n && (i = i || []).push("style", n);
    var c = i;
    (t.updateQueue = c) && (t.flags |= 4);
  }
};
Sc = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function Rn(e, t) {
  if (!H)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; )
          (t.alternate !== null && (n = t), (t = t.sibling));
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; )
          (n.alternate !== null && (r = n), (n = n.sibling));
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function oe(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var l = e.child; l !== null; )
      ((n |= l.lanes | l.childLanes),
        (r |= l.subtreeFlags & 14680064),
        (r |= l.flags & 14680064),
        (l.return = e),
        (l = l.sibling));
  else
    for (l = e.child; l !== null; )
      ((n |= l.lanes | l.childLanes),
        (r |= l.subtreeFlags),
        (r |= l.flags),
        (l.return = e),
        (l = l.sibling));
  return ((e.subtreeFlags |= r), (e.childLanes = n), t);
}
function sp(e, t, n) {
  var r = t.pendingProps;
  switch ((Oo(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return (oe(t), null);
    case 1:
      return (ve(t.type) && rl(), oe(t), null);
    case 3:
      return (
        (r = t.stateNode),
        yn(),
        V(ge),
        V(ae),
        Wo(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (Lr(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), Me !== null && (io(Me), (Me = null)))),
        Zi(e, t),
        oe(t),
        null
      );
    case 5:
      Bo(t);
      var l = Ot(ir.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        (kc(e, t, n, r, l),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(E(166));
          return (oe(t), null);
        }
        if (((e = Ot(Qe.current)), Lr(t))) {
          ((r = t.stateNode), (n = t.type));
          var i = t.memoizedProps;
          switch (((r[Ve] = t), (r[rr] = i), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              (W("cancel", r), W("close", r));
              break;
            case "iframe":
            case "object":
            case "embed":
              W("load", r);
              break;
            case "video":
            case "audio":
              for (l = 0; l < Fn.length; l++) W(Fn[l], r);
              break;
            case "source":
              W("error", r);
              break;
            case "img":
            case "image":
            case "link":
              (W("error", r), W("load", r));
              break;
            case "details":
              W("toggle", r);
              break;
            case "input":
              (ms(r, i), W("invalid", r));
              break;
            case "select":
              ((r._wrapperState = { wasMultiple: !!i.multiple }),
                W("invalid", r));
              break;
            case "textarea":
              (gs(r, i), W("invalid", r));
          }
          (Ni(n, i), (l = null));
          for (var o in i)
            if (i.hasOwnProperty(o)) {
              var s = i[o];
              o === "children"
                ? typeof s == "string"
                  ? r.textContent !== s &&
                    (i.suppressHydrationWarning !== !0 &&
                      Tr(r.textContent, s, e),
                    (l = ["children", s]))
                  : typeof s == "number" &&
                    r.textContent !== "" + s &&
                    (i.suppressHydrationWarning !== !0 &&
                      Tr(r.textContent, s, e),
                    (l = ["children", "" + s]))
                : Kn.hasOwnProperty(o) &&
                  s != null &&
                  o === "onScroll" &&
                  W("scroll", r);
            }
          switch (n) {
            case "input":
              (kr(r), hs(r, i, !0));
              break;
            case "textarea":
              (kr(r), vs(r));
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = nl);
          }
          ((r = l), (t.updateQueue = r), r !== null && (t.flags |= 4));
        } else {
          ((o = l.nodeType === 9 ? l : l.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = Xa(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = o.createElement("div")),
                  (e.innerHTML = "<script><\/script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                  ? (e = o.createElement(n, { is: r.is }))
                  : ((e = o.createElement(n)),
                    n === "select" &&
                      ((o = e),
                      r.multiple
                        ? (o.multiple = !0)
                        : r.size && (o.size = r.size)))
              : (e = o.createElementNS(e, n)),
            (e[Ve] = t),
            (e[rr] = r),
            wc(e, t, !1, !1),
            (t.stateNode = e));
          e: {
            switch (((o = ji(n, r)), n)) {
              case "dialog":
                (W("cancel", e), W("close", e), (l = r));
                break;
              case "iframe":
              case "object":
              case "embed":
                (W("load", e), (l = r));
                break;
              case "video":
              case "audio":
                for (l = 0; l < Fn.length; l++) W(Fn[l], e);
                l = r;
                break;
              case "source":
                (W("error", e), (l = r));
                break;
              case "img":
              case "image":
              case "link":
                (W("error", e), W("load", e), (l = r));
                break;
              case "details":
                (W("toggle", e), (l = r));
                break;
              case "input":
                (ms(e, r), (l = xi(e, r)), W("invalid", e));
                break;
              case "option":
                l = r;
                break;
              case "select":
                ((e._wrapperState = { wasMultiple: !!r.multiple }),
                  (l = K({}, r, { value: void 0 })),
                  W("invalid", e));
                break;
              case "textarea":
                (gs(e, r), (l = Si(e, r)), W("invalid", e));
                break;
              default:
                l = r;
            }
            (Ni(n, l), (s = l));
            for (i in s)
              if (s.hasOwnProperty(i)) {
                var u = s[i];
                i === "style"
                  ? qa(e, u)
                  : i === "dangerouslySetInnerHTML"
                    ? ((u = u ? u.__html : void 0), u != null && Za(e, u))
                    : i === "children"
                      ? typeof u == "string"
                        ? (n !== "textarea" || u !== "") && Gn(e, u)
                        : typeof u == "number" && Gn(e, "" + u)
                      : i !== "suppressContentEditableWarning" &&
                        i !== "suppressHydrationWarning" &&
                        i !== "autoFocus" &&
                        (Kn.hasOwnProperty(i)
                          ? u != null && i === "onScroll" && W("scroll", e)
                          : u != null && yo(e, i, u, o));
              }
            switch (n) {
              case "input":
                (kr(e), hs(e, r, !1));
                break;
              case "textarea":
                (kr(e), vs(e));
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + Et(r.value));
                break;
              case "select":
                ((e.multiple = !!r.multiple),
                  (i = r.value),
                  i != null
                    ? an(e, !!r.multiple, i, !1)
                    : r.defaultValue != null &&
                      an(e, !!r.multiple, r.defaultValue, !0));
                break;
              default:
                typeof l.onClick == "function" && (e.onclick = nl);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return (oe(t), null);
    case 6:
      if (e && t.stateNode != null) Sc(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(E(166));
        if (((n = Ot(ir.current)), Ot(Qe.current), Lr(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[Ve] = t),
            (i = r.nodeValue !== n) && ((e = Se), e !== null))
          )
            switch (e.tag) {
              case 3:
                Tr(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Tr(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          i && (t.flags |= 4);
        } else
          ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[Ve] = t),
            (t.stateNode = r));
      }
      return (oe(t), null);
    case 13:
      if (
        (V(Q),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (H && ke !== null && t.mode & 1 && !(t.flags & 128))
          (Au(), gn(), (t.flags |= 98560), (i = !1));
        else if (((i = Lr(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!i) throw Error(E(318));
            if (
              ((i = t.memoizedState),
              (i = i !== null ? i.dehydrated : null),
              !i)
            )
              throw Error(E(317));
            i[Ve] = t;
          } else
            (gn(),
              !(t.flags & 128) && (t.memoizedState = null),
              (t.flags |= 4));
          (oe(t), (i = !1));
        } else (Me !== null && (io(Me), (Me = null)), (i = !0));
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 &&
              (e === null || Q.current & 1 ? q === 0 && (q = 3) : es())),
          t.updateQueue !== null && (t.flags |= 4),
          oe(t),
          null);
    case 4:
      return (
        yn(),
        Zi(e, t),
        e === null && tr(t.stateNode.containerInfo),
        oe(t),
        null
      );
    case 10:
      return (Fo(t.type._context), oe(t), null);
    case 17:
      return (ve(t.type) && rl(), oe(t), null);
    case 19:
      if ((V(Q), (i = t.memoizedState), i === null)) return (oe(t), null);
      if (((r = (t.flags & 128) !== 0), (o = i.rendering), o === null))
        if (r) Rn(i, !1);
        else {
          if (q !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((o = cl(e)), o !== null)) {
                for (
                  t.flags |= 128,
                    Rn(i, !1),
                    r = o.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;

                )
                  ((i = n),
                    (e = r),
                    (i.flags &= 14680066),
                    (o = i.alternate),
                    o === null
                      ? ((i.childLanes = 0),
                        (i.lanes = e),
                        (i.child = null),
                        (i.subtreeFlags = 0),
                        (i.memoizedProps = null),
                        (i.memoizedState = null),
                        (i.updateQueue = null),
                        (i.dependencies = null),
                        (i.stateNode = null))
                      : ((i.childLanes = o.childLanes),
                        (i.lanes = o.lanes),
                        (i.child = o.child),
                        (i.subtreeFlags = 0),
                        (i.deletions = null),
                        (i.memoizedProps = o.memoizedProps),
                        (i.memoizedState = o.memoizedState),
                        (i.updateQueue = o.updateQueue),
                        (i.type = o.type),
                        (e = o.dependencies),
                        (i.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling));
                return (A(Q, (Q.current & 1) | 2), t.child);
              }
              e = e.sibling;
            }
          i.tail !== null &&
            Y() > wn &&
            ((t.flags |= 128), (r = !0), Rn(i, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = cl(o)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Rn(i, !0),
              i.tail === null && i.tailMode === "hidden" && !o.alternate && !H)
            )
              return (oe(t), null);
          } else
            2 * Y() - i.renderingStartTime > wn &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Rn(i, !1), (t.lanes = 4194304));
        i.isBackwards
          ? ((o.sibling = t.child), (t.child = o))
          : ((n = i.last),
            n !== null ? (n.sibling = o) : (t.child = o),
            (i.last = o));
      }
      return i.tail !== null
        ? ((t = i.tail),
          (i.rendering = t),
          (i.tail = t.sibling),
          (i.renderingStartTime = Y()),
          (t.sibling = null),
          (n = Q.current),
          A(Q, r ? (n & 1) | 2 : n & 1),
          t)
        : (oe(t), null);
    case 22:
    case 23:
      return (
        qo(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? we & 1073741824 && (oe(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : oe(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(E(156, t.tag));
}
function ap(e, t) {
  switch ((Oo(t), t.tag)) {
    case 1:
      return (
        ve(t.type) && rl(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        yn(),
        V(ge),
        V(ae),
        Wo(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return (Bo(t), null);
    case 13:
      if ((V(Q), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
        if (t.alternate === null) throw Error(E(340));
        gn();
      }
      return (
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return (V(Q), null);
    case 4:
      return (yn(), null);
    case 10:
      return (Fo(t.type._context), null);
    case 22:
    case 23:
      return (qo(), null);
    case 24:
      return null;
    default:
      return null;
  }
}
var Or = !1,
  se = !1,
  up = typeof WeakSet == "function" ? WeakSet : Set,
  _ = null;
function on(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        G(e, t, r);
      }
    else n.current = null;
}
function Ji(e, t, n) {
  try {
    n();
  } catch (r) {
    G(e, t, r);
  }
}
var oa = !1;
function cp(e, t) {
  if (((Di = qr), (e = Pu()), Ro(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var l = r.anchorOffset,
            i = r.focusNode;
          r = r.focusOffset;
          try {
            (n.nodeType, i.nodeType);
          } catch {
            n = null;
            break e;
          }
          var o = 0,
            s = -1,
            u = -1,
            c = 0,
            h = 0,
            p = e,
            v = null;
          t: for (;;) {
            for (
              var k;
              p !== n || (l !== 0 && p.nodeType !== 3) || (s = o + l),
                p !== i || (r !== 0 && p.nodeType !== 3) || (u = o + r),
                p.nodeType === 3 && (o += p.nodeValue.length),
                (k = p.firstChild) !== null;

            )
              ((v = p), (p = k));
            for (;;) {
              if (p === e) break t;
              if (
                (v === n && ++c === l && (s = o),
                v === i && ++h === r && (u = o),
                (k = p.nextSibling) !== null)
              )
                break;
              ((p = v), (v = p.parentNode));
            }
            p = k;
          }
          n = s === -1 || u === -1 ? null : { start: s, end: u };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Mi = { focusedElem: e, selectionRange: n }, qr = !1, _ = t; _ !== null; )
    if (((t = _), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      ((e.return = t), (_ = e));
    else
      for (; _ !== null; ) {
        t = _;
        try {
          var y = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (y !== null) {
                  var w = y.memoizedProps,
                    C = y.memoizedState,
                    f = t.stateNode,
                    d = f.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? w : Ie(t.type, w),
                      C,
                    );
                  f.__reactInternalSnapshotBeforeUpdate = d;
                }
                break;
              case 3:
                var m = t.stateNode.containerInfo;
                m.nodeType === 1
                  ? (m.textContent = "")
                  : m.nodeType === 9 &&
                    m.documentElement &&
                    m.removeChild(m.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(E(163));
            }
        } catch (x) {
          G(t, t.return, x);
        }
        if (((e = t.sibling), e !== null)) {
          ((e.return = t.return), (_ = e));
          break;
        }
        _ = t.return;
      }
  return ((y = oa), (oa = !1), y);
}
function Hn(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var l = (r = r.next);
    do {
      if ((l.tag & e) === e) {
        var i = l.destroy;
        ((l.destroy = void 0), i !== void 0 && Ji(t, n, i));
      }
      l = l.next;
    } while (l !== r);
  }
}
function _l(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function qi(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function Ec(e) {
  var t = e.alternate;
  (t !== null && ((e.alternate = null), Ec(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[Ve], delete t[rr], delete t[$i], delete t[bf], delete t[Kf])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null));
}
function Nc(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function sa(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || Nc(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      ((e.child.return = e), (e = e.child));
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function eo(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = nl)));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (eo(e, t, n), e = e.sibling; e !== null; )
      (eo(e, t, n), (e = e.sibling));
}
function to(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (to(e, t, n), e = e.sibling; e !== null; )
      (to(e, t, n), (e = e.sibling));
}
var ne = null,
  De = !1;
function ot(e, t, n) {
  for (n = n.child; n !== null; ) (jc(e, t, n), (n = n.sibling));
}
function jc(e, t, n) {
  if (He && typeof He.onCommitFiberUnmount == "function")
    try {
      He.onCommitFiberUnmount(wl, n);
    } catch {}
  switch (n.tag) {
    case 5:
      se || on(n, t);
    case 6:
      var r = ne,
        l = De;
      ((ne = null),
        ot(e, t, n),
        (ne = r),
        (De = l),
        ne !== null &&
          (De
            ? ((e = ne),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : ne.removeChild(n.stateNode)));
      break;
    case 18:
      ne !== null &&
        (De
          ? ((e = ne),
            (n = n.stateNode),
            e.nodeType === 8
              ? ei(e.parentNode, n)
              : e.nodeType === 1 && ei(e, n),
            Jn(e))
          : ei(ne, n.stateNode));
      break;
    case 4:
      ((r = ne),
        (l = De),
        (ne = n.stateNode.containerInfo),
        (De = !0),
        ot(e, t, n),
        (ne = r),
        (De = l));
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !se &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        l = r = r.next;
        do {
          var i = l,
            o = i.destroy;
          ((i = i.tag),
            o !== void 0 && (i & 2 || i & 4) && Ji(n, t, o),
            (l = l.next));
        } while (l !== r);
      }
      ot(e, t, n);
      break;
    case 1:
      if (
        !se &&
        (on(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          ((r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount());
        } catch (s) {
          G(n, t, s);
        }
      ot(e, t, n);
      break;
    case 21:
      ot(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((se = (r = se) || n.memoizedState !== null), ot(e, t, n), (se = r))
        : ot(e, t, n);
      break;
    default:
      ot(e, t, n);
  }
}
function aa(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    (n === null && (n = e.stateNode = new up()),
      t.forEach(function (r) {
        var l = xp.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      }));
  }
}
function Oe(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e,
          o = t,
          s = o;
        e: for (; s !== null; ) {
          switch (s.tag) {
            case 5:
              ((ne = s.stateNode), (De = !1));
              break e;
            case 3:
              ((ne = s.stateNode.containerInfo), (De = !0));
              break e;
            case 4:
              ((ne = s.stateNode.containerInfo), (De = !0));
              break e;
          }
          s = s.return;
        }
        if (ne === null) throw Error(E(160));
        (jc(i, o, l), (ne = null), (De = !1));
        var u = l.alternate;
        (u !== null && (u.return = null), (l.return = null));
      } catch (c) {
        G(l, t, c);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) (Cc(t, e), (t = t.sibling));
}
function Cc(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((Oe(t, e), Ae(e), r & 4)) {
        try {
          (Hn(3, e, e.return), _l(3, e));
        } catch (w) {
          G(e, e.return, w);
        }
        try {
          Hn(5, e, e.return);
        } catch (w) {
          G(e, e.return, w);
        }
      }
      break;
    case 1:
      (Oe(t, e), Ae(e), r & 512 && n !== null && on(n, n.return));
      break;
    case 5:
      if (
        (Oe(t, e),
        Ae(e),
        r & 512 && n !== null && on(n, n.return),
        e.flags & 32)
      ) {
        var l = e.stateNode;
        try {
          Gn(l, "");
        } catch (w) {
          G(e, e.return, w);
        }
      }
      if (r & 4 && ((l = e.stateNode), l != null)) {
        var i = e.memoizedProps,
          o = n !== null ? n.memoizedProps : i,
          s = e.type,
          u = e.updateQueue;
        if (((e.updateQueue = null), u !== null))
          try {
            (s === "input" && i.type === "radio" && i.name != null && Ga(l, i),
              ji(s, o));
            var c = ji(s, i);
            for (o = 0; o < u.length; o += 2) {
              var h = u[o],
                p = u[o + 1];
              h === "style"
                ? qa(l, p)
                : h === "dangerouslySetInnerHTML"
                  ? Za(l, p)
                  : h === "children"
                    ? Gn(l, p)
                    : yo(l, h, p, c);
            }
            switch (s) {
              case "input":
                wi(l, i);
                break;
              case "textarea":
                Ya(l, i);
                break;
              case "select":
                var v = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var k = i.value;
                k != null
                  ? an(l, !!i.multiple, k, !1)
                  : v !== !!i.multiple &&
                    (i.defaultValue != null
                      ? an(l, !!i.multiple, i.defaultValue, !0)
                      : an(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[rr] = i;
          } catch (w) {
            G(e, e.return, w);
          }
      }
      break;
    case 6:
      if ((Oe(t, e), Ae(e), r & 4)) {
        if (e.stateNode === null) throw Error(E(162));
        ((l = e.stateNode), (i = e.memoizedProps));
        try {
          l.nodeValue = i;
        } catch (w) {
          G(e, e.return, w);
        }
      }
      break;
    case 3:
      if (
        (Oe(t, e), Ae(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          Jn(t.containerInfo);
        } catch (w) {
          G(e, e.return, w);
        }
      break;
    case 4:
      (Oe(t, e), Ae(e));
      break;
    case 13:
      (Oe(t, e),
        Ae(e),
        (l = e.child),
        l.flags & 8192 &&
          ((i = l.memoizedState !== null),
          (l.stateNode.isHidden = i),
          !i ||
            (l.alternate !== null && l.alternate.memoizedState !== null) ||
            (Zo = Y())),
        r & 4 && aa(e));
      break;
    case 22:
      if (
        ((h = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((se = (c = se) || h), Oe(t, e), (se = c)) : Oe(t, e),
        Ae(e),
        r & 8192)
      ) {
        if (
          ((c = e.memoizedState !== null),
          (e.stateNode.isHidden = c) && !h && e.mode & 1)
        )
          for (_ = e, h = e.child; h !== null; ) {
            for (p = _ = h; _ !== null; ) {
              switch (((v = _), (k = v.child), v.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Hn(4, v, v.return);
                  break;
                case 1:
                  on(v, v.return);
                  var y = v.stateNode;
                  if (typeof y.componentWillUnmount == "function") {
                    ((r = v), (n = v.return));
                    try {
                      ((t = r),
                        (y.props = t.memoizedProps),
                        (y.state = t.memoizedState),
                        y.componentWillUnmount());
                    } catch (w) {
                      G(r, n, w);
                    }
                  }
                  break;
                case 5:
                  on(v, v.return);
                  break;
                case 22:
                  if (v.memoizedState !== null) {
                    ca(p);
                    continue;
                  }
              }
              k !== null ? ((k.return = v), (_ = k)) : ca(p);
            }
            h = h.sibling;
          }
        e: for (h = null, p = e; ; ) {
          if (p.tag === 5) {
            if (h === null) {
              h = p;
              try {
                ((l = p.stateNode),
                  c
                    ? ((i = l.style),
                      typeof i.setProperty == "function"
                        ? i.setProperty("display", "none", "important")
                        : (i.display = "none"))
                    : ((s = p.stateNode),
                      (u = p.memoizedProps.style),
                      (o =
                        u != null && u.hasOwnProperty("display")
                          ? u.display
                          : null),
                      (s.style.display = Ja("display", o))));
              } catch (w) {
                G(e, e.return, w);
              }
            }
          } else if (p.tag === 6) {
            if (h === null)
              try {
                p.stateNode.nodeValue = c ? "" : p.memoizedProps;
              } catch (w) {
                G(e, e.return, w);
              }
          } else if (
            ((p.tag !== 22 && p.tag !== 23) ||
              p.memoizedState === null ||
              p === e) &&
            p.child !== null
          ) {
            ((p.child.return = p), (p = p.child));
            continue;
          }
          if (p === e) break e;
          for (; p.sibling === null; ) {
            if (p.return === null || p.return === e) break e;
            (h === p && (h = null), (p = p.return));
          }
          (h === p && (h = null),
            (p.sibling.return = p.return),
            (p = p.sibling));
        }
      }
      break;
    case 19:
      (Oe(t, e), Ae(e), r & 4 && aa(e));
      break;
    case 21:
      break;
    default:
      (Oe(t, e), Ae(e));
  }
}
function Ae(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (Nc(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(E(160));
      }
      switch (r.tag) {
        case 5:
          var l = r.stateNode;
          r.flags & 32 && (Gn(l, ""), (r.flags &= -33));
          var i = sa(e);
          to(e, i, l);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo,
            s = sa(e);
          eo(e, s, o);
          break;
        default:
          throw Error(E(161));
      }
    } catch (u) {
      G(e, e.return, u);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function dp(e, t, n) {
  ((_ = e), Pc(e));
}
function Pc(e, t, n) {
  for (var r = (e.mode & 1) !== 0; _ !== null; ) {
    var l = _,
      i = l.child;
    if (l.tag === 22 && r) {
      var o = l.memoizedState !== null || Or;
      if (!o) {
        var s = l.alternate,
          u = (s !== null && s.memoizedState !== null) || se;
        s = Or;
        var c = se;
        if (((Or = o), (se = u) && !c))
          for (_ = l; _ !== null; )
            ((o = _),
              (u = o.child),
              o.tag === 22 && o.memoizedState !== null
                ? da(l)
                : u !== null
                  ? ((u.return = o), (_ = u))
                  : da(l));
        for (; i !== null; ) ((_ = i), Pc(i), (i = i.sibling));
        ((_ = l), (Or = s), (se = c));
      }
      ua(e);
    } else
      l.subtreeFlags & 8772 && i !== null ? ((i.return = l), (_ = i)) : ua(e);
  }
}
function ua(e) {
  for (; _ !== null; ) {
    var t = _;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              se || _l(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !se)
                if (n === null) r.componentDidMount();
                else {
                  var l =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : Ie(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    l,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var i = t.updateQueue;
              i !== null && Ks(t, i, r);
              break;
            case 3:
              var o = t.updateQueue;
              if (o !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                Ks(t, o, n);
              }
              break;
            case 5:
              var s = t.stateNode;
              if (n === null && t.flags & 4) {
                n = s;
                var u = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    u.autoFocus && n.focus();
                    break;
                  case "img":
                    u.src && (n.src = u.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var c = t.alternate;
                if (c !== null) {
                  var h = c.memoizedState;
                  if (h !== null) {
                    var p = h.dehydrated;
                    p !== null && Jn(p);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(E(163));
          }
        se || (t.flags & 512 && qi(t));
      } catch (v) {
        G(t, t.return, v);
      }
    }
    if (t === e) {
      _ = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      ((n.return = t.return), (_ = n));
      break;
    }
    _ = t.return;
  }
}
function ca(e) {
  for (; _ !== null; ) {
    var t = _;
    if (t === e) {
      _ = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      ((n.return = t.return), (_ = n));
      break;
    }
    _ = t.return;
  }
}
function da(e) {
  for (; _ !== null; ) {
    var t = _;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            _l(4, t);
          } catch (u) {
            G(t, n, u);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var l = t.return;
            try {
              r.componentDidMount();
            } catch (u) {
              G(t, l, u);
            }
          }
          var i = t.return;
          try {
            qi(t);
          } catch (u) {
            G(t, i, u);
          }
          break;
        case 5:
          var o = t.return;
          try {
            qi(t);
          } catch (u) {
            G(t, o, u);
          }
      }
    } catch (u) {
      G(t, t.return, u);
    }
    if (t === e) {
      _ = null;
      break;
    }
    var s = t.sibling;
    if (s !== null) {
      ((s.return = t.return), (_ = s));
      break;
    }
    _ = t.return;
  }
}
var fp = Math.ceil,
  pl = rt.ReactCurrentDispatcher,
  Yo = rt.ReactCurrentOwner,
  Le = rt.ReactCurrentBatchConfig,
  M = 0,
  te = null,
  X = null,
  re = 0,
  we = 0,
  sn = Ct(0),
  q = 0,
  ur = null,
  $t = 0,
  Tl = 0,
  Xo = 0,
  Qn = null,
  me = null,
  Zo = 0,
  wn = 1 / 0,
  Ge = null,
  ml = !1,
  no = null,
  xt = null,
  Ir = !1,
  ft = null,
  hl = 0,
  bn = 0,
  ro = null,
  Qr = -1,
  br = 0;
function ce() {
  return M & 6 ? Y() : Qr !== -1 ? Qr : (Qr = Y());
}
function wt(e) {
  return e.mode & 1
    ? M & 2 && re !== 0
      ? re & -re
      : Yf.transition !== null
        ? (br === 0 && (br = du()), br)
        : ((e = U),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : yu(e.type))),
          e)
    : 1;
}
function Ue(e, t, n, r) {
  if (50 < bn) throw ((bn = 0), (ro = null), Error(E(185)));
  (pr(e, n, r),
    (!(M & 2) || e !== te) &&
      (e === te && (!(M & 2) && (Tl |= n), q === 4 && ct(e, re)),
      ye(e, r),
      n === 1 && M === 0 && !(t.mode & 1) && ((wn = Y() + 500), jl && Pt())));
}
function ye(e, t) {
  var n = e.callbackNode;
  Gd(e, t);
  var r = Jr(e, e === te ? re : 0);
  if (r === 0)
    (n !== null && ws(n), (e.callbackNode = null), (e.callbackPriority = 0));
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && ws(n), t === 1))
      (e.tag === 0 ? Gf(fa.bind(null, e)) : Fu(fa.bind(null, e)),
        Hf(function () {
          !(M & 6) && Pt();
        }),
        (n = null));
    else {
      switch (fu(r)) {
        case 1:
          n = Eo;
          break;
        case 4:
          n = uu;
          break;
        case 16:
          n = Zr;
          break;
        case 536870912:
          n = cu;
          break;
        default:
          n = Zr;
      }
      n = Dc(n, _c.bind(null, e));
    }
    ((e.callbackPriority = t), (e.callbackNode = n));
  }
}
function _c(e, t) {
  if (((Qr = -1), (br = 0), M & 6)) throw Error(E(327));
  var n = e.callbackNode;
  if (pn() && e.callbackNode !== n) return null;
  var r = Jr(e, e === te ? re : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = gl(e, r);
  else {
    t = r;
    var l = M;
    M |= 2;
    var i = Lc();
    (te !== e || re !== t) && ((Ge = null), (wn = Y() + 500), It(e, t));
    do
      try {
        hp();
        break;
      } catch (s) {
        Tc(e, s);
      }
    while (!0);
    (Mo(),
      (pl.current = i),
      (M = l),
      X !== null ? (t = 0) : ((te = null), (re = 0), (t = q)));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((l = Li(e)), l !== 0 && ((r = l), (t = lo(e, l)))), t === 1)
    )
      throw ((n = ur), It(e, 0), ct(e, r), ye(e, Y()), n);
    if (t === 6) ct(e, r);
    else {
      if (
        ((l = e.current.alternate),
        !(r & 30) &&
          !pp(l) &&
          ((t = gl(e, r)),
          t === 2 && ((i = Li(e)), i !== 0 && ((r = i), (t = lo(e, i)))),
          t === 1))
      )
        throw ((n = ur), It(e, 0), ct(e, r), ye(e, Y()), n);
      switch (((e.finishedWork = l), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(E(345));
        case 2:
          Lt(e, me, Ge);
          break;
        case 3:
          if (
            (ct(e, r), (r & 130023424) === r && ((t = Zo + 500 - Y()), 10 < t))
          ) {
            if (Jr(e, 0) !== 0) break;
            if (((l = e.suspendedLanes), (l & r) !== r)) {
              (ce(), (e.pingedLanes |= e.suspendedLanes & l));
              break;
            }
            e.timeoutHandle = Ui(Lt.bind(null, e, me, Ge), t);
            break;
          }
          Lt(e, me, Ge);
          break;
        case 4:
          if ((ct(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, l = -1; 0 < r; ) {
            var o = 31 - Fe(r);
            ((i = 1 << o), (o = t[o]), o > l && (l = o), (r &= ~i));
          }
          if (
            ((r = l),
            (r = Y() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                  ? 480
                  : 1080 > r
                    ? 1080
                    : 1920 > r
                      ? 1920
                      : 3e3 > r
                        ? 3e3
                        : 4320 > r
                          ? 4320
                          : 1960 * fp(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = Ui(Lt.bind(null, e, me, Ge), r);
            break;
          }
          Lt(e, me, Ge);
          break;
        case 5:
          Lt(e, me, Ge);
          break;
        default:
          throw Error(E(329));
      }
    }
  }
  return (ye(e, Y()), e.callbackNode === n ? _c.bind(null, e) : null);
}
function lo(e, t) {
  var n = Qn;
  return (
    e.current.memoizedState.isDehydrated && (It(e, t).flags |= 256),
    (e = gl(e, t)),
    e !== 2 && ((t = me), (me = n), t !== null && io(t)),
    e
  );
}
function io(e) {
  me === null ? (me = e) : me.push.apply(me, e);
}
function pp(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var l = n[r],
            i = l.getSnapshot;
          l = l.value;
          try {
            if (!$e(i(), l)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
      ((n.return = t), (t = n));
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
  }
  return !0;
}
function ct(e, t) {
  for (
    t &= ~Xo,
      t &= ~Tl,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - Fe(t),
      r = 1 << n;
    ((e[n] = -1), (t &= ~r));
  }
}
function fa(e) {
  if (M & 6) throw Error(E(327));
  pn();
  var t = Jr(e, 0);
  if (!(t & 1)) return (ye(e, Y()), null);
  var n = gl(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Li(e);
    r !== 0 && ((t = r), (n = lo(e, r)));
  }
  if (n === 1) throw ((n = ur), It(e, 0), ct(e, t), ye(e, Y()), n);
  if (n === 6) throw Error(E(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    Lt(e, me, Ge),
    ye(e, Y()),
    null
  );
}
function Jo(e, t) {
  var n = M;
  M |= 1;
  try {
    return e(t);
  } finally {
    ((M = n), M === 0 && ((wn = Y() + 500), jl && Pt()));
  }
}
function At(e) {
  ft !== null && ft.tag === 0 && !(M & 6) && pn();
  var t = M;
  M |= 1;
  var n = Le.transition,
    r = U;
  try {
    if (((Le.transition = null), (U = 1), e)) return e();
  } finally {
    ((U = r), (Le.transition = n), (M = t), !(M & 6) && Pt());
  }
}
function qo() {
  ((we = sn.current), V(sn));
}
function It(e, t) {
  ((e.finishedWork = null), (e.finishedLanes = 0));
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), Vf(n)), X !== null))
    for (n = X.return; n !== null; ) {
      var r = n;
      switch ((Oo(r), r.tag)) {
        case 1:
          ((r = r.type.childContextTypes), r != null && rl());
          break;
        case 3:
          (yn(), V(ge), V(ae), Wo());
          break;
        case 5:
          Bo(r);
          break;
        case 4:
          yn();
          break;
        case 13:
          V(Q);
          break;
        case 19:
          V(Q);
          break;
        case 10:
          Fo(r.type._context);
          break;
        case 22:
        case 23:
          qo();
      }
      n = n.return;
    }
  if (
    ((te = e),
    (X = e = kt(e.current, null)),
    (re = we = t),
    (q = 0),
    (ur = null),
    (Xo = Tl = $t = 0),
    (me = Qn = null),
    zt !== null)
  ) {
    for (t = 0; t < zt.length; t++)
      if (((n = zt[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var l = r.next,
          i = n.pending;
        if (i !== null) {
          var o = i.next;
          ((i.next = l), (r.next = o));
        }
        n.pending = r;
      }
    zt = null;
  }
  return e;
}
function Tc(e, t) {
  do {
    var n = X;
    try {
      if ((Mo(), (Wr.current = fl), dl)) {
        for (var r = b.memoizedState; r !== null; ) {
          var l = r.queue;
          (l !== null && (l.pending = null), (r = r.next));
        }
        dl = !1;
      }
      if (
        ((Ut = 0),
        (ee = J = b = null),
        (Vn = !1),
        (or = 0),
        (Yo.current = null),
        n === null || n.return === null)
      ) {
        ((q = 1), (ur = t), (X = null));
        break;
      }
      e: {
        var i = e,
          o = n.return,
          s = n,
          u = t;
        if (
          ((t = re),
          (s.flags |= 32768),
          u !== null && typeof u == "object" && typeof u.then == "function")
        ) {
          var c = u,
            h = s,
            p = h.tag;
          if (!(h.mode & 1) && (p === 0 || p === 11 || p === 15)) {
            var v = h.alternate;
            v
              ? ((h.updateQueue = v.updateQueue),
                (h.memoizedState = v.memoizedState),
                (h.lanes = v.lanes))
              : ((h.updateQueue = null), (h.memoizedState = null));
          }
          var k = qs(o);
          if (k !== null) {
            ((k.flags &= -257),
              ea(k, o, s, i, t),
              k.mode & 1 && Js(i, c, t),
              (t = k),
              (u = c));
            var y = t.updateQueue;
            if (y === null) {
              var w = new Set();
              (w.add(u), (t.updateQueue = w));
            } else y.add(u);
            break e;
          } else {
            if (!(t & 1)) {
              (Js(i, c, t), es());
              break e;
            }
            u = Error(E(426));
          }
        } else if (H && s.mode & 1) {
          var C = qs(o);
          if (C !== null) {
            (!(C.flags & 65536) && (C.flags |= 256),
              ea(C, o, s, i, t),
              Io(xn(u, s)));
            break e;
          }
        }
        ((i = u = xn(u, s)),
          q !== 4 && (q = 2),
          Qn === null ? (Qn = [i]) : Qn.push(i),
          (i = o));
        do {
          switch (i.tag) {
            case 3:
              ((i.flags |= 65536), (t &= -t), (i.lanes |= t));
              var f = fc(i, u, t);
              bs(i, f);
              break e;
            case 1:
              s = u;
              var d = i.type,
                m = i.stateNode;
              if (
                !(i.flags & 128) &&
                (typeof d.getDerivedStateFromError == "function" ||
                  (m !== null &&
                    typeof m.componentDidCatch == "function" &&
                    (xt === null || !xt.has(m))))
              ) {
                ((i.flags |= 65536), (t &= -t), (i.lanes |= t));
                var x = pc(i, s, t);
                bs(i, x);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      zc(n);
    } catch (j) {
      ((t = j), X === n && n !== null && (X = n = n.return));
      continue;
    }
    break;
  } while (!0);
}
function Lc() {
  var e = pl.current;
  return ((pl.current = fl), e === null ? fl : e);
}
function es() {
  ((q === 0 || q === 3 || q === 2) && (q = 4),
    te === null || (!($t & 268435455) && !(Tl & 268435455)) || ct(te, re));
}
function gl(e, t) {
  var n = M;
  M |= 2;
  var r = Lc();
  (te !== e || re !== t) && ((Ge = null), It(e, t));
  do
    try {
      mp();
      break;
    } catch (l) {
      Tc(e, l);
    }
  while (!0);
  if ((Mo(), (M = n), (pl.current = r), X !== null)) throw Error(E(261));
  return ((te = null), (re = 0), q);
}
function mp() {
  for (; X !== null; ) Rc(X);
}
function hp() {
  for (; X !== null && !$d(); ) Rc(X);
}
function Rc(e) {
  var t = Ic(e.alternate, e, we);
  ((e.memoizedProps = e.pendingProps),
    t === null ? zc(e) : (X = t),
    (Yo.current = null));
}
function zc(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = ap(n, t)), n !== null)) {
        ((n.flags &= 32767), (X = n));
        return;
      }
      if (e !== null)
        ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
      else {
        ((q = 6), (X = null));
        return;
      }
    } else if (((n = sp(n, t, we)), n !== null)) {
      X = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      X = t;
      return;
    }
    X = t = e;
  } while (t !== null);
  q === 0 && (q = 5);
}
function Lt(e, t, n) {
  var r = U,
    l = Le.transition;
  try {
    ((Le.transition = null), (U = 1), gp(e, t, n, r));
  } finally {
    ((Le.transition = l), (U = r));
  }
  return null;
}
function gp(e, t, n, r) {
  do pn();
  while (ft !== null);
  if (M & 6) throw Error(E(327));
  n = e.finishedWork;
  var l = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(E(177));
  ((e.callbackNode = null), (e.callbackPriority = 0));
  var i = n.lanes | n.childLanes;
  if (
    (Yd(e, i),
    e === te && ((X = te = null), (re = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      Ir ||
      ((Ir = !0),
      Dc(Zr, function () {
        return (pn(), null);
      })),
    (i = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || i)
  ) {
    ((i = Le.transition), (Le.transition = null));
    var o = U;
    U = 1;
    var s = M;
    ((M |= 4),
      (Yo.current = null),
      cp(e, n),
      Cc(n, e),
      Mf(Mi),
      (qr = !!Di),
      (Mi = Di = null),
      (e.current = n),
      dp(n),
      Ad(),
      (M = s),
      (U = o),
      (Le.transition = i));
  } else e.current = n;
  if (
    (Ir && ((Ir = !1), (ft = e), (hl = l)),
    (i = e.pendingLanes),
    i === 0 && (xt = null),
    Vd(n.stateNode),
    ye(e, Y()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      ((l = t[n]), r(l.value, { componentStack: l.stack, digest: l.digest }));
  if (ml) throw ((ml = !1), (e = no), (no = null), e);
  return (
    hl & 1 && e.tag !== 0 && pn(),
    (i = e.pendingLanes),
    i & 1 ? (e === ro ? bn++ : ((bn = 0), (ro = e))) : (bn = 0),
    Pt(),
    null
  );
}
function pn() {
  if (ft !== null) {
    var e = fu(hl),
      t = Le.transition,
      n = U;
    try {
      if (((Le.transition = null), (U = 16 > e ? 16 : e), ft === null))
        var r = !1;
      else {
        if (((e = ft), (ft = null), (hl = 0), M & 6)) throw Error(E(331));
        var l = M;
        for (M |= 4, _ = e.current; _ !== null; ) {
          var i = _,
            o = i.child;
          if (_.flags & 16) {
            var s = i.deletions;
            if (s !== null) {
              for (var u = 0; u < s.length; u++) {
                var c = s[u];
                for (_ = c; _ !== null; ) {
                  var h = _;
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Hn(8, h, i);
                  }
                  var p = h.child;
                  if (p !== null) ((p.return = h), (_ = p));
                  else
                    for (; _ !== null; ) {
                      h = _;
                      var v = h.sibling,
                        k = h.return;
                      if ((Ec(h), h === c)) {
                        _ = null;
                        break;
                      }
                      if (v !== null) {
                        ((v.return = k), (_ = v));
                        break;
                      }
                      _ = k;
                    }
                }
              }
              var y = i.alternate;
              if (y !== null) {
                var w = y.child;
                if (w !== null) {
                  y.child = null;
                  do {
                    var C = w.sibling;
                    ((w.sibling = null), (w = C));
                  } while (w !== null);
                }
              }
              _ = i;
            }
          }
          if (i.subtreeFlags & 2064 && o !== null) ((o.return = i), (_ = o));
          else
            e: for (; _ !== null; ) {
              if (((i = _), i.flags & 2048))
                switch (i.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Hn(9, i, i.return);
                }
              var f = i.sibling;
              if (f !== null) {
                ((f.return = i.return), (_ = f));
                break e;
              }
              _ = i.return;
            }
        }
        var d = e.current;
        for (_ = d; _ !== null; ) {
          o = _;
          var m = o.child;
          if (o.subtreeFlags & 2064 && m !== null) ((m.return = o), (_ = m));
          else
            e: for (o = d; _ !== null; ) {
              if (((s = _), s.flags & 2048))
                try {
                  switch (s.tag) {
                    case 0:
                    case 11:
                    case 15:
                      _l(9, s);
                  }
                } catch (j) {
                  G(s, s.return, j);
                }
              if (s === o) {
                _ = null;
                break e;
              }
              var x = s.sibling;
              if (x !== null) {
                ((x.return = s.return), (_ = x));
                break e;
              }
              _ = s.return;
            }
        }
        if (
          ((M = l), Pt(), He && typeof He.onPostCommitFiberRoot == "function")
        )
          try {
            He.onPostCommitFiberRoot(wl, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      ((U = n), (Le.transition = t));
    }
  }
  return !1;
}
function pa(e, t, n) {
  ((t = xn(n, t)),
    (t = fc(e, t, 1)),
    (e = yt(e, t, 1)),
    (t = ce()),
    e !== null && (pr(e, 1, t), ye(e, t)));
}
function G(e, t, n) {
  if (e.tag === 3) pa(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        pa(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (xt === null || !xt.has(r)))
        ) {
          ((e = xn(n, e)),
            (e = pc(t, e, 1)),
            (t = yt(t, e, 1)),
            (e = ce()),
            t !== null && (pr(t, 1, e), ye(t, e)));
          break;
        }
      }
      t = t.return;
    }
}
function vp(e, t, n) {
  var r = e.pingCache;
  (r !== null && r.delete(t),
    (t = ce()),
    (e.pingedLanes |= e.suspendedLanes & n),
    te === e &&
      (re & n) === n &&
      (q === 4 || (q === 3 && (re & 130023424) === re && 500 > Y() - Zo)
        ? It(e, 0)
        : (Xo |= n)),
    ye(e, t));
}
function Oc(e, t) {
  t === 0 &&
    (e.mode & 1
      ? ((t = Nr), (Nr <<= 1), !(Nr & 130023424) && (Nr = 4194304))
      : (t = 1));
  var n = ce();
  ((e = tt(e, t)), e !== null && (pr(e, t, n), ye(e, n)));
}
function yp(e) {
  var t = e.memoizedState,
    n = 0;
  (t !== null && (n = t.retryLane), Oc(e, n));
}
function xp(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        l = e.memoizedState;
      l !== null && (n = l.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(E(314));
  }
  (r !== null && r.delete(t), Oc(e, n));
}
var Ic;
Ic = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || ge.current) he = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return ((he = !1), op(e, t, n));
      he = !!(e.flags & 131072);
    }
  else ((he = !1), H && t.flags & 1048576 && Uu(t, ol, t.index));
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      (Hr(e, t), (e = t.pendingProps));
      var l = hn(t, ae.current);
      (fn(t, n), (l = Ho(null, t, r, e, l, n)));
      var i = Qo();
      return (
        (t.flags |= 1),
        typeof l == "object" &&
        l !== null &&
        typeof l.render == "function" &&
        l.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            ve(r) ? ((i = !0), ll(t)) : (i = !1),
            (t.memoizedState =
              l.state !== null && l.state !== void 0 ? l.state : null),
            $o(t),
            (l.updater = Pl),
            (t.stateNode = l),
            (l._reactInternals = t),
            Qi(t, r, e, n),
            (t = Gi(null, t, r, !0, i, n)))
          : ((t.tag = 0), H && i && zo(t), ue(null, t, l, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (Hr(e, t),
          (e = t.pendingProps),
          (l = r._init),
          (r = l(r._payload)),
          (t.type = r),
          (l = t.tag = kp(r)),
          (e = Ie(r, e)),
          l)
        ) {
          case 0:
            t = Ki(null, t, r, e, n);
            break e;
          case 1:
            t = ra(null, t, r, e, n);
            break e;
          case 11:
            t = ta(null, t, r, e, n);
            break e;
          case 14:
            t = na(null, t, r, Ie(r.type, e), n);
            break e;
        }
        throw Error(E(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : Ie(r, l)),
        Ki(e, t, r, l, n)
      );
    case 1:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : Ie(r, l)),
        ra(e, t, r, l, n)
      );
    case 3:
      e: {
        if ((vc(t), e === null)) throw Error(E(387));
        ((r = t.pendingProps),
          (i = t.memoizedState),
          (l = i.element),
          Hu(e, t),
          ul(t, r, null, n));
        var o = t.memoizedState;
        if (((r = o.element), i.isDehydrated))
          if (
            ((i = {
              element: r,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions,
            }),
            (t.updateQueue.baseState = i),
            (t.memoizedState = i),
            t.flags & 256)
          ) {
            ((l = xn(Error(E(423)), t)), (t = la(e, t, r, n, l)));
            break e;
          } else if (r !== l) {
            ((l = xn(Error(E(424)), t)), (t = la(e, t, r, n, l)));
            break e;
          } else
            for (
              ke = vt(t.stateNode.containerInfo.firstChild),
                Se = t,
                H = !0,
                Me = null,
                n = Wu(t, null, r, n),
                t.child = n;
              n;

            )
              ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
        else {
          if ((gn(), r === l)) {
            t = nt(e, t, n);
            break e;
          }
          ue(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        Qu(t),
        e === null && Wi(t),
        (r = t.type),
        (l = t.pendingProps),
        (i = e !== null ? e.memoizedProps : null),
        (o = l.children),
        Fi(r, l) ? (o = null) : i !== null && Fi(r, i) && (t.flags |= 32),
        gc(e, t),
        ue(e, t, o, n),
        t.child
      );
    case 6:
      return (e === null && Wi(t), null);
    case 13:
      return yc(e, t, n);
    case 4:
      return (
        Ao(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = vn(t, null, r, n)) : ue(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : Ie(r, l)),
        ta(e, t, r, l, n)
      );
    case 7:
      return (ue(e, t, t.pendingProps, n), t.child);
    case 8:
      return (ue(e, t, t.pendingProps.children, n), t.child);
    case 12:
      return (ue(e, t, t.pendingProps.children, n), t.child);
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (l = t.pendingProps),
          (i = t.memoizedProps),
          (o = l.value),
          A(sl, r._currentValue),
          (r._currentValue = o),
          i !== null)
        )
          if ($e(i.value, o)) {
            if (i.children === l.children && !ge.current) {
              t = nt(e, t, n);
              break e;
            }
          } else
            for (i = t.child, i !== null && (i.return = t); i !== null; ) {
              var s = i.dependencies;
              if (s !== null) {
                o = i.child;
                for (var u = s.firstContext; u !== null; ) {
                  if (u.context === r) {
                    if (i.tag === 1) {
                      ((u = Je(-1, n & -n)), (u.tag = 2));
                      var c = i.updateQueue;
                      if (c !== null) {
                        c = c.shared;
                        var h = c.pending;
                        (h === null
                          ? (u.next = u)
                          : ((u.next = h.next), (h.next = u)),
                          (c.pending = u));
                      }
                    }
                    ((i.lanes |= n),
                      (u = i.alternate),
                      u !== null && (u.lanes |= n),
                      Vi(i.return, n, t),
                      (s.lanes |= n));
                    break;
                  }
                  u = u.next;
                }
              } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
              else if (i.tag === 18) {
                if (((o = i.return), o === null)) throw Error(E(341));
                ((o.lanes |= n),
                  (s = o.alternate),
                  s !== null && (s.lanes |= n),
                  Vi(o, n, t),
                  (o = i.sibling));
              } else o = i.child;
              if (o !== null) o.return = i;
              else
                for (o = i; o !== null; ) {
                  if (o === t) {
                    o = null;
                    break;
                  }
                  if (((i = o.sibling), i !== null)) {
                    ((i.return = o.return), (o = i));
                    break;
                  }
                  o = o.return;
                }
              i = o;
            }
        (ue(e, t, l.children, n), (t = t.child));
      }
      return t;
    case 9:
      return (
        (l = t.type),
        (r = t.pendingProps.children),
        fn(t, n),
        (l = Re(l)),
        (r = r(l)),
        (t.flags |= 1),
        ue(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (l = Ie(r, t.pendingProps)),
        (l = Ie(r.type, l)),
        na(e, t, r, l, n)
      );
    case 15:
      return mc(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : Ie(r, l)),
        Hr(e, t),
        (t.tag = 1),
        ve(r) ? ((e = !0), ll(t)) : (e = !1),
        fn(t, n),
        dc(t, r, l),
        Qi(t, r, l, n),
        Gi(null, t, r, !0, e, n)
      );
    case 19:
      return xc(e, t, n);
    case 22:
      return hc(e, t, n);
  }
  throw Error(E(156, t.tag));
};
function Dc(e, t) {
  return au(e, t);
}
function wp(e, t, n, r) {
  ((this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null));
}
function Te(e, t, n, r) {
  return new wp(e, t, n, r);
}
function ts(e) {
  return ((e = e.prototype), !(!e || !e.isReactComponent));
}
function kp(e) {
  if (typeof e == "function") return ts(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === wo)) return 11;
    if (e === ko) return 14;
  }
  return 2;
}
function kt(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = Te(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function Kr(e, t, n, r, l, i) {
  var o = 2;
  if (((r = e), typeof e == "function")) ts(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else
    e: switch (e) {
      case Xt:
        return Dt(n.children, l, i, t);
      case xo:
        ((o = 8), (l |= 8));
        break;
      case hi:
        return (
          (e = Te(12, n, t, l | 2)),
          (e.elementType = hi),
          (e.lanes = i),
          e
        );
      case gi:
        return ((e = Te(13, n, t, l)), (e.elementType = gi), (e.lanes = i), e);
      case vi:
        return ((e = Te(19, n, t, l)), (e.elementType = vi), (e.lanes = i), e);
      case Qa:
        return Ll(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case Va:
              o = 10;
              break e;
            case Ha:
              o = 9;
              break e;
            case wo:
              o = 11;
              break e;
            case ko:
              o = 14;
              break e;
            case st:
              ((o = 16), (r = null));
              break e;
          }
        throw Error(E(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = Te(o, n, t, l)),
    (t.elementType = e),
    (t.type = r),
    (t.lanes = i),
    t
  );
}
function Dt(e, t, n, r) {
  return ((e = Te(7, e, r, t)), (e.lanes = n), e);
}
function Ll(e, t, n, r) {
  return (
    (e = Te(22, e, r, t)),
    (e.elementType = Qa),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function ai(e, t, n) {
  return ((e = Te(6, e, null, t)), (e.lanes = n), e);
}
function ui(e, t, n) {
  return (
    (t = Te(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function Sp(e, t, n, r, l) {
  ((this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = Vl(0)),
    (this.expirationTimes = Vl(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = Vl(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = l),
    (this.mutableSourceEagerHydrationData = null));
}
function ns(e, t, n, r, l, i, o, s, u) {
  return (
    (e = new Sp(e, t, n, s, u)),
    t === 1 ? ((t = 1), i === !0 && (t |= 8)) : (t = 0),
    (i = Te(3, null, null, t)),
    (e.current = i),
    (i.stateNode = e),
    (i.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    $o(i),
    e
  );
}
function Ep(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Yt,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function Mc(e) {
  if (!e) return Nt;
  e = e._reactInternals;
  e: {
    if (Wt(e) !== e || e.tag !== 1) throw Error(E(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (ve(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(E(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (ve(n)) return Mu(e, n, t);
  }
  return t;
}
function Fc(e, t, n, r, l, i, o, s, u) {
  return (
    (e = ns(n, r, !0, e, l, i, o, s, u)),
    (e.context = Mc(null)),
    (n = e.current),
    (r = ce()),
    (l = wt(n)),
    (i = Je(r, l)),
    (i.callback = t ?? null),
    yt(n, i, l),
    (e.current.lanes = l),
    pr(e, l, r),
    ye(e, r),
    e
  );
}
function Rl(e, t, n, r) {
  var l = t.current,
    i = ce(),
    o = wt(l);
  return (
    (n = Mc(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = Je(i, o)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = yt(l, t, o)),
    e !== null && (Ue(e, l, o, i), Br(e, l, o)),
    o
  );
}
function vl(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function ma(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function rs(e, t) {
  (ma(e, t), (e = e.alternate) && ma(e, t));
}
function Np() {
  return null;
}
var Uc =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function ls(e) {
  this._internalRoot = e;
}
zl.prototype.render = ls.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(E(409));
  Rl(e, t, null, null);
};
zl.prototype.unmount = ls.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    (At(function () {
      Rl(null, e, null, null);
    }),
      (t[et] = null));
  }
};
function zl(e) {
  this._internalRoot = e;
}
zl.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = hu();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < ut.length && t !== 0 && t < ut[n].priority; n++);
    (ut.splice(n, 0, e), n === 0 && vu(e));
  }
};
function is(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function Ol(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function ha() {}
function jp(e, t, n, r, l) {
  if (l) {
    if (typeof r == "function") {
      var i = r;
      r = function () {
        var c = vl(o);
        i.call(c);
      };
    }
    var o = Fc(t, r, e, 0, null, !1, !1, "", ha);
    return (
      (e._reactRootContainer = o),
      (e[et] = o.current),
      tr(e.nodeType === 8 ? e.parentNode : e),
      At(),
      o
    );
  }
  for (; (l = e.lastChild); ) e.removeChild(l);
  if (typeof r == "function") {
    var s = r;
    r = function () {
      var c = vl(u);
      s.call(c);
    };
  }
  var u = ns(e, 0, !1, null, null, !1, !1, "", ha);
  return (
    (e._reactRootContainer = u),
    (e[et] = u.current),
    tr(e.nodeType === 8 ? e.parentNode : e),
    At(function () {
      Rl(t, u, n, r);
    }),
    u
  );
}
function Il(e, t, n, r, l) {
  var i = n._reactRootContainer;
  if (i) {
    var o = i;
    if (typeof l == "function") {
      var s = l;
      l = function () {
        var u = vl(o);
        s.call(u);
      };
    }
    Rl(t, o, e, l);
  } else o = jp(n, t, e, l, r);
  return vl(o);
}
pu = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Mn(t.pendingLanes);
        n !== 0 &&
          (No(t, n | 1), ye(t, Y()), !(M & 6) && ((wn = Y() + 500), Pt()));
      }
      break;
    case 13:
      (At(function () {
        var r = tt(e, 1);
        if (r !== null) {
          var l = ce();
          Ue(r, e, 1, l);
        }
      }),
        rs(e, 1));
  }
};
jo = function (e) {
  if (e.tag === 13) {
    var t = tt(e, 134217728);
    if (t !== null) {
      var n = ce();
      Ue(t, e, 134217728, n);
    }
    rs(e, 134217728);
  }
};
mu = function (e) {
  if (e.tag === 13) {
    var t = wt(e),
      n = tt(e, t);
    if (n !== null) {
      var r = ce();
      Ue(n, e, t, r);
    }
    rs(e, t);
  }
};
hu = function () {
  return U;
};
gu = function (e, t) {
  var n = U;
  try {
    return ((U = e), t());
  } finally {
    U = n;
  }
};
Pi = function (e, t, n) {
  switch (t) {
    case "input":
      if ((wi(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var l = Nl(r);
            if (!l) throw Error(E(90));
            (Ka(r), wi(r, l));
          }
        }
      }
      break;
    case "textarea":
      Ya(e, n);
      break;
    case "select":
      ((t = n.value), t != null && an(e, !!n.multiple, t, !1));
  }
};
nu = Jo;
ru = At;
var Cp = { usingClientEntryPoint: !1, Events: [hr, en, Nl, eu, tu, Jo] },
  zn = {
    findFiberByHostInstance: Rt,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  Pp = {
    bundleType: zn.bundleType,
    version: zn.version,
    rendererPackageName: zn.rendererPackageName,
    rendererConfig: zn.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: rt.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return ((e = ou(e)), e === null ? null : e.stateNode);
    },
    findFiberByHostInstance: zn.findFiberByHostInstance || Np,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Dr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Dr.isDisabled && Dr.supportsFiber)
    try {
      ((wl = Dr.inject(Pp)), (He = Dr));
    } catch {}
}
Ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Cp;
Ne.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!is(t)) throw Error(E(200));
  return Ep(e, t, null, n);
};
Ne.createRoot = function (e, t) {
  if (!is(e)) throw Error(E(299));
  var n = !1,
    r = "",
    l = Uc;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (l = t.onRecoverableError)),
    (t = ns(e, 1, !1, null, null, n, !1, r, l)),
    (e[et] = t.current),
    tr(e.nodeType === 8 ? e.parentNode : e),
    new ls(t)
  );
};
Ne.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(E(188))
      : ((e = Object.keys(e).join(",")), Error(E(268, e)));
  return ((e = ou(t)), (e = e === null ? null : e.stateNode), e);
};
Ne.flushSync = function (e) {
  return At(e);
};
Ne.hydrate = function (e, t, n) {
  if (!Ol(t)) throw Error(E(200));
  return Il(null, e, t, !0, n);
};
Ne.hydrateRoot = function (e, t, n) {
  if (!is(e)) throw Error(E(405));
  var r = (n != null && n.hydratedSources) || null,
    l = !1,
    i = "",
    o = Uc;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (l = !0),
      n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (o = n.onRecoverableError)),
    (t = Fc(t, null, e, 1, n ?? null, l, !1, i, o)),
    (e[et] = t.current),
    tr(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      ((n = r[e]),
        (l = n._getVersion),
        (l = l(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, l])
          : t.mutableSourceEagerHydrationData.push(n, l));
  return new zl(t);
};
Ne.render = function (e, t, n) {
  if (!Ol(t)) throw Error(E(200));
  return Il(null, e, t, !1, n);
};
Ne.unmountComponentAtNode = function (e) {
  if (!Ol(e)) throw Error(E(40));
  return e._reactRootContainer
    ? (At(function () {
        Il(null, null, e, !1, function () {
          ((e._reactRootContainer = null), (e[et] = null));
        });
      }),
      !0)
    : !1;
};
Ne.unstable_batchedUpdates = Jo;
Ne.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Ol(n)) throw Error(E(200));
  if (e == null || e._reactInternals === void 0) throw Error(E(38));
  return Il(e, t, n, !1, r);
};
Ne.version = "18.3.1-next-f1338f8080-20240426";
function $c() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE($c);
    } catch (e) {
      console.error(e);
    }
}
($c(), ($a.exports = Ne));
var _p = $a.exports,
  ga = _p;
((pi.createRoot = ga.createRoot), (pi.hydrateRoot = ga.hydrateRoot));
/**
 * @remix-run/router v1.23.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function cr() {
  return (
    (cr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    cr.apply(this, arguments)
  );
}
var pt;
(function (e) {
  ((e.Pop = "POP"), (e.Push = "PUSH"), (e.Replace = "REPLACE"));
})(pt || (pt = {}));
const va = "popstate";
function Tp(e) {
  e === void 0 && (e = {});
  function t(r, l) {
    let { pathname: i, search: o, hash: s } = r.location;
    return oo(
      "",
      { pathname: i, search: o, hash: s },
      (l.state && l.state.usr) || null,
      (l.state && l.state.key) || "default",
    );
  }
  function n(r, l) {
    return typeof l == "string" ? l : yl(l);
  }
  return Rp(t, n, null, e);
}
function Z(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function Ac(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function Lp() {
  return Math.random().toString(36).substr(2, 8);
}
function ya(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function oo(e, t, n, r) {
  return (
    n === void 0 && (n = null),
    cr(
      { pathname: typeof e == "string" ? e : e.pathname, search: "", hash: "" },
      typeof t == "string" ? Nn(t) : t,
      { state: n, key: (t && t.key) || r || Lp() },
    )
  );
}
function yl(e) {
  let { pathname: t = "/", search: n = "", hash: r = "" } = e;
  return (
    n && n !== "?" && (t += n.charAt(0) === "?" ? n : "?" + n),
    r && r !== "#" && (t += r.charAt(0) === "#" ? r : "#" + r),
    t
  );
}
function Nn(e) {
  let t = {};
  if (e) {
    let n = e.indexOf("#");
    n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)));
    let r = e.indexOf("?");
    (r >= 0 && ((t.search = e.substr(r)), (e = e.substr(0, r))),
      e && (t.pathname = e));
  }
  return t;
}
function Rp(e, t, n, r) {
  r === void 0 && (r = {});
  let { window: l = document.defaultView, v5Compat: i = !1 } = r,
    o = l.history,
    s = pt.Pop,
    u = null,
    c = h();
  c == null && ((c = 0), o.replaceState(cr({}, o.state, { idx: c }), ""));
  function h() {
    return (o.state || { idx: null }).idx;
  }
  function p() {
    s = pt.Pop;
    let C = h(),
      f = C == null ? null : C - c;
    ((c = C), u && u({ action: s, location: w.location, delta: f }));
  }
  function v(C, f) {
    s = pt.Push;
    let d = oo(w.location, C, f);
    c = h() + 1;
    let m = ya(d, c),
      x = w.createHref(d);
    try {
      o.pushState(m, "", x);
    } catch (j) {
      if (j instanceof DOMException && j.name === "DataCloneError") throw j;
      l.location.assign(x);
    }
    i && u && u({ action: s, location: w.location, delta: 1 });
  }
  function k(C, f) {
    s = pt.Replace;
    let d = oo(w.location, C, f);
    c = h();
    let m = ya(d, c),
      x = w.createHref(d);
    (o.replaceState(m, "", x),
      i && u && u({ action: s, location: w.location, delta: 0 }));
  }
  function y(C) {
    let f = l.location.origin !== "null" ? l.location.origin : l.location.href,
      d = typeof C == "string" ? C : yl(C);
    return (
      (d = d.replace(/ $/, "%20")),
      Z(
        f,
        "No window.location.(origin|href) available to create URL for href: " +
          d,
      ),
      new URL(d, f)
    );
  }
  let w = {
    get action() {
      return s;
    },
    get location() {
      return e(l, o);
    },
    listen(C) {
      if (u) throw new Error("A history only accepts one active listener");
      return (
        l.addEventListener(va, p),
        (u = C),
        () => {
          (l.removeEventListener(va, p), (u = null));
        }
      );
    },
    createHref(C) {
      return t(l, C);
    },
    createURL: y,
    encodeLocation(C) {
      let f = y(C);
      return { pathname: f.pathname, search: f.search, hash: f.hash };
    },
    push: v,
    replace: k,
    go(C) {
      return o.go(C);
    },
  };
  return w;
}
var xa;
(function (e) {
  ((e.data = "data"),
    (e.deferred = "deferred"),
    (e.redirect = "redirect"),
    (e.error = "error"));
})(xa || (xa = {}));
function zp(e, t, n) {
  return (n === void 0 && (n = "/"), Op(e, t, n));
}
function Op(e, t, n, r) {
  let l = typeof t == "string" ? Nn(t) : t,
    i = os(l.pathname || "/", n);
  if (i == null) return null;
  let o = Bc(e);
  Ip(o);
  let s = null;
  for (let u = 0; s == null && u < o.length; ++u) {
    let c = bp(i);
    s = Vp(o[u], c);
  }
  return s;
}
function Bc(e, t, n, r) {
  (t === void 0 && (t = []),
    n === void 0 && (n = []),
    r === void 0 && (r = ""));
  let l = (i, o, s) => {
    let u = {
      relativePath: s === void 0 ? i.path || "" : s,
      caseSensitive: i.caseSensitive === !0,
      childrenIndex: o,
      route: i,
    };
    u.relativePath.startsWith("/") &&
      (Z(
        u.relativePath.startsWith(r),
        'Absolute route path "' +
          u.relativePath +
          '" nested under path ' +
          ('"' + r + '" is not valid. An absolute child route path ') +
          "must start with the combined path of all its parent routes.",
      ),
      (u.relativePath = u.relativePath.slice(r.length)));
    let c = St([r, u.relativePath]),
      h = n.concat(u);
    (i.children &&
      i.children.length > 0 &&
      (Z(
        i.index !== !0,
        "Index routes must not have child routes. Please remove " +
          ('all child routes from route path "' + c + '".'),
      ),
      Bc(i.children, t, h, c)),
      !(i.path == null && !i.index) &&
        t.push({ path: c, score: Bp(c, i.index), routesMeta: h }));
  };
  return (
    e.forEach((i, o) => {
      var s;
      if (i.path === "" || !((s = i.path) != null && s.includes("?"))) l(i, o);
      else for (let u of Wc(i.path)) l(i, o, u);
    }),
    t
  );
}
function Wc(e) {
  let t = e.split("/");
  if (t.length === 0) return [];
  let [n, ...r] = t,
    l = n.endsWith("?"),
    i = n.replace(/\?$/, "");
  if (r.length === 0) return l ? [i, ""] : [i];
  let o = Wc(r.join("/")),
    s = [];
  return (
    s.push(...o.map((u) => (u === "" ? i : [i, u].join("/")))),
    l && s.push(...o),
    s.map((u) => (e.startsWith("/") && u === "" ? "/" : u))
  );
}
function Ip(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : Wp(
          t.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex),
        ),
  );
}
const Dp = /^:[\w-]+$/,
  Mp = 3,
  Fp = 2,
  Up = 1,
  $p = 10,
  Ap = -2,
  wa = (e) => e === "*";
function Bp(e, t) {
  let n = e.split("/"),
    r = n.length;
  return (
    n.some(wa) && (r += Ap),
    t && (r += Fp),
    n
      .filter((l) => !wa(l))
      .reduce((l, i) => l + (Dp.test(i) ? Mp : i === "" ? Up : $p), r)
  );
}
function Wp(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, l) => r === t[l])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function Vp(e, t, n) {
  let { routesMeta: r } = e,
    l = {},
    i = "/",
    o = [];
  for (let s = 0; s < r.length; ++s) {
    let u = r[s],
      c = s === r.length - 1,
      h = i === "/" ? t : t.slice(i.length) || "/",
      p = Hp(
        { path: u.relativePath, caseSensitive: u.caseSensitive, end: c },
        h,
      ),
      v = u.route;
    if (!p) return null;
    (Object.assign(l, p.params),
      o.push({
        params: l,
        pathname: St([i, p.pathname]),
        pathnameBase: Xp(St([i, p.pathnameBase])),
        route: v,
      }),
      p.pathnameBase !== "/" && (i = St([i, p.pathnameBase])));
  }
  return o;
}
function Hp(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = Qp(e.path, e.caseSensitive, e.end),
    l = t.match(n);
  if (!l) return null;
  let i = l[0],
    o = i.replace(/(.)\/+$/, "$1"),
    s = l.slice(1);
  return {
    params: r.reduce((c, h, p) => {
      let { paramName: v, isOptional: k } = h;
      if (v === "*") {
        let w = s[p] || "";
        o = i.slice(0, i.length - w.length).replace(/(.)\/+$/, "$1");
      }
      const y = s[p];
      return (
        k && !y ? (c[v] = void 0) : (c[v] = (y || "").replace(/%2F/g, "/")),
        c
      );
    }, {}),
    pathname: i,
    pathnameBase: o,
    pattern: e,
  };
}
function Qp(e, t, n) {
  (t === void 0 && (t = !1),
    n === void 0 && (n = !0),
    Ac(
      e === "*" || !e.endsWith("*") || e.endsWith("/*"),
      'Route path "' +
        e +
        '" will be treated as if it were ' +
        ('"' + e.replace(/\*$/, "/*") + '" because the `*` character must ') +
        "always follow a `/` in the pattern. To get rid of this warning, " +
        ('please change the route path to "' + e.replace(/\*$/, "/*") + '".'),
    ));
  let r = [],
    l =
      "^" +
      e
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (o, s, u) => (
            r.push({ paramName: s, isOptional: u != null }),
            u ? "/?([^\\/]+)?" : "/([^\\/]+)"
          ),
        );
  return (
    e.endsWith("*")
      ? (r.push({ paramName: "*" }),
        (l += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : n
        ? (l += "\\/*$")
        : e !== "" && e !== "/" && (l += "(?:(?=\\/|$))"),
    [new RegExp(l, t ? void 0 : "i"), r]
  );
}
function bp(e) {
  try {
    return e
      .split("/")
      .map((t) => decodeURIComponent(t).replace(/\//g, "%2F"))
      .join("/");
  } catch (t) {
    return (
      Ac(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ("encoding (" + t + ")."),
      ),
      e
    );
  }
}
function os(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith("/") ? t.length - 1 : t.length,
    r = e.charAt(n);
  return r && r !== "/" ? null : e.slice(n) || "/";
}
function Kp(e, t) {
  t === void 0 && (t = "/");
  let {
    pathname: n,
    search: r = "",
    hash: l = "",
  } = typeof e == "string" ? Nn(e) : e;
  return {
    pathname: n ? (n.startsWith("/") ? n : Gp(n, t)) : t,
    search: Zp(r),
    hash: Jp(l),
  };
}
function Gp(e, t) {
  let n = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((l) => {
      l === ".." ? n.length > 1 && n.pop() : l !== "." && n.push(l);
    }),
    n.length > 1 ? n.join("/") : "/"
  );
}
function ci(e, t, n, r) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified " +
    ("`to." +
      t +
      "` field [" +
      JSON.stringify(r) +
      "].  Please separate it out to the ") +
    ("`to." + n + "` field. Alternatively you may provide the full path as ") +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function Yp(e) {
  return e.filter(
    (t, n) => n === 0 || (t.route.path && t.route.path.length > 0),
  );
}
function Vc(e, t) {
  let n = Yp(e);
  return t
    ? n.map((r, l) => (l === n.length - 1 ? r.pathname : r.pathnameBase))
    : n.map((r) => r.pathnameBase);
}
function Hc(e, t, n, r) {
  r === void 0 && (r = !1);
  let l;
  typeof e == "string"
    ? (l = Nn(e))
    : ((l = cr({}, e)),
      Z(
        !l.pathname || !l.pathname.includes("?"),
        ci("?", "pathname", "search", l),
      ),
      Z(
        !l.pathname || !l.pathname.includes("#"),
        ci("#", "pathname", "hash", l),
      ),
      Z(!l.search || !l.search.includes("#"), ci("#", "search", "hash", l)));
  let i = e === "" || l.pathname === "",
    o = i ? "/" : l.pathname,
    s;
  if (o == null) s = n;
  else {
    let p = t.length - 1;
    if (!r && o.startsWith("..")) {
      let v = o.split("/");
      for (; v[0] === ".."; ) (v.shift(), (p -= 1));
      l.pathname = v.join("/");
    }
    s = p >= 0 ? t[p] : "/";
  }
  let u = Kp(l, s),
    c = o && o !== "/" && o.endsWith("/"),
    h = (i || o === ".") && n.endsWith("/");
  return (!u.pathname.endsWith("/") && (c || h) && (u.pathname += "/"), u);
}
const St = (e) => e.join("/").replace(/\/\/+/g, "/"),
  Xp = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
  Zp = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e),
  Jp = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e);
function qp(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.internal == "boolean" &&
    "data" in e
  );
}
const Qc = ["post", "put", "patch", "delete"];
new Set(Qc);
const em = ["get", ...Qc];
new Set(em);
/**
 * React Router v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function dr() {
  return (
    (dr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    dr.apply(this, arguments)
  );
}
const ss = N.createContext(null),
  tm = N.createContext(null),
  Vt = N.createContext(null),
  Dl = N.createContext(null),
  Ht = N.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  bc = N.createContext(null);
function nm(e, t) {
  let { relative: n } = t === void 0 ? {} : t;
  vr() || Z(!1);
  let { basename: r, navigator: l } = N.useContext(Vt),
    { hash: i, pathname: o, search: s } = Gc(e, { relative: n }),
    u = o;
  return (
    r !== "/" && (u = o === "/" ? r : St([r, o])),
    l.createHref({ pathname: u, search: s, hash: i })
  );
}
function vr() {
  return N.useContext(Dl) != null;
}
function Ml() {
  return (vr() || Z(!1), N.useContext(Dl).location);
}
function Kc(e) {
  N.useContext(Vt).static || N.useLayoutEffect(e);
}
function rm() {
  let { isDataRoute: e } = N.useContext(Ht);
  return e ? gm() : lm();
}
function lm() {
  vr() || Z(!1);
  let e = N.useContext(ss),
    { basename: t, future: n, navigator: r } = N.useContext(Vt),
    { matches: l } = N.useContext(Ht),
    { pathname: i } = Ml(),
    o = JSON.stringify(Vc(l, n.v7_relativeSplatPath)),
    s = N.useRef(!1);
  return (
    Kc(() => {
      s.current = !0;
    }),
    N.useCallback(
      function (c, h) {
        if ((h === void 0 && (h = {}), !s.current)) return;
        if (typeof c == "number") {
          r.go(c);
          return;
        }
        let p = Hc(c, JSON.parse(o), i, h.relative === "path");
        (e == null &&
          t !== "/" &&
          (p.pathname = p.pathname === "/" ? t : St([t, p.pathname])),
          (h.replace ? r.replace : r.push)(p, h.state, h));
      },
      [t, r, o, i, e],
    )
  );
}
function Gc(e, t) {
  let { relative: n } = t === void 0 ? {} : t,
    { future: r } = N.useContext(Vt),
    { matches: l } = N.useContext(Ht),
    { pathname: i } = Ml(),
    o = JSON.stringify(Vc(l, r.v7_relativeSplatPath));
  return N.useMemo(() => Hc(e, JSON.parse(o), i, n === "path"), [e, o, i, n]);
}
function im(e, t) {
  return om(e, t);
}
function om(e, t, n, r) {
  vr() || Z(!1);
  let { navigator: l } = N.useContext(Vt),
    { matches: i } = N.useContext(Ht),
    o = i[i.length - 1],
    s = o ? o.params : {};
  o && o.pathname;
  let u = o ? o.pathnameBase : "/";
  o && o.route;
  let c = Ml(),
    h;
  if (t) {
    var p;
    let C = typeof t == "string" ? Nn(t) : t;
    (u === "/" || ((p = C.pathname) != null && p.startsWith(u)) || Z(!1),
      (h = C));
  } else h = c;
  let v = h.pathname || "/",
    k = v;
  if (u !== "/") {
    let C = u.replace(/^\//, "").split("/");
    k = "/" + v.replace(/^\//, "").split("/").slice(C.length).join("/");
  }
  let y = zp(e, { pathname: k }),
    w = dm(
      y &&
        y.map((C) =>
          Object.assign({}, C, {
            params: Object.assign({}, s, C.params),
            pathname: St([
              u,
              l.encodeLocation
                ? l.encodeLocation(C.pathname).pathname
                : C.pathname,
            ]),
            pathnameBase:
              C.pathnameBase === "/"
                ? u
                : St([
                    u,
                    l.encodeLocation
                      ? l.encodeLocation(C.pathnameBase).pathname
                      : C.pathnameBase,
                  ]),
          }),
        ),
      i,
      n,
      r,
    );
  return t && w
    ? N.createElement(
        Dl.Provider,
        {
          value: {
            location: dr(
              {
                pathname: "/",
                search: "",
                hash: "",
                state: null,
                key: "default",
              },
              h,
            ),
            navigationType: pt.Pop,
          },
        },
        w,
      )
    : w;
}
function sm() {
  let e = hm(),
    t = qp(e)
      ? e.status + " " + e.statusText
      : e instanceof Error
        ? e.message
        : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null,
    l = { padding: "0.5rem", backgroundColor: "rgba(200,200,200, 0.5)" };
  return N.createElement(
    N.Fragment,
    null,
    N.createElement("h2", null, "Unexpected Application Error!"),
    N.createElement("h3", { style: { fontStyle: "italic" } }, t),
    n ? N.createElement("pre", { style: l }, n) : null,
    null,
  );
}
const am = N.createElement(sm, null);
class um extends N.Component {
  constructor(t) {
    (super(t),
      (this.state = {
        location: t.location,
        revalidation: t.revalidation,
        error: t.error,
      }));
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  static getDerivedStateFromProps(t, n) {
    return n.location !== t.location ||
      (n.revalidation !== "idle" && t.revalidation === "idle")
      ? { error: t.error, location: t.location, revalidation: t.revalidation }
      : {
          error: t.error !== void 0 ? t.error : n.error,
          location: n.location,
          revalidation: t.revalidation || n.revalidation,
        };
  }
  componentDidCatch(t, n) {
    console.error(
      "React Router caught the following error during render",
      t,
      n,
    );
  }
  render() {
    return this.state.error !== void 0
      ? N.createElement(
          Ht.Provider,
          { value: this.props.routeContext },
          N.createElement(bc.Provider, {
            value: this.state.error,
            children: this.props.component,
          }),
        )
      : this.props.children;
  }
}
function cm(e) {
  let { routeContext: t, match: n, children: r } = e,
    l = N.useContext(ss);
  return (
    l &&
      l.static &&
      l.staticContext &&
      (n.route.errorElement || n.route.ErrorBoundary) &&
      (l.staticContext._deepestRenderedBoundaryId = n.route.id),
    N.createElement(Ht.Provider, { value: t }, r)
  );
}
function dm(e, t, n, r) {
  var l;
  if (
    (t === void 0 && (t = []),
    n === void 0 && (n = null),
    r === void 0 && (r = null),
    e == null)
  ) {
    var i;
    if (!n) return null;
    if (n.errors) e = n.matches;
    else if (
      (i = r) != null &&
      i.v7_partialHydration &&
      t.length === 0 &&
      !n.initialized &&
      n.matches.length > 0
    )
      e = n.matches;
    else return null;
  }
  let o = e,
    s = (l = n) == null ? void 0 : l.errors;
  if (s != null) {
    let h = o.findIndex(
      (p) => p.route.id && (s == null ? void 0 : s[p.route.id]) !== void 0,
    );
    (h >= 0 || Z(!1), (o = o.slice(0, Math.min(o.length, h + 1))));
  }
  let u = !1,
    c = -1;
  if (n && r && r.v7_partialHydration)
    for (let h = 0; h < o.length; h++) {
      let p = o[h];
      if (
        ((p.route.HydrateFallback || p.route.hydrateFallbackElement) && (c = h),
        p.route.id)
      ) {
        let { loaderData: v, errors: k } = n,
          y =
            p.route.loader &&
            v[p.route.id] === void 0 &&
            (!k || k[p.route.id] === void 0);
        if (p.route.lazy || y) {
          ((u = !0), c >= 0 ? (o = o.slice(0, c + 1)) : (o = [o[0]]));
          break;
        }
      }
    }
  return o.reduceRight((h, p, v) => {
    let k,
      y = !1,
      w = null,
      C = null;
    n &&
      ((k = s && p.route.id ? s[p.route.id] : void 0),
      (w = p.route.errorElement || am),
      u &&
        (c < 0 && v === 0
          ? (vm("route-fallback"), (y = !0), (C = null))
          : c === v &&
            ((y = !0), (C = p.route.hydrateFallbackElement || null))));
    let f = t.concat(o.slice(0, v + 1)),
      d = () => {
        let m;
        return (
          k
            ? (m = w)
            : y
              ? (m = C)
              : p.route.Component
                ? (m = N.createElement(p.route.Component, null))
                : p.route.element
                  ? (m = p.route.element)
                  : (m = h),
          N.createElement(cm, {
            match: p,
            routeContext: { outlet: h, matches: f, isDataRoute: n != null },
            children: m,
          })
        );
      };
    return n && (p.route.ErrorBoundary || p.route.errorElement || v === 0)
      ? N.createElement(um, {
          location: n.location,
          revalidation: n.revalidation,
          component: w,
          error: k,
          children: d(),
          routeContext: { outlet: null, matches: f, isDataRoute: !0 },
        })
      : d();
  }, null);
}
var Yc = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      e
    );
  })(Yc || {}),
  Xc = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseLoaderData = "useLoaderData"),
      (e.UseActionData = "useActionData"),
      (e.UseRouteError = "useRouteError"),
      (e.UseNavigation = "useNavigation"),
      (e.UseRouteLoaderData = "useRouteLoaderData"),
      (e.UseMatches = "useMatches"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      (e.UseRouteId = "useRouteId"),
      e
    );
  })(Xc || {});
function fm(e) {
  let t = N.useContext(ss);
  return (t || Z(!1), t);
}
function pm(e) {
  let t = N.useContext(tm);
  return (t || Z(!1), t);
}
function mm(e) {
  let t = N.useContext(Ht);
  return (t || Z(!1), t);
}
function Zc(e) {
  let t = mm(),
    n = t.matches[t.matches.length - 1];
  return (n.route.id || Z(!1), n.route.id);
}
function hm() {
  var e;
  let t = N.useContext(bc),
    n = pm(),
    r = Zc();
  return t !== void 0 ? t : (e = n.errors) == null ? void 0 : e[r];
}
function gm() {
  let { router: e } = fm(Yc.UseNavigateStable),
    t = Zc(Xc.UseNavigateStable),
    n = N.useRef(!1);
  return (
    Kc(() => {
      n.current = !0;
    }),
    N.useCallback(
      function (l, i) {
        (i === void 0 && (i = {}),
          n.current &&
            (typeof l == "number"
              ? e.navigate(l)
              : e.navigate(l, dr({ fromRouteId: t }, i))));
      },
      [e, t],
    )
  );
}
const ka = {};
function vm(e, t, n) {
  ka[e] || (ka[e] = !0);
}
function ym(e, t) {
  (e == null || e.v7_startTransition, e == null || e.v7_relativeSplatPath);
}
function so(e) {
  Z(!1);
}
function xm(e) {
  let {
    basename: t = "/",
    children: n = null,
    location: r,
    navigationType: l = pt.Pop,
    navigator: i,
    static: o = !1,
    future: s,
  } = e;
  vr() && Z(!1);
  let u = t.replace(/^\/*/, "/"),
    c = N.useMemo(
      () => ({
        basename: u,
        navigator: i,
        static: o,
        future: dr({ v7_relativeSplatPath: !1 }, s),
      }),
      [u, s, i, o],
    );
  typeof r == "string" && (r = Nn(r));
  let {
      pathname: h = "/",
      search: p = "",
      hash: v = "",
      state: k = null,
      key: y = "default",
    } = r,
    w = N.useMemo(() => {
      let C = os(h, u);
      return C == null
        ? null
        : {
            location: { pathname: C, search: p, hash: v, state: k, key: y },
            navigationType: l,
          };
    }, [u, h, p, v, k, y, l]);
  return w == null
    ? null
    : N.createElement(
        Vt.Provider,
        { value: c },
        N.createElement(Dl.Provider, { children: n, value: w }),
      );
}
function wm(e) {
  let { children: t, location: n } = e;
  return im(ao(t), n);
}
new Promise(() => {});
function ao(e, t) {
  t === void 0 && (t = []);
  let n = [];
  return (
    N.Children.forEach(e, (r, l) => {
      if (!N.isValidElement(r)) return;
      let i = [...t, l];
      if (r.type === N.Fragment) {
        n.push.apply(n, ao(r.props.children, i));
        return;
      }
      (r.type !== so && Z(!1), !r.props.index || !r.props.children || Z(!1));
      let o = {
        id: r.props.id || i.join("-"),
        caseSensitive: r.props.caseSensitive,
        element: r.props.element,
        Component: r.props.Component,
        index: r.props.index,
        path: r.props.path,
        loader: r.props.loader,
        action: r.props.action,
        errorElement: r.props.errorElement,
        ErrorBoundary: r.props.ErrorBoundary,
        hasErrorBoundary:
          r.props.ErrorBoundary != null || r.props.errorElement != null,
        shouldRevalidate: r.props.shouldRevalidate,
        handle: r.props.handle,
        lazy: r.props.lazy,
      };
      (r.props.children && (o.children = ao(r.props.children, i)), n.push(o));
    }),
    n
  );
}
/**
 * React Router DOM v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function uo() {
  return (
    (uo = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    uo.apply(this, arguments)
  );
}
function km(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    l,
    i;
  for (i = 0; i < r.length; i++)
    ((l = r[i]), !(t.indexOf(l) >= 0) && (n[l] = e[l]));
  return n;
}
function Sm(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function Em(e, t) {
  return e.button === 0 && (!t || t === "_self") && !Sm(e);
}
const Nm = [
    "onClick",
    "relative",
    "reloadDocument",
    "replace",
    "state",
    "target",
    "to",
    "preventScrollReset",
    "viewTransition",
  ],
  jm = "6";
try {
  window.__reactRouterVersion = jm;
} catch {}
const Cm = "startTransition",
  Sa = gd[Cm];
function Pm(e) {
  let { basename: t, children: n, future: r, window: l } = e,
    i = N.useRef();
  i.current == null && (i.current = Tp({ window: l, v5Compat: !0 }));
  let o = i.current,
    [s, u] = N.useState({ action: o.action, location: o.location }),
    { v7_startTransition: c } = r || {},
    h = N.useCallback(
      (p) => {
        c && Sa ? Sa(() => u(p)) : u(p);
      },
      [u, c],
    );
  return (
    N.useLayoutEffect(() => o.listen(h), [o, h]),
    N.useEffect(() => ym(r), [r]),
    N.createElement(xm, {
      basename: t,
      children: n,
      location: s.location,
      navigationType: s.action,
      navigator: o,
      future: r,
    })
  );
}
const _m =
    typeof window < "u" &&
    typeof window.document < "u" &&
    typeof window.document.createElement < "u",
  Tm = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Lm = N.forwardRef(function (t, n) {
    let {
        onClick: r,
        relative: l,
        reloadDocument: i,
        replace: o,
        state: s,
        target: u,
        to: c,
        preventScrollReset: h,
        viewTransition: p,
      } = t,
      v = km(t, Nm),
      { basename: k } = N.useContext(Vt),
      y,
      w = !1;
    if (typeof c == "string" && Tm.test(c) && ((y = c), _m))
      try {
        let m = new URL(window.location.href),
          x = c.startsWith("//") ? new URL(m.protocol + c) : new URL(c),
          j = os(x.pathname, k);
        x.origin === m.origin && j != null
          ? (c = j + x.search + x.hash)
          : (w = !0);
      } catch {}
    let C = nm(c, { relative: l }),
      f = Rm(c, {
        replace: o,
        state: s,
        target: u,
        preventScrollReset: h,
        relative: l,
        viewTransition: p,
      });
    function d(m) {
      (r && r(m), m.defaultPrevented || f(m));
    }
    return N.createElement(
      "a",
      uo({}, v, { href: y || C, onClick: w || i ? r : d, ref: n, target: u }),
    );
  });
var Ea;
(function (e) {
  ((e.UseScrollRestoration = "useScrollRestoration"),
    (e.UseSubmit = "useSubmit"),
    (e.UseSubmitFetcher = "useSubmitFetcher"),
    (e.UseFetcher = "useFetcher"),
    (e.useViewTransitionState = "useViewTransitionState"));
})(Ea || (Ea = {}));
var Na;
(function (e) {
  ((e.UseFetcher = "useFetcher"),
    (e.UseFetchers = "useFetchers"),
    (e.UseScrollRestoration = "useScrollRestoration"));
})(Na || (Na = {}));
function Rm(e, t) {
  let {
      target: n,
      replace: r,
      state: l,
      preventScrollReset: i,
      relative: o,
      viewTransition: s,
    } = t === void 0 ? {} : t,
    u = rm(),
    c = Ml(),
    h = Gc(e, { relative: o });
  return N.useCallback(
    (p) => {
      if (Em(p, n)) {
        p.preventDefault();
        let v = r !== void 0 ? r : yl(c) === yl(h);
        u(e, {
          replace: v,
          state: l,
          preventScrollReset: i,
          relative: o,
          viewTransition: s,
        });
      }
    },
    [c, u, h, r, l, n, e, i, o, s],
  );
}
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const zm = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  Jc = (...e) =>
    e
      .filter((t, n, r) => !!t && t.trim() !== "" && r.indexOf(t) === n)
      .join(" ")
      .trim();
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var Om = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Im = N.forwardRef(
  (
    {
      color: e = "currentColor",
      size: t = 24,
      strokeWidth: n = 2,
      absoluteStrokeWidth: r,
      className: l = "",
      children: i,
      iconNode: o,
      ...s
    },
    u,
  ) =>
    N.createElement(
      "svg",
      {
        ref: u,
        ...Om,
        width: t,
        height: t,
        stroke: e,
        strokeWidth: r ? (Number(n) * 24) / Number(t) : n,
        className: Jc("lucide", l),
        ...s,
      },
      [
        ...o.map(([c, h]) => N.createElement(c, h)),
        ...(Array.isArray(i) ? i : [i]),
      ],
    ),
);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ce = (e, t) => {
  const n = N.forwardRef(({ className: r, ...l }, i) =>
    N.createElement(Im, {
      ref: i,
      iconNode: t,
      className: Jc(`lucide-${zm(e)}`, r),
      ...l,
    }),
  );
  return ((n.displayName = `${e}`), n);
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ja = Ce("Archive", [
  [
    "rect",
    { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" },
  ],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
  ["path", { d: "M10 12h4", key: "a56b0p" }],
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Dm = Ce("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }],
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Mm = Ce("Brain", [
  [
    "path",
    {
      d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
      key: "l5xja",
    },
  ],
  [
    "path",
    {
      d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",
      key: "ep3f8r",
    },
  ],
  ["path", { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4", key: "1p4c4q" }],
  ["path", { d: "M17.599 6.5a3 3 0 0 0 .399-1.375", key: "tmeiqw" }],
  ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5", key: "105sqy" }],
  ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396", key: "ql3yin" }],
  ["path", { d: "M19.938 10.5a4 4 0 0 1 .585.396", key: "1qfode" }],
  ["path", { d: "M6 18a4 4 0 0 1-1.967-.516", key: "2e4loj" }],
  ["path", { d: "M19.967 17.484A4 4 0 0 1 18 18", key: "159ez6" }],
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Fm = Ce("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }],
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Um = Ce("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }],
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ca = Ce("CircleCheckBig", [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }],
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const co = Ce("Clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }],
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const $m = Ce("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }],
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Am = Ce("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }],
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Bm = Ce("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }],
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Wm = Ce("Users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }],
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Vm = Ce("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Hm = Ce("Zap", [
    [
      "path",
      {
        d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
        key: "1xq2db",
      },
    ],
  ]),
  Qm = "/api";
async function Be(e, t) {
  const n = await fetch(`${Qm}${e}`, {
    ...t,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(t == null ? void 0 : t.headers),
    },
  });
  if (!n.ok) {
    const r = await n.json().catch(() => ({ error: n.statusText }));
    throw new Error(r.error || `API Error: ${n.statusText}`);
  }
  return n.json();
}
const $ = {
    getMe: () => Be("/auth/me"),
    getTasks: (e) => {
      const t = new URLSearchParams();
      (e != null && e.status && t.append("status", e.status),
        e != null &&
          e.timeBlock &&
          e.timeBlock !== "all" &&
          t.append("timeBlock", e.timeBlock),
        e != null && e.limit && t.append("limit", e.limit.toString()));
      const n = t.toString();
      return Be(`/tasks${n ? `?${n}` : ""}`);
    },
    createTask: (e) =>
      Be("/tasks", { method: "POST", body: JSON.stringify(e) }),
    updateTask: (e, t) =>
      Be(`/tasks/${e}`, { method: "PUT", body: JSON.stringify(t) }),
    deleteTask: (e) => Be(`/tasks/${e}`, { method: "DELETE" }),
    completeTask: (e) => Be(`/tasks/${e}/complete`, { method: "PATCH" }),
    getPreferences: () => Be("/preferences"),
    updatePreferences: (e) =>
      Be("/preferences", { method: "PUT", body: JSON.stringify(e) }),
    getOverview: () => Be("/stats/overview"),
    getRecommendations: (e) => Be(`/stats/recommendations?method=${e}`),
  },
  Ke = {
    IS_DEMO: !1,
    STORAGE_TYPE: "database",
    AUTH_ENABLED: !0,
    DEMO_USER: { id: 1, email: "demo@taskpriority.app", name: "Demo User" },
  };
class bm {
  async getTasks() {
    return (await $.get("/tasks")).tasks;
  }
  async createTask(t) {
    return (await $.post("/tasks", t)).task;
  }
  async updateTask(t, n) {
    return (await $.put(`/tasks/${t}`, n)).task;
  }
  async deleteTask(t) {
    await $.delete(`/tasks/${t}`);
  }
  async completeTask(t) {
    return (await $.patch(`/tasks/${t}/complete`)).task;
  }
  async getCurrentUser() {
    return (await $.get("/auth/me")).user;
  }
  async getPreferences() {
    return (await $.get("/preferences")).preferences;
  }
  async updatePreferences(t) {
    return (await $.put("/preferences", t)).preferences;
  }
  async getOverviewStats() {
    return (await $.get("/stats/overview")).stats;
  }
}
const On = new bm(),
  Km = () => {
    const [e, t] = N.useState(!1),
      [n, r] = N.useState(!1);
    return null;
  },
  di = (e) => ((e.impact + e.confidence + e.ease) / 3).toFixed(1),
  fi = (e) => {
    const t = {
      do: {
        icon: "✅",
        label: "DO",
        color: "bg-green-100 text-green-800 border-green-300",
        description: "Làm ngay - High value, phù hợp với kỹ năng",
      },
      delegate: {
        icon: "👤",
        label: "DELEGATE",
        color: "bg-blue-100 text-blue-800 border-blue-300",
        description:
          "Giao cho người khác - Low skill requirement hoặc người khác làm tốt hơn",
      },
      delay: {
        icon: "⏸️",
        label: "DELAY",
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        description: "Hoãn lại - Quan trọng nhưng chưa cấp thiết",
      },
      delete: {
        icon: "🗑️",
        label: "DELETE",
        color: "bg-red-100 text-red-800 border-red-300",
        description: "Loại bỏ - Low impact, không cần thiết",
      },
    };
    return t[e] || t.do;
  },
  Gm = (e) => {
    const t = {
      deep: {
        icon: Mm,
        label: "Deep Work",
        color: "bg-indigo-100 text-indigo-800 border-indigo-300",
        description: "Cần tập trung cao, không bị gián đoạn",
        bestTime: "🌅 Sáng sớm / Sau giờ nghỉ trưa",
      },
      collaborative: {
        icon: Wm,
        label: "Collaborative",
        color: "bg-cyan-100 text-cyan-800 border-cyan-300",
        description: "Cần tương tác, feedback từ người khác",
        bestTime: "☀️ Giờ hành chính / Khi team online",
      },
      quick: {
        icon: Hm,
        label: "Quick Wins",
        color: "bg-amber-100 text-amber-800 border-amber-300",
        description: "Nhanh gọn, 5-30 phút",
        bestTime: "⚡ Khi chờ đợi / Giữa các task lớn",
      },
      systematic: {
        icon: co,
        label: "Systematic",
        color: "bg-rose-100 text-rose-800 border-rose-300",
        description: "Setup một lần, chạy tự động",
        bestTime: "🔧 Khi có thời gian yên tĩnh để setup",
      },
    };
    return t[e] || t.quick;
  },
  Ym = (e) => ((e.impact + e.confidence + e.ease) / 3).toFixed(1),
  Xm = (e, t = "hybrid") => {
    const n = parseFloat(Ym(e)),
      r = e.impact,
      l = e.ease,
      i = e.confidence,
      o = e.estimatedTime || 30;
    if (t === "simple")
      return n >= 7.5 && r >= 7
        ? { decision: "do", reason: "High value & achievable" }
        : r >= 7 && l <= 5
          ? { decision: "delegate", reason: "Important but difficult" }
          : r <= 5 && l >= 8
            ? {
                decision: "delegate",
                reason: "Easy task - delegate to free up time",
              }
            : r >= 6 && r < 8 && i <= 6
              ? { decision: "delay", reason: "Need more clarity" }
              : r <= 4
                ? { decision: "delete", reason: "Low impact" }
                : { decision: "do", reason: "Balanced task" };
    if (t === "weighted") {
      const s = r * 0.5 + i * 0.3 + l * 0.2;
      return s >= 8 && r >= 7
        ? { decision: "do", reason: `High weighted score (${s.toFixed(1)})` }
        : s >= 7 && l <= 4
          ? { decision: "delegate", reason: "Good score but too difficult" }
          : s >= 5 && s < 7 && i <= 5
            ? { decision: "delay", reason: "Medium score, low confidence" }
            : s < 5
              ? { decision: "delete", reason: `Low score (${s.toFixed(1)})` }
              : { decision: "do", reason: `Good score (${s.toFixed(1)})` };
    }
    if (t === "roi") {
      const s = 11 - l,
        u = r / s,
        c = r / (o / 60);
      return u >= 1.5 && c >= 5
        ? {
            decision: "do",
            reason: `High ROI (${u.toFixed(2)}) & time efficient`,
          }
        : u >= 1.5 && l <= 4
          ? {
              decision: "delegate",
              reason: `High ROI (${u.toFixed(2)}) but difficult`,
            }
          : u < 1 && l >= 7
            ? {
                decision: "delegate",
                reason: `Low ROI (${u.toFixed(2)}), waste of time`,
              }
            : u < 0.8
              ? { decision: "delete", reason: `Very low ROI (${u.toFixed(2)})` }
              : { decision: "delay", reason: `Medium ROI (${u.toFixed(2)})` };
    }
    if (t === "eisenhower") {
      const s = { quick: 3, collaborative: 2, deep: 0, systematic: -1 },
        u = 10 - i + (s[e.timeBlock] || 0),
        c = r;
      return c >= 7 && u >= 7
        ? { decision: "do", reason: "Important & Urgent (Do Now)" }
        : c >= 7 && u < 7 && l >= 6
          ? { decision: "do", reason: "Important, Not Urgent (Schedule)" }
          : c >= 7 && u < 7 && l < 6
            ? { decision: "delegate", reason: "Important but need help" }
            : c < 7 && u >= 7
              ? { decision: "delegate", reason: "Not Important but Urgent" }
              : { decision: "delete", reason: "Not Important, Not Urgent" };
    }
    if (t === "skill") {
      const s = l,
        u = (r * i) / 10;
      return u >= 6 && s >= 7
        ? { decision: "do", reason: "Perfect skill-value match" }
        : u >= 6 && s < 5
          ? { decision: "delegate", reason: "Valuable but not your strength" }
          : u < 4 && s >= 8
            ? { decision: "delegate", reason: "Too easy, waste your talent" }
            : u < 3
              ? { decision: "delete", reason: "Low value potential" }
              : { decision: "delay", reason: "Unclear skill-value fit" };
    }
    if (t === "energy") {
      const s = 11 - l + o / 30,
        c = (r * (i / 10)) / s;
      return c >= 1.5
        ? { decision: "do", reason: `Excellent energy ROI (${c.toFixed(2)})` }
        : c >= 0.8 && s <= 5
          ? { decision: "do", reason: "Good value, low energy" }
          : c >= 0.8 && s > 5
            ? { decision: "delegate", reason: "Good value but too draining" }
            : c < 0.5
              ? {
                  decision: "delete",
                  reason: `Poor energy ROI (${c.toFixed(2)})`,
                }
              : { decision: "delay", reason: "Medium energy efficiency" };
    }
    if (t === "strategic") {
      const u =
          ({
            revenue: 1.5,
            strategic: 1.3,
            growth: 1.2,
            operations: 1,
            personal: 0.8,
          }[e.type] || 1) * r,
        c = (i + l) / 2;
      return u >= 10 && c >= 6
        ? { decision: "do", reason: "Strategic priority & feasible" }
        : u >= 10 && c < 6
          ? { decision: "delegate", reason: "Strategic but need help" }
          : u < 6 && c >= 8
            ? { decision: "delegate", reason: "Low strategic value" }
            : u < 5
              ? { decision: "delete", reason: "Not aligned with strategy" }
              : { decision: "delay", reason: "Medium strategic fit" };
    }
    if (t === "hybrid") {
      const s = {
          revenue: 1.5,
          strategic: 1.3,
          growth: 1.2,
          operations: 1,
          personal: 0.8,
        },
        u = r * (i / 10),
        c = 11 - l + o / 30,
        h = u / c,
        p = s[e.type] || 1,
        v = h * 0.4 + u * 0.3 + p * 0.3;
      return v >= 3.5 && u >= 6
        ? { decision: "do", reason: `Excellent score (${v.toFixed(2)})` }
        : v >= 2.5 && c >= 8
          ? { decision: "delegate", reason: "Good value but too effortful" }
          : v >= 2.5 && u <= 5 && l >= 7
            ? { decision: "delegate", reason: "Easy but low value" }
            : i <= 5 && v < 3.5
              ? { decision: "delay", reason: "Uncertain, need more info" }
              : v < 2
                ? { decision: "delete", reason: `Low score (${v.toFixed(2)})` }
                : { decision: "do", reason: `Good score (${v.toFixed(2)})` };
    }
    return { decision: "do", reason: "Default" };
  },
  Zm = () => {
    const [e, t] = N.useState([]),
      [n, r] = N.useState(null),
      [l, i] = N.useState(null),
      [o, s] = N.useState(!0),
      [u, c] = N.useState(null),
      [h, p] = N.useState({
        name: "",
        impact: 5,
        confidence: 5,
        ease: 5,
        type: "operations",
        timeBlock: "quick",
        estimatedTime: 30,
        decision: "do",
        notes: "",
      }),
      [v, k] = N.useState("all"),
      [y, w] = N.useState("hybrid"),
      [C, f] = N.useState(new Set()),
      [d, m] = N.useState(""),
      [x, j] = N.useState("active");
    N.useEffect(() => {
      T();
    }, []);
    const T = async () => {
      try {
        if ((s(!0), !Ke.IS_DEMO)) {
          const [g, S, R] = await Promise.all([
            $.getMe(),
            $.getTasks({ status: x }),
            $.getOverview(),
          ]);
          (r(g), t(S), i(R));
        }
        c(null);
      } catch (g) {
        c(g instanceof Error ? g.message : "Failed to load data");
      } finally {
        s(!1);
      }
    };
    N.useEffect(() => {
      n && T();
    }, [x]);
    const L = async () => {
        if (h.name.trim())
          try {
            const g = Ke.IS_DEMO
              ? await On.createTask(h)
              : await $.createTask(h);
            (t([...e, g]),
              p({
                name: "",
                impact: 5,
                confidence: 5,
                ease: 5,
                type: "operations",
                timeBlock: "quick",
                estimatedTime: 30,
                decision: "do",
                notes: "",
              }));
            const S = Ke.IS_DEMO
              ? await On.getOverviewStats()
              : await $.getOverview();
            i(S);
          } catch (g) {
            c(g instanceof Error ? g.message : "Failed to create task");
          }
      },
      z = async (g) => {
        try {
          (Ke.IS_DEMO || (await $.deleteTask(g)),
            t(e.filter((R) => R.id !== g)));
          const S = Ke.IS_DEMO
            ? await On.getOverviewStats()
            : await $.getOverview();
          i(S);
        } catch (S) {
          c(S instanceof Error ? S.message : "Failed to delete task");
        }
      },
      F = async (g, S, R) => {
        try {
          const D = await $.updateTask(g, { [S]: R });
          if (
            (t(e.map((pe) => (pe.id === g ? D : pe))),
            ["decision", "timeBlock", "type", "estimatedTime"].includes(S))
          ) {
            const pe = await $.getOverview();
            i(pe);
          }
        } catch (D) {
          c(D instanceof Error ? D.message : "Failed to update task");
        }
      },
      O = (g) => {
        let S = g;
        if (d.trim()) {
          const R = d.toLowerCase();
          S = S.filter(
            (D) =>
              D.name.toLowerCase().includes(R) ||
              (D.notes && D.notes.toLowerCase().includes(R)) ||
              D.type.toLowerCase().includes(R) ||
              D.decision.toLowerCase().includes(R),
          );
        }
        return (v !== "all" && (S = S.filter((R) => R.timeBlock === v)), S);
      },
      xe = [...e].sort((g, S) => parseFloat(di(S)) - parseFloat(di(g))),
      lt = O(xe),
      _t = (g) =>
        l ? l.decisions[g] || { count: 0, time: 0 } : { count: 0, time: 0 },
      it = (g) =>
        l ? l.timeBlocks[g] || { count: 0, time: 0 } : { count: 0, time: 0 },
      Fl = (g) => {
        const S = new Set(C);
        (S.has(g) ? S.delete(g) : S.add(g), f(S));
      },
      Qt = async (g) => {
        try {
          (await $.completeTask(g),
            t(
              e.map((R) =>
                R.id === g
                  ? { ...R, status: "completed", completedAt: new Date() }
                  : R,
              ),
            ));
          const S = await $.getOverview();
          i(S);
        } catch (S) {
          c(S instanceof Error ? S.message : "Failed to complete task");
        }
      },
      bt = async (g) => {
        try {
          Ke.IS_DEMO ||
            (await $.updateTask(g, { status: "archived" }),
            t(e.map((R) => (R.id === g ? { ...R, status: "archived" } : R))));
          const S = Ke.IS_DEMO
            ? await On.getOverviewStats()
            : await $.getOverview();
          i(S);
        } catch (S) {
          c(S instanceof Error ? S.message : "Failed to archive task");
        }
      },
      P = async (g) => {
        try {
          Ke.IS_DEMO ||
            (await $.updateTask(g, { status: "active" }),
            t(
              e.map((R) =>
                R.id === g
                  ? { ...R, status: "active", completedAt: void 0 }
                  : R,
              ),
            ));
          const S = Ke.IS_DEMO
            ? await On.getOverviewStats()
            : await $.getOverview();
          i(S);
        } catch (S) {
          c(S instanceof Error ? S.message : "Failed to reactivate task");
        }
      };
    return o
      ? a.jsxs("div", {
          className: "w-full max-w-7xl mx-auto p-6 bg-gray-50",
          children: [
            a.jsx(Km, {}),
            a.jsx("div", {
              className: "bg-white rounded-lg shadow-lg p-6",
              children: a.jsxs("div", {
                className: "animate-pulse",
                children: [
                  a.jsx("div", {
                    className: "h-8 bg-gray-200 rounded w-1/3 mb-4",
                  }),
                  a.jsx("div", {
                    className: "h-4 bg-gray-200 rounded w-2/3 mb-6",
                  }),
                  a.jsx("div", {
                    className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                    children: [...Array(4)].map((g, S) =>
                      a.jsx(
                        "div",
                        { className: "h-20 bg-gray-200 rounded" },
                        S,
                      ),
                    ),
                  }),
                ],
              }),
            }),
          ],
        })
      : u
        ? a.jsx("div", {
            className: "w-full max-w-7xl mx-auto p-6 bg-gray-50",
            children: a.jsxs("div", {
              className: "bg-red-50 border border-red-200 rounded-lg p-6",
              children: [
                a.jsx("h2", {
                  className: "text-red-800 font-semibold mb-2",
                  children: "Error",
                }),
                a.jsx("p", { className: "text-red-600", children: u }),
                a.jsx("button", {
                  onClick: T,
                  className:
                    "mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
                  children: "Retry",
                }),
              ],
            }),
          })
        : a.jsxs("div", {
            className: "w-full max-w-7xl mx-auto p-6 bg-gray-50",
            children: [
              a.jsxs("div", {
                className: "bg-white rounded-lg shadow-lg p-6 mb-6",
                children: [
                  a.jsx("h1", {
                    className: "text-3xl font-bold text-gray-800 mb-2",
                    children: "Task Priority Framework",
                  }),
                  a.jsx("p", {
                    className: "text-gray-600 mb-4",
                    children:
                      "ICE Score + Time Blocking + 4D Decision Framework",
                  }),
                  n &&
                    a.jsxs("p", {
                      className: "text-sm text-gray-500 mb-4",
                      children: ["Welcome, ", n.name || n.email],
                    }),
                  a.jsxs("div", {
                    className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm",
                    children: [
                      a.jsxs("div", {
                        className: "bg-gray-50 p-3 rounded-lg",
                        children: [
                          a.jsx("span", {
                            className: "font-semibold text-gray-700",
                            children: "Impact:",
                          }),
                          a.jsx("p", {
                            className: "text-gray-600 text-xs mt-1",
                            children: "Tác động đến mục tiêu (1-10)",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        className: "bg-gray-50 p-3 rounded-lg",
                        children: [
                          a.jsx("span", {
                            className: "font-semibold text-gray-700",
                            children: "Confidence:",
                          }),
                          a.jsx("p", {
                            className: "text-gray-600 text-xs mt-1",
                            children: "Độ chắc chắn hoàn thành (1-10)",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        className: "bg-gray-50 p-3 rounded-lg",
                        children: [
                          a.jsx("span", {
                            className: "font-semibold text-gray-700",
                            children: "Ease:",
                          }),
                          a.jsx("p", {
                            className: "text-gray-600 text-xs mt-1",
                            children: "Độ dễ thực hiện (1-10)",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        className: "bg-gray-50 p-3 rounded-lg",
                        children: [
                          a.jsx("span", {
                            className: "font-semibold text-gray-700",
                            children: "ICE Score:",
                          }),
                          a.jsx("p", {
                            className: "text-gray-600 text-xs mt-1",
                            children: "Điểm ưu tiên = Trung bình 3 yếu tố",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              a.jsx("div", {
                className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6",
                children: ["do", "delegate", "delay", "delete"].map((g) => {
                  const S = fi(g),
                    R = _t(g);
                  return a.jsxs(
                    "div",
                    {
                      className: `${S.color} border-2 rounded-lg p-4`,
                      children: [
                        a.jsxs("div", {
                          className: "flex items-center justify-between mb-2",
                          children: [
                            a.jsxs("div", {
                              className: "flex items-center",
                              children: [
                                a.jsx("span", {
                                  className: "text-2xl mr-2",
                                  children: S.icon,
                                }),
                                a.jsx("span", {
                                  className: "font-bold",
                                  children: S.label,
                                }),
                              ],
                            }),
                            a.jsxs("span", {
                              className: "text-sm font-semibold",
                              children: [R.count, " tasks"],
                            }),
                          ],
                        }),
                        a.jsx("p", {
                          className: "text-xs mb-2",
                          children: S.description,
                        }),
                        a.jsxs("p", {
                          className: "text-xs mt-1 font-semibold",
                          children: ["⏱️ ", R.time, " phút"],
                        }),
                      ],
                    },
                    g,
                  );
                }),
              }),
              a.jsx("div", {
                className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6",
                children: ["deep", "collaborative", "quick", "systematic"].map(
                  (g) => {
                    const S = Gm(g),
                      R = it(g),
                      D = S.icon;
                    return a.jsxs(
                      "div",
                      {
                        className: `${S.color} border-2 rounded-lg p-4`,
                        children: [
                          a.jsxs("div", {
                            className: "flex items-center justify-between mb-2",
                            children: [
                              a.jsxs("div", {
                                className: "flex items-center",
                                children: [
                                  a.jsx(D, { size: 20, className: "mr-2" }),
                                  a.jsx("span", {
                                    className: "font-bold",
                                    children: S.label,
                                  }),
                                ],
                              }),
                              a.jsxs("span", {
                                className: "text-sm font-semibold",
                                children: [R.count, " tasks"],
                              }),
                            ],
                          }),
                          a.jsx("p", {
                            className: "text-xs mb-2",
                            children: S.description,
                          }),
                          a.jsx("p", {
                            className: "text-xs font-medium",
                            children: S.bestTime,
                          }),
                          a.jsxs("p", {
                            className: "text-xs mt-1 font-semibold",
                            children: ["⏱️ ", R.time, " phút"],
                          }),
                        ],
                      },
                      g,
                    );
                  },
                ),
              }),
              a.jsxs("div", {
                className: "bg-white rounded-lg shadow-lg p-6 mb-6",
                children: [
                  a.jsx("h2", {
                    className: "text-xl font-bold text-gray-800 mb-4",
                    children: "➕ Thêm Task Mới",
                  }),
                  a.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-7 gap-4 mb-4",
                    children: [
                      a.jsx("input", {
                        type: "text",
                        placeholder: "Tên công việc...",
                        value: h.name,
                        onChange: (g) => p({ ...h, name: g.target.value }),
                        className:
                          "col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
                        onKeyPress: (g) => g.key === "Enter" && L(),
                      }),
                      a.jsxs("div", {
                        children: [
                          a.jsx("label", {
                            className: "block text-xs text-gray-600 mb-1",
                            children: "Impact",
                          }),
                          a.jsx("input", {
                            type: "number",
                            min: "1",
                            max: "10",
                            value: h.impact,
                            onChange: (g) =>
                              p({
                                ...h,
                                impact: parseInt(g.target.value) || 1,
                              }),
                            className:
                              "w-full px-3 py-2 border border-gray-300 rounded-lg",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        children: [
                          a.jsx("label", {
                            className: "block text-xs text-gray-600 mb-1",
                            children: "Confidence",
                          }),
                          a.jsx("input", {
                            type: "number",
                            min: "1",
                            max: "10",
                            value: h.confidence,
                            onChange: (g) =>
                              p({
                                ...h,
                                confidence: parseInt(g.target.value) || 1,
                              }),
                            className:
                              "w-full px-3 py-2 border border-gray-300 rounded-lg",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        children: [
                          a.jsx("label", {
                            className: "block text-xs text-gray-600 mb-1",
                            children: "Ease",
                          }),
                          a.jsx("input", {
                            type: "number",
                            min: "1",
                            max: "10",
                            value: h.ease,
                            onChange: (g) =>
                              p({ ...h, ease: parseInt(g.target.value) || 1 }),
                            className:
                              "w-full px-3 py-2 border border-gray-300 rounded-lg",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        children: [
                          a.jsx("label", {
                            className: "block text-xs text-gray-600 mb-1",
                            children: "Type",
                          }),
                          a.jsxs("select", {
                            value: h.type,
                            onChange: (g) => p({ ...h, type: g.target.value }),
                            className:
                              "w-full px-3 py-2 border border-gray-300 rounded-lg",
                            children: [
                              a.jsx("option", {
                                value: "revenue",
                                children: "💰 Revenue",
                              }),
                              a.jsx("option", {
                                value: "growth",
                                children: "📈 Growth",
                              }),
                              a.jsx("option", {
                                value: "operations",
                                children: "🔧 Operations",
                              }),
                              a.jsx("option", {
                                value: "strategic",
                                children: "🎯 Strategic",
                              }),
                              a.jsx("option", {
                                value: "personal",
                                children: "✨ Personal",
                              }),
                            ],
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        children: [
                          a.jsx("label", {
                            className: "block text-xs text-gray-600 mb-1",
                            children: "Time Block",
                          }),
                          a.jsxs("select", {
                            value: h.timeBlock,
                            onChange: (g) =>
                              p({ ...h, timeBlock: g.target.value }),
                            className:
                              "w-full px-3 py-2 border border-gray-300 rounded-lg",
                            children: [
                              a.jsx("option", {
                                value: "deep",
                                children: "🧠 Deep Work",
                              }),
                              a.jsx("option", {
                                value: "collaborative",
                                children: "👥 Collaborative",
                              }),
                              a.jsx("option", {
                                value: "quick",
                                children: "⚡ Quick Wins",
                              }),
                              a.jsx("option", {
                                value: "systematic",
                                children: "🔧 Systematic",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  a.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",
                    children: [
                      a.jsxs("div", {
                        children: [
                          a.jsx("label", {
                            className: "block text-xs text-gray-600 mb-1",
                            children: "Estimated Time (phút)",
                          }),
                          a.jsx("input", {
                            type: "number",
                            min: "5",
                            value: h.estimatedTime,
                            onChange: (g) =>
                              p({
                                ...h,
                                estimatedTime: parseInt(g.target.value) || 5,
                              }),
                            className:
                              "w-full px-3 py-2 border border-gray-300 rounded-lg",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        children: [
                          a.jsx("label", {
                            className: "block text-xs text-gray-600 mb-1",
                            children: "Decision (4D Framework)",
                          }),
                          a.jsxs("select", {
                            value: h.decision,
                            onChange: (g) =>
                              p({ ...h, decision: g.target.value }),
                            className:
                              "w-full px-3 py-2 border border-gray-300 rounded-lg",
                            children: [
                              a.jsx("option", {
                                value: "do",
                                children: "✅ DO - Làm ngay",
                              }),
                              a.jsx("option", {
                                value: "delegate",
                                children: "👤 DELEGATE - Giao việc",
                              }),
                              a.jsx("option", {
                                value: "delay",
                                children: "⏸️ DELAY - Hoãn lại",
                              }),
                              a.jsx("option", {
                                value: "delete",
                                children: "🗑️ DELETE - Loại bỏ",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  a.jsxs("div", {
                    className: "mb-4",
                    children: [
                      a.jsx("label", {
                        className: "block text-xs text-gray-600 mb-1",
                        children: "Description / Notes",
                      }),
                      a.jsx("textarea", {
                        placeholder:
                          "Add detailed description, requirements, or notes about this task...",
                        value: h.notes || "",
                        onChange: (g) => p({ ...h, notes: g.target.value }),
                        className:
                          "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24 resize-none",
                      }),
                    ],
                  }),
                  a.jsxs("button", {
                    onClick: L,
                    className:
                      "w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition",
                    children: [
                      a.jsx($m, { className: "mr-2", size: 20 }),
                      "Thêm Task",
                    ],
                  }),
                ],
              }),
              a.jsx("div", {
                className: "bg-white rounded-lg shadow-lg p-4 mb-6",
                children: a.jsxs("div", {
                  className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                  children: [
                    a.jsxs("div", {
                      className: "relative",
                      children: [
                        a.jsx(Am, {
                          className:
                            "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",
                          size: 20,
                        }),
                        a.jsx("input", {
                          type: "text",
                          placeholder: "Search tasks, descriptions, types...",
                          value: d,
                          onChange: (g) => m(g.target.value),
                          className:
                            "w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                        }),
                        d &&
                          a.jsx("button", {
                            onClick: () => m(""),
                            className:
                              "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",
                            children: a.jsx(Vm, { size: 20 }),
                          }),
                      ],
                    }),
                    a.jsx("div", {
                      children: a.jsxs("select", {
                        value: x,
                        onChange: (g) => j(g.target.value),
                        className:
                          "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                        children: [
                          a.jsx("option", {
                            value: "active",
                            children: "📋 Active Tasks",
                          }),
                          a.jsx("option", {
                            value: "completed",
                            children: "✅ Completed Tasks",
                          }),
                          a.jsx("option", {
                            value: "archived",
                            children: "📦 Archived Tasks",
                          }),
                        ],
                      }),
                    }),
                    a.jsx("div", {
                      className:
                        "flex items-center justify-center bg-gray-50 rounded-lg px-4 py-3",
                      children: a.jsxs("span", {
                        className: "text-gray-600 font-medium",
                        children: [lt.length, " of ", e.length, " tasks"],
                      }),
                    }),
                  ],
                }),
              }),
              a.jsxs("div", {
                className: "bg-white rounded-t-lg shadow-lg",
                children: [
                  a.jsxs("div", {
                    className:
                      "p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-200",
                    children: [
                      a.jsx("label", {
                        className: "block text-sm font-bold text-gray-800 mb-2",
                        children:
                          "🤖 AI Recommendation Method (chọn để xem sự thay đổi ngay bên dưới):",
                      }),
                      a.jsxs("select", {
                        value: y,
                        onChange: (g) => w(g.target.value),
                        className:
                          "w-full px-4 py-3 border-2 border-purple-300 rounded-lg font-semibold text-base focus:ring-2 focus:ring-purple-500 bg-white shadow-sm",
                        children: [
                          a.jsx("option", {
                            value: "simple",
                            children: "1️⃣ Simple ICE (Original)",
                          }),
                          a.jsx("option", {
                            value: "weighted",
                            children: "2️⃣ Weighted Score (Impact 50%)",
                          }),
                          a.jsx("option", {
                            value: "roi",
                            children: "3️⃣ ROI-Based (Time Efficiency)",
                          }),
                          a.jsx("option", {
                            value: "eisenhower",
                            children: "4️⃣ Eisenhower Enhanced (Urgency)",
                          }),
                          a.jsx("option", {
                            value: "skill",
                            children: "5️⃣ Skill Match (Talent Fit)",
                          }),
                          a.jsx("option", {
                            value: "energy",
                            children: "6️⃣ Energy-Aware (Sustainable)",
                          }),
                          a.jsx("option", {
                            value: "strategic",
                            children: "7️⃣ Strategic Alignment (Type-Based)",
                          }),
                          a.jsx("option", {
                            value: "hybrid",
                            children: "8️⃣ Hybrid Smart (Recommended) ⭐",
                          }),
                        ],
                      }),
                      a.jsxs("p", {
                        className: "text-xs text-gray-700 mt-2 font-medium",
                        children: [
                          y === "simple" &&
                            "📝 Basic method using ICE score and impact level",
                          y === "weighted" &&
                            "⚖️ Impact (50%) > Confidence (30%) > Ease (20%)",
                          y === "roi" &&
                            "📊 Considers ROI = Impact / Effort and time efficiency",
                          y === "eisenhower" &&
                            "📋 Classic Important/Urgent matrix with time blocks",
                          y === "skill" &&
                            "🎯 Matches your skills (ease) with value potential",
                          y === "energy" &&
                            "⚡ Optimizes for energy efficiency and burnout prevention",
                          y === "strategic" &&
                            "🎲 Prioritizes based on task type (Revenue > Strategic > Growth)",
                          y === "hybrid" &&
                            "🔮 Combines ROI (40%), Value (30%), Strategy (30%) - Most comprehensive",
                        ],
                      }),
                    ],
                  }),
                  a.jsxs("div", {
                    className: "flex border-b overflow-x-auto",
                    children: [
                      a.jsxs("button", {
                        onClick: () => k("all"),
                        className: `px-6 py-3 font-semibold whitespace-nowrap ${v === "all" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`,
                        children: ["📋 All Tasks (", e.length, ")"],
                      }),
                      a.jsxs("button", {
                        onClick: () => k("deep"),
                        className: `px-6 py-3 font-semibold whitespace-nowrap ${v === "deep" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-600"}`,
                        children: ["🧠 Deep Work (", it("deep").count, ")"],
                      }),
                      a.jsxs("button", {
                        onClick: () => k("collaborative"),
                        className: `px-6 py-3 font-semibold whitespace-nowrap ${v === "collaborative" ? "border-b-2 border-cyan-500 text-cyan-600" : "text-gray-600"}`,
                        children: [
                          "👥 Collaborative (",
                          it("collaborative").count,
                          ")",
                        ],
                      }),
                      a.jsxs("button", {
                        onClick: () => k("quick"),
                        className: `px-6 py-3 font-semibold whitespace-nowrap ${v === "quick" ? "border-b-2 border-amber-500 text-amber-600" : "text-gray-600"}`,
                        children: ["⚡ Quick Wins (", it("quick").count, ")"],
                      }),
                      a.jsxs("button", {
                        onClick: () => k("systematic"),
                        className: `px-6 py-3 font-semibold whitespace-nowrap ${v === "systematic" ? "border-b-2 border-rose-500 text-rose-600" : "text-gray-600"}`,
                        children: [
                          "🔧 Systematic (",
                          it("systematic").count,
                          ")",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              a.jsx("div", {
                className: "bg-white rounded-b-lg shadow-lg overflow-hidden",
                children: a.jsx("div", {
                  className: "overflow-x-auto",
                  children: a.jsxs("table", {
                    className: "w-full",
                    children: [
                      a.jsx("thead", {
                        className: "bg-gray-100",
                        children: a.jsxs("tr", {
                          children: [
                            a.jsx("th", {
                              className:
                                "px-2 py-3 text-left text-sm font-semibold text-gray-700 w-8",
                            }),
                            a.jsx("th", {
                              className:
                                "px-4 py-3 text-left text-sm font-semibold text-gray-700",
                              children: "Priority",
                            }),
                            a.jsx("th", {
                              className:
                                "px-4 py-3 text-left text-sm font-semibold text-gray-700",
                              children: "Task",
                            }),
                            a.jsx("th", {
                              className:
                                "px-3 py-3 text-center text-sm font-semibold text-gray-700",
                              children: "ICE",
                            }),
                            a.jsx("th", {
                              className:
                                "px-4 py-3 text-left text-sm font-semibold text-gray-700",
                              children: "Decision",
                            }),
                            a.jsx("th", {
                              className:
                                "px-4 py-3 text-left text-sm font-semibold text-gray-700",
                              children: "AI Suggest",
                            }),
                            a.jsx("th", {
                              className:
                                "px-4 py-3 text-center text-sm font-semibold text-gray-700",
                              children: "Actions",
                            }),
                          ],
                        }),
                      }),
                      a.jsx("tbody", {
                        children: lt.map((g, S) => {
                          const R = di(g),
                            D = fi(g.decision),
                            pe = Xm(g, y),
                            be =
                              parseFloat(R) >= 8
                                ? "bg-green-500"
                                : parseFloat(R) >= 6
                                  ? "bg-yellow-500"
                                  : "bg-gray-400",
                            Kt = C.has(g.id);
                          return a.jsxs(a.Fragment, {
                            children: [
                              a.jsxs(
                                "tr",
                                {
                                  className:
                                    "border-t border-gray-200 hover:bg-gray-50",
                                  children: [
                                    a.jsx("td", {
                                      className: "px-2 py-3",
                                      children: a.jsx("button", {
                                        onClick: () => Fl(g.id),
                                        className:
                                          "text-gray-400 hover:text-gray-600 transition",
                                        children: Kt
                                          ? a.jsx(Fm, { size: 16 })
                                          : a.jsx(Um, { size: 16 }),
                                      }),
                                    }),
                                    a.jsx("td", {
                                      className: "px-4 py-3",
                                      children: a.jsxs("span", {
                                        className: `${be} text-white font-bold px-3 py-1 rounded-full text-sm whitespace-nowrap`,
                                        children: ["#", S + 1],
                                      }),
                                    }),
                                    a.jsx("td", {
                                      className: "px-4 py-3",
                                      children: a.jsxs("div", {
                                        className: "max-w-md",
                                        children: [
                                          a.jsxs("div", {
                                            className:
                                              "flex items-center gap-2 mb-2",
                                            children: [
                                              a.jsx("input", {
                                                type: "text",
                                                value: g.name,
                                                onChange: (B) =>
                                                  F(
                                                    g.id,
                                                    "name",
                                                    B.target.value,
                                                  ),
                                                className: `flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium ${g.status === "completed" ? "line-through text-gray-500" : ""}`,
                                              }),
                                              a.jsxs("span", {
                                                className: `px-2 py-1 rounded-full text-xs font-medium ${g.status === "completed" ? "bg-green-100 text-green-800" : g.status === "archived" ? "bg-gray-100 text-gray-800" : "bg-blue-100 text-blue-800"}`,
                                                children: [
                                                  g.status === "completed" &&
                                                    "✅",
                                                  g.status === "archived" &&
                                                    "📦",
                                                  g.status === "active" && "📋",
                                                ],
                                              }),
                                            ],
                                          }),
                                          g.notes &&
                                            a.jsx("p", {
                                              className:
                                                "text-sm text-gray-600 mt-1 line-clamp-2",
                                              children: g.notes,
                                            }),
                                          g.completedAt &&
                                            a.jsxs("p", {
                                              className:
                                                "text-xs text-green-600 mt-1",
                                              children: [
                                                "Completed: ",
                                                new Date(
                                                  g.completedAt,
                                                ).toLocaleDateString(),
                                              ],
                                            }),
                                        ],
                                      }),
                                    }),
                                    a.jsx("td", {
                                      className: "px-3 py-3 text-center",
                                      children: a.jsxs("div", {
                                        className: "flex flex-col items-center",
                                        children: [
                                          a.jsx("span", {
                                            className:
                                              "text-2xl font-bold text-gray-800",
                                            children: R,
                                          }),
                                          a.jsxs("div", {
                                            className:
                                              "flex gap-1 text-xs text-gray-500",
                                            children: [
                                              a.jsx("span", {
                                                children: g.impact,
                                              }),
                                              a.jsx("span", {
                                                children: g.confidence,
                                              }),
                                              a.jsx("span", {
                                                children: g.ease,
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    }),
                                    a.jsx("td", {
                                      className: "px-4 py-3",
                                      children: a.jsxs("select", {
                                        value: g.decision,
                                        onChange: (B) =>
                                          F(g.id, "decision", B.target.value),
                                        className: `${D.color} border px-3 py-2 rounded-lg text-sm font-medium w-full`,
                                        children: [
                                          a.jsx("option", {
                                            value: "do",
                                            children: "✅ DO",
                                          }),
                                          a.jsx("option", {
                                            value: "delegate",
                                            children: "👤 DELEGATE",
                                          }),
                                          a.jsx("option", {
                                            value: "delay",
                                            children: "⏸️ DELAY",
                                          }),
                                          a.jsx("option", {
                                            value: "delete",
                                            children: "🗑️ DELETE",
                                          }),
                                        ],
                                      }),
                                    }),
                                    a.jsx("td", {
                                      className: "px-4 py-3",
                                      children: a.jsxs("div", {
                                        className: "text-sm max-w-xs",
                                        children: [
                                          a.jsxs("div", {
                                            className:
                                              "font-semibold text-gray-700 mb-1",
                                            children: [
                                              fi(pe.decision).icon,
                                              " ",
                                              pe.decision.toUpperCase(),
                                            ],
                                          }),
                                          a.jsx("div", {
                                            className:
                                              "text-gray-600 text-xs line-clamp-2",
                                            children: pe.reason,
                                          }),
                                        ],
                                      }),
                                    }),
                                    a.jsx("td", {
                                      className: "px-4 py-3 text-center",
                                      children: a.jsxs("div", {
                                        className:
                                          "flex items-center justify-center gap-2",
                                        children: [
                                          g.status === "active" &&
                                            a.jsxs(a.Fragment, {
                                              children: [
                                                a.jsx("button", {
                                                  onClick: () => Qt(g.id),
                                                  className:
                                                    "text-green-600 hover:text-green-700 transition p-2 rounded-lg hover:bg-green-50",
                                                  title: "Mark as completed",
                                                  children: a.jsx(Ca, {
                                                    size: 18,
                                                  }),
                                                }),
                                                a.jsx("button", {
                                                  onClick: () => bt(g.id),
                                                  className:
                                                    "text-gray-600 hover:text-gray-700 transition p-2 rounded-lg hover:bg-gray-50",
                                                  title: "Archive task",
                                                  children: a.jsx(ja, {
                                                    size: 18,
                                                  }),
                                                }),
                                              ],
                                            }),
                                          (g.status === "completed" ||
                                            g.status === "archived") &&
                                            a.jsx("button", {
                                              onClick: () => P(g.id),
                                              className:
                                                "text-blue-600 hover:text-blue-700 transition p-2 rounded-lg hover:bg-blue-50",
                                              title: "Reactivate task",
                                              children: a.jsx(co, { size: 18 }),
                                            }),
                                          a.jsx("button", {
                                            onClick: () => z(g.id),
                                            className:
                                              "text-red-500 hover:text-red-700 transition p-2 rounded-lg hover:bg-red-50",
                                            title: "Delete task permanently",
                                            children: a.jsx(Bm, { size: 18 }),
                                          }),
                                        ],
                                      }),
                                    }),
                                  ],
                                },
                                g.id,
                              ),
                              Kt &&
                                a.jsx("tr", {
                                  className:
                                    "bg-gray-50 border-t border-gray-100",
                                  children: a.jsx("td", {
                                    colSpan: 7,
                                    className: "px-6 py-4",
                                    children: a.jsxs("div", {
                                      className:
                                        "grid grid-cols-1 md:grid-cols-4 gap-6",
                                      children: [
                                        a.jsxs("div", {
                                          className: "space-y-4",
                                          children: [
                                            a.jsx("h4", {
                                              className:
                                                "font-semibold text-gray-800 mb-3",
                                              children: "📊 Status Management",
                                            }),
                                            a.jsxs("div", {
                                              className: "space-y-3",
                                              children: [
                                                a.jsxs("div", {
                                                  children: [
                                                    a.jsx("label", {
                                                      className:
                                                        "block text-xs font-medium text-gray-600 mb-2",
                                                      children:
                                                        "Current Status",
                                                    }),
                                                    a.jsxs("div", {
                                                      className: `p-3 rounded-lg border-2 ${g.status === "completed" ? "bg-green-50 border-green-200" : g.status === "archived" ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"}`,
                                                      children: [
                                                        a.jsxs("span", {
                                                          className:
                                                            "font-medium",
                                                          children: [
                                                            g.status ===
                                                              "completed" &&
                                                              "✅ Completed",
                                                            g.status ===
                                                              "archived" &&
                                                              "📦 Archived",
                                                            g.status ===
                                                              "active" &&
                                                              "📋 Active",
                                                          ],
                                                        }),
                                                        g.completedAt &&
                                                          a.jsx("p", {
                                                            className:
                                                              "text-xs text-gray-600 mt-1",
                                                            children: new Date(
                                                              g.completedAt,
                                                            ).toLocaleString(),
                                                          }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                                a.jsxs("div", {
                                                  className:
                                                    "grid grid-cols-1 gap-2",
                                                  children: [
                                                    g.status === "active" &&
                                                      a.jsxs(a.Fragment, {
                                                        children: [
                                                          a.jsxs("button", {
                                                            onClick: () =>
                                                              Qt(g.id),
                                                            className:
                                                              "flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm",
                                                            children: [
                                                              a.jsx(Ca, {
                                                                size: 16,
                                                              }),
                                                              "Mark Complete",
                                                            ],
                                                          }),
                                                          a.jsxs("button", {
                                                            onClick: () =>
                                                              bt(g.id),
                                                            className:
                                                              "flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm",
                                                            children: [
                                                              a.jsx(ja, {
                                                                size: 16,
                                                              }),
                                                              "Archive",
                                                            ],
                                                          }),
                                                        ],
                                                      }),
                                                    (g.status === "completed" ||
                                                      g.status ===
                                                        "archived") &&
                                                      a.jsxs("button", {
                                                        onClick: () => P(g.id),
                                                        className:
                                                          "flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm",
                                                        children: [
                                                          a.jsx(co, {
                                                            size: 16,
                                                          }),
                                                          "Reactivate",
                                                        ],
                                                      }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        a.jsxs("div", {
                                          className: "space-y-4",
                                          children: [
                                            a.jsx("h4", {
                                              className:
                                                "font-semibold text-gray-800 mb-3",
                                              children: "🎯 ICE Scoring",
                                            }),
                                            a.jsxs("div", {
                                              className: "space-y-3",
                                              children: [
                                                a.jsxs("div", {
                                                  children: [
                                                    a.jsx("label", {
                                                      className:
                                                        "block text-xs font-medium text-gray-600 mb-1",
                                                      children: "Impact (1-10)",
                                                    }),
                                                    a.jsx("input", {
                                                      type: "number",
                                                      min: "1",
                                                      max: "10",
                                                      value: g.impact,
                                                      onChange: (B) =>
                                                        F(
                                                          g.id,
                                                          "impact",
                                                          parseInt(
                                                            B.target.value,
                                                          ) || 1,
                                                        ),
                                                      className:
                                                        "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500",
                                                    }),
                                                  ],
                                                }),
                                                a.jsxs("div", {
                                                  children: [
                                                    a.jsx("label", {
                                                      className:
                                                        "block text-xs font-medium text-gray-600 mb-1",
                                                      children:
                                                        "Confidence (1-10)",
                                                    }),
                                                    a.jsx("input", {
                                                      type: "number",
                                                      min: "1",
                                                      max: "10",
                                                      value: g.confidence,
                                                      onChange: (B) =>
                                                        F(
                                                          g.id,
                                                          "confidence",
                                                          parseInt(
                                                            B.target.value,
                                                          ) || 1,
                                                        ),
                                                      className:
                                                        "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500",
                                                    }),
                                                  ],
                                                }),
                                                a.jsxs("div", {
                                                  children: [
                                                    a.jsx("label", {
                                                      className:
                                                        "block text-xs font-medium text-gray-600 mb-1",
                                                      children: "Ease (1-10)",
                                                    }),
                                                    a.jsx("input", {
                                                      type: "number",
                                                      min: "1",
                                                      max: "10",
                                                      value: g.ease,
                                                      onChange: (B) =>
                                                        F(
                                                          g.id,
                                                          "ease",
                                                          parseInt(
                                                            B.target.value,
                                                          ) || 1,
                                                        ),
                                                      className:
                                                        "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500",
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        a.jsxs("div", {
                                          className: "space-y-4",
                                          children: [
                                            a.jsx("h4", {
                                              className:
                                                "font-semibold text-gray-800 mb-3",
                                              children: "📊 Categorization",
                                            }),
                                            a.jsxs("div", {
                                              className: "space-y-3",
                                              children: [
                                                a.jsxs("div", {
                                                  children: [
                                                    a.jsx("label", {
                                                      className:
                                                        "block text-xs font-medium text-gray-600 mb-1",
                                                      children: "Type",
                                                    }),
                                                    a.jsxs("select", {
                                                      value: g.type,
                                                      onChange: (B) =>
                                                        F(
                                                          g.id,
                                                          "type",
                                                          B.target.value,
                                                        ),
                                                      className:
                                                        "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500",
                                                      children: [
                                                        a.jsx("option", {
                                                          value: "revenue",
                                                          children:
                                                            "💰 Revenue",
                                                        }),
                                                        a.jsx("option", {
                                                          value: "growth",
                                                          children: "📈 Growth",
                                                        }),
                                                        a.jsx("option", {
                                                          value: "operations",
                                                          children:
                                                            "🔧 Operations",
                                                        }),
                                                        a.jsx("option", {
                                                          value: "strategic",
                                                          children:
                                                            "🎯 Strategic",
                                                        }),
                                                        a.jsx("option", {
                                                          value: "personal",
                                                          children:
                                                            "✨ Personal",
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                                a.jsxs("div", {
                                                  children: [
                                                    a.jsx("label", {
                                                      className:
                                                        "block text-xs font-medium text-gray-600 mb-1",
                                                      children: "Time Block",
                                                    }),
                                                    a.jsxs("select", {
                                                      value: g.timeBlock,
                                                      onChange: (B) =>
                                                        F(
                                                          g.id,
                                                          "timeBlock",
                                                          B.target.value,
                                                        ),
                                                      className:
                                                        "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500",
                                                      children: [
                                                        a.jsx("option", {
                                                          value: "deep",
                                                          children:
                                                            "🧠 Deep Work",
                                                        }),
                                                        a.jsx("option", {
                                                          value:
                                                            "collaborative",
                                                          children:
                                                            "👥 Collaborative",
                                                        }),
                                                        a.jsx("option", {
                                                          value: "quick",
                                                          children:
                                                            "⚡ Quick Wins",
                                                        }),
                                                        a.jsx("option", {
                                                          value: "systematic",
                                                          children:
                                                            "🔧 Systematic",
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                                a.jsxs("div", {
                                                  children: [
                                                    a.jsx("label", {
                                                      className:
                                                        "block text-xs font-medium text-gray-600 mb-1",
                                                      children:
                                                        "Estimated Time (minutes)",
                                                    }),
                                                    a.jsx("input", {
                                                      type: "number",
                                                      min: "5",
                                                      value: g.estimatedTime,
                                                      onChange: (B) =>
                                                        F(
                                                          g.id,
                                                          "estimatedTime",
                                                          parseInt(
                                                            B.target.value,
                                                          ) || 5,
                                                        ),
                                                      className:
                                                        "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500",
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        a.jsxs("div", {
                                          className: "space-y-4",
                                          children: [
                                            a.jsx("h4", {
                                              className:
                                                "font-semibold text-gray-800 mb-3",
                                              children: "📝 Description",
                                            }),
                                            a.jsxs("div", {
                                              children: [
                                                a.jsx("label", {
                                                  className:
                                                    "block text-xs font-medium text-gray-600 mb-1",
                                                  children: "Notes",
                                                }),
                                                a.jsx("textarea", {
                                                  value: g.notes || "",
                                                  onChange: (B) =>
                                                    F(
                                                      g.id,
                                                      "notes",
                                                      B.target.value,
                                                    ),
                                                  placeholder:
                                                    "Add detailed description, requirements, or notes...",
                                                  className:
                                                    "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 h-32 resize-none",
                                                }),
                                              ],
                                            }),
                                            a.jsxs("div", {
                                              className:
                                                "bg-blue-50 p-3 rounded-lg",
                                              children: [
                                                a.jsx("p", {
                                                  className:
                                                    "text-xs text-blue-700 font-medium mb-1",
                                                  children:
                                                    "AI Recommendation:",
                                                }),
                                                a.jsx("p", {
                                                  className:
                                                    "text-sm text-blue-800",
                                                  children: pe.reason,
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  }),
                                }),
                            ],
                          });
                        }),
                      }),
                    ],
                  }),
                }),
              }),
              a.jsxs("div", {
                className: "mt-6 bg-white rounded-lg shadow-lg p-6",
                children: [
                  a.jsx("h3", {
                    className: "text-lg font-bold text-gray-800 mb-3",
                    children: "💡 4D Decision Framework:",
                  }),
                  a.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
                    children: [
                      a.jsxs("div", {
                        className: "border-l-4 border-green-500 pl-4",
                        children: [
                          a.jsx("p", {
                            className: "font-semibold text-green-700",
                            children: "✅ DO - Làm ngay",
                          }),
                          a.jsx("p", {
                            className: "text-sm text-gray-600",
                            children:
                              "High ICE (≥7.5) + High Impact (≥7). Tasks này quan trọng và bạn có khả năng làm tốt.",
                          }),
                          a.jsx("p", {
                            className: "text-xs text-gray-500 mt-1",
                            children:
                              "Ví dụ: Core product development, strategic planning",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        className: "border-l-4 border-blue-500 pl-4",
                        children: [
                          a.jsx("p", {
                            className: "font-semibold text-blue-700",
                            children: "👤 DELEGATE - Giao việc",
                          }),
                          a.jsx("p", {
                            className: "text-sm text-gray-600",
                            children:
                              "High Impact nhưng Low Ease (khó với bạn) HOẶC Low Impact nhưng Easy (ai cũng làm được).",
                          }),
                          a.jsx("p", {
                            className: "text-xs text-gray-500 mt-1",
                            children:
                              "Ví dụ: Admin tasks, graphic design, data entry",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        className: "border-l-4 border-yellow-500 pl-4",
                        children: [
                          a.jsx("p", {
                            className: "font-semibold text-yellow-700",
                            children: "⏸️ DELAY - Hoãn lại",
                          }),
                          a.jsx("p", {
                            className: "text-sm text-gray-600",
                            children:
                              "Medium Impact + Low Confidence. Cần thêm thông tin hoặc chưa đến lúc phù hợp.",
                          }),
                          a.jsx("p", {
                            className: "text-xs text-gray-500 mt-1",
                            children:
                              "Ví dụ: Projects cần thêm research, tasks phụ thuộc vào điều kiện khác",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        className: "border-l-4 border-red-500 pl-4",
                        children: [
                          a.jsx("p", {
                            className: "font-semibold text-red-700",
                            children: "🗑️ DELETE - Loại bỏ",
                          }),
                          a.jsx("p", {
                            className: "text-sm text-gray-600",
                            children:
                              "Low Impact (≤4). Không đáng để dành thời gian, energy và attention.",
                          }),
                          a.jsx("p", {
                            className: "text-xs text-gray-500 mt-1",
                            children:
                              "Ví dụ: Nice-to-have features, vanity metrics, busy work",
                          }),
                        ],
                      }),
                    ],
                  }),
                  a.jsx("h3", {
                    className: "text-lg font-bold text-gray-800 mb-3 mt-6",
                    children: "🎯 Hướng Dẫn Sử Dụng Time Blocking:",
                  }),
                  a.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: [
                      a.jsxs("div", {
                        className: "border-l-4 border-indigo-500 pl-4",
                        children: [
                          a.jsx("p", {
                            className: "font-semibold text-indigo-700",
                            children: "🧠 Deep Work Tasks",
                          }),
                          a.jsx("p", {
                            className: "text-sm text-gray-600",
                            children:
                              "Schedule vào buổi sáng hoặc khung giờ bạn tập trung tốt nhất. Tắt thông báo, không multitask.",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        className: "border-l-4 border-cyan-500 pl-4",
                        children: [
                          a.jsx("p", {
                            className: "font-semibold text-cyan-700",
                            children: "👥 Collaborative Tasks",
                          }),
                          a.jsx("p", {
                            className: "text-sm text-gray-600",
                            children:
                              "Làm trong giờ hành chính khi team online. Chuẩn bị trước để meeting hiệu quả.",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        className: "border-l-4 border-amber-500 pl-4",
                        children: [
                          a.jsx("p", {
                            className: "font-semibold text-amber-700",
                            children: "⚡ Quick Wins",
                          }),
                          a.jsx("p", {
                            className: "text-sm text-gray-600",
                            children:
                              "Làm khi chờ đợi, giữa các task lớn, hoặc khi năng lượng thấp. Momentum tốt cho ngày mới.",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        className: "border-l-4 border-rose-500 pl-4",
                        children: [
                          a.jsx("p", {
                            className: "font-semibold text-rose-700",
                            children: "🔧 Systematic Tasks",
                          }),
                          a.jsx("p", {
                            className: "text-sm text-gray-600",
                            children:
                              "Đầu tư thời gian setup một lần, sau đó chạy tự động. Ưu tiên cao nếu tiết kiệm được nhiều thời gian.",
                          }),
                        ],
                      }),
                    ],
                  }),
                  a.jsxs("div", {
                    className:
                      "mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200",
                    children: [
                      a.jsxs("p", {
                        className: "text-sm text-blue-800 mb-2",
                        children: [
                          a.jsx("strong", { children: "💡 Pro Tip:" }),
                          ' Cột "AI Suggest" thay đổi theo method bạn chọn phía trên.',
                        ],
                      }),
                      a.jsxs("p", {
                        className: "text-xs text-blue-700",
                        children: [
                          a.jsx("strong", { children: "Khuyến nghị:" }),
                          " Thử các methods khác nhau để tìm cách tính phù hợp nhất với phong cách làm việc của bạn.",
                          a.jsx("strong", { children: "Hybrid Smart" }),
                          " là balanced nhất, ",
                          a.jsx("strong", { children: "ROI-Based" }),
                          " tốt cho efficiency,",
                          a.jsx("strong", { children: "Energy-Aware" }),
                          " tốt cho sustainable productivity, ",
                          a.jsx("strong", { children: "Strategic" }),
                          " tốt cho business owners.",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          });
  },
  Jm = () => {
    const [e, t] = N.useState(null),
      [n, r] = N.useState(null),
      [l, i] = N.useState(!0),
      [o, s] = N.useState(!1),
      [u, c] = N.useState(null),
      [h, p] = N.useState(null);
    N.useEffect(() => {
      v();
    }, []);
    const v = async () => {
        try {
          i(!0);
          const [y, w] = await Promise.all([$.getMe(), $.getPreferences()]);
          (t(y), r(w), c(null));
        } catch (y) {
          c(y instanceof Error ? y.message : "Failed to load data");
        } finally {
          i(!1);
        }
      },
      k = async (y) => {
        try {
          s(!0);
          const w = await $.updatePreferences(y);
          (r(w),
            p("Preferences updated successfully!"),
            c(null),
            setTimeout(() => p(null), 3e3));
        } catch (w) {
          c(w instanceof Error ? w.message : "Failed to update preferences");
        } finally {
          s(!1);
        }
      };
    return l
      ? a.jsx("div", {
          className: "w-full max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen",
          children: a.jsx("div", {
            className: "bg-white rounded-lg shadow-lg p-6",
            children: a.jsxs("div", {
              className: "animate-pulse",
              children: [
                a.jsx("div", {
                  className: "h-8 bg-gray-200 rounded w-1/3 mb-4",
                }),
                a.jsx("div", {
                  className: "h-4 bg-gray-200 rounded w-2/3 mb-6",
                }),
                a.jsx("div", {
                  className: "space-y-4",
                  children: [...Array(3)].map((y, w) =>
                    a.jsx("div", { className: "h-12 bg-gray-200 rounded" }, w),
                  ),
                }),
              ],
            }),
          }),
        })
      : a.jsx("div", {
          className: "w-full max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen",
          children: a.jsxs("div", {
            className: "bg-white rounded-lg shadow-lg p-6",
            children: [
              a.jsxs("div", {
                className: "flex items-center mb-6",
                children: [
                  a.jsx(Lm, {
                    to: "/",
                    className: "mr-4 text-blue-600 hover:text-blue-800",
                    children: a.jsx(Dm, { size: 24 }),
                  }),
                  a.jsx("h1", {
                    className: "text-3xl font-bold text-gray-800",
                    children: "Settings",
                  }),
                ],
              }),
              u &&
                a.jsx("div", {
                  className:
                    "bg-red-50 border border-red-200 rounded-lg p-4 mb-6",
                  children: a.jsx("p", {
                    className: "text-red-600",
                    children: u,
                  }),
                }),
              h &&
                a.jsx("div", {
                  className:
                    "bg-green-50 border border-green-200 rounded-lg p-4 mb-6",
                  children: a.jsx("p", {
                    className: "text-green-600",
                    children: h,
                  }),
                }),
              a.jsxs("div", {
                className: "mb-8",
                children: [
                  a.jsx("h2", {
                    className: "text-xl font-semibold text-gray-800 mb-4",
                    children: "User Information",
                  }),
                  a.jsxs("div", {
                    className: "bg-gray-50 rounded-lg p-4",
                    children: [
                      a.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                          a.jsxs("div", {
                            children: [
                              a.jsx("label", {
                                className:
                                  "block text-sm font-medium text-gray-700 mb-1",
                                children: "Email",
                              }),
                              a.jsx("p", {
                                className: "text-gray-900",
                                children: e == null ? void 0 : e.email,
                              }),
                            ],
                          }),
                          a.jsxs("div", {
                            children: [
                              a.jsx("label", {
                                className:
                                  "block text-sm font-medium text-gray-700 mb-1",
                                children: "Name",
                              }),
                              a.jsx("p", {
                                className: "text-gray-900",
                                children:
                                  (e == null ? void 0 : e.name) || "Not set",
                              }),
                            ],
                          }),
                        ],
                      }),
                      a.jsx("p", {
                        className: "text-xs text-gray-500 mt-4",
                        children:
                          "User information is managed by Cloudflare Access and cannot be changed here.",
                      }),
                    ],
                  }),
                ],
              }),
              a.jsxs("div", {
                className: "mb-8",
                children: [
                  a.jsx("h2", {
                    className: "text-xl font-semibold text-gray-800 mb-4",
                    children: "AI Recommendation Preferences",
                  }),
                  a.jsxs("div", {
                    className: "space-y-4",
                    children: [
                      a.jsxs("div", {
                        children: [
                          a.jsx("label", {
                            className:
                              "block text-sm font-medium text-gray-700 mb-2",
                            children: "Preferred AI Method",
                          }),
                          a.jsxs("select", {
                            value:
                              (n == null ? void 0 : n.preferredMethod) ||
                              "hybrid",
                            onChange: (y) =>
                              k({ preferredMethod: y.target.value }),
                            disabled: o,
                            className:
                              "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50",
                            children: [
                              a.jsx("option", {
                                value: "simple",
                                children: "1️⃣ Simple ICE (Original)",
                              }),
                              a.jsx("option", {
                                value: "weighted",
                                children: "2️⃣ Weighted Score (Impact 50%)",
                              }),
                              a.jsx("option", {
                                value: "roi",
                                children: "3️⃣ ROI-Based (Time Efficiency)",
                              }),
                              a.jsx("option", {
                                value: "eisenhower",
                                children: "4️⃣ Eisenhower Enhanced (Urgency)",
                              }),
                              a.jsx("option", {
                                value: "skill",
                                children: "5️⃣ Skill Match (Talent Fit)",
                              }),
                              a.jsx("option", {
                                value: "energy",
                                children: "6️⃣ Energy-Aware (Sustainable)",
                              }),
                              a.jsx("option", {
                                value: "strategic",
                                children: "7️⃣ Strategic Alignment (Type-Based)",
                              }),
                              a.jsx("option", {
                                value: "hybrid",
                                children: "8️⃣ Hybrid Smart (Recommended) ⭐",
                              }),
                            ],
                          }),
                          a.jsx("p", {
                            className: "text-xs text-gray-500 mt-1",
                            children:
                              "This will be the default method selected when you load the dashboard.",
                          }),
                        ],
                      }),
                      a.jsxs("div", {
                        children: [
                          a.jsx("label", {
                            className:
                              "block text-sm font-medium text-gray-700 mb-2",
                            children: "Default Time Block Filter",
                          }),
                          a.jsxs("select", {
                            value:
                              (n == null ? void 0 : n.defaultTimeBlock) ||
                              "all",
                            onChange: (y) =>
                              k({ defaultTimeBlock: y.target.value }),
                            disabled: o,
                            className:
                              "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50",
                            children: [
                              a.jsx("option", {
                                value: "all",
                                children: "📋 All Tasks",
                              }),
                              a.jsx("option", {
                                value: "deep",
                                children: "🧠 Deep Work",
                              }),
                              a.jsx("option", {
                                value: "collaborative",
                                children: "👥 Collaborative",
                              }),
                              a.jsx("option", {
                                value: "quick",
                                children: "⚡ Quick Wins",
                              }),
                              a.jsx("option", {
                                value: "systematic",
                                children: "🔧 Systematic",
                              }),
                            ],
                          }),
                          a.jsx("p", {
                            className: "text-xs text-gray-500 mt-1",
                            children:
                              "This will be the default tab selected when you load the dashboard.",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              a.jsxs("div", {
                className: "border-t border-gray-200 pt-6",
                children: [
                  a.jsx("h2", {
                    className: "text-xl font-semibold text-gray-800 mb-4",
                    children: "About",
                  }),
                  a.jsxs("div", {
                    className: "bg-blue-50 rounded-lg p-4",
                    children: [
                      a.jsx("h3", {
                        className: "font-semibold text-blue-900 mb-2",
                        children: "Task Priority Framework",
                      }),
                      a.jsx("p", {
                        className: "text-blue-800 text-sm mb-2",
                        children:
                          "A comprehensive task prioritization system combining ICE scoring, time blocking, and the 4D decision framework (DO, DELEGATE, DELAY, DELETE).",
                      }),
                      a.jsx("p", {
                        className: "text-blue-700 text-xs",
                        children:
                          "Powered by 8 different AI recommendation algorithms to help you make better decisions about your tasks and optimize your productivity.",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        });
  };
function qm() {
  return a.jsx(Pm, {
    children: a.jsxs(wm, {
      children: [
        a.jsx(so, { path: "/", element: a.jsx(Zm, {}) }),
        a.jsx(so, { path: "/settings", element: a.jsx(Jm, {}) }),
      ],
    }),
  });
}
pi.createRoot(document.getElementById("root")).render(
  a.jsx(Fa.StrictMode, { children: a.jsx(qm, {}) }),
);
