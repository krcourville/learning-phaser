(function (Phaser) {
    var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');
    game.state.add('main', new GAME.MainState(game,Phaser));
    game.state.start('main');
}(Phaser));