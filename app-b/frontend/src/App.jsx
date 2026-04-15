import React, { useState, useEffect } from 'react';
import { Send, User, LogOut, Trash2 } from 'lucide-react';
import './index.css';
import { 
  collection, query, orderBy, onSnapshot, doc, setDoc, getDoc, addDoc, deleteDoc
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { db, auth } from './firebase'; 

function App() {
  // Global States
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [view, setView] = useState('auth'); // 'auth', 'dashboard', 'chat'
  
  // Auth Form States
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');

  // Chat States
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // 1. Listen for Firebase Auth Status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
        } catch(e) {
          console.warn("Could not fetch profile", e);
        }
        setView('dashboard');
      } else {
        setView('auth');
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Auth Actions
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', cred.user.uid), {
          name: name || 'Anonymous',
          email: email
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setEmail(''); setPassword(''); setName('');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // 3. Realtime Chat Listener
  useEffect(() => {
    if (view !== 'chat' && view !== 'dashboard') return;

    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    }, (error) => {
      console.warn("Firestore error:", error.message);
      setMessages([{ id: 1, text: "Configure authentic Firebase keys to see live messages.", sender: "System" }]);
    });

    return () => unsubscribe();
  }, [view]);

  // 4. Send Message (Direct to Firestore to bypass missing Admin Keys)
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentName = profile?.name || user?.email || 'Unknown';

    try {
      await addDoc(collection(db, 'messages'), {
        text: input,
        sender: currentName,
        timestamp: Date.now()
      });
      setInput('');
    } catch(err) {
      console.error("Firebase write failed", err);
      alert("Send Error: " + err.message + "\nIf this says missing permissions, your Firestore Rules need to be set to allow writes!");
    }
  };

  const deleteMessage = async (msgId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, 'messages', msgId));
      } catch (err) {
        console.error("Failed to delete message", err);
        alert("Could not delete message. Check permissions.");
      }
    }
  };

  // RENDERS
  if (view === 'auth') {
    return (
      <div className="glass-panel app-b-theme auth-view">
        <User size={48} className="avatar" style={{marginBottom: 15}} />
        <h2>{isRegister ? 'Create Go Account' : 'Golang Chat Login'}</h2>
        {authError && <p style={{color: '#ef4444', fontSize: '0.8rem'}}>{authError}</p>}
        
        <form className="auth-form" onSubmit={handleAuth}>
          {isRegister && (
            <input 
              type="text" required placeholder="Your Name" 
              className="input-field" value={name} onChange={e => setName(e.target.value)}
            />
          )}
          <input 
            type="email" required placeholder="Email Address" 
            className="input-field" value={email} onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" required placeholder="Password" 
            className="input-field" value={password} onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <button className="btn-secondary" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    );
  }

  if (view === 'dashboard') {
    return (
      <div className="glass-panel app-b-theme dashboard-view">
        <h2>Go Dashboard</h2>
        <div className="profile-card">
          <h3 style={{margin: '0 0 10px 0'}}>Profile Data</h3>
          <p style={{margin: 4}}><strong>Name:</strong> {profile?.name || 'Loading...'}</p>
          <p style={{margin: 4}}><strong>Email:</strong> {user?.email}</p>
        </div>
        <button className="btn-primary" onClick={() => setView('chat')}>
          Enter Global Chat
        </button>
        <button className="btn-secondary" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    );
  }

  // view === 'chat'
  return (
    <div className="glass-panel app-b-theme chat-container">
      <div className="chat-header">
        <div className="header-info">
          <User className="avatar" />
          <h2 style={{margin: 0, fontSize: '1.2rem'}}>Go Chat</h2>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <button className="logout-btn" onClick={() => setView('dashboard')}>Dashboard</button>
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) => {
          const isMe = msg.sender === (profile?.name || user?.email);
          return (
            <div key={msg.id} className={`message ${isMe ? 'sent' : 'received'}`}>
              <div className="message-bubble">{msg.text}</div>
              <div className="message-sender">{msg.sender}</div>
              {isMe && (
                <button 
                  className="icon-btn chat-delete-btn" 
                  onClick={() => deleteMessage(msg.id)}
                  title="Delete message"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <form className="chat-input-area" onSubmit={sendMessage}>
        <input 
          type="text" 
          placeholder="Start typing..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default App;
