import { formatDistanceToNow } from 'date-fns';

function ChatList({ chats, currentUserId, onSelectChat, selectedChatId }) {
  const getOtherParticipant = (chat) => {
    if (chat.type === 'direct') {
      return chat.participants.find(p => p._id !== currentUserId);
    }
    return null;
  };

  const getLastMessagePreview = (chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    if (chat.lastMessage.type === 'image') {
      return '📷 Image';
    }
    if (chat.lastMessage.type === 'file') {
      return `📎 ${chat.lastMessage.fileName || 'File'}`;
    }
    return chat.lastMessage.content || 'No messages yet';
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <p>No chats yet. Start a new conversation!</p>
        </div>
      ) : (
        chats.map((chat) => {
          const otherParticipant = getOtherParticipant(chat);
          const isSelected = selectedChatId === chat._id;

          return (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {otherParticipant?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  {otherParticipant?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {otherParticipant?.username || chat.name || 'Unknown'}
                    </h3>
                    {chat.lastMessageAt && (
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {getLastMessagePreview(chat)}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ChatList;
