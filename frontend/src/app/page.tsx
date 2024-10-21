"use client"
import { useState } from 'react';
import { Upload, Mail } from 'lucide-react';
import Navbar from '@/components/navbar';
import { API_URL } from '@/contants';

export default function ShareDrop() {
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (!file || !email) {
      setMessage('Please select a file and enter an email address.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadResponse = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadResult.message || 'Failed to upload file');
      }
      const shareResponse = await fetch(`${API_URL}/api/file-share/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverEmail: email, fileUrl: uploadResult.viewUrl }),
      });
      const shareResult = await shareResponse.json();

      if (!shareResponse.ok) {
        throw new Error(shareResult.message || 'Failed to share file');
      }

      setMessage('File shared successfully! The receiver will get an email with the download code.');
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceive = async () => {
    if (!code) {
      setMessage('Please enter a download code.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/file-share/retrieve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to retrieve file');
      }

      // Redirect to the file URL
      window.location.href = result.fileUrl;
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="w-full mx-auto">
        <Navbar />

        <div className="bg-white rounded-lg shadow-sm mt-6">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-semibold ${
                activeTab === 'send' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('send')}
            >
              Send File
            </button>
            <button
              className={`flex-1 py-4 text-center font-semibold ${
                activeTab === 'receive' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('receive')}
            >
              Receive File
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'send' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">Any file up to 10MB</p>
                      </div>
                      <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                  {file && <p className="mt-2 text-sm text-gray-500">Selected file: {file.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Receiver's Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md text-black"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  onClick={handleSend}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send File'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Download Code
                  </label>
                  <input
                    type="text"
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md text-black"
                    placeholder="Enter your download code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <button
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  onClick={handleReceive}
                  disabled={isLoading}
                >
                  {isLoading ? 'Retrieving...' : 'Retrieve File'}
                </button>
              </div>
            )}
            {message && (
              <div className={`mt-4 p-4 rounded-md ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}