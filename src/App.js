import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { 
  MessageSquare, 
  Code, 
  Image as ImageIcon, 
  FileText, 
  Bug, 
  RefreshCw, 
  Upload, 
  Send 
} from 'lucide-react';

// Services
import { geminiService } from './services/gemini.js';

// Components
const Navbar = () => (
  <nav className="bg-slate-900 text-white p-4">
    <div className="container mx-auto">
      <div className="flex flex-wrap items-center justify-between">
        <Link to="/" className="text-xl font-bold">Gemini AI Tool</Link>
        <div className="flex space-x-4">
          <Link to="/image-to-code" className="hover:text-blue-400 flex items-center gap-2">
            <ImageIcon size={20} />
            Image en Code
          </Link>
          <Link to="/code-conversion" className="hover:text-blue-400 flex items-center gap-2">
            <RefreshCw size={20} />
            Conversion
          </Link>
          <Link to="/code-correction" className="hover:text-blue-400 flex items-center gap-2">
            <Code size={20} />
            Correction
          </Link>
          <Link to="/debugging" className="hover:text-blue-400 flex items-center gap-2">
            <Bug size={20} />
            Débogage
          </Link>
          <Link to="/file-chat" className="hover:text-blue-400 flex items-center gap-2">
            <FileText size={20} />
            Fichiers
          </Link>
          <Link to="/programming-chat" className="hover:text-blue-400 flex items-center gap-2">
            <MessageSquare size={20} />
            Chat Dev
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

const ChatBox = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState('');

  return (
    <div className="border rounded-lg p-4 mt-4">
      <div className="h-48 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 mb-2 rounded ${
            msg.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
          } max-w-[80%]`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Posez votre question..."
        />
        <button
          onClick={() => {
            onSendMessage(message);
            setMessage('');
          }}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

const LanguageSelect = ({ value, onChange, includeCustom = true }) => {
  const [customLang, setCustomLang] = useState('');
  const languages = [
    'react',
    'svg',
    'react native',
    'swift ui',
    'html css bootstrap',
    'angular',
    'kotlin xml',
    'kotlin jetpack compose'
  ];

  return (
    <div className="flex gap-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Sélectionnez un langage</option>
        {languages.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
        {customLang && <option value={customLang}>{customLang}</option>}
      </select>
      {includeCustom && (
        <input
          type="text"
          placeholder="Autre langage..."
          className="p-2 border rounded"
          value={customLang}
          onChange={(e) => {
            setCustomLang(e.target.value);
            if (e.target.value) onChange(e.target.value);
          }}
        />
      )}
    </div>
  );
};

const ImageToCode = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetLang, setTargetLang] = useState('');
  const [messages, setMessages] = useState([]);

  const handleGenerate = async () => {
    if (!selectedFile || !targetLang) {
      alert('Veuillez sélectionner une image et un langage cible');
      return;
    }

    try {
      setMessages([...messages, { sender: 'user', text: 'Génération du code en cours...' }]);
      const generatedCode = await geminiService.generateFromImage(selectedFile, targetLang);
      setMessages([
        ...messages,
        { sender: 'user', text: 'Génération du code en cours...' },
        { sender: 'assistant', text: generatedCode }
      ]);
    } catch (error) {
      setMessages([
        ...messages,
        { sender: 'user', text: 'Génération du code en cours...' },
        { sender: 'assistant', text: `Erreur: ${error.message}` }
      ]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image en Code</h1>
      <div className="space-y-4">
        <div className="border-2 border-dashed p-4 text-center rounded">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="mx-auto mb-2" size={24} />
            <div>Cliquez ou déposez une image</div>
          </label>
        </div>
        
        <LanguageSelect value={targetLang} onChange={setTargetLang} />
        
        <button
          onClick={handleGenerate}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Générer le Code
        </button>
        
        <ChatBox
          messages={messages}
          onSendMessage={(text) => setMessages([...messages, { sender: 'user', text }])}
        />
      </div>
    </div>
  );
};

const CodeConversion = () => {
  const [sourceLang, setSourceLang] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [messages, setMessages] = useState([]);

  const handleGenerate = async () => {
    if (!sourceCode || !sourceLang || !targetLang) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      setMessages([...messages, { sender: 'user', text: 'Conversion en cours...' }]);
      const convertedCode = await geminiService.convertCode(sourceCode, sourceLang, targetLang);
      setMessages([
        ...messages,
        { sender: 'user', text: 'Conversion en cours...' },
        { sender: 'assistant', text: convertedCode }
      ]);
    } catch (error) {
      setMessages([
        ...messages,
        { sender: 'user', text: 'Conversion en cours...' },
        { sender: 'assistant', text: `Erreur: ${error.message}` }
      ]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Conversion de Code</h1>
      <div className="space-y-4">
        <LanguageSelect value={sourceLang} onChange={setSourceLang} />
        
        <textarea
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          className="w-full p-2 border rounded h-48"
          placeholder="Collez votre code ici..."
        />
        
        <LanguageSelect value={targetLang} onChange={setTargetLang} />
        
        <button
          onClick={handleGenerate}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Générer le Code
        </button>
        
        <ChatBox
          messages={messages}
          onSendMessage={(text) => setMessages([...messages, { sender: 'user', text }])}
        />
      </div>
    </div>
  );
};

const CodeCorrection = () => {
  const [originalCode, setOriginalCode] = useState('');
  const [corrections, setCorrections] = useState('');
  const [messages, setMessages] = useState([]);

  const handleGenerate = async () => {
    if (!originalCode || !corrections) {
      alert('Veuillez remplir tous les champs');
      return;
    }
  
    try {
      setMessages([...messages, { sender: 'user', text: 'Correction en cours...' }]);
      const correctedCode = await geminiService.correctCode(originalCode, corrections);
      setMessages([
        ...messages,
        { sender: 'user', text: 'Correction en cours...' },
        { sender: 'assistant', text: correctedCode }
      ]);
    } catch (error) {
      setMessages([
        ...messages,
        { sender: 'user', text: 'Correction en cours...' },
        { sender: 'assistant', text: `Erreur: ${error.message}` }
      ]);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Correction de Code</h1>
      <div className="space-y-4">
        <textarea
          value={originalCode}
          onChange={(e) => setOriginalCode(e.target.value)}
          className="w-full p-2 border rounded h-48"
          placeholder="Code original..."
        />
        
        <textarea
          value={corrections}
          onChange={(e) => setCorrections(e.target.value)}
          className="w-full p-2 border rounded h-24"
          placeholder="Instructions de correction..."
        />
        
        <button
          onClick={handleGenerate}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Générer les Corrections
        </button>
        
        <ChatBox
          messages={messages}
          onSendMessage={(text) => setMessages([...messages, { sender: 'user', text }])}
        />
      </div>
    </div>
  );
};

const Debugging = () => {
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [messages, setMessages] = useState([]);

  const handleGenerate = async () => {
    if (!code || !description) {
      alert('Veuillez remplir tous les champs');
      return;
    }
  
    try {
      setMessages([...messages, { sender: 'user', text: 'Débogage en cours...' }]);
      const debugResult = await geminiService.debugCode(code, description);
      setMessages([
        ...messages,
        { sender: 'user', text: 'Débogage en cours...' },
        { sender: 'assistant', text: debugResult }
      ]);
    } catch (error) {
      setMessages([
        ...messages,
        { sender: 'user', text: 'Débogage en cours...' },
        { sender: 'assistant', text: `Erreur: ${error.message}` }
      ]);
    }
  };
  


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Débogage</h1>
      <div className="space-y-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded h-24"
          placeholder="Décrivez le problème..."
        />
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 border rounded h-48"
          placeholder="Code à déboguer..."
        />
        
        <button
          onClick={handleGenerate}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Générer le Débogage
        </button>
        
        <ChatBox
          messages={messages}
          onSendMessage={(text) => setMessages([...messages, { sender: 'user', text }])}
        />
      </div>
    </div>
  );
};

const FileChat = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (text) => {
    try {
      setMessages([...messages, { sender: 'user', text }]);
      const response = await geminiService.chatWithFile(selectedFile, text);
      setMessages([
        ...messages,
        { sender: 'user', text },
        { sender: 'assistant', text: response }
      ]);
    } catch (error) {
      setMessages([
        ...messages,
        { sender: 'user', text },
        { sender: 'assistant', text: `Erreur: ${error.message}` }
      ]);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Discussion sur Fichier</h1>
      <div className="space-y-4">
        <div className="border-2 border-dashed p-4 text-center rounded">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto mb-2" />
            <div>Cliquez ou déposez un fichier</div>
          </label>
        </div>
        
        <ChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

const ProgrammingChat = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (text) => {
    try {
      setMessages([...messages, { sender: 'user', text }]);
      const response = await geminiService.programmerChat(text, selectedFile);
      setMessages([
        ...messages,
        { sender: 'user', text },
        { sender: 'assistant', text: response }
      ]);
    } catch (error) {
      setMessages([
        ...messages,
        { sender: 'user', text },
        { sender: 'assistant', text: `Erreur: ${error.message}` }
      ]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Développement</h1>
      <div className="space-y-4">
        <div className="border-2 border-dashed p-4 text-center rounded">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="hidden"
            id="dev-file-upload"
          />
          <label htmlFor="dev-file-upload" className="cursor-pointer">
            <Upload className="mx-auto mb-2" />
            <div>Cliquez ou déposez un fichier (optionnel)</div>
          </label>
        </div>
        
        <ChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};



const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/image-to-code" element={<ImageToCode />} />
          <Route path="/code-conversion" element={<CodeConversion />} />
          <Route path="/code-correction" element={<CodeCorrection />} />
          <Route path="/debugging" element={<Debugging />} />
          <Route path="/file-chat" element={<FileChat />} />
          <Route path="/programming-chat" element={<ProgrammingChat />} />
          <Route path="/" element={<ProgrammingChat />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;