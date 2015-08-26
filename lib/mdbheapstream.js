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
function MDBHeapStream(opts) {
    this.log = opts.log;
    var streamOpts = { objectMode : true };

    stream.Transform.call(this, streamOpts);
    mod_vstream.wrapTransform(this);
}
util.inherits(MDBHeapStream, stream.Transform);

// XXX - should actually enforce protocol
MDBHeapStream.prototype._transform = function heapTransform(buf, enc, cb) {
    if (!(buf === PROT_LINE || buf === BEGIN_LINE || buf === END_LINE || buf.length === 0)) {
        this.push(buf);
    } else {
        this.log.debug({ buf: buf }, 'mds: Skipping protocol line');
    }
    return cb();
}

module.exports = MDBHeapStream;
