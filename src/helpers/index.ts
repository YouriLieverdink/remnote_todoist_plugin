import {TodoistApi} from "@doist/todoist-api-typescript";
import {RNPlugin} from "@remnote/plugin-sdk";

export async function getApi(
  plugin: RNPlugin
): Promise<TodoistApi> {
  const key: string = await plugin.settings.getSetting('todoist_api_key');

  return new TodoistApi(key);
}