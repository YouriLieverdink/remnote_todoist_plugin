/* eslint-disable complexity */
import {Task} from '@doist/todoist-api-typescript';
import {AppEvents, WidgetLocation, renderWidget, useAPIEventListener, usePlugin, useRunAsync} from '@remnote/plugin-sdk';
import {debounce} from 'lodash';
import {useState} from 'react';
import {getTodoist} from '../di';

export const todoistWidget = () => {
  const plugin = usePlugin();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [previous, setPrevious] = useState<string | null>(null);

  const todoist = useRunAsync(
    () => getTodoist(plugin),
    []
  );

  const context = useRunAsync(
    () => plugin.widget.getWidgetContext<WidgetLocation.UnderRemEditor>(),
    []
  );

  const render = async () => {
    const rem = await plugin.rem.findOne(context?.remId);
    if (!rem) return;

    try {
      // We use the text of the rem as filter for the tasks.
      const filter = rem.text?.join('');
      if (!filter) return;

      if (previous === filter) {
        // Cancel, we already did this.
        return;
      } else {
        setPrevious(filter);
      }

      const tasks = await todoist?.getTasks({filter});
      if (tasks) {
        setTasks(tasks);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useAPIEventListener(
    AppEvents.RemChanged,
    context?.remId,
    debounce(render, 500)
  );

  // Initial render.
  render();

  if (tasks.length === 0) {
    return <div>No tasks!</div>
  }
  
  return <ul>
    {tasks.map((task) => {
      return <li
        key={task.id}
      >
        <input
          type="checkbox"
          id={task.id}
          checked={task.isCompleted}
        />
        <label htmlFor={task.id}>
          {task.content}
        </label>
      </li>
    })}
  </ul>;
}

renderWidget(todoistWidget);