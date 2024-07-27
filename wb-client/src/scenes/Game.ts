import { Scene } from 'phaser';
import { Network } from '../connection';
import { Room } from 'colyseus.js';
import { GameState, Player, WbRoomState } from '../data';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    msg_text: Phaser.GameObjects.Text;
    bomb: Phaser.GameObjects.Image;
    turn_text: Phaser.GameObjects.Text;

    playerViews: Map<number, Phaser.GameObjects.Text>;

    constructor() {
        super('Game');
        this.playerViews = new Map<number, Phaser.GameObjects.Text>();
        this.onPlayerJoined = this.onPlayerJoined.bind(this);
        this.onPlayerLeave = this.onPlayerLeave.bind(this);
        this.onRoomStateChange = this.onRoomStateChange.bind(this);
    }

    create() {
        this.camera = this.cameras.main;
        const room = Network.currentRoom();
        room.state.players.onAdd(this.onPlayerJoined);
        room.state.players.onRemove(this.onPlayerLeave);
        this.msg_text = this.add.text(innerWidth / 2, innerHeight / 2, '', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.msg_text.setOrigin(0.5);
        this.bomb = this.add.image(innerWidth / 2, innerHeight / 2, 'bomb');
        this.bomb.setDisplaySize(64, 90);
        this.turn_text = this.add.text(innerWidth / 2, innerHeight / 2 + 100, '');
        this.turn_text.setOrigin(0.5);

        room.state.onChange(() => { this.onRoomStateChange(room) });
        this.onRoomStateChange(room);
    }

    onRoomStateChange(room: Room<WbRoomState>) {
        let state = room.state.gameState;
        if (state == undefined)
            state = GameState.WAITING_FOR_PLAYERS;
        switch (state) {
            case GameState.WAITING_FOR_PLAYERS:
                this.msg_text.text = "Waiting for players";
                this.msg_text.setPosition(this.msg_text.x, innerHeight - 200);
                break;
            case GameState.COUNTDOWN:
                this.msg_text.setPosition(this.msg_text.x, innerHeight - 200);
                this.msg_text.text = "Countdown " + room.state.countdown;
                break;
            case GameState.GAME:
                this.msg_text.setPosition(this.msg_text.x, innerHeight - 200);
                this.msg_text.text = "Time " + room.state.time;
                const ind = room.state.currentPlayerIndex;
                let index = 0;
                room.state.players.forEach(pl => {
                    const view = this.playerViews.get(pl.id);
                    view?.setColor("white");
                    if (index == ind) {
                        view?.setColor("green");
                    }
                    index++;
                });

                break;
            case GameState.ENDING:
                this.msg_text.text = "Game Ended";
                break;
        }
    }

    onPlayerLeave(player: Player) {
        const text = this.playerViews.get(player.id);
        text?.destroy();
        this.playerViews.delete(player.id);
        this.updatePlayerPositions();
    }

    onPlayerJoined(player: Player) {
        const text = this.add.text(0, 0, player.name).setOrigin(0.5, 0.5);
        this.playerViews.set(player.id, text);
        text.text = player.name + "\n❤".repeat(player.heart)
        this.updatePlayerPositions();
        player.onChange(() => {
            text.text = player.name;
            text.text += "\n❤".repeat(player.heart)
        });
    }

    updatePlayerPositions() {
        const count = this.playerViews.size;
        let centerX = innerWidth / 2;
        let centerY = innerHeight / 2;
        const radius = 140;
        const anglePi = (2 * Math.PI) / count;

        let index = 0;
        this.playerViews.forEach((text, _playerId) => {
            const angle = anglePi * index;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            text.setPosition(x, y);
            index++;
        });
    }
}

