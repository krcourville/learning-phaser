var menuState = {

    create: function () {
        if (!localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', 0);
        }
        if (game.global.score > localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', game.global.score);
        }

        game.add.image(0, 0, 'background');

        var nameLabel = game.add.text(game.world.centerX, -50, 'Super Coin Box', {
            font: '70px Geo',
            fill: '#ffffff'
        });
        nameLabel.anchor.setTo(0.5, 0.5);
        game.add.tween(nameLabel).to({
            y: 80
        }, 1000)
            .easing(Phaser.Easing.Bounce.Out)
            .start();

        var text = 'score: ' + game.global.score + '\nbest score: ' +
            localStorage.getItem('bestScore');

        var scoreLabel = game.add.text(game.world.centerX, game.world.centerY,
            text, {
                font: '25px Arial',
                fill: '#ffffff'
            });
        scoreLabel.anchor.setTo(0.5, 0.5);

        var starttext = null;
        if (game.device.desktop) {
            starttext = 'press the up arrow to start';
        } else {
            starttext = 'touch the screen to start';
        }

        var startLabel = game.add.text(game.world.centerX, game.world.height - 80,
            starttext, {
                font: '25px Arial',
                fill: '#ffffff'
            });
        startLabel.anchor.setTo(0.5, 0.5);
        game.add.tween(startLabel).to({
            angle: -2
        }, 500).to({
            angle: 2
        }, 500).loop().start();

        game.input.onDown.addOnce(this.start,this);

        this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
        this.muteButton.input.useHandCursor = true;
        if (game.sound.mute) {
            this.muteButton.frame = 1;
        }
    },

    toggleSound: function () {
        game.sound.mute = !game.sound.mute;
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    },

    start: function () {
        game.state.start('play');
    }
};