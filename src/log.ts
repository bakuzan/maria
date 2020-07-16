export function log(...messages: any[]) {
  console.log(
    '%c [Maria]: ',
    'color: #88001b; font-size: 16px; font-weight: bold;',
    ...messages
  );
}

export function reportError(...messages: any[]) {
  console.log(
    '%c [Maria]: Error, ',
    'color: #660000; font-size: 16px; font-weight: bold;',
    ...messages
  );
}
