if (typeof(firefoxDlHook) === "undefined") {
	var firefoxDlHook = {};
}

(function (namespace) {
	namespace.al = function () { alert ("This is main function!!!"); };
}) (firefoxDlHook);
