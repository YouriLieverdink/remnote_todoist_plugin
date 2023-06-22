import { Task } from '@doist/todoist-api-typescript';
import { renderWidget, useTracker } from '@remnote/plugin-sdk';
import { useState } from 'react';
import { getApi } from '../helpers';

export const TodoistIndex = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useTracker(async (plugin) => {
    const api = await getApi(plugin);
    const data = await api.getTasks({ filter: 'today' });

    setTasks(data);
  });

  return (
    <div>
      {tasks.map((task) => {
        return <p>{task.content}</p>;
      })}
    </div>
  );
};

renderWidget(TodoistIndex);
