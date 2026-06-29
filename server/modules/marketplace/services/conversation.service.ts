import { Op } from "@sequelize/core";
import { sequelize } from "@/config/database.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { Listing } from "../models/listing.model.js";
import { HttpError } from "@/utils/httpError.js";
import { StartConversationInput, SendMessageInput } from "../validations/conversation.schema.js";

class ConversationService {
  async startOrGetConversation(userId: number, data: StartConversationInput) {
    const { listingId, message } = data;

    const listing = await Listing.findByPk(listingId);
    if (!listing) throw HttpError.notFound("آگهی یافت نشد.");

    if (listing.userId === userId) {
      throw HttpError.badRequest("شما نمیتوانید با خودتان چت کنید.");
    }

    const sellerId = listing.userId;

    let conversation = await Conversation.findOne({
      where: { listingId, buyerId: userId, sellerId },
    });

    if (!conversation) {
      conversation = await sequelize.transaction(async (t) => {
        const newConv = await Conversation.create(
          {
            listingId,
            buyerId: userId,
            sellerId,
          },
          { transaction: t },
        );

        await Message.create(
          { conversationId: newConv.id, senderId: userId, content: message },
          { transaction: t },
        );

        return newConv;
      });
    } else {
      await Message.create({
        conversationId: conversation.id,
        senderId: userId,
        content: message,
      });

      conversation.lastMessageAt = new Date();
      await conversation.save();
    }
  }

  async sendMessage(userId: number, data: SendMessageInput) {
    const { conversationId } = data.params;
    const { content } = data.body;

    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) throw HttpError.notFound("گفت‌وگو یافت نشد.");

    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      throw HttpError.forbidden("شما دسترسی به این گفت‌وگو ندارید.");
    }

    const message = await Message.create({
      conversationId,
      senderId: userId,
      content,
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    return message;
  }

  async getUserConversations(userId: number) {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: [{ model: Listing, as: "listing", attributes: ["id", "title", "thumbnail"] }],
      order: [["lastMessageAt", "DESC"]],
    });

    return conversations;
  }

  async getConversationMessages(conversationId: number, userId: number) {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) throw HttpError.notFound("گفت‌وگو یافت نشد.");

    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      throw HttpError.forbidden("شما دسترسی به این گفت‌وگو ندارید.");
    }

    const messages = await Message.findAll({
      where: { conversationId },
      order: [["createdAt", "ASC"]],
    });

    return messages;
  }
}

export const conversationService = new ConversationService();
