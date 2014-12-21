'use strict';

(function(config) {
    config.gameUrl = 'xortag.apphb.com'; //192.168.1.132
    config.proximityBuffer = 5;
    config.commands = {
        up: 0,
        down: 1,
        left: 2,
        right: 3,
        look: 4
    };

})(module.exports);