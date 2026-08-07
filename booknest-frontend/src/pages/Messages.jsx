import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listConversations } from '../api/chat.api.js';
import { ConversationList } from '../components/messaging/ConversationList.jsx';
import { MessageThread } from '../components/messaging/MessageThread.jsx';
import { EmptyState } from '../components/primitives/EmptyState.jsx';

export default function Messages() {
  const { id: activeId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listConversations()
      .then((res) => setConversations(res.data.conversations))
      .finally(() => setIsLoading(false));
  }, []);

  const activeConversation = conversations.find((c) => c._id === activeId);

  return (
    <div className="max-w-6xl mx-auto md:px-5 md:py-8">
      <h1 className="font-display text-2xl font-semibold text-ink px-4 pt-6 md:px-0 md:pt-0 mb-4 hidden md:block">
        Messages
      </h1>

      <div className="md:border md:border-hairline md:rounded-sm bg-paper-raised md:bg-paper-raised flex h-[calc(100vh-4rem)] md:h-[600px] overflow-hidden">
        {/* On mobile: show either the list OR the thread, never both.
            On desktop: split pane, per the design brief. */}
        <div
          className={
            'w-full md:w-80 md:border-r border-hairline overflow-y-auto shrink-0 ' +
            (activeId ? 'hidden md:block' : 'block')
          }
        >
          {isLoading ? (
            <p className="p-6 text-sm text-ink-soft font-mono">loading...</p>
          ) : (
            <ConversationList conversations={conversations} activeId={activeId} />
          )}
        </div>

        <div className={'flex-1 ' + (activeId ? 'block' : 'hidden md:block')}>
          {activeId ? (
            <div className="h-full flex flex-col">
              <button
                onClick={() => navigate('/messages')}
                className="md:hidden text-sm text-ink-soft px-4 py-2.5 border-b border-hairline text-left"
              >
                &larr; Back to conversations
              </button>
              <div className="flex-1 min-h-0">
                <MessageThread conversation={activeConversation} conversationId={activeId} />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center px-6">
              <EmptyState
                title="Select a conversation"
                description="Pick a thread on the left to see the messages."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
