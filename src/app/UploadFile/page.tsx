'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, ChangeEvent } from 'react';
import mammoth from 'mammoth';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Set the workerSrc to the correct path, hardcoding the version number
//GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.js`;
GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";


export default function UploadFile() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  // If loading, display a loading message
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // If not authenticated, redirect to sign-in page
  if (!session) {
    signIn(); // Redirects to the sign-in page if not authenticated
    return null;
  }

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  // Handle file upload and content extraction
  const handleFileUpload = async () => {
    if (file) {
      const fileType = file.type;
      const reader = new FileReader();

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;

        if (fileType === 'application/pdf') {
          const loadingTask = getDocument(arrayBuffer);
          const pdf = await loadingTask.promise;
          let textContent = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map((item: any) => item.str).join(' ');
          }

          setFileContent(textContent);
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const { value } = await mammoth.extractRawText({ arrayBuffer });
          setFileContent(value);
        } else if (typeof e.target?.result === 'string') {
          setFileContent(e.target.result);
        }
      };

      if (fileType === 'application/pdf' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    } else {
      alert('Please upload a file.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-end p-4">
        <button
          className="text-lg text-white font-semibold p-3 bg-orange-400 rounded-md hover:bg-orange-500"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign out
        </button>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center">Upload and Display Document</h2>
          <div className="mt-8">
            <input
              title="document"
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleFileUpload}
              className="w-full py-2 mt-4 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700"
            >
              Upload
            </button>
            {fileContent && (
              <div className="mt-8 bg-white p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold">File Content:</h3>
                <pre className="whitespace-pre-wrap">{fileContent}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
