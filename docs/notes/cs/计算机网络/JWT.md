---
title: JWT
createTime: 2024/11/24 16:27:22
permalink: /notes/cs/wzlr1qox/
---
Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Payload

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

Signature

```
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```