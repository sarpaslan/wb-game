import { Schema, MapSchema } from "@colyseus/schema";

export enum GameState {
    WAITING_FOR_PLAYERS,
    COUNTDOWN,
    GAME,
    ENDING,
}

export class Player extends Schema {
    id: number;
    name: string;
    level: number;
    heart: number;
}

export class WbRoomState extends Schema {
    language: string = "english"
    gameState: number;
    players = new MapSchema<Player>();
    started: boolean;
    countdown: number;
    time: number;
    currentPlayerIndex: number;
}