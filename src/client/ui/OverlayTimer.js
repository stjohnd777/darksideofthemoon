
let OverlayTimer = function(id, time) {
    this.waitTimer = undefined;
    this.timeout = time * 1000 || 60000; // default to a minute mostly for debugging
    this.overlayId = id;
};

OverlayTimer.prototype = {

    startOverlay: function() {
        var self = this;
        self.stopOverlay(self);
        //$(elem).prop('disabled', true);

        $(self.overlayId).removeClass('hidden');
        self.waitTimer = setTimeout(function() { self.overlayTimeout(self); }, self.timeout);
    },

    overlayTimeout: function(self) {
        self.stopOverlay(self);
        alert("Request timed out");
    },

    stopOverlay: function(self) {
        if(self.waitTimer) {
            clearTimeout(self.waitTimer);
            self.waitTimer = undefined;
        }
        $(self.overlayId).addClass('hidden');
    }
};

export default OverlayTimer;
