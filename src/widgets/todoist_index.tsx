import { renderWidget } from '@remnote/plugin-sdk';

export const TodoistIndex = () => {
  return (
    <div>
      <iframe
        src="https://todoist.com/app"
        style={{ height: '100%', width: '100%', border: 'none' }}
      ></iframe>
    </div>
  );
};

renderWidget(TodoistIndex);
