/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2015, Joyent, Inc.
 */

var mod_vstream = require('vstream');
var stream = require('stream');
var util = require('util');

function TestOutputStream() {
    opts = { objectMode : true };

    stream.Transform.call(this, opts);
    mod_vstream.wrapTransform(this);
}
util.inherits(TestOutputStream, stream.Transform);

TestOutputStream.prototype._transform = function testOutputTransform(buf, enc, cb) {
    // buf is a line-oriented chunk
    var chunk = buf;
    console.log(chunk);
    this.push(chunk);
    cb();
}

module.exports = TestOutputStream;
