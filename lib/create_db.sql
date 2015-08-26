PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
SELECT 'drop table ' || name || ';' from sqlite_master where type = 'table';

CREATE TABLE `edges` (
	`edge_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`src_node_id`	INTEGER NOT NULL,
	`dest_node_id`	INTEGER NOT NULL,
	`edge_kind_id`	INTEGER NOT NULL,
	`label`	TEXT NOT NULL
);
CREATE TABLE `nodes` (
	`node_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`value_kind_id`	INTEGER NOT NULL,
	`ref_id`	CHAR(8) NOT NULL
);
CREATE TABLE `edge_kinds` (
	`edge_kind_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`name`	VARCHAR(16) NOT NULL
);
CREATE TABLE `value_kinds` (
	`value_kind_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`name`	VARCHAR(16) NOT NULL
);
CREATE TABLE `objects` (
	`object_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`ref_id`	CHAR(8) NOT NULL
);
CREATE TABLE `arrays` (
	`array_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`ref_id`	CHAR(8) NOT NULL,
	`len`	    TEXT NOT NULL
);
CREATE TABLE `dates` (
	`date_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`ref_id`	INTEGER NOT NULL,
	`date_time`	TEXT NOT NULL
);
CREATE TABLE `regexes` (
	`regex_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`ref_id`	CHAR(8) NOT NULL,
	`source`	TEXT NOT NULL
);
CREATE TABLE `heap_numbers` (
	`heap_num_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`ref_id`	CHAR(8) NOT NULL,
	`number`	TEXT NOT NULL
);
CREATE TABLE `odd_balls` (
	`odd_ball_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`ref_id`	CHAR(8) NOT NULL,
	`val`	VARCHAR(32) NOT NULL
);
CREATE TABLE `closures` (
	`closure_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`ref_id`	CHAR(8) NOT NULL,
	`function_name`	TEXT NOT NULL,
	`location`	TEXT NOT NULL,
	`values`	TEXT NOT NULL
);
CREATE TABLE `strings` (
	`string_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`ref_id`	CHAR(8) NOT NULL,
	`val`	VARCHAR(32) NOT NULL
);

INSERT INTO "edge_kinds" VALUES(1,'object');
INSERT INTO "edge_kinds" VALUES(2,'array');
INSERT INTO "edge_kinds" VALUES(3,'closure');

INSERT INTO "value_kinds" VALUES(1,'object');
INSERT INTO "value_kinds" VALUES(2,'array');
INSERT INTO "value_kinds" VALUES(3,'date');
INSERT INTO "value_kinds" VALUES(4,'regex');
INSERT INTO "value_kinds" VALUES(5,'heap number');
INSERT INTO "value_kinds" VALUES(6,'smi');
INSERT INTO "value_kinds" VALUES(7,'odd ball');
INSERT INTO "value_kinds" VALUES(8,'closure');
INSERT INTO "value_kinds" VALUES(9,'string');

DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('edge_kinds',3);
INSERT INTO "sqlite_sequence" VALUES('value_kinds',9);
COMMIT;
