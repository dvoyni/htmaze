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
from flask import render_template, abort, url_for
from htmaze import app
import re
from tasks import tasks


@app.route("/")
def content():
    task_info = [{"url": url_for("task", index=i + 1),
                  "has_css": t["css"],
                  "index": i + 1}
                 for i, t in enumerate(tasks)]

    return render_template("index.html",
                           tasks=task_info)


@app.route("/help")
def help():
    return render_template("help.html")


def _js_array_str(array):
    if array:
        return "[%s]" % ", ".join(["\"%s\"" % re.sub(r'"', "\\\"", item) for item in array])
    return "null"


def _js_array2_str(array):
    if array:
        return "[%s]" % ", ".join(["[%s]" % _js_array_str(item)[1:-1] for item in array])
    return "null"


@app.route("/task/<int:index>")
def task(index):
    if index < 1 or index > len(tasks):
        abort(404)

    t = tasks[index - 1]
    return render_template("task.html",
                           task={
                               "index": index,
                               "html": _js_array_str(t["html"]),
                               "css": _js_array2_str(t["css"]),
                               "css_args": _js_array_str(t["css_args"]),
                               "has_next": index < len(tasks)
                           },
                           url={
                               "content": url_for("content"),
                               "help": url_for("help"),
                               "next_task": url_for("task", index=index + 1),
                           })
