/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2015, Joyent, Inc.
 */

// XXX - make logs
var mod_bunyan = require('bunyan');
var mod_vstream = require('vstream');
var split = require('split');
var stream = require('stream');
var util = require('util');

var MBDHeapStream = require('./mdbheapstream');
var SQLiteStream = require('./sqlitestream');
var V8HeapObjStream = require('./v8heapobjstream');
var TestOutputStream = require('./testoutputstream');

function init(sourceStream) {

    var opts = {
        log: mod_bunyan.createLogger({
            name: 'wendall',
            level: 'debug'
        })
    };


    var pipe = new mod_vstream.PipelineStream({ streams: [
        sourceStream,
        split(),
        new MBDHeapStream(opts),
        new V8HeapObjStream(opts),
        new SQLiteStream(opts),
        new TestOutputStream(opts)
    ]});

    // XXX handle stream errs.
}

module.exports = init;
