<?php
$data = json_encode(array(
  'key1' => 'val1',
  'key2' => 'val2'
));
$callback = $_GET["callback2"];
echo $callback . '(' . $data . ')';
