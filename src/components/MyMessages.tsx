import * as React from "react";
import Sheet from "@mui/joy/Sheet";
import MessagesPane from "./MessagesPane";
import { ChatProps } from "../types";
import { chats } from "../data";

export default function MyProfile() {
  const [selectedChat, setSelectedChat] = React.useState<ChatProps>(chats[0]);
  return (
    <Sheet
      sx={{
        flex: 1,
        width: "100%",
        mx: "auto",
        pt: { xs: "var(--Header-height)", sm: 0 },
        display: "grid",
      }}
    >
      <MessagesPane chat={selectedChat} />
    </Sheet>
  );
}
