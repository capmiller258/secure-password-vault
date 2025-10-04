
// src/components/PasswordGenerator.tsx

'use client';

import { useState } from 'react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookalikes, setExcludeLookalikes] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    const lookalikeChars = /[oO0l1iI]/g;

    let charPool = lowerChars;
    if (includeUppercase) charPool += upperChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;
    if (excludeLookalikes) {
      charPool = charPool.replace(lookalikeChars, '');
    }

    if (charPool.length === 0) {
        setPassword('Please select at least one character set.');
        return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      newPassword += charPool[randomIndex];
    }
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Password Generator</h2>
      
      {/* Password Display */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={password}
          readOnly
          placeholder="Your new password will appear here"
          className="flex-grow p-2 border border-gray-300 rounded-md text-gray-700 bg-gray-50"
        />
        <button onClick={copyToClipboard} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 w-24">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Length Slider */}
      <div className="mb-4">
        <label className="block text-gray-700">Length: {length}</label>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Options Checkboxes */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} />
          <span>Uppercase (A-Z)</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} />
          <span>Numbers (0-9)</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} />
          <span>Symbols (!@#$)</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={excludeLookalikes} onChange={(e) => setExcludeLookalikes(e.target.checked)} />
          <span>Exclude Look-Alikes (o, 0, l, 1)</span>
        </label>
      </div>

      {/* Generate Button */}
      <button onClick={generatePassword} className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold">
        Generate Password
      </button>
    </div>
  );
}

