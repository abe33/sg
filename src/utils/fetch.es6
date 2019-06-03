'use strict';

export default function fetch(url, opts = {}) {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open(opts.method || 'get', url);
    for (const k in opts.headers || {}) {
      xhr.setRequestHeader(k, opts.headers[k]);
    }
    xhr.onload = e => res({
      text: () => e.target.responseText,
      status: e.target.status,
    });
    xhr.onerror = rej;
    if (opts.onProgress) {
      xhr.onprogress = opts.onProgress;
    }
    xhr.send(opts.body);
  });
}
