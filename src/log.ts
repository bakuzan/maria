export function log(...messages: any[]) {
  console.log('%c [Maria]: ', 'color: #88001b; font-size: 16px;', ...messages);
}

export function reportError(...messages: any[]) {
  // TODO
  // Better error handling
  console.log(
    '%c [Maria]: Error, ',
    'color: #f00000; font-size: 16px;',
    ...messages
  );
}
