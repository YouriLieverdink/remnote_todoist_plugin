import {declareIndexPlugin, ReactRNPlugin, WidgetLocation} from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';

export const TODOIST_POWERUP = 'todoist_powerup';

async function onActivate(
  plugin: ReactRNPlugin
): Promise<void> {
  await plugin.settings.registerStringSetting({
    id: 'todoist.token',
    title: 'Todoist > Settings > Integrations > Developer > Api token'
  });

  await plugin.app.registerPowerup(
    'Todoist',
    TODOIST_POWERUP,
    'A todoist plugin.',
    {
      slots: [{code: 'todoist', name: 'Todoist'}]
    }
  );

  await plugin.app.registerWidget(
    'todoist',
    WidgetLocation.UnderRemEditor,
    {
      dimensions: {
        height: 'auto',
        width: '100%'
      },
      powerupFilter: TODOIST_POWERUP
    }
  );

  await plugin.app.registerCommand({
    id: 'todoist.command',
    name: 'Todoist',
    action: async (): Promise<void> => {
      const rem = await plugin.focus.getFocusedRem();

      await rem?.addPowerup(TODOIST_POWERUP);
      await rem?.setText(['today | overdue']);
    }
  });
}

async function onDeactivate(): Promise<void> {
  //
}

declareIndexPlugin(onActivate, onDeactivate);
