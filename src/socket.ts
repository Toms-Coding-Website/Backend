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

  const roomRoles: { [roomId: string]: { [socketId: string]: string } } = {};
  const roomUserCounts: {
    [roomId: string]: { mentorId?: string; studentCount: number };
  } = {};

  io.on("connection", (socket) => {
    // Handle joining a room
    socket.on("joinRoom", ({ roomId }) => {
      socket.join(roomId);

      // Initialize room data if not already present
      roomRoles[roomId] = roomRoles[roomId] || {};
      roomUserCounts[roomId] = roomUserCounts[roomId] || { studentCount: 0 };

      // Determine the user's role
      const room = io.sockets.adapter.rooms.get(roomId);
      const role = room && room.size === 1 ? "Mentor" : "Student";
      roomRoles[roomId][socket.id] = role;

      // Update the user count
      if (role === "Mentor") {
        roomUserCounts[roomId].mentorId = socket.id;
      } else {
        roomUserCounts[roomId].studentCount += 1;
      }

      // Emit role assignment to the new user
      socket.emit("roleAssigned", role);

      // Notify all users in the room about the updated status
      io.to(roomId).emit("updateRoomStatus", {
        mentorId: roomUserCounts[roomId].mentorId,
        studentCount: roomUserCounts[roomId].studentCount,
      });

      // Handle live code changes (from the student)
      socket.on("codeChange", (code) => {
        io.to(roomId).emit("codeChange", code);
      });

      // Handle code submission (from the student)
      socket.on("submissionResult", (isCorrect: boolean) => {
        const roomId = Array.from(socket.rooms).find(
          (room) => room !== socket.id
        );
        if (roomId) {
          io.to(roomId).emit("submissionResult", isCorrect);
        }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        socket.leave(roomId);

        // Check if the disconnected user is the mentor
        if (roomRoles[roomId][socket.id] === "Mentor") {
          // Disconnect all users in the room if the mentor disconnects
          io.to(roomId).emit("mentorDisconnected");
          io.sockets.in(roomId).disconnectSockets(true);
          delete roomRoles[roomId];
          delete roomUserCounts[roomId];
        } else {
          // Update the student count
          roomUserCounts[roomId].studentCount -= 1;
          delete roomRoles[roomId][socket.id];
          io.to(roomId).emit("updateRoomStatus", roomUserCounts[roomId]);
        }
      });
    });
  });

  return io;
};

export default createSocketServer;
