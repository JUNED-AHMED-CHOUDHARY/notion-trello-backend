import { Namespace, Server, Socket } from "socket.io";
import SocketIndexSetup from "./Socket.index.setup.js";
import { decodeJWTToken } from "../../utility/controller.utility.js";

const handlers: any[] = [
  {
    nameSpace: "/",
    handler: (socket: Socket) => {
      console.log("handler: client connected (server-side)");

      // Example: listen for a custom event named 'hello'
      socket.on("hello", payload => {
        console.log("received hello:", payload);
        socket.emit("hello_response", { ok: true, echo: payload });
      });

      socket.on("join_room", payload => {
        console.log("karu kya iska ??", payload);
      });

      // If you want a one-time log of the authenticated user:
      console.log("Authenticated user on server (if any):", (socket as any).user);
    },
  },
];

// Auth middleware - validates JWT token for all connections
const authMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    // Verify JWT token
    const decoded = await decodeJWTToken(token);

    // Attach user info to socket for later use
    (socket as any).user = decoded;

    console.log(`Authenticated user: ${(decoded as any).userId || (decoded as any).id}`);
    next();
  } catch (error: any) {
    console.error("Socket authentication failed:", error.message);
    next(new Error("Invalid authentication token"));
  }
};

class SocketEventHandlers {
  private io: Server | undefined;
  private nameSpace: string;
  private nsp: Namespace;

  public constructor(nameSpace: string, handler: (socket: Socket) => void, skipAuth: boolean = false) {
    this.nameSpace = nameSpace;
    this.io = SocketIndexSetup.getIo();

    this.nsp = this.io?.of(this.nameSpace) as Namespace;

    // Apply authentication middleware by default (unless skipAuth is true)
    if (!skipAuth) {
      this.nsp.use(authMiddleware);
    }

    this.init(handler);
    this.start();
  }

  private init(handler: (socket: Socket) => void) {
    this.nsp.on("connection", (socket: Socket) => {
      console.log(`new connection ${socket.id}`);
      try {
        handler(socket);
      } catch (error: any) {
        console.log(`Error in connection handler: ${error.message}`);
        socket.emit("server_error", "An error occurred during connection setup.");
      }

      // Add common disconnect logic
      socket.on("disconnect", reason => {
        console.log(`Socket disconnected: ${socket.id}. Reason: ${reason}`);
      });
    });
  }

  private start() {
    console.log(`handler listening on namespace ${this.nameSpace}`);
  }

  public broadcast(event: string, ...args: any[]): void {
    this.nsp.emit(event, ...args);
  }

  public emitToRoom(room: string, event: string, ...args: any[]): void {
    this.nsp.to(room).emit(event, ...args);
  }
}

export function registerSocketEvents() {
  handlers.map(handler => new SocketEventHandlers(handler.nameSpace, handler.handler));
}
