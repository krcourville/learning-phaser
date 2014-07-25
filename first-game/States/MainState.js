(function () {
    'use strict';

    window.GAME = window.GAME || {};

    GAME.MainState = function (game, Phaser) {
        //
        // PRIVATE
        var
            player,
            cursor,
            walls,
            scoreLabel,
            score,
            enemies,
            coin;

        function createWorld() {
            walls = game.add.group();
            walls.enableBody = true;

            // Create the 10 walls
            game.add.sprite(0, 0, 'wallV', 0, walls); // Left
            game.add.sprite(480, 0, 'wallV', 0, walls); // Right
            game.add.sprite(0, 0, 'wallH', 0, walls); // Top left
            game.add.sprite(300, 0, 'wallH', 0, walls); // Top right
            game.add.sprite(0, 320, 'wallH', 0, walls); // Bottom left
            game.add.sprite(300, 320, 'wallH', 0, walls); // Bottom right
            game.add.sprite(-100, 160, 'wallH', 0, walls); // Middle left
            game.add.sprite(400, 160, 'wallH', 0, walls); // Middle right
            var middleTop = game.add.sprite(100, 80, 'wallH', 0, walls);
            middleTop.scale.setTo(1.5, 1);
            var middleBottom = game.add.sprite(100, 240, 'wallH', 0, walls);
            middleBottom.scale.setTo(1.5, 1);
            // Set all the walls to be immovable
            walls.setAll('body.immovable', true);
        }

        function movePlayer() {
            if (cursor.left.isDown) {
                player.body.velocity.x = -200;
            } else if (cursor.right.isDown) {
                player.body.velocity.x = 200;
            } else {
                player.body.velocity.x = 0;
            }

            if (cursor.up.isDown && player.body.touching.down) {
                player.body.velocity.y = -320;
            }
        }

        function playerDie() {
            game.state.start('main');
        }

        function takeCoin(player, coin) {

            score += 5;
            scoreLabel.text = 'score: ' + score;
            updateCoinPosition();
        }

        function updateCoinPosition() {
            var coinPosition = [
                {
                    x: 140,
                    y: 60
                }, {
                    x: 360,
                    y: 60
                }, // Top row
                {
                    x: 60,
                    y: 140
                }, {
                    x: 440,
                    y: 140
                }, // Middle row
                {
                    x: 130,
                    y: 300
                }, {
                    x: 370,
                    y: 300
                } // Bottom row
            ];

            for (var i = 0; i < coinPosition.length; i++) {
                if (coinPosition[i].x === coin.x) {
                    coinPosition.splice(i, 1);
                }
            }

            var newPosition = coinPosition[
                game.rnd.integerInRange(0, coinPosition.length - 1)];
            coin.reset(newPosition.x, newPosition.y);

        }

        function addEnemy() {
            var enemy = enemies.getFirstDead();
            if (!enemy) {
                return;
            }

            enemy.anchor.setTo(0.5, 1);
            enemy.reset(game.world.centerX, 0);
            enemy.body.gravity.y = 500;
            enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
            enemy.body.bounce.x = 1;
            enemy.checkWorldBounds = true;
            enemy.outOfBoundsKill = true;
        }
        //
        // PUBLIC
        function preload() {
            game.load.image('player', 'assets/player.png');
            game.load.image('wallV', 'assets/wallVertical.png');
            game.load.image('wallH', 'assets/wallHorizontal.png');
            game.load.image('coin', 'assets/coin.png');
            game.load.image('enemy', 'assets/enemy.png');
        }

        function create() {
            game.stage.backgroundColor = '#3498db';
            game.physics.startSystem(Phaser.Physics.ARCADE);

            player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
            player.anchor.setTo(0.5, 0.5);
            game.physics.arcade.enable(player);
            player.body.gravity.y = 500;

            cursor = game.input.keyboard.createCursorKeys();

            createWorld();

            coin = game.add.sprite(60, 140, 'coin');
            game.physics.arcade.enable(coin);
            coin.anchor.setTo(0.5, 0.5);
            scoreLabel = game.add.text(30, 30, 'score: 0', {
                font: '18px Arial',
                fill: '#ffffff'
            });
            score = 0;

            enemies = game.add.group();
            enemies.enableBody = true;
            enemies.createMultiple(10, 'enemy');
            game.time.events.loop(2200, addEnemy);
        }

        function update() {
            game.physics.arcade.collide(player, walls);
            game.physics.arcade.collide(enemies,walls);
            
            game.physics.arcade.overlap(player, coin, takeCoin, null);
            game.physics.arcade.overlap(player, enemies, playerDie, null);
            
            movePlayer();
            
            if (!player.inWorld) {
                playerDie();
            }
        }

        return {
            preload: preload,
            create: create,
            update: update
        };

    };

}());