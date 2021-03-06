/**
 * @author       Javier Valencia Romero <javiervalenciaromero@gmail.com>
 * @copyright    Javier Valencia Romero
 * @license      {@link https://github.com/jvalen/prototypePacman/blob/master/license.txt|MIT License}
 */

/**
 * Player class constructor
 *
 * @class PrototypePacman.Player
 * @constructor
 * @param {object} game
 * @param {object} options
 */
var PrototypePacman = PrototypePacman || {};

PrototypePacman.Player = function(game, options) {
    this.game = game;
    this.size = options.size;
    this.center = options.center;
    this.color = options.color;
    this.innerColor = options.innerColor;
    this.speed = options.speed;
    this.keyboarder = new Controls.Keyboard();
    this.moveDirection = {
        current: 'left', //Default direction
        waiting: 'left'
    };
};

PrototypePacman.Player.prototype = {
    /**
     * Update the player state
     * @method PrototypePacman.Player#update
     */
    update: function() {
        //Move player
        var mode = this.game.returnGameMode();
        this.movePlayer(this, this.moveDirection.waiting, true);

        if (
            mode === 'machine-learning' &&
            this.isValidAction(this.game.socket.dataReceived)
        ) {
            //Player direction is given by the socket connection
            this.moveDirection.waiting = this.game.socket.dataReceived;
        } else if(mode === 'multiplayer') {
            //Multiplayer mode
            var multiplayerData = this.game.socket.dataReceived;
            this.moveDirection.waiting = multiplayerData[0].direction;
        } else {
            //Change direction (keyboard)
            if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
                this.moveDirection.waiting = 'left';
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
                this.moveDirection.waiting = 'right';
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
                this.moveDirection.waiting = 'up';
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN)) {
                this.moveDirection.waiting = 'down';
            }
        }
    },
    /**
     * Draw the player
     * @method PrototypePacman.Player#draw
     * @param {object} screen Canvas ctx
     */
    draw: function(screen) {
        Utils.drawRect(screen, this, this.color, this.innerColor);
    },
    /**
     * Move player
     * @method PrototypePacman.Player#movePlayer
     * @param {object} player
     * @param {string} direction
     * @param {boolean} isWaiting Returns true if there is a direction waiting to be used
     */
    movePlayer: function(player, direction, isWaiting) {
        var speed = this.speed,
            currentPositionProperties = {
                size: { width: this.size.width, height: this.size.height },
                center: { x: this.center.x, y: this.center.y }
            };
        switch (direction) {
            case 'left':
                if (player.game.isValidLocation(currentPositionProperties, -1 * speed, 0)) {
                    player.game.markTileAsWalked(
                        this.center.x - (this.size.width / 2),
                        this.center.y - (this.size.height / 2)
                    );
                    if (player.game.outOfBoundaries(player.center.x - speed, player.center.y)) {
                        var rightTunnelPos = player.game.giveMeTunnelPosition('right');

                        player.center.x = rightTunnelPos.x;
                        player.center.y = rightTunnelPos.y;
                    } else {
                        player.center.x -= speed;
                    }
                    player.moveDirection.current = 'left';
                } else if (isWaiting) {
                    this.movePlayer(player, player.moveDirection.current, false);
                }
                break;
            case 'right':
                if (player.game.isValidLocation(currentPositionProperties, 1 * speed, 0)) {
                    player.game.markTileAsWalked(
                        this.center.x - (this.size.width / 2),
                        this.center.y - (this.size.height / 2)
                    );
                    if (player.game.outOfBoundaries(player.center.x + speed, player.center.y)) {
                        var leftTunnelPos = player.game.giveMeTunnelPosition('left');

                        player.center.x = leftTunnelPos.x;
                        player.center.y = leftTunnelPos.y;
                    } else {
                        player.center.x += speed;
                    }

                    player.moveDirection.current = 'right';
                } else if (isWaiting) {
                    this.movePlayer(player, player.moveDirection.current, false);
                }
                break;
            case 'up':
                if (player.game.isValidLocation(currentPositionProperties, 0, -1 * speed)) {
                    player.game.markTileAsWalked(
                        this.center.x - (this.size.width / 2),
                        this.center.y - (this.size.height / 2)
                    );
                    this.center.y -= speed;
                    this.moveDirection.current = 'up';
                } else if (isWaiting) {
                    this.movePlayer(player, player.moveDirection.current, false);
                }
                break;
            case 'down':
                if (player.game.isValidLocation(currentPositionProperties, 0, 1 * speed)) {
                    player.game.markTileAsWalked(
                        this.center.x - (this.size.width / 2),
                        this.center.y - (this.size.height / 2)
                    );
                    player.center.y += speed;
                    player.moveDirection.current = 'down';
                } else if (isWaiting) {
                    this.movePlayer(player, player.moveDirection.current, false);
                }
                break;
        }
    },
    isValidAction: function(action) {
        if (typeof action === 'string') {
          return (['up', 'down', 'left', 'right'].indexOf(action) > -1);
        } else {
            return false;
        }
    }
};

PrototypePacman.Player.prototype.constructor = PrototypePacman.Player;
