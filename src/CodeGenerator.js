import React, { useState } from 'react';
import { Loader2, Copy } from 'lucide-react';

const Card = ({ children, className }) => (
  <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600 ${className}`}
  >
    {children}
  </button>
);

const Select = ({ value, onValueChange, children }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="block w-full text-sm border rounded-md p-2"
  >
    {children}
  </select>
);

const Textarea = ({ value, onChange, className, placeholder }) => (
  <textarea
    value={value}
    onChange={onChange}
    className={`block w-full p-4 border rounded-md ${className}`}
    placeholder={placeholder}
  />
);

const Tabs = ({ children, defaultValue }) => (
  <div className="space-y-4">{children}</div>
);

const TabsList = ({ children }) => (
  <div className="flex border-b">{children}</div>
);

const TabsTrigger = ({ value, children, onClick }) => (
  <button
    onClick={onClick}
    className="py-2 px-4 text-sm font-semibold text-blue-500 hover:text-blue-700"
  >
    {children}
  </button>
);

const TabsContent = ({ value, children }) => (
  <div className="pt-4">{children}</div>
);

const CodeGenerator = () => {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('nodejs');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => setContent(e.target.result);
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (!content) return;
    setLoading(true);
    try {
      const response = await fetch('https://generativeai.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a complete ${language} web service/API based on this schema: ${content}`,
            }],
          }],
        }),
      });

      const data = await response.json();
      setGeneratedCode(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Code Generator</h2>

        <div className="space-y-4">
          <Tabs defaultValue="paste">
            <TabsList>
              <TabsTrigger value="paste" onClick={() => {}}>Paste Content</TabsTrigger>
              <TabsTrigger value="upload" onClick={() => {}}>Upload File</TabsTrigger>
            </TabsList>

            <TabsContent value="paste">
              <Textarea 
                placeholder="Paste your JSON or SQL content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
            </TabsContent>

            <TabsContent value="upload">
              <input
                type="file"
                accept=".json,.sql"
                onChange={handleFileChange}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
            </TabsContent>
          </Tabs>

          <Select value={language} onValueChange={setLanguage}>
            <option value="nodejs">Node.js</option>
            <option value="php">PHP</option>
            <option value="python">Python</option>
          </Select>

          <Button 
            onClick={handleGenerate} 
            disabled={!content || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Code'
            )}
          </Button>

          {generatedCode && (
            <div className="relative mt-4">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{generatedCode}</code>
              </pre>
              <Button
                onClick={copyToClipboard}
                className="absolute top-2 right-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CodeGenerator;
