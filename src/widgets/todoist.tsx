/* eslint-disable complexity */
import {Task} from '@doist/todoist-api-typescript';
import {
  AppEvents,
  WidgetLocation,
  renderWidget,
  useAPIEventListener,
  usePlugin,
  useRunAsync
} from '@remnote/plugin-sdk';
import {debounce} from 'lodash';
import {useState} from 'react';
import {getTodoist} from '../di';

export const todoistWidget = () => {
  const plugin = usePlugin();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [previous, setPrevious] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('No tasks');

  const todoist = useRunAsync(() => getTodoist(plugin), []);

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
      setStatus('An error occurred while fetching the tasks from Todoist');
      setTasks([]);

      console.error(e);
    }
  };

  const closeTask = async (task: Task) => {
    setTasks(
      tasks.map((a) => {
        if (a.id === task.id) {
          return {
            ...task,
            isCompleted: true
          };
        }

        return a;
      })
    );

    try {
      // Close the task
      await todoist?.closeTask(task.id);

      // Remove from local state.
      setTasks(tasks.filter((a) => a.id !== task.id));
    } catch (e) {
      setTasks(
        tasks.map((a) => {
          if (a.id === task.id) {
            return {
              ...task,
              isCompleted: false
            };
          }

          return a;
        })
      );

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
    return <div className="text-center p-5">
      ✅ {status}
    </div>;
  }

  return (
    <ul>
      {tasks.map((task) => {
        return (
          <li key={task.id} className="p-1">
            <input
              type="checkbox"
              id={task.id}
              checked={task.isCompleted}
              onChange={() => closeTask(task)}
              style={{cursor: 'pointer'}}
            />
            <label className="ml-1">
              <button
                role="link"
                onClick={() => window.open(task.url, '_blank', 'noreferrer')}
              >
                {task.content}
              </button>
            </label>
            <br />
            <div className="ml-5"></div>
          </li>
        );
      })}
    </ul>
  );
};

renderWidget(todoistWidget);
