export default function TaskCard({task}) {
  const p = Math.round((task.priority_score||0)*10)/10;
  return (
    <div className="border p-4 rounded mb-3 shadow-sm">
      <div className="flex justify-between">
        <h3 className="font-bold">{task.title}</h3>
        <div className="text-sm">{task.status}</div>
      </div>
      <p className="text-sm text-gray-600">{task.description}</p>
      <div className="mt-2 text-xs">
        Priority: <span className="font-mono">{p}</span>
        {task.deadline && (<span className="ml-4">Deadline: {new Date(task.deadline).toLocaleString()}</span>)}
      </div>
    </div>
  )
}
