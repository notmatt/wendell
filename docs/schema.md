## Edges Table
| edge_id | src_node_id | dest_node_id | kind_id | ref_id       |
| ------- | ----------- | ------------ | ------- | ------------ |
| INT     | INT         | INT          | INT     | CHARACTER(8) |

## Nodes Table
| node_id | kind_id | ref_id       |
| ------- | ------- | ------------ |
| INT     | INT     | CHARACTER(8) |

## Objects Table
| object_id | ref_id       | name        | value |
| --------- | ------------ | ----------- | ----- |
| INT       | CHARACTER(8) | VARCHAR(64) | TEXT  |

## Arrays Table
| array_id  | ref_id       | length      | value |
| --------- | ------------ | ----------- | ----- |
| INT       | CHARACTER(8) | VARCHAR(64) | TEXT  |

## Date Table
| date_id   | ref_id       | timestamp   | value |
| --------- | ------------ | ----------- | ----- |
| INT       | CHARACTER(8) | DATETIME    | TEXT  |

## RegEx Table
| regex_id  | ref_id       | source |
| --------- | ------------ | ------ |
| INT       | CHARACTER(8) | TEXT   |

## HeapNumber Table
| heap_num_id | ref_id       | value |
| ----------- | ------------ | ----- |
| INT         | CHARACTER(8) | FLOAT |

## SMI Table
| smi_id    | ref_id       | value |
| --------- | ------------ | ----- |
| INT       | CHARACTER(8) | INT   |

## OddBalls Table
| odd_ball_id | ref_id       | value |
| ----------- | ------------ | ----- |
| INT         | CHARACTER(8) | TEXT  |

## Closures Table
| closure_id | file_name | position | values |
| ---------- | --------- | -------- | ------ |
| INT        | TEXT      | TEXT     | TEXT   |


Edges (1) <-> (1) FooKind

Edges (1) <-> (N) Nodes

Nodes (1) <-> (1) FooKind
