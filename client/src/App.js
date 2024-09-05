import "./App.css";
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); 

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); 
  const [isNameSet, setIsNameSet] = useState(false); 
  const endOfMessagesRef = useRef(null); 

  useEffect(() => {

    socket.on('chatMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      console.log("react sucks!");
      socket.off('chatMessage');
    };
  }, []);

  useEffect(() => {
  
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name) {
      setIsNameSet(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      const chatMessage = { name, message };
      socket.emit('chatMessage', chatMessage); 
      setMessage('');
    }
  };

  return (
    <div className="App">
      {!isNameSet ? (
        <form onSubmit={handleNameSubmit}>
          <h2>Enter your name to join the chat</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <button type="submit">Join Chat</button>
        </form>
      ) : (
        <div className="chat-window">
          <h1 className="username">Welcome, {name}!</h1>
          <div className="messages">
            {messages.map((msg, index) => (
              <div className="sinlemsg" key={index}>
                <strong>{msg.name}: </strong>{msg.message}
              </div>
            ))}
            
            <div ref={endOfMessagesRef} />
          </div>
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
              required
            /><br></br><br></br>
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
