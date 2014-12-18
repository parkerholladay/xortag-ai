var ai = require('../ai');
var up = 0;
var down = 1;
var left =2;
var right = 3;
var look = 4;

describe('get next move', function() {
    var player = {};

    beforeEach(function () {
        player = {id: 1, name: 'foo', mapWidth: 20, mapHeight: 20, x: 0, y: 0, players: [], isIt: false};
    });

    describe('when player is not it', function () {
        beforeEach(function () {
            player.isIt = false;
        });

        describe('when player is near the top edge of the map', function () {
            beforeEach(function () {
                player.y = 0;
            });

            it('should move down', function () {
                player.x = 9;
                expect(ai.getNextMove(player)).toBe(down);
            });

            describe('when player is also near the left edge of the map', function () {
                it('should move down', function () {
                    player.x = 1;
                    expect(ai.getNextMove(player)).toBe(down);
                });

            });

            describe('when player is also near the right edge of the map', function () {
                it('should move down', function () {
                    player.x = player.mapWidth - 2;
                    expect(ai.getNextMove(player)).toBe(down);
                });

            });

        });

        describe('when player is near the bottom edge of the map', function () {
            beforeEach(function () {
                player.y = player.mapHeight - 1;
            });

            it('should move up', function () {
                player.x = 9;
                expect(ai.getNextMove(player)).toBe(up);
            });

            describe('when player is also near the left edge of the map', function () {
                it('should move up', function () {
                    player.x = 1;
                    expect(ai.getNextMove(player)).toBe(up);
                });

            });

            describe('when player is also near the right edge of the map', function () {
                it('should move up', function () {
                    player.x = player.mapWidth - 2;
                    expect(ai.getNextMove(player)).toBe(up);
                });

            });

        });

        describe('when player is near the left edge of the map', function () {
            beforeEach(function () {
                player.x = 0;
            });

            it('should move right', function () {
                player.y = 9;
                expect(ai.getNextMove(player)).toBe(right);
            });

        });

        describe('when player is near the right edge of the map', function () {
            beforeEach(function () {
                player.x = player.mapWidth - 1;
            });

            it('should move left', function () {
                player.y = 9;
                expect(ai.getNextMove(player)).toBe(left);
            });

        });

        describe('when another player is nearby', function () {
            beforeEach(function () {
                player.x = 9;
                player.y = 9;
            });

            describe('when other player is above', function () {
                beforeEach(function () {
                    player.players = [{isIt: false, x: 9, y: 6}];
                });

                it('should move down', function () {
                    expect(ai.getNextMove(player)).toBe(down);
                });

                describe('when player is also near the left edge of the map', function () {
                    beforeEach(function () {
                        player.y = 17;
                        player.players = [{isIt: false, x: 9, y: 14}];
                    });

                    it('should move down', function () {
                        expect(ai.getNextMove(player)).toBe(down);
                    });

                });

            });

            describe('when other player is below', function () {
                beforeEach(function () {
                    player.players = [{isIt: false, x: 9, y: 12}];
                });

                it('should move up', function () {
                    expect(ai.getNextMove(player)).toBe(up);
                });

                describe('when player is also near the top edge of the map', function () {
                    beforeEach(function () {
                        player.y = 3;
                        player.players = [{isIt: false, x: 9, y: 8}];
                    });

                    it('should move down', function () {
                        expect(ai.getNextMove(player)).toBe(down);
                    });

                });

            });

            describe('when other player is to the left', function () {
                beforeEach(function () {
                    player.players = [{isIt: false, x: 6, y: 9}];
                });

                it('should move right', function () {
                    expect(ai.getNextMove(player)).toBe(right);
                });

                describe('when player is also near the right edge of the map', function () {
                    beforeEach(function () {
                        player.x = 17;
                        player.players = [{isIt: false, x: 12, y: 9}];
                    });

                    it('should move left', function () {
                        expect(ai.getNextMove(player)).toBe(left);
                    });

                });

            });

            describe('when other player is to the right', function () {
                beforeEach(function () {
                    player.players = [{isIt: false, x: 12, y: 9}];
                });

                it('should move left', function () {
                    expect(ai.getNextMove(player)).toBe(left);
                });

                describe('when player is also near the left edge of the map', function () {
                    beforeEach(function () {
                        player.x = 3;
                        player.players = [{isIt: false, x: 8, y: 9}];
                    });

                    it('should move right', function () {
                        expect(ai.getNextMove(player)).toBe(right);
                    });

                });

            });

        });

        describe('when multiple players are nearby', function () {
            beforeEach(function () {
                player.x = 9;
                player.y = 9;
            });

            it('should move away from the nearest player', function () {
                player.players = [{x: 5, y: 8}, {x: 11, y: 11}];
                expect(ai.getNextMove(player)).toBe(up);

                player.players = [{x: 8, y: 8}, {x: 10, y: 10}];
                expect(ai.getNextMove(player)).toBe(down);

                player.players = [{x: 8, y: 9}, {x: 10, y: 10}];
                expect(ai.getNextMove(player)).toBe(right);

                player.players = [{x: 10, y: 9}, {x: 8, y: 10}];
                expect(ai.getNextMove(player)).toBe(left);
            });


            describe('when other player is it', function () {
                it('should move away from it player first', function () {
                    player.players = [{x: 9, y: 7}, {isIt: true, x: 9, y: 14}];
                    expect(ai.getNextMove(player)).toBe(up);

                    player.players = [{x: 9, y: 11}, {isIt: true, x: 9, y: 4}];
                    expect(ai.getNextMove(player)).toBe(down);

                    player.players = [{x: 11, y: 9}, {isIt: true, x: 4, y: 9}];
                    expect(ai.getNextMove(player)).toBe(right);

                    player.players = [{x: 7, y: 9}, {isIt: true, x: 14, y: 9}];
                    expect(ai.getNextMove(player)).toBe(left);
                });

            });

            describe('when an obstacle is in the way', function () {
                it('should move in the next best way', function () {
                    player.players = [{x: 9, y: 8}, {isIt: true, x: 9, y: 14}];
                    expect(ai.getNextMove(player)).toBe(left);

                    player.players = [{x: 9, y: 10}, {isIt: true, x: 9, y: 4}];
                    expect(ai.getNextMove(player)).toBe(left);

                    player.players = [{x: 9, y: 10}, {isIt: true, x: 8, y: 4}];
                    expect(ai.getNextMove(player)).toBe(right);

                    player.players = [{x: 10, y: 9}, {isIt: true, x: 4, y: 9}];
                    expect(ai.getNextMove(player)).toBe(up);

                    player.players = [{x: 8, y: 9}, {isIt: true, x: 14, y: 9}];
                    expect(ai.getNextMove(player)).toBe(up);

                    player.players = [{x: 8, y: 9}, {isIt: true, x: 14, y: 8}];
                    expect(ai.getNextMove(player)).toBe(down);
                });

            });

        });

    });

    describe('when player is it', function () {
        beforeEach(function () {
            player = {id: 1, name: 'foo', mapWidth: 20, mapHeight: 20, x: 9, y: 9, players: [], isIt: true};
        });

        describe('when no players are nearby', function () {
            it('should move at random', function () {
                expect(ai.getNextMove(player)).not.toBeGreaterThan(right);
            });

        });

        describe('when a player is nearby', function () {
            it('should follow the player', function () {

            });

        });

    });

});