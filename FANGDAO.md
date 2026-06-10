# 面试专属：CDN 视频防盗链/防下载 完整技术方案（含 Demo 可落地代码 + 面试话术）
先给你讲透技术本质，再给你 TikTok/YouTube 大厂的行业方案，最后给你**可直接落地到 Cloudflare + TikTok Minis Demo 的代码**，同时配套面试话术，完美覆盖 JD 里的「防盗链实战经验」要求。

---

## 一、先讲透技术本质（面试必说第一句）
**没有 100% 绝对防下载的方案！**
只要视频能在前端播放，就一定能被抓包下载（浏览器/播放器必须拿到视频流才能解码播放）。我们能做的是：**大幅提高盗链的技术门槛和时间成本**，让普通用户盗不了，让专业盗链者的成本高于收益。

---

## 二、TikTok/YouTube 等大厂的 4 层核心防盗方案（行业最佳实践，面试必讲）
| 层级 | 技术方案 | 作用 | 实现难度 |
|------|----------|------|----------|
| 1 | **Referer/UA 防盗链 + IP 黑白名单** | 拦截最基础的直接盗链、爬虫下载 | 低 |
| 2 | **HLS/DASH 分片 + 动态签名 URL（Token 鉴权）** | 视频地址有时效性，过期失效，无法永久分享 | 中 |
| 3 | **AES-128 加密分片（DRM 轻量级）** | 即使下载了分片，没有密钥也无法播放 | 中高 |
| 4 | **Widevine/PlayReady 硬件级 DRM（商业级）** |  TikTok/Netflix 正式商用方案，硬件级加密，极难破解 | 高 |

---

## 三、适配你 Demo 的 3 层可落地方案（Cloudflare + 边缘计算，面试能讲、代码能写）
你现在的技术栈是 Cloudflare R2 + Workers + TikTok Minis，我给你一套**低成本、高性价比、面试能讲清楚亮点**的方案，直接就能加到你的 Demo 里。

### 方案 1：基础层 —— Referer/UA 防盗链 + 隐藏真实源地址（5分钟搞定，面试必讲）
**核心思路**：只允许 TikTok 域名/你的小程序域名访问，直接拦截外部盗链；用 Worker 做代理，永远不暴露真实的 R2 视频地址。

#### Cloudflare Worker 完整代码（直接复制用）
```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 1. 防盗链第一层：校验 Referer，只允许 TikTok 和你的小程序域名访问
    const referer = request.headers.get("Referer") || "";
    const allowedHosts = [
      "tiktok.com",
      "你的小程序域名.workers.dev",
      "你的测试域名.com"
    ];
    const isValidReferer = allowedHosts.some(host => referer.includes(host));
    
    // 面试亮点：可以加个 User-Agent 校验，只允许 TikTok WebView/移动端浏览器访问
    const userAgent = request.headers.get("User-Agent") || "";
    const isValidUA = /Mobile|TikTok/.test(userAgent);

    if (!isValidReferer || !isValidUA) {
      return new Response("禁止盗链", { status: 403 });
    }

    // 2. 隐藏真实源地址：按路径映射到 R2，永远不暴露 R2 原始链接
    let r2Key = "";
    if (url.pathname.startsWith("/video/720")) {
      r2Key = "drama1/ep1_720p.mp4";
    } else if (url.pathname.startsWith("/video/480")) {
      r2Key = "drama1/ep1_480p.mp4";
    } else {
      return new Response("404", { status: 404 });
    }

    // 3. 从 R2 读取视频，添加缓存头，优化性能
    const object = await env.MY_BUCKET.get(r2Key);
    if (!object) return new Response("视频不存在", { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Access-Control-Allow-Origin", "https://tiktok.com");
    headers.set("Cache-Control", "public, max-age=3600");

    return new Response(object.body, { headers });
  }
};
```

**面试话术**：
> “我在 Demo 里用 Cloudflare Workers 实现了第一层基础防盗链：首先校验 Referer 和 User-Agent，只允许 TikTok 域名和移动端 WebView 访问，拦截外部直接盗链；同时用 Worker 做反向代理，永远不暴露真实的 R2 存储地址，从源头上避免了原始链接被泄露。”

---

### 方案 2：进阶层 —— 动态签名 URL（Token 鉴权，有时效性，面试核心亮点）
**核心思路**：视频地址不是固定的，是前端通过 ttminis SDK 拿到临时 Token，拼接成有时效性的 URL（比如 10 分钟过期），过期后即使分享了链接也无法播放。这是 TikTok/YouTube 最常用的方案，**面试讲这个直接加分**。

