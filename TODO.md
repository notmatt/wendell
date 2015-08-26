Database-backed versions of:

Stuff that MDB already does:

* `OBJ::jsprint`: given an object, print it out (e.g., property names and values)
* `findjsobjects -p PROPNAME`: given a property name, list objects having those
  properties.  (The MDB-based `findjsobjects` shows representative objects, but
  this would at least show that we can sort by name.)
* `findjsobjects -c CONSTRUCTOR`: given a constructor name, list objects having
  that constructor.  (Ditto.)

Stuff that this could do much better than MDB:

* `OBJ::findjsobjects -r`: list the objects that have a property with value OBJ

Totally new stuff:

* `findvars VARNAME`: find closures with variables called "VARNAME"
