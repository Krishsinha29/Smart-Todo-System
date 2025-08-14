import { useState, useEffect } from 'react';
import { postContext, getContext } from '../lib/api';
export default function ContextPage(){
  const [content,setContent]=useState('');
  const [source,setSource]=useState('note');
  const [history,setHistory]=useState([]);
  useEffect(()=>{ fetchHistory(); },[]);
  async function fetchHistory(){ const res = await getContext(); setHistory(res.data); }
  async function save(){
    await postContext({ content, source_type: source });
    setContent('');
    fetchHistory();
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Daily Context</h2>
      <select value={source} onChange={e=>setSource(e.target.value)} className="border p-2 mb-3">
        <option value="note">Note</option>
        <option value="whatsapp">WhatsApp</option>
        <option value="email">Email</option>
      </select>
      <textarea value={content} onChange={e=>setContent(e.target.value)} className="w-full border p-2 mb-3 h-32" />
      <div><button onClick={save} className="bg-blue-600 text-white px-3 py-2 rounded">Save Context</button></div>
      <h3 className="mt-6 font-bold">History</h3>
      <div className="mt-3">
        {history.map(h => (
          <div key={h.id} className="border p-3 rounded mb-2">
            <div className="text-xs text-gray-500">{h.source_type} • {new Date(h.timestamp).toLocaleString()}</div>
            <div>{h.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
