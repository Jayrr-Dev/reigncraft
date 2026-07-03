"use client";

/**
 * Club Penguin style chat input embedded in the plaza action bar.
 *
 * @module components/world/components/renderingWorldPlazaRoomChatPanel
 */

import { RenderingWorldPlazaRoomChatEmojiPicker } from "@/components/world/components/renderingWorldPlazaRoomChatEmojiPicker";
import { RenderingWorldPlazaRoomChatGifPicker } from "@/components/world/components/renderingWorldPlazaRoomChatGifPicker";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import {
  DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_INPUT_ROW_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_PICKER_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_SLOT_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_ICON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_INPUT_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_SEND_BUTTON_CLASS_NAME,
} from "@/components/world/domains/definingWorldPlazaRoomChatPanelConstants";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_MAX_MESSAGE_LENGTH,
  type DefiningWorldPlazaOnlineRoomChatSnapshot,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";
import { insertingWorldPlazaRoomChatEmojiIntoDraft } from "@/components/world/domains/insertingWorldPlazaRoomChatEmojiIntoDraft";
import { resolvingWorldPlazaRoomChatActionBarViewportStyles } from "@/components/world/domains/resolvingWorldPlazaRoomChatActionBarViewportStyles";
import { trimmingWorldPlazaRoomChatMessage } from "@/components/world/domains/trimmingWorldPlazaRoomChatMessage";
import { ImageIcon, Send, Smile } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** Placeholder for the chat input field. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_INPUT_PLACEHOLDER =
  "Say something..." as const;

/** Accessible label for the chat field. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_INPUT_LABEL =
  "Plaza chat message" as const;

/** Accessible label for the GIF picker toggle. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_TOGGLE_LABEL = "Add GIF" as const;

/** Accessible label for the emoji picker toggle. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_EMOJI_TOGGLE_LABEL = "Add emoji" as const;

/** Accessible label for the send message button. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_SEND_BUTTON_LABEL = "Send message" as const;

/** Plaza action bar toolbar selector for dismiss guard. */
const RENDERING_WORLD_PLAZA_ROOM_CHAT_PLAZA_ACTION_BAR_SELECTOR =
  '[role="toolbar"][aria-label="Plaza actions"]' as const;

/** Active attachment picker in the chat panel. */
type RenderingWorldPlazaRoomChatAttachmentPicker = "none" | "gif" | "emoji";

export interface RenderingWorldPlazaRoomChatPanelProps {
  chatSnapshot: DefiningWorldPlazaOnlineRoomChatSnapshot;
  isEnabled: boolean;
  focusContainerRef: React.RefObject<HTMLElement | null>;
  onOpenChat: () => void;
  onCloseChat: () => void;
  onDraftChange: (draftMessage: string) => void;
  onSendMessage: () => void;
  onSendGif: (gifId: string) => void;
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
}

/**
 * Club Penguin style chat input embedded in the plaza action bar.
 */
