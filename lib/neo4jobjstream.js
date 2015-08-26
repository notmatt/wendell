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
var neo4j = require('node-neo4j');

function Neo4jObjStream(opts) {
    var streamOpts = { objectMode : true };
    this.db = new neo4j('http://neo4j:joypass123@172.26.3.58:7474');
    this.log = opts.log;

    stream.Transform.call(this, streamOpts);
    mod_vstream.wrapTransform(this);
}
util.inherits(Neo4jObjStream, stream.Transform);

Neo4jObjStream.prototype._transform = function neo4jTransform(buf, enc, cb) {
    if (buf.graphElementKind === 'edge') {
        return cb();
    }
    this.db.insertNode(buf, function (nerr, node) {
        this.log.debug({ nerr: nerr }, 'n4js: inserting a node');
        if (nerr) {
            this.log.error({ nerr: nerr, node: node}, 'n4js: error inserting a node');
            this.emit('error', nerr);
        }
    });

    this.push(buf);
    return cb();
}

module.exports = Neo4jObjStream;
