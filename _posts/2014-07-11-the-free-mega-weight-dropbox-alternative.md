---
layout: post
title: The Free Mega-Weight Dropbox Alternative
date: 2014-07-11 14:26:00
tags: cloud, backup 
published: true
comments: true
---

About a year back, Dropbox decided to delete all the mp3s and miscellaneous parts of the project files inside my music production folder. Didn't notice until it was too late to restore. That caused me to (1) rethink my mostly cloud-based backup strategy and (2) cancel my 100GB plan in favor of the free plan. Fortunately I had completed all the bonus space missions for my account, including referring a bunch of workstations in my college computer lab with bogus email addresses, so my free account has 13.2GB instead of 2.

Now days i keep all dev work mirrored on a couple git servers and have multiple physical backups combined with Amazon Glacier for everything else; Dropbox only serves as a temporary stash/collaboration/app sync tool.

After watching [the saga of Kim Dotcom and Mega](http://www.vice.com/vice-news/kim-dotcom-the-man-behind-mega) I decided to check out what they have to offer - a lot. 50GB of space for free, with all the key bells and whistles of Dropbox like collaboration and native sync apps. The web interface, selective sync, and dealing with proxies are much nice in my opinion. The [`ln -s` trick](http://lifehacker.com/5154698/sync-files-and-folders-outside-your-my-dropbox-folder) works, but there's actually no need for it - users can add a "Sync" (directory) straight from the desktop client to put any folder on the machine into any folder on Mega, even with a different name. It's just easy. And super fast.

![](/assets/mega-1.png)

![](/assets/mega-2.png)

So now, all of the less-recent but non-ancient stuff that doesn't fit in my Dropbox is going to Mega, such as the year's raw dump of photos/videos and a massive legal case directory that I occaisionally need to share or call up rapidly.

Oh, and the paid plans are Mega-huge, yo.

* 500GB - $9.99/mo
* 2TB - $19.99/mo
* 4TB - $29.99/mo

Compared to Dropbox:

* 100GB - $9.99/mo
* 200GB - $19.99/mo
* 500GB - $49.99/mo

[https://mega.co.nz](https://mega.co.nz/)