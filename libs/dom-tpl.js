function parse (elements, scope) {
  var target = elements;
  var result = $(target).clone();
};
// $(div).data('name', scope.name)
<div data-bind="name" data-evt="events">
  // $(div).data('age', scope.old);
  <div data-bind="age=old">
    <ul data-if="list">
      <li>My hobbies:</li>
      <li data-repeat="list" 
        data-repeat-as="k,hobby" 
        data-bind="hobby">
        {{hobby.name}}
        <i class="hobby" data-ext-star="hobby.star"></i>
      </li>
    </ul>
  </div>
</div>

R.assign('bind', function () {

});
R.assign('if', function () {

});
R.
R.$bind = function (ele, exp, name, data) {
  ele.data(name, data);
};
R.$if = function (ele, exp, check) {

};
R.$ext = function (name, value) {

};
R.$ext('star', function (ele, express, data) {

});