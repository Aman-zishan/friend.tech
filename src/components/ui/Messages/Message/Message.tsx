import React from 'react';

function Message({ message: { text, user }, name }: any) {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="chat-message">
      <div className="flex items-end justify-end">
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
          <div>
            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
              {text}
            </span>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
          alt="My profile"
          className="w-6 h-6 rounded-full order-2"
        />
      </div>
    </div>
  ) : (
    // <div className="messageContainer justifyEnd">
    //   <p className="sentText pr-10">{trimmedName}</p>
    //   <div className="messageBox backgroundBlue">
    //     <p className="messageText colorWhite">{text}</p>
    //   </div>
    // </div>
    <div className="chat-message">
      <div className="flex items-end">
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          <div>
            <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
              {text}
            </span>
          </div>
        </div>
        <p className="sentText pl-10">{user}</p>
      </div>
    </div>
    // <div className="messageContainer justifyStart">
    //   <div className="messageBox backgroundLight">
    //     <p className="messageText colorDark">{text}</p>
    //   </div>
    //   <p className="sentText pl-10">{user}</p>
    // </div>
  );
}

export default Message;
