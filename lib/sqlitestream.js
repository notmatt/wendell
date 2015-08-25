/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2015, Joyent, Inc.
 */

var mod_sqlite3 = require('sqlite3');
var mod_vstream = require('vstream');
var stream = require('stream');
var util = require('util');
var fs = require('fs');

function initDb() {
    var db = new mod_sqlite3.Database(':memory:', function (err) {
        if (err) {
            console.log('ERROR: ', err);
            throw new Error(err);
        }

        fs.readFile('./create_db.sql', 'utf8', function (err, sql) {
            if (err) {
                console.log('ERROR: ', err);
                throw new Error(err);
            }

            db.exec(sql, function (err) {
                if (err) {
                    console.log('ERROR: ', err);
                    throw new Error(err);
                }
            });
        });
    });
}

// opts likely here:
//   - db location
//   - db type
function SQLiteStream() {
    opts = { objectMode : true };

    // db init.
    var self = this;

    initDb(function (err, db) {
        self.db = db;

    });

    stream.Transform.call(this, opts);
    mod_vstream.wrapTransform(this);
}
util.inherits(SQLiteStream, stream.Transform);

SQLiteStream.prototype._transform = function v8Transform(buf, end, cb) {

    // does nothing at the moment.
    if (this.is_ready) {
        this.push(chunk);
        cb();
    }
}

// likely err handling:
// if db err event, we want to exert backpressure & attempt to reopen (or die?)
// are these events emitted in general, or do they stick to this 'if cb
// provided' implicitness?

module.exports = SQLiteStream;
