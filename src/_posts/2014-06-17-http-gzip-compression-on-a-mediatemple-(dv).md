---
title: HTTP gzip compression on a MediaTemple (dv)
date: 2014-06-17 03:23:00
tags: dev, web servers, performance optimzation
---

I've had this (mt) DV box for quite some time, mostly use it for staging, small WordPress gigs and running a qmail server that forwards mail elsewhere. It's reliable, has lots of client-friendly features like Plesk, and can host a zillion websites. But it was always kinda slow, especially from the eastern hemisphere, and executing otherwise simple server admin stuff (like adding ssh keys) was always a bit perverted by the finicky complexities that come with Plesk. So, it wasn't really my go-to for builds with serious production needs.

Recently I've embarked on a mission: give out 100 free websites, to raise awareness about the benefits of quality web development in Nepal. The allure of having them all live in one central community, flexible enough to provide features like email and separate client hosting logins when needed, along with he infamous [Plesk Command Line Utilities](http://download1.parallels.com/Plesk/PP11/11.0/Doc/en-US/online/plesk-unix-cli/) provided sufficient temptation to get toolin'. First stop: HTTP compression.

Well, two hours later, blatantly violating my 20 minute commit rule, there is fruit at the end of the tunnel. At first it seemed as simple as finding some good Apache `mod_deflate` rules, appending to `httpd.conf` and watching the PageSpeed rank soar. I followed [(mt)'s knowledge base article on compressing web pages with mod_deflate](http://kb.mediatemple.net/questions/1567/Compressing+web+pages+with+mod_deflate#dv) to the letter, no luck - `Content-Encoding:gzip` was no where to be found in my response headers.

Here's the QA session that ensued:

__Is `.htaccess` negating whatever I just did?__

No, even after removing the boilerplate compression rules, still nothing.

__What about removing (mt)'s content type rules and sticking with the `.htaccess`?__

Nada.

__I remembered to restart apache, right?__

Once more for good measure... nope.

__Are there separate apache configs for the Plesk vhosts overwriting `httpd.conf`?__

Negative.

__Google: "mediatemple dv mod_deflate not working"__

Aha, [someone in the (mt) community forums](https://forum.mediatemple.net/topic/6979-mod-deflate-only-working-on-files-1kb-anyone-help-locate-the-issue/#entry37335) mentioned "I'm willing to bet you're running Nginx as a reverse proxy on your (dv) box."

A quick peek into `/etc/nginx/nginx.conf` shows that not only are there ready-made gzip switches in place, they've been commented out.

    #gzip on;
    #gzip_disable "MSIE [1-6]\.(?!.*SV1)";

After uncommenting and `service nginx restart`ing, gzip compression was working... for *only for* `index.html`! js, css, etc were still missing the elusive `Content-Encoding:gzip` header. Time to crack a second litre of whiskey.

My `mod_deflate` rules included all the correct content types. I even added redundant declarations in both `httpd.conf` and the indigenous `.htaccess`.

    AddOutputFilterByType DEFLATE application/atom+xml \
                                  application/javascript \
                                  application/json \
                                  application/ld+json \
                                  application/rss+xml \
                                  application/vnd.ms-fontobject \
                                  application/x-font-ttf \
                                  application/x-web-app-manifest+json \
                                  application/xhtml+xml \
                                  application/xml \
                                  font/opentype \
                                  image/svg+xml \
                                  image/x-icon \
                                  text/css \
                                  text/html \
                                  text/plain \
                                  text/x-component \
                                  text/xml

So, back to Google, wherein lies a [kick ass post](http://kickassability.com/apache-nginx-mod_deflate-gzip-compression-woes/) about the woes of compression on a Mediatemple DV, along with a more iterative solution:

    gzip on;
    gzip_http_version 1.1;
    gzip_types text/plain text/html text/css text/javascript application/x-javascript text/xml application/xml application/xml+rss;

gzip was on, but nginx also controls which file types will be compressed. Ok, so just `service nginx restart` right quick, pop back to dev tools, refresh... Huh? CSS is gzipped, and JS isn't. So did I misspell `javacsritp` in `nginx.conf`? No, but as it turns out, if you check the response header of a .js file in any browser since the dark ages, the term is `Content-Type:text/javascript;`, not `text/javascript`. One more round of restart/refresh, and gzip goodness was fully functional.

So all those neglected sites on my DV are running pretty fast now, even despite the heinously slow internet speeds in Nepal, on par with a dial up modem that's having a really good day.

If you're thinking about hopping aboard the HTTP compression love boat, be sure to keep your packages safe from uncool browsers with `Vary: Accept-Encoding`. MaxCDN has a [nice write up](http://blog.maxcdn.com/accept-encoding-its-vary-important/) on why it's vary important.
