import $ from './jq_or_jquery';

afterEach(function () {
  $('#test').empty().removeData();
  $(document).off();
  $(document.body).off();
});
