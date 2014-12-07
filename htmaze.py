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
import os
from flask import Flask

DEVELOPMENT = str(os.environ.get('DEVELOPMENT', "")).lower() == "true"

app = Flask(__name__)
app.debug = DEVELOPMENT

app.jinja_options['extensions'].append('jinja2ext.spaceless.SpacelessExtension')
from assets import *
from router import *

if __name__ == '__main__':
    app.run()
