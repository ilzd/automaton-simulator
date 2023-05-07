import createGame from "./game/game";
import Server from "./server/server";

const server = new Server()
const game = createGame(server)