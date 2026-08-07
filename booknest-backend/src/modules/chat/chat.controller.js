import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as chatService from './chat.service.js';

export const listConversations = catchAsync(async (req, res) => {
  const conversations = await chatService.getUserConversations(req.user._id);
  return ApiResponse(res, 200, { conversations }, 'Conversations retrieved');
});

export const start = catchAsync(async (req, res) => {
  const conversation = await chatService.startConversation(req.user._id, req.body.listingId);
  return ApiResponse(res, 201, { conversation }, 'Conversation ready');
});

export const getMessages = catchAsync(async (req, res) => {
  const messages = await chatService.getMessages(req.params.id, req.user._id, req.query);
  return ApiResponse(res, 200, { messages }, 'Messages retrieved');
});