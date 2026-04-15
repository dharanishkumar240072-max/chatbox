import { useState } from 'react';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  return { messages };
};
