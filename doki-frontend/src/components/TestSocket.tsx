import { socket } from "@/lib/socket";
import { useEffect } from "react";

export default function TestSocket() {
  useEffect(() => {
    const handleConnect = () => {
      socket.emit("join_board", { boardId: "123" });
    };

    const handleConnectError = (err: Error) => {
      console.log("Connection Error:", err.message);
    };

    const handleDisconnect = (reason: string) => {
      console.log("Disconnect:", reason);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return <div>testing</div>;
}
