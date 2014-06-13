const panel = require("panel");
const widget = require("widget");
const {Hotkey} = require("hotkeys");
const notifications = require("sdk/notifications");
const {Cc, Ci, Cu} = require("chrome");
const events = require("sdk/system/events");

var handleListener = function(aTraceableChannel, dataStore) {
    var self = this;
    this.originalListener = null;
    this.newListener = {
        onDataAvailable: function(req, ctx, is, offset, count) {
            console.log(offset, count, req.name);
            dataStore.push(req.name);
            self.originalListener.onDataAvailable(req, ctx, is, offset, count);
        },
        onStartRequest: function(req, ctx) {
            console.log("=== START REQUEST ===", req.name);
            self.originalListener.onStartRequest(req, ctx);
        },
        onStopRequest: function(req, ctx, statusCode) {
            self.originalListener.onStopRequest(req, ctx, statusCode);
        }
    };
    this.originalListener = aTraceableChannel.setNewListener(this.newListener);
    return this;
}
var dataStore = [];
events.on("http-on-examine-response", function(e) {
    if (e.type == "http-on-examine-response") {
        var channel = e.subject.QueryInterface(Ci.nsITraceableChannel);
        var myListener = new handleListener(channel, dataStore);
    }
}, true);
