import React, { useState } from 'react';
import { Loader2, Copy, FileUp } from 'lucide-react';
import { geminiService } from './services/gemini';



// Composants UI intégrés dans le même fichier
const Card = ({ children }) => <div className="bg-white shadow-md rounded-lg">{children}</div>;
const CardHeader = ({ children }) => <div className="p-4 border-b">{children}</div>;
const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;
const CardContent = ({ children }) => <div className="p-4">{children}</div>;
const Button = ({ children, onClick, disabled, className, variant, size }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md ${
      variant === 'outline' ? 'border border-gray-300 bg-transparent' : 'bg-blue-500 text-white'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);
const Select = ({ value, onValueChange, children }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="w-32 p-2 border rounded-md"
  >
    {children}
  </select>
);
const SelectTrigger = ({ children }) => <div>{children}</div>;
const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
const SelectContent = ({ children }) => <div className="mt-2 bg-white border rounded-md shadow-lg">{children}</div>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

// Composant principal
const CodeGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('nodejs');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const text = await file.text();
        setInputText(text);
        setError('');
      } catch (err) {
        setError('Error reading file');
      }
    }
  };

  const generateCode = async () => {
    if (!inputText) {
      setError('Please enter or upload code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const prompt = `Generate a complete ${selectedLanguage} web service/API based on this schema:\n\n${inputText}\n\nProvide only the code with proper structure and error handling.`;
      const result = await geminiService.programmerChat(prompt);
      setGeneratedCode(result);
    } catch (err) {
      setError('Failed to generate code');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Code Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nodejs">Node.js</SelectItem>
                <SelectItem value="php">PHP</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Button variant="outline" className="flex gap-2">
                <FileUp size={16} />
                Upload Schema
                <input
                  type="file"
                  accept=".json,.sql,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your JSON or SQL schema here..."
              className="w-full h-40 p-2 border rounded-md bg-gray-50"
            />

            <div className="flex justify-between items-center">
              <Button
                onClick={generateCode}
                disabled={isLoading || !inputText}
                className="flex gap-2"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                Generate Code
              </Button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {generatedCode && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={copyToClipboard}
                >
                  <Copy size={16} />
                </Button>
                <pre className="p-4 bg-gray-100 rounded-md overflow-x-auto">
                  <code>{generatedCode}</code>
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeGenerator;