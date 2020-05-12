
'use strict';

import n3 from 'n3';
import url from 'url';
import http from 'http';

async function serializeQuads(quads, format) {
  return new Promise((resolve, reject) => {
    const writer = n3.Writer({ format });
    writer.addQuads(quads);
    writer.end((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function deserializeQuads(data, format) {
  return new Promise((resolve, reject) => {
    const parser = n3.Parser({ format });
    const quads = [];
    parser.parse(data, (err, quad) => {
      if (err) reject(err);
      else if (!quad) resolve(quads);
      else quads.push(quad);
    });
  });
}

async function get(targetUrl, acceptedFormat) {
  return new Promise((resolve, reject) => {
    const opts = typeof(targetUrl) === 'string'
      ? url.parse(targetUrl)
      : targetUrl;
    if (acceptedFormat) {
      if (!opts.headers) {
        opts.headers = {};
      }
      opts.headers.accept = acceptedFormat;
    }
    http.get(targetUrl, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`Bad status code (${res.statusCode}).`));
        return;
      }
      res.setEncoding('utf8');
      let buf = '';
      res.on('data', (chunk) => { buf += chunk; });
      res.on('end', () => { resolve([buf, res.headers['content-type']]); });
    });
  });
}

async function getQuads(targetUrl) {
  const [payload, format] = await get(targetUrl);
  return deserializeQuads(payload, format);
}

async function postQuads(targetUrl, quads, format) {
  if (!format) format = 'application/trig';
  const payload = await serializeQuads(quads, format);
  return new Promise((resolve, reject) => {
    const opts = url.parse(targetUrl);
    opts.headers = { 'Content-Type': format };
    opts.method = 'POST';
    const req = http.request(opts, (res) => {
      res.resume();
      if (res.statusCode !== 200) {
        reject(new Error('Bad status code.'));
        return;
      }
      res.on('error', (err) => { reject(err); });
      res.on('end', () => { resolve(); });
    });
    req.on('error', (err) => { reject(err); });
    req.write(payload);
    req.end();
  });
}

export { serializeQuads, deserializeQuads, get, getQuads, postQuads };
