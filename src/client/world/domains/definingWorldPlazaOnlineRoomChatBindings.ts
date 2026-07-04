import type { DefiningWorldPlazaOnlineRoomChatSnapshot } from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";

/** Live chat UI actions shared by plaza online transports. */
export type UsingWorldPlazaOnlineRoomChatResult = {
  chatSnapshot: DefiningWorldPlazaOnlineRoomChatSnapshot;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  setDraftMessage: (draftMessage: string) => void;
  sendChatMessage: () => Promise<void>;
  sendChatGifMessage: (gifId: string) => Promise<void>;
};
