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
var neo4j = require('neo4j-js');

function Neo4jObjStream(opts) {
    var streamOpts = { objectMode : true };
    this.log = opts.log;

    stream.Transform.call(this, streamOpts);
    mod_vstream.wrapTransform(this);
}
util.inherits(Neo4jObjStream, stream.Transform);

Neo4jObjStream.prototype._transform = function neo4jTransform(buf, enc, cb) {

    neo4j.connect('http://neo4j:joypass123@172.26.3.58:7474/db/data/',
        function (err, graph) {
            if (err)
                throw err;

            if (buf.graphElementKind === 'edge') {
                var query = 'MATCH src, dst' +
                    ' WHERE src.referenceId = {src_node_id}' +
                    ' AND dst.referenceId = {dest_node_id}' +
                    ' CREATE src-[r:OWNS { value: {edge_value}, valueKind: {edge_value_kind} }]->dst' +
                    ' RETURN r';
                var params = {
                    src_node_id: buf.sourceReferenceId,
                    dest_node_id: buf.destinationReferenceId,
                    edge_value: buf.value,
                    edge_value_kind: buf.valueKind
                };
                graph.query(query, params, function (err, results){
                    if (err) throw err;
                });
            } else if (buf.graphElementKind === 'node') {
                graph.createNode(buf, function (err, node) {
                    if (err)
                        throw err;
                });
            } else {
                this.emit('error',
                    new Error('Oh, your mother is not pregnant, is she?')
                );
            }
    });

    this.push(buf);
    return cb();
}

module.exports = Neo4jObjStream;
