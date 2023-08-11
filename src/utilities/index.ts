import {RNPlugin, Rem} from '@remnote/plugin-sdk';

export async function getRemById(
  plugin: RNPlugin,
  remId: string | undefined
): Promise<Rem | undefined> {
  const rem = await plugin.rem.findOne(remId);

  return rem;
}

export async function getRemTextById(
  plugin: RNPlugin,
  remId: string | undefined
): Promise<string> {
  const rem = await getRemById(plugin, remId);

  return String(rem?.text?.join('') || '');
}

export async function getRemChildrenById(
  plugin: RNPlugin,
  remId: string | undefined
): Promise<Rem[]> {
  const rem = await getRemById(plugin, remId);
  if (!rem) {
    return [];
  }

  const children = await rem.getChildrenRem();

  return children;
}