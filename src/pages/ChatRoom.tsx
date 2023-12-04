import React, { useState, useEffect, useRef } from 'react';
import queryString from 'query-string';
import ScrollToBottom from 'react-scroll-to-bottom';
import { io, Socket } from 'socket.io-client';

import Messages from '@/components/ui/Messages/Messages';
import TextContainer from '@/components/ui/TextContainer/TextContainer';
import Message from '@/components/ui/Messages/Message/Message';

// If using React Router, you can import the type for location
// import { Location } from 'react-router-dom';

interface ChatRoomProps {
  location: {
    search: string;
  };
}

interface IMessage {
  user: string;
  text: string;
}

export default function ChatRoom() {
  const ENDPOINT = 'http://localhost:5999';
  const [name, setName] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const { name, room } = queryString.parse(window.location.search);
    socketRef.current = io(ENDPOINT);

    socketRef.current.emit('joinRoom', { name, room }, (error: string) => {
      if (error) {
        alert(error);
      }
    });

    setName(name as string);
    setRoom(room as string);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [window.location.search]);

  useEffect(() => {
    socketRef.current?.on('message', (message: IMessage) => {
      setMessages((msgs) => [...msgs, message]);
    });

    socketRef.current?.on('roomData', ({ users }: { users: string[] }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (message && socketRef.current) {
      socketRef.current.emit('sendMessage', message, () => setMessage(''));
    }
  };
  // useEffect(() => {
  //   const { name, room } = queryString.parse(window.location.search);

  //   const newSocket = io(ENDPOINT);
  //   setSocket(newSocket);

  //   newSocket.on('connect_error', (error: any) => {
  //     console.log(error);
  //     alert(
  //       'Sorry, there seems to be an issue with the connection! Try refreshing'
  //     );
  //   });

  //   console.log(name, room);

  //   setName(name as string);
  //   setRoom(room as string);

  //   newSocket.emit('joinRoom', { name, room }, (error: any) => {
  //     if (error) {
  //       alert(error);
  //     }
  //   });

  //   newSocket.on('message', (message) => {
  //     setMessages((messages) => [...messages, message]);
  //   });

  //   newSocket.on('roomData', ({ users }) => {
  //     setUsers(users);
  //   });

  //   // clean up to close instance to avoid side effects
  //   return () => {
  //     newSocket.close();
  //   };
  // }, [ENDPOINT, window.location.search]);

  // const sendMessage = (event: any) => {
  //   event.preventDefault();

  //   if (message) {
  //     console.log(message);
  //     console.log(socket);
  //     socket!.emit('sendMessage', message, () => setMessage(''));
  //   }
  // };

  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <h3>{room}</h3>
        <ScrollToBottom className="messages">
          {messages.map((message: any, i: any) => (
            <div key={i}>
              <Message message={message} name={name} />
            </div>
          ))}
        </ScrollToBottom>
        <form className="form">
          <input
            className="input"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyPress={(event) =>
              event.key === 'Enter' ? sendMessage(event) : null
            }
          />
          <button
            className="sendButton"
            onClick={(event) => sendMessage(event)}
          >
            Send
          </button>
        </form>
      </div>
      <TextContainer users={users} />
    </div>
  );
}
