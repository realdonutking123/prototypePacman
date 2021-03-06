/**
 * @author       Javier Valencia Romero <javiervalenciaromero@gmail.com>
 * @copyright    Javier Valencia Romero
 * @license      {@link https://github.com/jvalen/prototypePacman/blob/master/license.txt|MIT License}
 */

/**
 * Socket class constructor
 *
 * @class Network.Socket
 * @constructor
 */
var Network = Network || {};

Network.Socket = function(address) {
    var self = this;
    this.socket = new WebSocket(address);
    this.socket.binaryType = "arraybuffer";
    this.dataReceived = null;

    this.socket.onopen = function() {
        this.isopen = true;
        console.log("Connected!");
    }

    this.socket.onmessage = function(e) {
        if (typeof e.data == "string") {
            self.dataReceived = JSON.parse(e.data);
            //console.log(e.data);
        }
    }

    this.socket.onclose = function(e) {
        console.log("Connection closed.");
        this.socket = null;
        this.isopen = false;
    }
};

Network.Socket.prototype = {
    send: function(data, type) {
        if (this.socket.isopen) {
            switch(type) {
                case 'json':
                    this.socket.send(JSON.stringify(data));
                    break;
                case 'string':
                    this.socket.send(data);
                    break;
            }
        } else {
            console.log("Connection not opened.")
        }
    },
    close: function() {
        this.socket.close(1000); // 1000: Normal way to close
    }
};

Network.Socket.prototype.constructor = Network.Socket;
