import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { serverLink } from "./constants/frontendLinks";

const createSocketServer = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: serverLink,
      methods: ["GET", "POST"],
    },
  });

  // Array of roomIds and map of socketIds to roles
  const roomRoles: { [roomId: string]: { [socketId: string]: string } } = {};
  const roomUserCounts: {
    [roomId: string]: { mentorId?: string; studentCount: number };
  } = {};

  //Helper function to handle disconnection
  const handleDisconnect = (socket, roomId) => {
    if (roomRoles[roomId]?.[socket.id] === "Mentor") {
      io.to(roomId).emit("mentorDisconnected");
      io.sockets.in(roomId).disconnectSockets(true);
      delete roomRoles[roomId];
      delete roomUserCounts[roomId];
    } else {
      roomUserCounts[roomId].studentCount -= 1;
      delete roomRoles[roomId][socket.id];
      io.to(roomId).emit("updateRoomStatus", roomUserCounts[roomId]);
    }
  };

  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ roomId }) => {
      socket.join(roomId);

      roomRoles[roomId] = roomRoles[roomId] || {};
      roomUserCounts[roomId] = roomUserCounts[roomId] || { studentCount: 0 };

      const room = io.sockets.adapter.rooms.get(roomId);
      const role = room?.size === 1 ? "Mentor" : "Student";
      roomRoles[roomId][socket.id] = role;

      if (role === "Mentor") {
        roomUserCounts[roomId].mentorId = socket.id;
      } else {
        roomUserCounts[roomId].studentCount += 1;
      }

      socket.emit("roleAssigned", role);

      const { mentorId, studentCount } = roomUserCounts[roomId];
      io.to(roomId).emit("updateRoomStatus", { mentorId, studentCount });

      socket.on("codeChange", ({ code, userId }) => {
        socket.to(roomId).emit("codeChange", { code, userId });
      });

      socket.on("submissionResult", (isCorrect: boolean) => {
        const roomId = Array.from(socket.rooms).find(
          (room) => room !== socket.id
        );
        if (roomId) {
          io.to(roomId).emit("submissionResult", isCorrect);
        }
      });

      socket.on("disconnect", () => handleDisconnect(socket, roomId));
    });
  });

  return io;
};

export default createSocketServer;
