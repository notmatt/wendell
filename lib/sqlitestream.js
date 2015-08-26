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
var dbConfig = './lib/create_db.sql';

// --- Stream interface

// opts likely here:
//   - db location
//   - db type
function SQLiteStream(opts) {
    var streamOpts = { objectMode : true };
    var self = this;

    this.log = opts.log;
    this.buffered = [];
    this.ready = false;
    this.db = null;

    // fs.readFile(dbConfig, { encoding: 'utf8' }, function(err, contents) {
    //     if (err) throw err;
    //     if (!err) throw new Error('No error');
    //     self.log.debug({}, 'sqs: read file');
    // });

    // open the db. on open, init the db, set ready.
    this.db = new mod_sqlite3.Database(dbFileName);
    this.db.on('open', function() {
        self.log.debug({ db: self.db }, 'sqs: db open');
        self.initDb();
    });
    this.db.on('error', function(dberr) {
        self.log.debug({ db: db }, 'sqs: db error');
        self.emit('error', dberr);
    });

    stream.Transform.call(this, streamOpts);
    mod_vstream.wrapTransform(this);
}
util.inherits(SQLiteStream, stream.Transform);

SQLiteStream.prototype._transform = function (buf, enc, callback) {
    this.log.debug({ buf: buf, ready: this.ready }, 'sqs: transform');
    this.doInsert(buf, callback);
}

// --- Internals

/*
 * Initialize the db file and create the initial tables & static values.
 */
SQLiteStream.prototype.initDb = function initDb() {
    var self = this;
    this.log.debug({ file: dbConfig }, 'sqs: initializing db');
    fs.readFile(dbConfig, { encoding: 'utf8' }, function (err, contents) {
        if (err) {
            throw err;
        }

        self.log.debug({}, 'sqs: read dbConfig');

        self.db.exec(contents, function (dberr) {
            self.log.debug({}, 'sqs: exec\'d dbConfig');
            if (err) {
                self.emit('error', dberr);
                return;
            }

            // now ready to read. Do we have a buffer to replay?
            self.ready = true;
            if (self.buffered) {
                self.log.debug({}, 'replaying buffered line');
                self.buffered.forEach(function (rec) {
                    self.doInsert(rec[0], rec[1]);
                });
            }
        });
    });
}


SQLiteStream.prototype.doInsert = function (buf, callback) {

    if (!this.ready) {
        this.log.debug({ buf: buf, ready: this.ready }, 'sqs: buffering until db open');
        this.buffered.push([buf, callback]);
        return;
    }

    // XXX - for now just push the obj with a flag.
    buf.inserted = true;
    this.log.debug({ buf: buf }, 'sqs: inserting record');
    this.push(buf);
    callback();
}

module.exports = SQLiteStream;
