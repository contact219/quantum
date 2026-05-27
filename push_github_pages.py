#!/usr/bin/env python3
import urllib.request, urllib.error, json, base64, os

TOKEN = os.environ.get('GITHUB_TOKEN', '')
OWNER = 'contact219'
REPO = 'texas-tdlr-bond-compliance-2026'
HEADERS = {
    'Authorization': f'token {TOKEN}',
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'QuantumSurety/1.0'
}

def gh(method, path, data=None):
    url = 'https://api.github.com' + path
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())

def get_file_sha(path):
    url = f'https://api.github.com/repos/{OWNER}/{REPO}/contents/{path}'
    req = urllib.request.Request(url, headers=HEADERS, method='GET')
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        data = json.loads(resp.read())
        return data.get('sha')
    except urllib.error.HTTPError:
        return None

def push_file(path, content, message):
    url = f'https://api.github.com/repos/{OWNER}/{REPO}/contents/{path}'
    payload = {
        'message': message,
        'content': base64.b64encode(content.encode('utf-8')).decode('ascii'),
        'branch': 'main'
    }
    sha = get_file_sha(path)
    if sha:
        payload['sha'] = sha
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=HEADERS, method='PUT')
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        return resp.status
    except urllib.error.HTTPError as e:
        return e.code

HTML = open('C:/quantum/gh_pages_index.html', 'r', encoding='utf-8').read()
s = push_file('index.html', HTML, 'Add GitHub Pages landing page with Dataset JSON-LD schema')
print(f'index.html: HTTP {s}')

status, resp = gh('POST', f'/repos/{OWNER}/{REPO}/pages', {
    'source': {'branch': 'main', 'path': '/'}
})
print(f'GitHub Pages enable: HTTP {status}')
msg = resp.get('html_url') or resp.get('message', str(resp))[:300]
print(f'  {msg}')
