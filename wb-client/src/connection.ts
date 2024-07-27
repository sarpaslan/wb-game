import * as Colyseus from "colyseus.js";
import { WbRoomState } from "./data";
export class Connection {
    private client: Colyseus.Client;
    private room: Colyseus.Room<WbRoomState>;
    constructor() {
        this.client = new Colyseus.Client('ws://localhost:2567');
    }
    public currentRoom(): Colyseus.Room<WbRoomState> {
        return this.room;
    }
    async joinRoom(): Promise<Colyseus.Room<WbRoomState>> {
        const joined = await this.client.joinOrCreate<WbRoomState>("my_room");
        this.room = joined;
        return joined;
    }
}
export const Network = new Connection();