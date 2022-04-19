import { Redirect, RedirectResult } from '@/types/Redirect';

function convertWildcardToRegex(pattern: string) {
  let converted = '^';

  for (let i = 0; i < pattern.length; i++) {
    let ch = pattern.charAt(i);

    if ('()[]{}?.^$\\+'.indexOf(ch) != -1) {
      converted += '\\' + ch;
    } else if (ch == '*') {
      converted += '(.*?)';
    } else {
      converted += ch;
    }
  }

  converted += '$';
  return converted;
}

export default function findRedirectMatch(
  redirects: Redirect[],
  url: string
): RedirectResult | undefined {
  for (let rule of redirects) {
    const filter = new RegExp(convertWildcardToRegex(rule.fromPattern), 'gi');
    const matches = filter.exec(url);
    console.log(`FIND >> `, rule, filter, matches);
    if (!matches || matches.length === 0) {
      continue;
    }

    let resultUrl = rule.toPattern;

    for (let i = matches.length - 1; i > 0; i--) {
      const repl = matches[i] || '';
      resultUrl = resultUrl.replace(new RegExp('\\$' + i, 'gi'), repl);
    }

    return {
      ...rule,
      redirectUrl: resultUrl
    };
  }

  return; // No redirects found
}
