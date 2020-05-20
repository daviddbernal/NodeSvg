function withoutSpace() {
  var newArr = [];
  for (var i = 0; i < arguments[0].length; i++) newArr.push("");
  for (var i = 0; i < arguments[0].length; i++)
    for (var x = 0; x < arguments[0][i].length; x++)
      if (!/[\n\r]/.test(arguments[0][i][x])) newArr[i] += arguments[0][i][x];
  return newArr;
}

function deleteComent() {
  var newArr = [];
  for (var i = 0; i < arguments[0].length; i++) newArr.push("");
  for (var i = 0; i < arguments[0].length; i++)
    for (var x = 0; x < arguments[0][i].length; x++) {
      if (arguments[0][i][x] === "/" && arguments[0][i][x + 1] === "/")
        x = arguments[0][i].length;
      else newArr[i] += arguments[0][i][x];
    }
  return newArr.filter((t) => t.length > 0);
}

module.exports.deleteComent = deleteComent;
module.exports.withoutSpace = withoutSpace;
