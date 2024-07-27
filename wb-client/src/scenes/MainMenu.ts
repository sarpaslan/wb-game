import { Scene, GameObjects } from 'phaser';
import { Network } from '../connection';
export class MainMenu extends Scene {

    background: GameObjects.Image;
    logo: GameObjects.Image;
    text: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }
    async create() {
        this.background = this.add.image(512, 384, 'background');
        this.text = this.add.text(512, 460, "Joining a lobby", {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.logo = this.add.image(512, 300, 'logo');
        var room = await Network.joinRoom();
        if (room != null) {
            this.scene.start('Game');
        }
        else {
            this.text.setText("Something went wrong. Can't find or create lobby right now.");
        }
    }
}
