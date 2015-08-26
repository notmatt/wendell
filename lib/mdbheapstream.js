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

// --- Globals

var PROT_LINE = 'MDBV8HEAP 1.0';
var BEGIN_LINE = 'begin';
var END_LINE = 'end';

/*
 * Handles mdb-heap specific 'protocol' lines
 */
function MDBHeapStream() {
    opts = { objectMode : true };

    stream.Transform.call(this, opts);
    mod_vstream.wrapTransform(this);
}
util.inherits(MDBHeapStream, stream.Transform);

// XXX - should actually enforce protocol
MDBHeapStream.prototype._transform = function heapTransform(buf, enc, cb) {
    if (!(buf === PROT_LINE || buf === BEGIN_LINE || buf === END_LINE)) {
        this.push(buf);
    }
    return cb();
}

module.exports = MDBHeapStream;
