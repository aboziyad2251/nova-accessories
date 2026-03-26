// Nova Accessories — SSH Deploy Script
import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';
import { createReadStream, statSync, readdirSync } from 'fs';

const HOST     = '76.13.40.119';
const USER     = 'root';
const PASSWORD = 'Zezo#2412251';
const REMOTE   = '/opt/nova';
const LOCAL    = 'c:/Users/moham/Desktop/nova-accessories';

// Files/dirs to deploy (exclude dev files)
const EXCLUDE = new Set(['deploy.mjs', 'SKILL.md', 'dockerfile', '.git', 'node_modules']);

function walkDir(dir, base = dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel  = path.relative(base, full).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      results.push(...walkDir(full, base));
    } else {
      results.push({ local: full, remote: `${REMOTE}/${rel}` });
    }
  }
  return results;
}

async function sftpPut(sftp, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    const dir = remotePath.substring(0, remotePath.lastIndexOf('/'));
    sftp.mkdir(dir, { mode: 0o755 }, () => {   // ignore error if exists
      sftp.fastPut(localPath, remotePath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

async function mkdirAll(sftp, remotePath) {
  const parts = remotePath.replace(/^\//, '').split('/');
  let current = '';
  for (const part of parts) {
    current += '/' + part;
    await new Promise(r => sftp.mkdir(current, () => r()));
  }
}

async function deploy() {
  const conn = new Client();

  await new Promise((resolve, reject) => {
    conn.on('ready', async () => {
      console.log('✅ SSH connected');

      conn.sftp(async (err, sftp) => {
        if (err) return reject(err);

        // Ensure base remote dir exists
        await mkdirAll(sftp, REMOTE);

        const files = walkDir(LOCAL);
        console.log(`📦 Deploying ${files.length} files to ${HOST}:${REMOTE} …\n`);

        // Create all subdirectories first
        const dirs = new Set(files.map(f => f.remote.substring(0, f.remote.lastIndexOf('/'))));
        for (const d of dirs) {
          await mkdirAll(sftp, d);
        }

        // Upload files
        let done = 0;
        for (const { local, remote } of files) {
          await new Promise((res, rej) => {
            sftp.fastPut(local, remote, (e) => {
              if (e) rej(e);
              else res();
            });
          });
          done++;
          const rel = path.relative(LOCAL, local).replace(/\\/g, '/');
          process.stdout.write(`  [${done}/${files.length}] ${rel}\n`);
        }

        console.log(`\n✅ All ${files.length} files uploaded.`);

        // Check if nginx/apache is serving /opt/nova
        conn.exec('nginx -t 2>&1 | tail -2; ls /etc/nginx/sites-enabled/ 2>/dev/null; ls /etc/apache2/sites-enabled/ 2>/dev/null', (err, stream) => {
          let out = '';
          stream?.on('data', d => out += d);
          stream?.stderr?.on('data', d => out += d);
          stream?.on('close', () => {
            console.log('\n🌐 Server info:\n' + out);
            conn.end();
            resolve();
          });
          if (!stream) { conn.end(); resolve(); }
        });
      });
    });

    conn.on('error', reject);

    conn.connect({
      host: HOST,
      port: 22,
      username: USER,
      password: PASSWORD,
      readyTimeout: 15000,
    });
  });
}

deploy().catch(e => {
  console.error('❌ Deploy failed:', e.message);
  process.exit(1);
});
