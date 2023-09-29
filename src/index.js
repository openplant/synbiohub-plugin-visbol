const React = require("react");
const { render } = require("react-dom");
const Renderer = require("visbol-react").default;
const { VisbolRenderer } = require("./VisbolRenderer.jsx");

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
  render(
    <Renderer svg={data.svg} width={data.width} height={data.height} />,
    document.getElementById("plugin-visual-visbol")
  );
} else {
  render(
    <VisbolRenderer
      display={data.display}
      visbolSequence={data.visbolSequence}
    />,
    document.getElementById("plugin-visual-visbol")
  );
}
// if (data.svg) {
//    render(<Renderer svg={data.svg} width={data.width} height={data.height} />, document.getElementById("plugin-visual-visbol"));
// }
// else {
//    render(<Renderer display={data.display} rendered={true} />, document.getElementById("plugin-visual-visbol"));
// }
