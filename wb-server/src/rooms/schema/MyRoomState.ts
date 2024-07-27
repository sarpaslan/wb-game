import { Schema, MapSchema, Context, type } from "@colyseus/schema";

export enum GameState {
  WAITING_FOR_PLAYERS,
  COUNTDOWN,
  GAME,
  ENDING,
}

export class Player extends Schema {
  @type("number") id: number;
  @type("string") name: string;
  @type("number") level: number;
  @type("number") heart: number;
}

export class WbRoomState extends Schema {
  @type("string") language: string = "english"
  @type("number") gameState: number;
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("boolean") started: boolean;
  @type("number") countdown: number;
  @type("number") time: number;
  @type("number") currentPlayerIndex: number;
}
