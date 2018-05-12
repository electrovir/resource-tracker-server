# Resource Tracker Server

## Status

Trying to figure out how to gather system resource utilization through node packages or system utilities. This is proving more difficult than I expected...

## Track the following

- [x] memory usage
- [ ] cpu utilization
- [ ] network I/O
- [ ] disk I/O
- [ ] disk space usage
- [ ] battery charge

## Why?

The activity monitor is great. But I want a more visual representation of its data. I want it served up on a server so I can use a web GUI to present the data. This will also allow me to view the data on a phone or tablet on my LAN.

This will also remove the need for all the different monitoring tools I have... (too many).
  * Activity Monitor itself for the cpu usage dock icon and it's entire application window. (Not very responsive UI. Not easy to read at a glance. However, *very* powerful.)
  * [MenuMeters](https://github.com/yujitach/MenuMeters) for network traffic in the menubar. (It's tiny.)
  * [Monit](https://mmonit.com/widget/) for memory percent usage and disk usage in the Notification Center. (Annoying to access.)
  * ``top`` in the Terminal. (Contains *way* too much information.)

Okay maybe not that many... but I've gone through unsatisfying trials of so many different ones I'm sick of it. And none of them do *everything* I want in one package. None of these are very easy to customize.

I hope to deliver the *same* features as all of these in a customizeable, easy to view package.

## Troubles

  * I tried using various Node.js packages and none of them give the right numbers for memory usage.
  * I can't figure out how to use psutil in python becuase I can't figure out how to install it because pip is just bad. (I don't want to do this in python anyway.)
  * ``top`` does not give proper memory usage!? It always says I'm using 90-100% of my memory. (which is never the case).
  * ``vm_stat`` does not agree with Activity Monitor numbers. Monit agrees with these numbers however. It's probably using ``vm_stat`` itself.
  * I don't know what MEMORY PRESSURE in the memory section of Activity Monitor is supposed to mean. Maybe it's some kind of ratio of compressed memory to total memory? It's always green for me (I have 16 GB of RAM). It seems so unimportant that I don't understand why it takes up so much space.
  * App Memory in Activity Monitor corresponds with *no* other reports that I can find.
  * I don't know what *Cached Files* in the Memory section of the Activity Monitor means. I don't think I need to worry about it.

Maybe I should read the Activity Monitor documentation. Does that exist?