#
# Copyright 2014 Sergey Dvoynikov
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from flask import render_template
from htmaze import app
import re


@app.route("/")
def index():
    return render_template("index.html")


def js_array_str(list):
    return "[%s]" % ", ".join(["\"%s\"" % re.sub(r'"', "\\\"", item) for item in list])


def js_array2_str(list):
    return "[%s]" % ", ".join(["[%s]" % js_array_str(item)[1:-1] for item in list])


test_html = [
    '<div class="a">',
    '<div class="b">',
    'Hey!',
    '</div>',
    '</div>'
]

test_css = [
    ["$$ {", "padding: 10px;", "}"],
    ["$$ {", "background-color: #ff0000;", "}"],
    ["$$ {", "background-color: #00ff00;", "}"]
]

test_css_args = ["div", ".a", ".b"]


@app.route("/task/<int:index>")
def task(index):
    return render_template("task.html",
                           task={
                               "index": index,
                               "html": js_array_str(test_html),
                               "css": js_array2_str(test_css),
                               "cssArgs": js_array_str(test_css_args)
                           })
