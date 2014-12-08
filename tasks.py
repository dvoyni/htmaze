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
    <h1>
    This is a Heading
    </h1>
    <p>
    This is a paragraph
    </p>
    """),

    _ct("""
    <p>
    This text is normal.
    </p>
    <p><strong>
    This text is strong.
    </strong></p>
    <p><i>
    This text is italic
    </i></p>
    """),

    _ct("""
    <h1>
    This is a Heading
    </h1>
    <p>
    This is a paragraph
    </p>
    """,
        """
        [h1] { color: green; }

        [p] { color: white; }
        """),

    _ct("""
    <h1>
    This is a Heading
    </h1>
    <p>
    This is a paragraph
    </p>
    """,
        """
        [h1] { color: green; }

        [p] { color: white; }
        """),

    _ct("""
    <a href="http://koding.com/" target="_blank" id="link-to-koding">
    Koding.com
    </a>
    <br />
    <a href="http://w3schools.com/" target="_blank" id="link-to-w3s">
    w3schools.com
    </a>
    """,
        """
        [#link-to-koding] {
            color: blue;
            font-size: [large];
        }
        [#link-to-w3s] {
            color: black;
            font-size: [small];
        }
        """),
    _ct("""
    <table>
        <tr>
            <th>Year</th>
            <th>Version</th>
        </tr>
        <tr>
            <td>1999</td><td>HTML4</td>
        </tr>
        <tr>
            <td>2014</td><td>HTML5</td>
        </tr>
    </table>
    """,
        """
        [table] { width: [100%]; }

        th { background-color: [grey]; }

        td { border: [1px] solid [black]; }

        [td, th] { [text-align]: center; }
        """),
    _ct("""
    <div class="block top">
        Top block
    </div>
    <div class="inline">
        Left block
    </div>
    <div class="inline">
        Right block
    </div>
    <div class="block bottom">
        Bottom block
    </div>
    """,
        """
        [div] {
        border: 1px solid white;
        color: [white];
        background-color: [green];
        padding: 10px;
         }

        [.block] { [display]: block; }

        [.inline] { display: [inline-block]; width: 50%;}

        .top { background-color: [navy]; }

        .bottom { background-color: [orange]; }
        """),
    _ct("""
    <div>
        <ol>
            <li>first</li>
            <li>second</li>
            <li>third</li>
        </ol>
    </div>
    <div>
        <ul>
            <li>apple</li>
            <li>banana</li>
            <li>watermelon</li>
        </ul>
    </div>
    """,
        """
        [div] { display: [inline-block]; }

        [ol] [li][:nth-child(2)] { color: blue; }

        [ul] [li][:nth-child(3)] { color: red; }

        [ol] { [margin-right]: 20px; }
        """)
]
