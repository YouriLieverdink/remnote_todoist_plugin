import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../App.css';
import '../style.css';

async function onActivate(plugin: ReactRNPlugin) {
  await plugin.app.registerWidget('todoist_index', WidgetLocation.RightSidebar, {
    dimensions: {
      height: 'auto',
      width: '100%',
    },
    widgetTabTitle: 'Todoist',
    widgetTabIcon: 'https://static-00.iconduck.com/assets.00/todoist-icon-512x512-v3a6dxo9.png',
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
