---
title: Automating Tasks With launchd In OS X
date: 2014-07-03 15:38:00
tags: hacks, security, shell, macOS, *nix
---

Just got into some `lanchd` automation with OS X. I wanted an automatic `rsync` of my [1Password Anywhere](http://help.agilebits.com/1Password3/1passwordanywhere.html) files to a remote web server, as a DIY public web service for 1Password.

First step: make a shell script with whatever you want to do, and save it in your `$PATH`. For my 1Password sync, a simple `rsync` one-liner:

```shell
#!/bin/sh
rsync -az --force --delete -e "ssh -p7890" /Users/me/Dropbox/Apps/1Password.agilekeychain/. root@yourmama.com:/var/www/vhosts/etc/et.all/public_html/
```

Then: make a .plist file in XML format so `launchd` can understand what must be done. Set the `StartInterval` in seconds (300 means every 5 minutes).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.YOURUSERNAME.NAMEOFTASK.backup</string>
    <key>ProgramArguments</key>
    <array>
        <string>YOURSCRIPT.sh</string>
    </array>
    <key>StartInterval</key>
    <integer>300</integer>
</dict>
</plist>
```

Save it as `com.YOURUSERNAME.NAMEOFTASK.backup.plist` in `~/Library/LaunchAgents/`. Be sure the file name matches the `<string>` for `<key>label</key>` in the XML. Also make sure the ownership and permissions are proper.

```shell
sudo chown root com.YOURUSERNAME.NAMEOFTASK.backup.plist
sudo chmod 644 com.YOURUSERNAME.NAMEOFTASK.backup.plist
```

Now to tell OSX about our screenplay. Fire up a terminal and

```shell
launchctl -w load ~/Library/LaunchAgents/com.YOURUSERNAME.NAMEOFTASK.backup.plist
```

The `-w` flag tells `launchctl` to load without waiting for a system reboot.

BAM. Now your shell script will run in the background every 300 seconds.

For the 1Password setup, they use a file called `1Password.html`, meaning you have to add that to the URL. To streamline the process, I touched an `index.html` file on the server that redirects to the 1Password html.

```html
<!DOCTYPE html>
<head>
    <meta http-equiv="refresh" content="0; url=/1Password.html">
</head>
</html>
```

So yes - my super top secret passwords are technically public on the Internet; however, they're well encrypted and I'm usually a pretty nice dude... so nobody would hack me right? For the paranoid, you could add some redundancy with an apache `.htpasswd` file on the server. 2Passwords is better than one.
