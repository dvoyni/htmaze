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
    var htmaze = window.htmaze;

    if (!htmaze) {
        window.htmaze = htmaze = { };
    }

    htmaze.html = function(source) {
        var elementsNode = document.querySelector("#workspace-html .elements"),
            codeNode = document.querySelector("#workspace-html .code");

        source.
            map(function(line) { return line.trim(); }).
            filter(function(line) { return line.length > 0; }).
            map(function(line) {
                return {
                    text: line,
                    id: "html-" + (htmaze.unique++),
                    isTag: line.indexOf("<") === 0 && line.indexOf(">") === line.length - 1,
                    isSolo: line.indexOf("/>") === line.length - 2,
                    isClosing: line.indexOf("</") === 0
                };
            }).
            sort(function(a, b) { return a.text < b.text; }).
            map(function(info) {
                var element = document.createElement("div");
                element.innerText = info.text;
                element.id = info.id;
                element.className = "element";
                element.setAttribute("data-is-tag", info.isTag);
                element.setAttribute("data-is-solo", info.isTag && info.isSolo);
                element.setAttribute("data-is-closing", info.isTag && info.isClosing);
                element.setAttribute("data-is-code", "false");
                element.setAttribute("data-type", "html");
                element.draggable = true;
                return element;
            }).
            map(function(element) {
                element.addEventListener("dragstart", function(event) {
                    event.dataTransfer.effectAllowed = "move";
                    element.style.marginLeft = "";
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
            if (htmaze.draggingElement.getAttribute("data-type") === "html") {
                event.preventDefault();
                codeNode.querySelector(".cursor").className = "cursor";
            }
        });

        elementsNode.addEventListener("drop", function(event) {
            if (htmaze.draggingElement.getAttribute("data-type") === "html") {
                event.preventDefault();
                elementsNode.appendChild(htmaze.draggingElement);
                htmaze.updateCodeSize(codeNode, elementsNode);
            }
        });

        codeNode.addEventListener("dragover", function(event) {
            if (htmaze.draggingElement.getAttribute("data-type") === "html") {
                event.preventDefault();
                codeNode.querySelector(".cursor").className += " visible";

                var offset = htmaze.getOffset(codeNode),
                    oy = htmaze.draggingElementOffsetY,
                    cursor = codeNode.querySelector(".cursor"),
                    elements = codeNode.querySelectorAll(".element"),
                    elementY = event.clientY - offset.top - oy,
                    refOffset, refElement, insertMode, i, e, top;

                for (i = elements.length - 1; i >= 0; i--) {
                    e = elements[i];
                    refOffset = htmaze.getOffset(e);
                    top = refOffset.top - offset.top;

                    if ((top <= elementY) && (elementY <= top + e.offsetHeight)) {
                        refElement = e;

                        if (elementY < (top + e.offsetHeight * 0.5)) {
                            insertMode = "before";
                            cursor.style.top = top + "px";
                            break;
                        }

                        cursor.style.top = (top + e.offsetHeight) + "px";
                        insertMode = "after";
                        break;
                    }
                }

                if (!refElement) {
                    e = codeNode.lastChild;
                    if (e === cursor) {
                        e = e.previousSibling;
                    }
                    if (e) {
                        cursor.style.top = e.offsetTop + e.offsetHeight + "px";
                    }
                    else {
                        cursor.style.top =
                            window.getComputedStyle(codeNode).getPropertyValue("padding-top");
                    }
                }

                htmaze.refElement = refElement;
                htmaze.insertMode = insertMode;
            }
        });

        codeNode.addEventListener("dragleave", function(event) {
            event.preventDefault();
        });

        codeNode.addEventListener("drop", function(event) {
            if (htmaze.draggingElement.getAttribute("data-type") === "html") {
                event.preventDefault();
                var element = htmaze.draggingElement,
                    refElement = htmaze.refElement,
                    insertMode = htmaze.insertMode;

                if (!refElement || !insertMode) {
                    codeNode.appendChild(element);
                }
                else {
                    if (insertMode === "before") {
                        refElement.parentNode.insertBefore(element, refElement);
                    }
                    else { //after
                        if (refElement.nextSibling) {
                            refElement.parentNode.insertBefore(element, refElement.nextSibling);
                        }
                        else {
                            refElement.parentNode.appendChild(element);
                        }
                    }
                }

                htmaze.validate();
                codeNode.querySelector(".cursor").className = "cursor";

                htmaze.updateCodeSize(codeNode, elementsNode);
            }
        });

        htmaze.updateCodeSize(codeNode, elementsNode);
    };

    htmaze.validateHTML = function() {
        var htmlCode = document.querySelector("#workspace-html .code"),
            preview = document.querySelector("#preview-results .area"),
            target = document.querySelector("#preview-target .area").innerHTML,
            lines = Array.prototype.slice.apply(htmlCode.children),
            compiled = lines.
                map(function(element) { return element.innerText; }).
                join(""),
            tab = 0;

        lines.forEach(function(line) {
            line.style.marginLeft = (tab * 30) + "px";

            if (line.getAttribute("data-is-tag") === "true") {
                if (line.getAttribute("data-is-closing") === "true") {
                    tab = Math.max(0, tab-1);
                    line.style.marginLeft = (tab * 30) + "px";
                }
                else if (line.getAttribute("data-is-solo") === "false") {
                    tab++;
                }
            }
        });

        preview.innerHTML = compiled;
        return compiled === target;
    };
}());
