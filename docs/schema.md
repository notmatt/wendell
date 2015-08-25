## Edges Table
| edge_id | src_node_id | dest_node_id | edge_kind_id | label        |
| ------- | ----------- | ------------ | ------------ | ------------ |
| INT     | INT         | INT          | INT          | TEXT         |

## Nodes Table
| node_id | value_kind_id | ref_id       |
| ------- | ------------- | ------------ |
| INT     | INT           | CHARACTER(8) |

## Edge Kinds Table
| edge_kind_id | name        |
| ------------ | ----------- |
| INT          | VARCHAR(16) |

## Value Kinds table
| value_kind_id | name        |
| ------------- | ----------- |
| INT           | VARCHAR(16) |

## Objects Table
| object_id | ref_id       |
| --------- | ------------ |
| INT       | CHARACTER(8) |

## Arrays Table
| array_id  | ref_id       | length      |
| --------- | ------------ | ----------- |
| INT       | CHARACTER(8) | BIG_INT     |

## Date Table
| date_id   | ref_id       | timestamp   |
| --------- | ------------ | ----------- |
| INT       | CHARACTER(8) | DATETIME    |

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
