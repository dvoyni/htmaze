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
        window.htmaze = htmaze = {};
    }

    htmaze.unique = 0;

    function getOffset(element) {
        var ox = 0, oy = 0;

        while (element.offsetParent) {
            ox += element.offsetLeft;
            oy += element.offsetTop;
            element = element.offsetParent;
        }

        return { left: ox, top: oy };
    }

    htmaze.init = function(html, htmlArgs, css, cssArgs) {
        function initElements(source, elementType, elementsNode, codeNode) {
            source.
                map(function(line) { return line.trim(); }).
                filter(function(line) { return line.length > 0; }).
                map(function(line) {
                    return {
                        text: line,
                        id: elementType + "-" + (htmaze.unique++) ,
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
                    element.setAttribute("data-element-type", elementType);
                    element.setAttribute("data-is-code", "false");
                    element.draggable = true;
                    return element;
                }).
                map(function(element) {
                    element.addEventListener("dragstart", function(event) {
                        element.style.marginLeft = "";
                        var dt = event.dataTransfer;
                        dt.setData("id", event.target.id);
                        dt.setData("offsetX", event.offsetX);
                        dt.setData("offsetY", event.offsetY);
                        dt.effectAllowed = "move";
                    });

                    return element;
                }).
                map(function(element) {
                    elementsNode.appendChild(element);
                    return element;
                });

            elementsNode.addEventListener("dragover", function(event) {
                event.preventDefault();
                codeNode.querySelector(".cursor").className = "cursor";
            });

            elementsNode.addEventListener("drop", function(event) {
                event.preventDefault();
                var elementId = event.dataTransfer.getData("id");
                elementsNode.appendChild(document.getElementById(elementId));
            });

            codeNode.addEventListener("dragover", function(event) {
                event.preventDefault();
                codeNode.querySelector(".cursor").className += " visible";

                var offset = getOffset(codeNode),
                    dt = event.dataTransfer,
                    oy = dt.getData("offsetY"),
                    cursor = codeNode.querySelector(".cursor"),
                    elements = codeNode.querySelectorAll(".element"),
                    elementY = event.clientY - offset.top - oy,
                    refOffset, refElement, insertMode, i, e, margin, top;

                for (i = elements.length - 1; i >= 0; i--) {
                    e = elements[i];
                    refOffset = getOffset(e);
                    top = refOffset.top - offset.top;

                    if ((top <= elementY) && (elementY <= top + e.offsetHeight)) {
                        margin = refOffset.left - offset.left;
                        refElement = e;

                        if (elementY < (top + e.offsetHeight * 0.25)) {
                            insertMode = "before";
                            cursor.style.top = top + "px";
                            cursor.style.marginLeft = margin + "px";
                            break;
                        }

                        cursor.style.top = (top + e.offsetHeight) + "px";

                        if (elementY < (top + e.offsetHeight * 0.75)) {
                            insertMode = "inside";
                            cursor.style.marginLeft = (margin + 30) + "px";
                            break;
                        }

                        insertMode = "after";
                        cursor.style.marginLeft = margin + "px";
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
            });

            codeNode.addEventListener("dragleave", function(event) {
                event.preventDefault();
            });

            codeNode.addEventListener("drop", function(event) {
                event.preventDefault();
                var dt = event.dataTransfer,
                    elementId = dt.getData("id"),
                    element = document.getElementById(elementId),
                    refElement = htmaze.refElement,
                    insertMode = htmaze.insertMode,
                    isTag = element.getAttribute("data-is-tag") === "true",
                    isSolo = element.getAttribute("data-is-solo") === "true",
                    closeTag = element.querySelector(".close-tag");

                if (isTag && !isSolo && (!closeTag || closeTag.parentNode !== element)) {
                    closeTag = document.createElement("div");
                    closeTag.id = elementType + "-" + (htmaze.unique++);
                    closeTag.className = "element close-tag";
                    closeTag.setAttribute("data-is-close-tag", "true");
                    element.setAttribute("data-close-tag-id", closeTag.id);
                    var pos = Math.min(element.innerText.indexOf(" "),
                        element.innerText.indexOf(">"));
                    closeTag.innerText = "</" + element.innerText.substring(1, pos).trim() + ">";
                    element.appendChild(closeTag);
                }

                if (!refElement || !insertMode) {
                    codeNode.appendChild(element);
                }
                else {
                    if (insertMode === "before") {
                        refElement.parentNode.insertBefore(element, refElement);
                    }
                    else if (insertMode === "after") {
                        if (refElement.nextSibling) {
                            refElement.parentNode.insertBefore(element, refElement.nextSibling);
                        }
                        else {
                            refElement.parentNode.appendChild(element);
                        }
                    }
                    else if (insertMode === "inside") {
                        refElement.appendChild(element);
                    }
                }

                codeNode.querySelector(".cursor").className = "cursor";
            });
        }

        document.addEventListener("DOMContentLoaded", function() {
            initElements(html, "html",
                document.querySelector("#workspace-html .elements"),
                document.querySelector("#workspace-html .code"));
        });
    };
}());
