<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PATCH, PUT, DELETE');
header('Access-Control-Allow-Headers: Token, Origin, X-Requested-With, X-Http-Method-Override, Accept, Content-Type, Connection, User-Agent');

echo json_encode(array(
  'key1' => 'val1',
  'key2' => 'val2'
));
