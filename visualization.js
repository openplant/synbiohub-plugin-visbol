const React = require("react");
const { render } = require("react-dom");
const RenderingMethod = require('visbol-react');
const { prepareDisplay } = require('visbol');
const Renderer = RenderingMethod.default;

// change non iterable obejct to iterable object, then can use spread operator
function* iterate_object(o) {
   var keys = Object.keys(o);
   for (var i = 0; i < keys.length; i++) {
      yield [keys[i], o[keys[i]]];
   }
}
const data = {};
for (var [key, val] of iterate_object(window.__INITIAL_DATA__)) {
   data[key] = val;
}

const display = prepareDisplay(data.displayList);

render(<Renderer display={display} />, document.getElementById("plugin-visual-visbol"));