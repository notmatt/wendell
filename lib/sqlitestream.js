/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2015, Joyent, Inc.
 */

var fs = require('fs');
var mod_sqlite3 = require('sqlite3');
var mod_vstream = require('vstream');
var stream = require('stream');
var util = require('util');

// --- Globals

var dbFileName = './wendall.sqlite';
var dbConfig = './create_db.sql';

// --- Stream interface

// opts likely here:
//   - db location
//   - db type
function SQLiteStream() {
    var opts = { objectMode : true };
    var self = this;

    this.buffered = [];
    this.ready = false;
    this.db = null;

    // open the db. on open, init the db, set ready.
    this.db = new mod_sqlite3.Database(dbFileName);
    this.db.on('open', function() {
        self.initDb();
    });
    this.db.on('error', function(dberr) {
        self.emit('error', dberr);
    });

    stream.Writable.call(this, opts);
    mod_vstream.wrapWritable(this);
}
util.inherits(SQLiteStream, stream.Writable);

SQLiteStream.prototype._transform = function (buf, enc, callback) {

    if (!this.ready) {
        buffered.push([buf, callback]);
        return;
    }

    this.doInsert(buf, callback);
}

// no leaks allowed - close the DB, etc.
SQLiteStream.prototype._flush = function sqFlush(callback) {
    // if we get a call to _flush before we have finished opening the db,
    // we will need to close it when we finish opening.
    if (!this.ready) {
        this.flushCb = callback;
        return;
    }

    this.doFlush(callback);
}


// --- Internals

/*
 * Initialize the db file and create the initial tables & static values.
 */
SQLiteStream.prototype.initDb() {
    var self = this;
    fs.readFile(dbConfig, 'utf8', function (err, contents) {
        self.db.exec(contents, function (dberr) {
            if (err) {
                self.emit('error', dberr);
                return;
            }

            // now ready to read. Do we have a buffer?

            // do we have a pending flush? do that too.

        });
    });
}


SQLiteStream.prototype.doInsert(chunk, callback) {
    // XXX - switch on type, call insertType().
}

// likely err handling:
// if db err event, we want to exert backpressure & attempt to reopen (or die?)
// are these events emitted in general, or do they stick to this 'if cb
// provided' implicitness?

module.exports = SQLiteStream;
