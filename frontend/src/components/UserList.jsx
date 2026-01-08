function UserList({ users, onSelectUser, onClose }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">New Chat</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No users available</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => onSelectUser(user._id)}
              className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {user.isOnline ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserList;
