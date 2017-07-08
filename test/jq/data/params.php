<?php

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
  case 'GET':
    $params = $_GET;

    if ($params['key1'] !== 'val1' || $params['key2'] !== 'val2') {
      $result = '参数值错误';
    } else {
      $result = 'get';
    }

    break;
  case 'POST':
    $params = $_POST;

    if ($params['key1'] !== 'val1' || $params['key2'] !== 'val2') {
      $result = '参数错误';
    } else {
      $result = 'post';
    }

    break;
  case 'PUT':
    parse_str(file_get_contents('php://input'), $params);

    if ($params['key1'] !== 'val1' || $params['key2'] !== 'val2') {
      $result = '参数错误';
    } else {
      $result = 'put';
    }

    break;
  case 'DELETE':
    parse_str(file_get_contents('php://input'), $params);

    if ($params['key1'] !== 'val1' || $params['key2'] !== 'val2') {
      $result = '参数错误';
    } else {
      $result = 'delete';
    }

    break;
  case 'HEAD':
    // head 请求只获取响应头，因此这里不判断参数
    $result = 'head';

    break;
  case 'OPTIONS':
    parse_str(file_get_contents('php://input'), $params);

    if ($params['key1'] !== 'val1' || $params['key2'] !== 'val2') {
      $result = '参数错误';
    } else {
      $result = 'options';
    }

    break;
  case 'PATCH':
    parse_str(file_get_contents('php://input'), $params);

    if ($params['key1'] !== 'val1' || $params['key2'] !== 'val2') {
      $result = '参数错误';
    } else {
      $result = 'patch';
    }

    break;
}

echo $result;
exit;
