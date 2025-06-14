const GAMESNACKS = {
    audioEnabled: true,
    audioSubscribers: [],
    ghostDataSubscriber: null,
    sendScore: (score, scoreMetadata={}) => {
        parent.postMessage(JSON.stringify({
            score,
            scoreMetadata
        }), "*");
    }
    ,
    gameOver: () => {
        parent.postMessage(JSON.stringify({
            type: "gameOver",
            value: true
        }), "*");
    }
    ,
    isAudioEnabled: function() {
        this.notifyGamesnacksOfAudioApiUsage();
        return this.audioEnabled;
    },
    subscribeToAudioUpdates: function(audioUpdateCallback) {
        this.notifyGamesnacksOfAudioApiUsage();
        this.audioSubscribers.push(audioUpdateCallback)
    },
    notifyGamesnacksOfAudioApiUsage: function(audioUpdateCallback) {
        parent.postMessage(JSON.stringify({
            type: "GAMESNACKS_AUDIO_SUBCRIPTION",
            value: true
        }), "*");
    },
    listenForAudioUpdates: function() {
        var _self = this;
        window.addEventListener("message", function(event) {
            _self.handleAudioUpdates(event);
        }, false);
    },
    handleAudioUpdates: function(event) {
        if (!event || !event.data || event.data.type !== "GAMESNACKS_AUDIO_UPDATE") {
            return;
        }
        var updatedIsAudioEnabled = event.data.isAudioEnabled;
        if (typeof updatedIsAudioEnabled !== "boolean") {
            return;
        }
        this.audioEnabled = updatedIsAudioEnabled;
        this.updateAudioSubscribers();
    },
    updateAudioSubscribers: function() {
        this.audioSubscribers.forEach( (subscriber) => {
            subscriber(this.audioEnabled);
        }
        );
    },
    _subscribeToGhostData: function(receiveGhostDataCallback) {
        this.ghostDataSubscriber = receiveGhostDataCallback;
        var _self = this;
        window.addEventListener("message", function(event) {
            if (!event || !event.data || event.data.type !== "GAMESNACKS_RECEIVE_GHOST_DATA") {
                return;
            }
            _self.ghostDataSubscriber(event.data.value);
        }, false);
        parent.postMessage(JSON.stringify({
            type: "GAMESNACKS_SUBSCRIBE_TO_GHOST_DATA",
            value: true
        }), "*");
    },
    _gameOverWithGhost: function(ghost) {
        parent.postMessage(JSON.stringify({
            type: "GAMESNACKS_GAME_OVER_WITH_GHOST",
            value: ghost
        }), "*");
    }
};
GAMESNACKS.listenForAudioUpdates();
if (typeof module === "object") {
    module.exports = GAMESNACKS;
}