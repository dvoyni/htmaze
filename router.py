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


test_html = ['<div style="background: #ff0000">',
             '<div style="background: #00ff00">',
             'Hey!',
             '</div>',
             '</div>']


def js_array_str(list):
    return "[%s]" % ", ".join(["\"%s\"" % re.sub(r'"', "\\\"", item) for item in list])


@app.route("/task/<int:index>")
def task(index):
    return render_template("task.html",
                           task={
                               "index": index,
                               "html": js_array_str(test_html)
                           })
