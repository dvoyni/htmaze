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

    htmaze.getOffset = function(element) {
        var ox = 0, oy = 0;

        while (element.offsetParent) {
            ox += element.offsetLeft;
            oy += element.offsetTop;
            element = element.offsetParent;
        }

        return { left: ox, top: oy };
    };

    htmaze.updateCodeSize = function(codeNode, elementsNode) {
        codeNode.style.top = elementsNode.offsetTop + elementsNode.offsetHeight + "px";
    };

    htmaze.init = function(html, css, cssArgs) {
        document.addEventListener("DOMContentLoaded", function() {
            htmaze.html(html);

            if (css) {
                htmaze.css(css, cssArgs);
            }
            else {
                document.querySelector("#workspace-css").style.display = "none";
            }

            document.querySelector("#preview-target .area").innerHTML = html.join("");
        });
    };
}());