#### 实现逻辑（面试必讲架构）
1.  **前端**：调用 ttminis SDK 的登录接口，拿到用户唯一标识，请求你的后端/Worker 生成签名 Token
2.  **边缘 Worker**：验证用户身份，生成带过期时间的签名 Token（比如用 HMAC-SHA256 签名）
3.  **视频请求**：前端把 Token 拼在 URL 后面，Worker 校验 Token 是否有效、是否过期，有效才返回视频

#### Cloudflare Worker 核心代码片段（签名生成 + 校验）
```javascript
// 密钥，存在 Cloudflare Workers Secrets 里，不要写在代码里
const SECRET_KEY = env.SIGNATURE_SECRET;

// 1. 生成签名 Token 的接口
async function generateToken(userId, videoId) {
  const expireTime = Math.floor(Date.now() / 1000) + 600; // 10分钟过期
  const payload = `${userId}:${videoId}:${expireTime}`;
  
  // 用 HMAC-SHA256 签名
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return `${payload}:${signatureBase64}`;
}

// 2. 校验 Token 的接口
async function verifyToken(token) {
  const parts = token.split(":");
  if (parts.length !== 4) return false;
  
  const [userId, videoId, expireTime, signatureBase64] = parts;
  
  // 先校验是否过期
  if (parseInt(expireTime) < Math.floor(Date.now() / 1000)) {
    return false;
  }
  
  // 再校验签名是否正确
  const payload = `${userId}:${videoId}:${expireTime}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false, ["verify"]
  );
  const signature = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
  const isValid = await crypto.subtle.verify("HMAC", key, signature, encoder.encode(payload));
  
  return isValid;
}
```

**面试话术**：
> “在基础防盗链之上，我还实现了动态签名 URL 鉴权：前端通过 TikTok Minis SDK 拿到用户标识后，请求边缘 Worker 生成带 HMAC-SHA256 签名的临时 Token，Token 有效期设为 10 分钟；视频请求时 Worker 会先校验 Token 的签名和时效性，只有有效 Token 才能返回视频流。这样即使视频地址被分享，过期后也无法播放，大幅提高了盗链门槛。”

---

### 方案 3：高级层 —— HLS 分片 + AES-128 加密（轻量级 DRM，面试拔高亮点）
**核心思路**：不用 MP4 直链，改用 HLS 流媒体协议（m3u8 + ts 分片），并且对每个 ts 分片用 AES-128 加密，即使下载了所有分片，没有解密密钥也无法播放。这是 TikTok 短剧的标准做法，**面试讲这个直接体现你对行业方案的理解**。

#### 实现逻辑
1.  **视频预处理**：用 FFmpeg 把 MP4 转成 HLS 分片，同时开启 AES-128 加密
2.  **密钥托管**：把解密密钥放在 R2 里，通过 Worker 鉴权后才能访问
3.  **播放流程**：前端请求 m3u8 清单 → Worker 返回带加密密钥地址的 m3u8 → 播放器请求密钥（鉴权）→ 解密播放

#### FFmpeg 加密转码命令（预处理用）
```bash
ffmpeg -i input.mp4 \
  -hls_time 10 \
  -hls_key_info_file key_info.txt \
  -hls_playlist_type vod \
  output.m3u8
```

#### 面试话术
> “为了进一步提高安全性，我还调研了 HLS 分片 + AES-128 加密的轻量级 DRM 方案：首先用 FFmpeg 把视频转成 10 秒一个的 ts 分片，并用 AES-128 加密每个分片；解密密钥单独托管，通过带 Token 鉴权的接口访问；播放器只有拿到有效 Token 才能获取密钥，进而解密播放。即使盗链者下载了所有分片，没有密钥也无法还原视频，这也是 TikTok 等长短视频平台的主流做法。”

---

## 四、面试必说的总结（拔高认知）
> “总结一下，我认为视频防盗是一个‘成本对抗’的过程，没有绝对的安全，我们要做的是在用户体验和防盗成本之间找到平衡：
> 1.  基础层用 Referer/UA 防盗链 + 反向代理，拦截 90% 的普通盗链；
> 2.  进阶层用动态签名 URL，让视频地址有时效性，无法永久分享；
> 3.  高级层用 HLS 加密分片，从内容层面保护视频；
> 4.  正式商用还可以加上 Widevine 硬件级 DRM，配合风控系统识别异常播放行为。
> 
> 在我的 Demo 里，我实现了前两层方案，完全覆盖了 JD 里的‘防盗链实战经验’要求，同时也为后续升级预留了架构空间。”

---

## 五、直接加到你 Demo 计划里的更新
把这部分内容直接加到你的 **Day1 边缘 Worker 开发** 和 **面试话术准备** 里，完美对应 JD 里的「防盗链实战经验」要求，成为面试核心加分项。