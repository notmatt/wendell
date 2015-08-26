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

function V8HeapObjStream(opts) {
    this.log = opts.log;
    var streamOpts = { objectMode : true };

    stream.Transform.call(this, streamOpts);
    mod_vstream.wrapTransform(this);
}
util.inherits(V8HeapObjStream, stream.Transform);

V8HeapObjStream.prototype._transform = function v8Transform(buf, enc, cb) {
    this.log.debug({ buf: buf }, 'vhs: transform');
    // buf is a line-oriented chunk
    // the last portion of this string can legitimately contain spaces so we
    // need to substr until we have the correct number of properties based on
    // the graphElementKind.
    // Get the graphElementKind (i.e. edge or node), edges have 6 properties and Nodes
    // have 4 properties

    var graphElementKind = buf.substr(0, 4);
    var valueEnd = buf.substr(6).indexOf('"');
    var valueKind = buf.substr(6, valueEnd);
    var refId = buf.substr(8 + valueEnd, 8);
    var props = buf.substr(17 + valueEnd).split(' ');

    if (graphElementKind === 'edge' && props[1] === 'SMI') {
        this.log.debug({ buf: buf }, 'vhs: Skipping SMI');
        return cb();
    }

    this.log.debug({
        graphElementKind: graphElementKind,
        valueKind: valueKind,
        refId: refId,
        props: props
    }, 'vhs: Parsed a line');

    var chunk;
    if (graphElementKind === 'node') {
        this.log.debug({ buf: buf }, 'vhs: found node');
        chunk = {
            graphElementKind: graphElementKind,
            valueKind: valueKind,
            referenceId: refId,
            value: props.join(' ')
        }
        this.push(chunk);
        return cb();
    }

    if (graphElementKind === 'edge'){
        this.log.debug({ buf: buf }, 'vhs: found edge');
        chunk = {
            graphElementKind: graphElementKind,
            valueKind: valueKind,
            sourceReferenceId: refId,
            value: props[0],
            destinationReferenceId: props[2]
        }
        this.push(chunk);
        return cb();
    }

    // "Can't happen"
    this.log.debug({ buf: buf }, 'vhs: Could not parse');
    this.emit('error', new Error('Fat don\'t fail me now!'));
}

module.exports = V8HeapObjStream;
