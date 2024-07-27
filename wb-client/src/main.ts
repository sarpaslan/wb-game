import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from "phaser";

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: innerWidth,
    height: innerHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    // scale: {
    //     mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    // },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
    ]
};

export default new Game(config);
