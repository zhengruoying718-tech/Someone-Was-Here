import { prepareRender } from './react.js';

function setProps(element, props) {
  Object.entries(props || {}).forEach(([name, value]) => {
    if (name === 'children' || value === null || value === undefined) return;

    if (name === 'className') {
      element.setAttribute('class', value);
      return;
    }

    if (name === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
      return;
    }

    if (name.startsWith('on') && typeof value === 'function') {
      element.addEventListener(name.slice(2).toLowerCase(), value);
      return;
    }

    element.setAttribute(name, value);
  });
}

function toDom(node) {
  if (node === null || node === undefined) return document.createTextNode('');
  if (typeof node === 'string' || typeof node === 'number') return document.createTextNode(String(node));
  if (typeof node.type === 'function') return toDom(node.type({ ...node.props, children: node.children }));

  const svgTags = ['svg', 'circle', 'path'];
  const element = svgTags.includes(node.type)
    ? document.createElementNS('http://www.w3.org/2000/svg', node.type)
    : document.createElement(node.type);
  setProps(element, node.props);
  node.children.forEach((child) => element.append(toDom(child)));
  return element;
}

export function createRoot(container) {
  return {
    render(app) {
      const draw = () => {
        prepareRender(draw);
        container.replaceChildren(toDom(app));
      };
      draw();
    },
  };
}
