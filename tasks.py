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
import re

css_re = re.compile("\[(.+?)\]+?")


def _ct(html, css=None):
    csslines = None
    args = None

    if css:
        args = re.findall(css_re, css)
        css = re.sub(css_re, "$$", css)
        csslines = []
        cssline = []

        for line in [line.strip() for line in css.split("\n")]:
            if len(line) == 0 and len(cssline) > 0:
                csslines.append(cssline)
                cssline = []
            else:
                cssline.append(line)
        if len(cssline) > 0:
            csslines.append(cssline)

    return {"html": list(filter(lambda l: len(l) > 0, [line.strip() for line in html.split("\n")])),
            "css": csslines,
            "css_args": args}


tasks = [
    _ct("""
        <div style="background-color: #B7FF72; padding: 10px;">
            <div style="border-radius: 10px; background-color: #FFB241; text-align: center;">
                It was easy
            </div>
        </div>
        """),

    _ct("""
        <div class="foo">
            <div class="bar" style="border-radius: 10px;">
                It was easy
            </div>
        </div>
        """,
        """
        [.foo] {
            background-color: #B7FF72;
        }

        [.bar] {
            background-color: #FFB241;
            text-align: center;
        }

        [div] {
            padding: 10px;
        }
        """),
]
