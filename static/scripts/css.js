/*
 * Copyright 2014 Sergey Dvoynikov
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

(function() {
    "use strict";
    var htmaze = window.htmaze,
        solvedCss = [],
        resultStyle = document.createElement("style");

    if (!htmaze) {
        window.htmaze = htmaze = { };
    }

    htmaze.css = function(source, args) {
        var elementsNode = document.querySelector("#workspace-css .elements"),
            codeNode = document.querySelector("#workspace-css .code"),
            taskStyle = document.createElement("style"),
            argIndex = 0;

        document.head.appendChild(taskStyle);
        document.head.appendChild(resultStyle);

        args.
            map(function(line) { return line.trim(); }).
            filter(function(line) { return line.length > 0; }).
            map(function(line) {
                return {
                    text: line,
                    id: "css-" + (htmaze.unique++)
                };
            }).
            sort(function(a, b) { return a.text < b.text; }).
            map(function(arg) {
                var element = document.createElement("div");
                element.textContent = arg.text;
                element.id = arg.id;
                element.className = "element";
                element.draggable = true;
                element.setAttribute("data-type", "css");
                return element;
            }).
            map(function(element) {
                element.addEventListener("dragstart", function(event) {
                    event.dataTransfer.effectAllowed = "move";
                    htmaze.draggingElement = element;
                    htmaze.draggingElementOffsetY = event.offsetY;
                });
                return element;
            }).
            map(function(element) {
                elementsNode.appendChild(element);
                return element;
            });

        elementsNode.addEventListener("dragover", function(event) {
            if (htmaze.draggingElement.getAttribute("data-type") === "css") {
                event.preventDefault();
            }
        });

        elementsNode.addEventListener("drop", function(event) {
            if (htmaze.draggingElement.getAttribute("data-type") === "css") {
                event.preventDefault();
                elementsNode.appendChild(htmaze.draggingElement);
                htmaze.updateCodeSize(codeNode, elementsNode);
                htmaze.validate();
            }
        });

        htmaze.updateCodeSize(codeNode, elementsNode);

        taskStyle.innerHTML = source.
            map(function(styleDef) {
                var line = styleDef.join("").replace(/\$\$/g, function() { return args[argIndex++]; });
                solvedCss.push(line);
                return "#preview-target .area " + line;
            }).
            join("\n");

        solvedCss.sort();

        source.forEach(function(styleDef) {
            var defElement = document.createElement("div");

            styleDef.forEach(function(styleLine) {
                var element = document.createElement("div"),
                    parts = styleLine.split("$$");

                element.className = "line";

                parts.forEach(function(part, index) {
                    var partElement = document.createElement("div");
                    partElement.className = "text";
                    partElement.innerHTML = part;
                    element.appendChild(partElement);

                    if (index !== parts.length - 1) {
                        partElement = document.createElement("div");
                        partElement.className = "argument";
                        element.appendChild(partElement);

                        partElement.addEventListener("dragover", function(event) {
                            if (htmaze.draggingElement.getAttribute("data-type") === "css") {
                                event.preventDefault();
                                partElement.className = "argument dragover";
                            }
                        });

                        partElement.addEventListener("dragleave", function(event) {
                            if (htmaze.draggingElement.getAttribute("data-type") === "css") {
                                event.preventDefault();
                                partElement.className = "argument";
                            }
                        });

                        partElement.addEventListener("drop", function(event) {
                            if (htmaze.draggingElement.getAttribute("data-type") === "css") {
                                var existing = partElement.querySelector(".element");
                                if (existing) {
                                    elementsNode.appendChild(existing);
                                }

                                event.preventDefault();
                                partElement.appendChild(htmaze.draggingElement);
                                partElement.className = "argument filled";
                                htmaze.updateCodeSize(codeNode, elementsNode);
                                htmaze.validate();
                            }
                        });
                    }
                });

                defElement.appendChild(element);
            });

            codeNode.appendChild(defElement);
        });
    };

    htmaze.validateCSS = function() {
        var codeNode = document.querySelector("#workspace-css .code"),
            result = [],
            resultCss = "", i;

        Array.prototype.slice.apply(codeNode.children).forEach(function(def) {
            resultCss += "#preview-results .area ";
            var resultLine = "";
            Array.prototype.slice.apply(def.children).forEach(function(line) {
                Array.prototype.slice.apply(line.children).forEach(function(element) {
                    var word;

                    if (element.className.indexOf("argument") !== -1) {
                        if (element.firstChild) {
                            word = element.firstChild.innerHTML;
                        }
                    }
                    else {
                        word = element.innerHTML;
                    }

                    resultLine += word;
                    resultCss += word;
                });
            });
            resultCss += "\n";
            result.push(resultLine);
        });

        resultStyle.innerHTML = resultCss;
        result.sort();

        if (result.length !== solvedCss.length) {
            return false;
        }
        for (i = 0; i < result.length; i++) {
            if (result[i] !== solvedCss[i]) {
                return false;
            }
        }
        return true;
    };
}());
