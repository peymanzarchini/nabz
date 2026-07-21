import { User } from "@/modules/auth/types";
import { EmojiClickData } from "emoji-picker-react";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { UseFormReturn } from "react-hook-form";
import { PasswordFormValues, ProfileFormValues } from "../validations/settingsSchema";
import { UseMutationResult } from "@tanstack/react-query";

export interface GetLocation {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  latitude: string | number | null;
  longitude: string | number | null;
  districts?: GetLocation[];
}

export interface FormValues {
  title: string;
  description: string;
  condition: "new" | "used";
  isNegotiable: boolean;
  cityId: string;
  districtId: string;
  latitude?: number;
  longitude?: number;
  categoryId?: string;
}

export interface ConversationUser {
  id: string;
  firstName: string;
  lastName: string;
  lastSeen: string | null;
  avatar: string | null;
}

export interface Conversation {
  id: string;
  listing: { id: string; title: string; thumbnail: string | null };
  buyer: ConversationUser;
  seller: ConversationUser;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead?: boolean;
}

export interface Stats {
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  rejectedListings: number;
  pendingReviews: number;
}

export interface Review {
  id: string;
  rating: number | null;
  comment: string;
  user: { firstName: string; lastName: string };
  listing: { title: string };
}

export interface NotificationMessage {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
}

export interface PanelLink {
  href: string;
  label: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  roles: string[];
}

export interface ChatSidebarProps {
  conversations: Conversation[] | undefined;
  loadingConvs: boolean;
  activeConvId: string | null;
  setActiveConvId: (id: string) => void;
  userId?: string;
}

export interface ChatWindowProps {
  activeConvId: string | null;
  otherUser: Conversation["buyer"] | null;
  loadingMsgs: boolean;
  liveMessages: Message[];
  isTyping: boolean;
  showEmoji: boolean;
  setShowEmoji: (val: boolean) => void;
  messageText: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmojiClick: (emojiData: EmojiClickData) => void;
  handleSend: (e: React.SubmitEvent) => void;
  sendMessageMutation: { isPending: boolean };
  setActiveConvId: (id: null) => void;
  userId?: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface ProfileFormProps {
  user: User | null;
  avatarPreview: string | null;
  profileForm: UseFormReturn<ProfileFormValues>;
  profileMutation: UseMutationResult<User, Error, ProfileFormValues, unknown>;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAvatar: () => void;
}

export interface PasswordFormProps {
  passwordForm: UseFormReturn<PasswordFormValues>;
  passwordMutation: UseMutationResult<void, Error, PasswordFormValues, unknown>;
}
