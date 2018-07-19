<?php

$params = file_get_contents('php://input');
if ($params === '[object Object]') {
  echo 'success';
} else {
  echo 'error';
}
