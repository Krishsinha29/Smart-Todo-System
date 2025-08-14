import { useEffect, useState } from 'react';
import { getTasks } from '../lib/api';
import TaskCard from '../components/TaskCard';
import Link from 'next/link';
export default function Dashboard(){
  const [tasks, setTasks] = useState([]);
  useEffect(()=>{ fetchTasks(); },[]);
  async function fetchTasks(){
    const res = await getTasks();
    setTasks(res.data);
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Smart Todo</h1>
        <div>
          <Link href="/add-task"><a className="bg-blue-600 text-white px-4 py-2 rounded">Add Task</a></Link>
          <Link href="/context"><a className="ml-3 text-sm text-gray-600">Context</a></Link>
        </div>
      </div>
      {tasks.length===0 ? <p>No tasks yet.</p> : tasks.map(t => <TaskCard key={t.id} task={t} />)}
    </div>
  )
}
