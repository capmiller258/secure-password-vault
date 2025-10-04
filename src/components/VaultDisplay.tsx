'use client';

import { useEffect, useState, FormEvent, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { encryptData, decryptData } from '@/lib/crypto';

// Define a type for our vault items for better TypeScript support
type VaultItem = {
  _id: string;
  title: string;

  username: string;
  password?: string; // Make password optional so we can hide/show it
  url: string;
  notes: string;
};

export default function VaultDisplay() {
  const { token, encryptionKey } = useAuth();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NEW: State for the search term ---
  const [searchTerm, setSearchTerm] = useState('');

  // --- State for the item currently being edited ---
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);

  // --- State specifically for the "Add New Item" form fields ---
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemUsername, setNewItemUsername] = useState('');
  const [newItemPassword, setNewItemPassword] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');

  // This useEffect hook runs once to fetch and decrypt the user's vault items.
  useEffect(() => {
    const fetchItems = async () => {
      if (!token || !encryptionKey) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/vault', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch vault items. Please try logging in again.');
        }
        const encryptedItems = await response.json();
        const decryptedItems = encryptedItems.map((item: any) => ({
          ...item,
          title: decryptData(item.title, encryptionKey),
          username: decryptData(item.username, encryptionKey),
          password: decryptData(item.password, encryptionKey),
          url: item.url ? decryptData(item.url, encryptionKey) : '',
          notes: item.notes ? decryptData(item.notes, encryptionKey) : '',
        }));
        setItems(decryptedItems);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [token, encryptionKey]);

  // --- NEW: Create a filtered list of items based on the search term ---
  // This ensures we don't modify the original list of items
  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return items;
    }
    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);


  const handleAddItem = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token || !encryptionKey) {
      setError("Authentication error. Please log in again.");
      return;
    }
    try {
      const encryptedItem = {
        title: encryptData(newItemTitle, encryptionKey),
        username: encryptData(newItemUsername, encryptionKey),
        password: encryptData(newItemPassword, encryptionKey),
        url: encryptData(newItemUrl, encryptionKey),
        notes: encryptData(newItemNotes, encryptionKey),
      };
      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(encryptedItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add the item.");
      }
      
      const savedItem = await response.json();
      
      // Decrypt the new item before adding to state
      const decryptedNewItem = {
          ...savedItem,
          title: decryptData(savedItem.title, encryptionKey),
          username: decryptData(savedItem.username, encryptionKey),
          password: decryptData(savedItem.password, encryptionKey),
          url: savedItem.url ? decryptData(savedItem.url, encryptionKey) : '',
          notes: savedItem.notes ? decryptData(savedItem.notes, encryptionKey) : '',
      };

      setItems(prevItems => [...prevItems, decryptedNewItem]);

      // Clear the form fields
      setNewItemTitle('');
      setNewItemUsername('');
      setNewItemPassword('');
      setNewItemUrl('');
      setNewItemNotes('');

    } catch (err: any) {
        setError(err.message);
    }
  };


  const handleUpdateItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingItem || !token || !encryptionKey) return;

    try {
        const encryptedItem = {
            title: encryptData(editingItem.title, encryptionKey),
            username: encryptData(editingItem.username, encryptionKey),
            password: encryptData(editingItem.password || '', encryptionKey),
            url: encryptData(editingItem.url, encryptionKey),
            notes: encryptData(editingItem.notes, encryptionKey),
        };

        const response = await fetch(`/api/vault/${editingItem._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(encryptedItem),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update item.");
        }
        
        const updatedItemFromServer = await response.json();
        const decryptedUpdatedItem = {
            ...updatedItemFromServer,
            title: decryptData(updatedItemFromServer.title, encryptionKey),
            username: decryptData(updatedItemFromServer.username, encryptionKey),
            password: decryptData(updatedItemFromServer.password, encryptionKey),
            url: updatedItemFromServer.url ? decryptData(updatedItemFromServer.url, encryptionKey) : '',
            notes: updatedItemFromServer.notes ? decryptData(updatedItemFromServer.notes, encryptionKey) : '',
        };

        setItems(prevItems => prevItems.map(item => 
            item._id === decryptedUpdatedItem._id ? decryptedUpdatedItem : item
        ));
        
        setEditingItem(null); // Close the modal on success
    } catch(err: any) {
        setError(err.message);
    }
  };


  const handleDeleteItem = async (itemId: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this item?')) {
        return;
    }

    try {
        const response = await fetch(`/api/vault/${itemId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete item.");
        }
        
        setItems(prevItems => prevItems.filter(item => item._id !== itemId));

    } catch (err: any) {
        setError(err.message);
    }
  };

  if (isLoading) return <p className="text-center mt-8">Loading vault...</p>;

  return (
    <div className="mt-8">
      {/* --- ADD NEW ITEM FORM --- */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Item</h2>
        <form onSubmit={handleAddItem} className="space-y-4">
          <input value={newItemTitle} onChange={e => setNewItemTitle(e.target.value)} placeholder="Title (e.g., Google)" required className="w-full p-2 border rounded text-black shadow-sm" />
          <input value={newItemUsername} onChange={e => setNewItemUsername(e.target.value)} placeholder="Username or Email" required className="w-full p-2 border rounded text-black shadow-sm" />
          <input value={newItemPassword} onChange={e => setNewItemPassword(e.target.value)} placeholder="Password" required className="w-full p-2 border rounded text-black shadow-sm" />
          <input value={newItemUrl} onChange={e => setNewItemUrl(e.target.value)} placeholder="URL (e.g., https://google.com)" className="w-full p-2 border rounded text-black shadow-sm" />
          <textarea value={newItemNotes} onChange={e => setNewItemNotes(e.target.value)} placeholder="Notes" className="w-full p-2 border rounded text-black shadow-sm"></textarea>
          <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold">Save Item</button>
        </form>
      </div>

      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      {/* --- DISPLAY SAVED ITEMS --- */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Saved Items</h2>
          {/* --- NEW: Search bar --- */}
          <input 
            type="text"
            placeholder="Search Vault..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="p-2 border rounded text-black shadow-sm"
          />
        </div>
        <div className="space-y-4">
          {/* --- UPDATE: Use `filteredItems` here instead of `items` --- */}
          {filteredItems.length > 0 ? filteredItems.map(item => (
            <div key={item._id} className="p-4 border rounded-md bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
              <p className="text-gray-600">Username: {item.username}</p>
              <div className="mt-2 space-x-4">
                <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:underline text-sm font-medium">Edit</button>
                <button onClick={() => handleDeleteItem(item._id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
              </div>
            </div>
          )) : (
            <p className="text-gray-500">
              {searchTerm ? "No items match your search." : "You have no items saved in your vault yet."}
            </p>
          )}
        </div>
      </div>

      {/* --- EDIT ITEM MODAL (POP-UP) --- */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <input value={editingItem.title} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} placeholder="Title" required className="w-full p-2 border rounded text-black shadow-sm" />
              <input value={editingItem.username} onChange={e => setEditingItem({ ...editingItem, username: e.target.value })} placeholder="Username" required className="w-full p-2 border rounded text-black shadow-sm" />
              <input value={editingItem.password} onChange={e => setEditingItem({ ...editingItem, password: e.target.value })} placeholder="Password" required className="w-full p-2 border rounded text-black shadow-sm" />
              <input value={editingItem.url} onChange={e => setEditingItem({ ...editingItem, url: e.target.value })} placeholder="URL" className="w-full p-2 border rounded text-black shadow-sm" />
              <textarea value={editingItem.notes} onChange={e => setEditingItem({ ...editingItem, notes: e.target.value })} placeholder="Notes" className="w-full p-2 border rounded text-black shadow-sm"></textarea>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
