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

function V8HeapObjStream() {
    opts = { objectMode : true };

    stream.Transform.call(this, opts);
    mod_vstream.wrapTransform(this);
}
util.inherits(V8HeapObjStream, stream.Transform);

V8HeapObjStream.prototype._transform = function v8Transform(buf, enc, cb) {
    // buf is a line-oriented chunk
    // the last portion of this string can legitimately contain spaces so we
    // need to substr until we have the correct number of properties based on
    // the graphKind.
    // Get the graphKind (i.e. edge or node), edges have 6 properties and Nodes
    // have 4 properties
    var rawChunk = buf;
    var splitPosition = rawChunk.indexOf(' ');
    var graphKind = rawChunk.substr(0, splitPosition);

    var propertyCount = graphKind == 'node' ? 3 : 5;
    var properties = [];
    for (var i = 0; i < propertyCount; i++) {
        rawChunk = rawChunk.substr(splitPosition + 1, rawChunk.length);
        if (i == propertyCount - 1) {
            properties[i] = rawChunk;
        } else {
            splitPosition = rawChunk.indexOf(' ');
            properties[i] = rawChunk.substr(0, splitPosition);
        }
    }
    if (graphKind == 'edge' && properties[3] == 'SMI') {
        cb();
    } else {
        var chunk;
        if (graphKind == 'node') {
            chunk = {
                graphKind: graphKind,
                valueKind: properties[0],
                referenceId: properties[1],
                value: properties[2]
            }
            this.push(chunk);
            cb();
        } else if (graphKind == 'edge'){
            chunk = {
                graphKind: graphKind,
                valueKind: properties[0],
                sourceReferenceId: properties[1],
                value: properties[2],
                destinationReferenceId: properties[4]
            }
            this.push(chunk);
            cb();
        } else {
            this.emit('error', new Error('Fat don\'t fail me now!'));
        }
    }
}

module.exports = V8HeapObjStream;
