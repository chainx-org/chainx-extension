// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import extension from 'extensionizer';

// inject our data injector
const script = document.createElement('script');

script.src = extension.extension.getURL('hello.js');
script.onload = (): void => {
  // remove the injecting tag when loaded
};

(document.head || document.documentElement).appendChild(script);
