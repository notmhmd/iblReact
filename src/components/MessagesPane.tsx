import * as React from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import AvatarWithStatus from "./AvatarWithStatus";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import MessagesPaneHeader from "./MessagesPaneHeader";
import { ChatProps, MessageProps } from "../types";

type MessagesPaneProps = {
  chat: ChatProps;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const { chat } = props;
  const [chatMessages, setChatMessages] = React.useState<MessageProps[]>([]);
  const [textAreaValue, setTextAreaValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [chatType, setChatType] = React.useState<
    "tutor" | "prompt" | undefined
  >("prompt");

  const sendMessage = (message: string) => {
    let payload = {};
    switch (chatType) {
      case "tutor":
        payload = {
          tutor: message,
        };
        break;

      case "prompt":
        payload = {
          message,
        };
        break;
    }
    if (socket && message.trim() !== "") {
      socket.send(JSON.stringify(payload));
    }
  };

  React.useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/chat/?key=123");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newId = chatMessages.length + 1;
      setChatMessages((messages) => {
        return [
          ...messages,
          {
            id: newId.toString(),
            sender: "Server",
            content: data.message,
            timestamp: "Just now",
          },
        ];
      });
      setError(null);
    };

    ws.onerror = (error) => {
      setError("WebSocket error");
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <Sheet
      sx={{
        height: { xs: "calc(100dvh - var(--Header-height))", lg: "100dvh" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      <MessagesPaneHeader sender={chat?.sender || ""} />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: "scroll",
          flexDirection: "column-reverse",
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {chatMessages.map((message: MessageProps, index: number) => {
            const isYou = message.sender === "You";
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                flexDirection={isYou ? "row-reverse" : "row"}
              >
                <ChatBubble
                  variant={isYou ? "sent" : "received"}
                  {...message}
                />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        options={["tutor", "prompt"]}
        onOptionsChange={(option) => setChatType(option)}
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={() => {
          const newId = chatMessages.length + 1;
          const newIdString = newId.toString();
          sendMessage(textAreaValue);
          setChatMessages((messages) => {
            return [
              ...messages,
              {
                id: newIdString,
                sender: "You",
                content: textAreaValue,
                timestamp: "Just now",
              },
            ];
          });
        }}
      />
    </Sheet>
  );
}
