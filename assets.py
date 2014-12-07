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
from flask.ext.assets import Environment, Bundle
from htmaze import app, DEVELOPMENT

assets = Environment(app)
app.config['ASSETS_DEBUG'] = DEVELOPMENT

scripts = Bundle('scripts/*.js', filters='jsmin', output='gen/scripts.js')
assets.register('scripts', scripts)

styles = Bundle('styles/*.scss', filters='pyscss,cssmin', output='gen/styles.css')
assets.register('styles', styles)
