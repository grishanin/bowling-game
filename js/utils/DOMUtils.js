import isArray from './isArray';

const DOMAttributeNames = {
  className: 'class'
}

function setAttributes(element, attrs) {
  for (var attrName in attrs) {
    if (attrs.hasOwnProperty(attrName)) {
      var attrValue = attrs[attrName]
      if (attrValue === undefined) {
        element.removeAttribute(attrName)
      } else {
        element.setAttribute(DOMAttributeNames[attrName] || attrName, attrValue)
      }
    }
  }
}

export const createElement = (obj) => {
  const element = document.createElement(obj.tagName);

  if (obj.children) {
    obj.children
    .filter(c => typeof c === 'object')
    .map(createElement)
    .forEach(c => element.appendChild(c))
    obj.children
    .filter(c => typeof c === 'string' || typeof c === 'number')
    .forEach(c => element.innerHTML += c);
  }

  setAttributes(element, obj.attributes);
  return element
}

export const h = (tagName, attributes, children) => {
  const skipAttributes = isArray(attributes) || typeof attributes !== 'object';
  return {
    tagName,
    attributes: skipAttributes ? null : attributes,
    children: skipAttributes ? attributes : children
  }
};

export const div = (children) => ({
  tagName: 'DIV',
  children
});

export const span = (children) => ({
  tagName: 'SPAN',
  children
});

// var tree = div([
//   span([
//     'Hello'
//   ])
// ]);

//console.log(createElement(tree));