export function RenderingWorldPlazaRoomChatPanel({
  chatSnapshot,
  isEnabled,
  focusContainerRef,
  onOpenChat,
  onCloseChat,
  onDraftChange,
  onSendMessage,
  onSendGif,
  viewportHudScale = 1,
}: RenderingWorldPlazaRoomChatPanelProps): React.JSX.Element {
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeAttachmentPicker, setActiveAttachmentPicker] =
    useState<RenderingWorldPlazaRoomChatAttachmentPicker>("none");
  const canSendMessage =
    trimmingWorldPlazaRoomChatMessage(chatSnapshot.draftMessage) !== null;
  const viewportStyles = useMemo(
    () => resolvingWorldPlazaRoomChatActionBarViewportStyles(viewportHudScale),
    [viewportHudScale],
  );

  useEffect(() => {
    if (chatSnapshot.isChatOpen) {
      inputRef.current?.focus();
    } else {
      setActiveAttachmentPicker("none");
    }
  }, [chatSnapshot.isChatOpen]);

  useEffect(() => {
    if (!chatSnapshot.isChatOpen) {
      return;
    }

    const dismissingChatOnPointerDown = (event: PointerEvent): void => {
      const chatPanel = chatPanelRef.current;
      const eventTarget = event.target;

      if (!(eventTarget instanceof Node)) {
        return;
      }

      if (chatPanel?.contains(eventTarget)) {
        return;
      }

      if (
        eventTarget instanceof Element &&
        eventTarget.closest(RENDERING_WORLD_PLAZA_ROOM_CHAT_PLAZA_ACTION_BAR_SELECTOR)
      ) {
        return;
      }

      onCloseChat();
    };

    document.addEventListener("pointerdown", dismissingChatOnPointerDown);

    return () => {
      document.removeEventListener("pointerdown", dismissingChatOnPointerDown);
    };
  }, [chatSnapshot.isChatOpen, onCloseChat]);

  const checkingFocusContainerIsActive = useCallback((): boolean => {
    const focusContainer = focusContainerRef.current;

    if (!focusContainer) {
      return false;
    }

    const activeElement = document.activeElement;

    if (!activeElement) {
      return false;
    }

    return (
      focusContainer === activeElement || focusContainer.contains(activeElement)
    );
  }, [focusContainerRef]);

  const insertingEmojiIntoDraft = useCallback(
    (emoji: string): void => {
      const inputElement = inputRef.current;

      if (!inputElement) {
        onDraftChange(
          insertingWorldPlazaRoomChatEmojiIntoDraft(
            chatSnapshot.draftMessage,
            emoji,
            chatSnapshot.draftMessage.length,
            chatSnapshot.draftMessage.length,
          ).nextDraft,
        );
        return;
      }

      const { nextDraft, nextCursorPosition } =
        insertingWorldPlazaRoomChatEmojiIntoDraft(
          chatSnapshot.draftMessage,
          emoji,
          inputElement.selectionStart ?? chatSnapshot.draftMessage.length,
          inputElement.selectionEnd ?? chatSnapshot.draftMessage.length,
        );

      onDraftChange(nextDraft);
      window.requestAnimationFrame(() => {
        inputElement.focus();
        inputElement.setSelectionRange(nextCursorPosition, nextCursorPosition);
      });
    },
    [chatSnapshot.draftMessage, onDraftChange],
  );

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handlingKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape" && chatSnapshot.isChatOpen) {
        event.preventDefault();

        if (activeAttachmentPicker !== "none") {
          setActiveAttachmentPicker("none");
          return;
        }

        onCloseChat();
        return;
      }

      if (event.key !== "Enter") {
        return;
      }

      const activeElement = document.activeElement;
      const isTypingInAnotherField =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;

      if (isTypingInAnotherField && activeElement !== inputRef.current) {
        return;
      }

      if (chatSnapshot.isChatOpen) {
        event.preventDefault();
        void onSendMessage();
        return;
      }

      if (!checkingFocusContainerIsActive()) {
        return;
      }

      event.preventDefault();
      onOpenChat();
    };

    window.addEventListener("keydown", handlingKeyDown);

    return () => {
      window.removeEventListener("keydown", handlingKeyDown);
    };
  }, [
    activeAttachmentPicker,
    chatSnapshot.isChatOpen,
    checkingFocusContainerIsActive,
    isEnabled,
    onCloseChat,
    onOpenChat,
    onSendMessage,
  ]);

  if (!isEnabled || !chatSnapshot.isChatOpen) {
    return <></>;
  }

  return (
    <div
      ref={chatPanelRef}
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      className={DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_SLOT_CLASS_NAME}
      style={viewportStyles.slotStyle}
    >
      <div
        className={DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_PICKER_ANCHOR_CLASS_NAME}
      >
        <RenderingWorldPlazaRoomChatEmojiPicker
          isOpen={activeAttachmentPicker === "emoji"}
          onSelectEmoji={insertingEmojiIntoDraft}
        />
        <RenderingWorldPlazaRoomChatGifPicker
          isOpen={activeAttachmentPicker === "gif"}
          onSelectGif={(gifId) => {
            setActiveAttachmentPicker("none");
            void onSendGif(gifId);
          }}
        />
      </div>

      <div
        className={DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_INPUT_ROW_CLASS_NAME}
        style={viewportStyles.inputRowStyle}
      >
        <button
          type="button"
          aria-label={RENDERING_WORLD_PLAZA_ROOM_CHAT_EMOJI_TOGGLE_LABEL}
          aria-pressed={activeAttachmentPicker === "emoji"}
          onClick={() => {
            setActiveAttachmentPicker((currentPicker) =>
              currentPicker === "emoji" ? "none" : "emoji",
            );
          }}
          className={
            activeAttachmentPicker === "emoji"
              ? DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_BUTTON_ACTIVE_CLASS_NAME
              : DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_BUTTON_CLASS_NAME
          }
          style={viewportStyles.attachmentButtonStyle}
        >
          <Smile
            className={DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_ICON_CLASS_NAME}
            style={viewportStyles.attachmentIconStyle}
            aria-hidden
          />
        </button>
        <button
          type="button"
          aria-label={RENDERING_WORLD_PLAZA_ROOM_CHAT_GIF_TOGGLE_LABEL}
          aria-pressed={activeAttachmentPicker === "gif"}
          onClick={() => {
            setActiveAttachmentPicker((currentPicker) =>
              currentPicker === "gif" ? "none" : "gif",
            );
          }}
          className={
            activeAttachmentPicker === "gif"
              ? DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_BUTTON_ACTIVE_CLASS_NAME
              : DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_BUTTON_CLASS_NAME
          }
          style={viewportStyles.attachmentButtonStyle}
        >
          <ImageIcon
            className={DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_ICON_CLASS_NAME}
            style={viewportStyles.attachmentIconStyle}
            aria-hidden
          />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={chatSnapshot.draftMessage}
          maxLength={DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_MAX_MESSAGE_LENGTH}
          aria-label={RENDERING_WORLD_PLAZA_ROOM_CHAT_INPUT_LABEL}
          placeholder={RENDERING_WORLD_PLAZA_ROOM_CHAT_INPUT_PLACEHOLDER}
          onChange={(event) => {
            onDraftChange(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void onSendMessage();
            }

            if (event.key === "Escape") {
              event.preventDefault();
              onCloseChat();
            }
          }}
          className={DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_INPUT_CLASS_NAME}
          style={viewportStyles.inputStyle}
        />
        <button
          type="button"
          aria-label={RENDERING_WORLD_PLAZA_ROOM_CHAT_SEND_BUTTON_LABEL}
          disabled={!canSendMessage}
          onClick={() => {
            void onSendMessage();
          }}
          className={DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_SEND_BUTTON_CLASS_NAME}
          style={viewportStyles.sendButtonStyle}
        >
          <Send
            className={DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_ICON_CLASS_NAME}
            style={viewportStyles.sendIconStyle}
            aria-hidden
          />
        </button>
      </div>
      {chatSnapshot.lastSendError ? (
        <p className="absolute left-0 top-full mt-1 w-max text-[10px] text-amber-200">
          {chatSnapshot.lastSendError}
        </p>
      ) : null}
    </div>
  );
}
