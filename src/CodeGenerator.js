import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy } from 'lucide-react';

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
          'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a complete ${language} web service/API based on this schema: ${content}`
            }]
          }]
        })
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
              <TabsTrigger value="paste">Paste Content</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
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
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nodejs">Node.js</SelectItem>
              <SelectItem value="php">PHP</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
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
                variant="outline"
                size="sm"
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