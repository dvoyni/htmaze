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
tasks = [
    {"html": ['<div class="a">', '<div class="b">', 'Hey!', '</div>', '</div>'],
     "css": None,
     "css_args": None},

    {"html": ['<div class="a">', '<div class="b">', 'Hey!', '</div>', '</div>'],
     "css": [["$$ {", "padding: 10px;", "}"],
             ["$$ {", "background-color: #ff0000;", "}"],
             ["$$ {", "background-color: #00ff00;", "}"]],
     "css_args": ["div", ".a", ".b"]}
]
