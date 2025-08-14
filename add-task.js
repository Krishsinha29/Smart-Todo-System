import { useState, useEffect } from "react";
import { createTask, getCategories, aiSuggestions } from "../lib/api";
import { useRouter } from "next/router";
export default function AddTask(){
  const [title,setTitle]=useState('');
  const [desc,setDesc]=useState('');
  const [suggestion,setSuggestion]=useState(null);
  const [categories,setCategories]=useState([]);
  const [categoryId,setCategoryId]=useState(null);
  const router = useRouter();
  useEffect(()=>{ fetchCats(); },[]);
  async function fetchCats(){
    const res = await getCategories();
    setCategories(res.data);
  }
  async function getAISuggestion(){
    const payload = { current_task: { title, description: desc }, daily_context: [] }
    const res = await aiSuggestions(payload);
    setSuggestion(res.data);
    if(res.data.suggested_category){
      const match = categories.find(c => c.name.toLowerCase() === res.data.suggested_category.toLowerCase());
      if(match) setCategoryId(match.id);
    }
  }
  async function save(){
    const data = { title, description: suggestion?.enhanced_description || desc, category_id: categoryId };
    await createTask(data);
    router.push('/');
  }
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Add Task</h2>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border p-2 mb-3" />
      <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="w-full border p-2 mb-3 h-36" />
      <div className="mb-3">
        <button onClick={getAISuggestion} className="bg-indigo-600 text-white px-3 py-2 rounded">Get AI Suggestion</button>
        <button onClick={save} className="bg-green-600 text-white px-3 py-2 rounded ml-3">Create Task</button>
      </div>
      {suggestion && (
        <div className="border p-3 rounded">
          <div><strong>Priority:</strong> {suggestion.priority_score}</div>
          <div><strong>Deadline:</strong> {suggestion.suggested_deadline}</div>
          <div className="mt-2"><strong>Enhanced description:</strong><pre className="whitespace-pre-wrap">{suggestion.enhanced_description}</pre></div>
          <div className="mt-2"><strong>Suggested category:</strong> {suggestion.suggested_category}</div>
        </div>
      )}
      <div className="mt-4">
        <label className="block text-sm font-medium">Category</label>
        <select value={categoryId||''} onChange={e=>setCategoryId(e.target.value)} className="border p-2">
          <option value="">— none —</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
    </div>
  )
}
