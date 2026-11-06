(function () {
	var _parse = JSON.parse;
	JSON.parse = function (value) {
		debugger;
		return _parse(value);
	}
})()