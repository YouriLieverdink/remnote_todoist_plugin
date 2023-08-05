/* eslint-disable complexity */
import {
  declareIndexPlugin,
  ReactRNPlugin,
  Rem,
  RNPlugin
} from '@remnote/plugin-sdk';
import {getTodoist} from '../di';
import {getRemText} from '../helpers';

const onActivate = async (
  plugin: ReactRNPlugin //
): Promise<void> => {
  await plugin.settings.registerStringSetting({
    id: 'todoist.token',
    title: 'Todoist > Settings > Integrations > Developer > Api token'
  });

  await addTodoist(plugin);
  plugin.track(handleTodoist);
};

const addTodoist = async (
  plugin: ReactRNPlugin //
): Promise<void> => {
  await plugin.app.registerPowerup(
    'Todoist', //
    'todoist.powerup',
    'A todoist plugin',
    {slots: []}
  );

  await plugin.app.registerCommand({
    id: 'todoist.command',
    name: 'Todoist',
    action: async (): Promise<void> => {
      const rem = await plugin.focus.getFocusedRem();

      await rem?.addPowerup('todoist.powerup');
      await rem?.setText(['today']);
    }
  });
};

const handleTodoist = async (
  plugin: RNPlugin //
): Promise<void> => {
  const powerup = await plugin.powerup.getPowerupByCode('todoist.powerup');

  // Retrieve all rems with the Todoist powerup.
  const rems = await powerup!.taggedRem();
  for (const rem of rems) {
    renderTodoist(plugin, rem);
  }
};

const renderTodoist = async (
  plugin: RNPlugin, //
  rem: Rem
): Promise<void> => {
  const filter = getRemText(rem);
  if (!filter) return;

  try {
    // Retrieve the tasks for the filter.
    const todoist = await getTodoist(plugin);

    const tasks = await todoist.getTasks({filter});
    const children = await rem.getChildrenRem();

    for (const task of tasks) {
      // Check if the task already exists.
      const index = children.findIndex((rem) => {
        return getRemText(rem) === task.content;
      });

      if (index === -1) {
        // Add the task.
        const taskRem = await plugin.rem.createRem();
        taskRem?.setText([task.content]);
        taskRem?.setIsTodo(true);
        taskRem?.setParent(rem);
      }

      for (const child of children) {
        // Check if the rem already exists.
        const index = tasks.findIndex((task) => {
          return task.content === getRemText(child);
        });

        if (index === -1) {
          child.remove();
        }
      }
    }
  } catch (e) {
    //
  }
};

const onDeactivate = async (): Promise<void> => {
  //
};

declareIndexPlugin(onActivate, onDeactivate);
