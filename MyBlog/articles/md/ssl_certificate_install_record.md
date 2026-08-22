---
title: "SSL站点证书申请及更换记录"
author: "Ethan"
date: "2026-08-16"
category: "技术教程"
tags: ["Markdown", "写作", "格式"]
readTime: "10分钟阅读"
---

## SSL站点证书申请及更换记录

- 记录自己站点证书过期时，申请和更换证书需要的关键步骤，方便下次证书的重新更换上线

### 阿里云证书个人免费证书的获取

- 如下图，阿里云直接申请个人免费测试证书即可

<img src="./picture/ssl_certificate_install_record/getssl.png" alt="内联图片" title="图片标题" width="50%" />


### 查询个人站点的证书路径、并进行替换

```bash
cat /etc/nginx/nginx.conf
```

<img src="./picture/ssl_certificate_install_record/sslpath.png" alt="内联图片" title="图片标题" width="50%" />

<img src="./picture/ssl_certificate_install_record/sslcopy.png" alt="内联图片" title="图片标题" width="50%" />
