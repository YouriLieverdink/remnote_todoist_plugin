import {TodoistApi} from '@doist/todoist-api-typescript';
import {RNPlugin} from '@remnote/plugin-sdk';

export const getTodoist = async (
  plugin: RNPlugin //
): Promise<TodoistApi> => {
  const token: string = await plugin.settings.getSetting('todoist.token');

  return new TodoistApi(token);
}