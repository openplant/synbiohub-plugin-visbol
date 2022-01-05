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

console.log("iterating over initial state");
const data = {};
for (var [key, val] of iterate_object(window.__INITIAL_STATE__)) {
   data[key] = val;
}

if (data.svg) {
   console.log("rendering svg");
   render(<Renderer svg={data.svg} width={data.width} height={data.height} />, document.getElementById("plugin-visual-visbol"));
}
else {
   console.log("preparing display");
   const display = prepareDisplay(data.displayList);

   console.log("rendering visbol");
   render(<Renderer display={display} />, document.getElementById("plugin-visual-visbol"));
}