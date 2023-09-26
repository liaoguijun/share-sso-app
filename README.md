sso app

```
// nginx 配置

server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  home.html home.htm;
        try_files $uri $uri/ /home.html;
    }

    location /login {
        root   /usr/share/nginx/html;
        index  login.html login.htm;
        try_files $uri $uri/ /login.html;
    }

    location /api {
        proxy_pass http://a.com:3010/api;
    }
}
```

```
/etc/hosts

192.168.1.104 a.com
192.168.1.104 b.com 
192.168.1.104 c.com

```