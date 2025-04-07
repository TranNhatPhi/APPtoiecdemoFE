// src/socket.ts
import { io } from "socket.io-client";

const socket = io("https://app-toiec-be-v4.onrender.com"); // ⚠️ chỉnh IP nếu khác

export default socket;
