if (typeof(firefoxDlHook) === "undefined") {
	var firefoxDlHook = {};
}

(function (namespace) {
	var Cc = Components.classes;
	var Ci = Components.interfaces;

	var TracingListener = function () {
		this.originalListener = null;
	};
	TracingListener.prototype.onDataAvailable = function (request, context, inputStream, offset, count) {
		var stream = Cc["@mozilla.org/scriptableinputstream;1"].createInstance(Ci.nsIScriptableInputStream);
		var storage = Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);
		storage.init(1024, count);
		stream.init(inputStream);
		console.log(offset, stream.read(count));
		this.originalListener.onDataAvailable (request, context, inputStream, offset, count);
	};
	TracingListener.prototype.onStartRequest = function (request, context) {
		this.originalListener.onStartRequest (request, context);
	};
	TracingListener.prototype.onStopRequest = function (request, context, statusCode) {
		this.originalListener.onStopRequest (request, context, statusCode);
	};
	TracingListener.prototype.QueryInterface = function (iID) {
		if (iID.equals(Ci.nsIStreamListener) || iID.equals(Ci.nsISupports)) {
			return this;
		}
		throw Components.results.NS_NOINTERFACE;
	}

	var httpRequestObserver = {
		observe: function(subject, topic, data) {
			if (topic == "http-on-examine-response") {
				var newListener = new TracingListener ();
				subject.QueryInterface(Ci.nsITraceableChannel);
				newListener.originalListener = subject.setNewListener(newListener);
			}
		}
	};

	var observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
	observerService.addObserver(httpRequestObserver, "http-on-examine-response", false);

	namespace.al = function () { alert ("This is main function!!!"); };
}) (firefoxDlHook);
