import { Room, Delayed, Client } from "@colyseus/core";
import { GameState, WbRoomState } from "./schema/MyRoomState";
import { Player } from "./schema/MyRoomState";

export class WbRoom extends Room<WbRoomState> {
  static ID: number = 0;
  maxClients = 8;
  public delayedInterval!: Delayed;

  onCreate(options: any) {
    this.setState(new WbRoomState());
    this.onMessage("type", (client, message) => {
    });
  }

  newPlayer(client: Client): Player {
    const player = new Player();
    player.name = this.getRandomName();
    player.level = 1;
    player.heart = 3;
    player.id = WbRoom.ID++;
    return player;
  }

  saveToDatabase(player: Player, client: Client) {
    //TODO save
  }
  //TODO check if exist in databse
  checkIfPlayerExist(client: Client): Player {
    return null;
  }

  getOrCreatePlayer(client: Client): Player {
    let player: Player;
    player = this.checkIfPlayerExist(client);
    if (player == null) {
      player = this.newPlayer(client);
      this.saveToDatabase(player, client);
    }
    return player;
  }

  onJoin(client: Client, options: any) {
    const player = this.getOrCreatePlayer(client);
    this.state.players.set(client.sessionId, player);
    if (this.shouldGameStart()) {
      this.startGame();
    }
  }

  shouldGameStart(): boolean {
    return !this.state.started && this.state.players.size >= 2;
  }

  getRandomItem<T>(set: Set<T>): T {
    return Array.from(set)[Math.floor(Math.random() * set.size)];
  }
  selectRandomIndex() {
    const playersArray = Array.from(this.state.players.values());
    const randomIndex = Math.floor(Math.random() * playersArray.length);
    this.state.currentPlayerIndex = randomIndex;
  }
  nextPlayer() {
    const playersArray = Array.from(this.state.players.values());
    const index = (this.state.currentPlayerIndex + 1) % this.state.players.size;
    this.state.currentPlayerIndex = index;
  }

  reset() {
    this.state.gameState = GameState.WAITING_FOR_PLAYERS;
    this.state.started = false;
    this.state.countdown = 3;
    this.state.time = 10;
    this.selectRandomIndex();
    this.state.players.forEach(Player => {
      Player.heart = 3;
    });
    this.clock.stop();
    this.delayedInterval?.clear();
  }

  resetTime() {
    this.state.time = 10;
  }

  startGame() {
    if (!this.state) {
      console.error("State is not defined");
      return;
    }
    this.reset();
    this.state.started = true;
    this.clock.start();
    this.delayedInterval = this.clock.setInterval(() => {
      const gameState = this.state.gameState;
      switch (gameState) {
        case GameState.WAITING_FOR_PLAYERS:
          if (this.state.players.size >= 2)
            this.state.gameState = GameState.COUNTDOWN;
          break;
        case GameState.COUNTDOWN:
          this.state.countdown--;
          if (this.state.countdown == 0) {
            this.state.gameState = GameState.GAME;
          }
          break;
        case GameState.GAME:
          this.state.time--;
          if (this.state.time <= 0) {
            this.nextPlayer();
            this.resetTime();
          }
          break;
        case GameState.ENDING:
          break;
      }
    }, 1000);
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
    if (!this.state.started)
      return;
    if (this.state.players.size <= 1)
      this.reset();
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
    this.reset();
  }

  getRandomName(): string {
    const names = [
      "Alice", "Bob", "Charlie", "David", "Eve",
      "Faythe", "Grace", "Heidi", "Ivan", "Judy",
      "Karl", "Liam", "Mia", "Noah", "Olivia",
      "Paul", "Quinn", "Ryan", "Sophia", "Trent"
    ];

    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  }
}
