import {Rem} from '@remnote/plugin-sdk';

export const getRemText = (rem: Rem): string => {
  return rem.text.join('');
}