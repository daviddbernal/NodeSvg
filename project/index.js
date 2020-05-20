const fs = require("fs");
const utils = require("./utils");

var search = {
  FontSize: /(FontSize)\s*([0-9]{1,})\s*([0-9]{1,})\s*/,
  Line: /(Line)\s+([0-9]{1,})\s+([0-9]{1,})\s+([0-9]{1,})\s+([0-9]{1,})\s+([0-9]+)\s+(rgba\(\s*[0-9]{1,3}\s*\,\s*[0-9]{1,3}\s*\,\s*[0-9]{1,3}\s*\,\s*[0-9]{1,3}\s*\)|[a-z]{1,})/,
  Circle: /(Circle)\s+([0-9]{1,})\s+([0-9]{1,})\s+([0-9]{1,})\s+([0-9]{1,})\s+(rgba\(\s*[0-9]{1,3}\s*\,\s*[0-9]{1,3}\s*\,\s*[0-9]{1,3}\s*\,\s*[0-9]{1,3}\s*\)|[a-z]{1,})\s+(rgba\(\s*[0-9]{1,3}\s*\,\s*[0-9]{1,3}\s*\,\s*[0-9]{1,3}\s*\,\s*[0-9]{1,3}\s*\)|[a-z]{1,})/,
};

fs.readFile("../src/code.red", "utf-8", (err, data) => {
  var code = utils.deleteComent(utils.withoutSpace(data.split(";")));
  readMyData(code);
});

const readMyData = (code) => {
  const firstStep = (code) => {
    var obj = {
      type: "compiler",
      body: [],
    };
    var names = Object.keys(search);
    var elem;
    for (var i = 0; i < code.length; i++) {
      for (var x = 0; x < names.length; x++)
        if (search[names[x]].test(code[i]))
          elem = code[i].match(search[names[x]]);
      switch (elem[1]) {
        case "FontSize":
          var FontSize = {
            tag: "svg",
            attr: [],
          };
          FontSize.attr.push({
            width: elem[2],
            height: elem[3],
          });
          obj.body.push(FontSize);
          break;
        case "Line":
          var Line = {
            tag: "line",
            attr: [],
          };
          Line.attr.push({
            x1: elem[2],
            y1: elem[3],
            x2: elem[4],
            y2: elem[5],
            Strokewidth: elem[6],
            stroke: elem[7],
          });
          obj.body.push(Line);
          break;
        case "Circle":
          var Circle = {
            tag: "circle",
            attr: [],
          };
          Circle.attr.push({
            cx: elem[2],
            cy: elem[3],
            r: elem[4],
            Strokewidth: elem[5],
            stroke: elem[6],
            fill: elem[7],
          });
          obj.body.push(Circle);
          break;
      }
    }
    return obj;
  };

  const createNode = (code) => {
    var T = {
      tags: [],
    };
    for (var i = 0; i < code.body.length; i++)
      switch (code.body[i].tag) {
        case "svg":
          var attrSvg = code.body[i].attr;
          T.svgBegin = `<svg height="${attrSvg[0].height}" width="${attrSvg[0].width}">`;
          T.svgEnd = "</svg>";
          break;
        case "line":
          var attrLine = code.body[i].attr;
          T.tags.push({
            line: `<line x1="${attrLine[0].x1}" y1="${attrLine[0].y1}" x2="${attrLine[0].x2}" y2="${attrLine[0].y2}" stroke="${attrLine[0].stroke}" stroke-width="${attrLine[0].Strokewidth}"/>`,
          });
          break;
        case "circle":
          var attrLine = code.body[i].attr;
          T.tags.push({
            circle: `<circle cx="${attrLine[0].cx}" cy="${attrLine[0].cy}" r="${attrLine[0].r}" fill="${attrLine[0].fill}" stroke="${attrLine[0].stroke}" stroke-width="${attrLine[0].Strokewidth}"/>`,
          });
          break;
      }
    return T;
  };

  const SVG = (code) => {
    var svg = "";
    svg += code.svgBegin;
    for (var i = 0; i < code.tags.length; i++) {
      var name = Object.keys(code.tags[i]);
      svg += code.tags[i][name[0]];
    }
    svg += code.svgEnd;
    return svg;
  };
  fs.appendFile(
    "../output/code.svg",
    SVG(createNode(firstStep(code))),
    (err) => {
      if (err) console.log("err" + err);
    }
  );
};
