let hookValues = [];
let hookIndex = 0;
let rerender = () => {};

export function createElement(type, props, ...children) {
  return {
    type,
    props: props || {},
    children: children.flat(Infinity).filter((child) => child !== false && child !== true && child !== undefined),
  };
}

export function useState(initialValue) {
  const stateIndex = hookIndex;
  hookValues[stateIndex] ??= initialValue;

  function setState(nextValue) {
    hookValues[stateIndex] = typeof nextValue === 'function' ? nextValue(hookValues[stateIndex]) : nextValue;
    rerender();
  }

  hookIndex += 1;
  return [hookValues[stateIndex], setState];
}

export function useMemo(factory) {
  hookIndex += 1;
  return factory();
}

export function prepareRender(callback) {
  hookIndex = 0;
  rerender = callback;
}

const React = { createElement, useMemo, useState };
export default React;
