# Resource Tracker Server

## Status

Critical system resource data gathering is in preliminary stages. A barebones server is functioning.

## Starting Server

```Bash
cd resource-tracker-server
node server.js
```

## Track the following

- [x] memory usage
  * calculating this from ``vm_stat`` command output (on Linux it's just ``vmstat``)
  * ``node-os-utils`` package does not correctly report this number
- [x] cpu utilization
  * seems to be correctly reported from ``node-os-utils`` package
- [ ] network I/O
- [ ] fan speed
- [ ] temperatures
- [ ] disk I/O
- [x] disk space usage
  * ``node-os-utils``, Monit, Finder get info, About This Mac, all disagree on free space.
  * all except ``node-os-utils`` agree on total space available
  * Disk Utility and DaisyDisk and About This Mac all agree on available space. ``df -h`` disagrees with these. I think ``node-os-utils`` uses ``df -h``.
  * I trust DaisyDisk above all the others since it performs a real-time scan of the system.
  * ``diskutil info -all`` correctly reports disk space usage.
- [x] battery charge
  * Accessible through ``system_profiler`` CLI
- [ ] energy usage
- [ ] peripheral battery charge
  * [This guide](http://osxdaily.com/2014/05/18/how-to-check-bluetooth-keyboard-battery-levels-from-the-command-line-on-mac-os-x/) may prove useful here.

## Why?

The activity monitor is great. But I want a more visual representation of its data. I want it served up on a server so I can use a web GUI to present the data. This will also allow me to view the data on a phone or tablet on my LAN.

This will also remove the need for all the different monitoring tools I have... (too many).
  * Activity Monitor itself for the cpu usage dock icon and it's entire application window. (Not very responsive UI. Not easy to read at-a-glance. However, *very* powerful.)
  * [MenuMeters](https://github.com/yujitach/MenuMeters) for network traffic in the menubar. (It's tiny.)
  * [Monit](https://mmonit.com/widget/) for memory percent usage and disk usage in the Notification Center. (Annoying to access.)
  * ``top`` in the Terminal. (Contains *way* too much information, non-visual.)
  * [Daisy Disk](https://daisydiskapp.com) for disk space usage. (Not good for quick glances but very beautiful, accurate, and powerful.)
  * [Coconut Battery](https://www.coconut-flavour.com/coconutbattery/) for battery condition. (Not much better at-a-glance features than the built-in menubar battery monitor.)

I hope to deliver the *same* at-a-glance features as all of these in a single customizeable, easy to view package.

## Troubles

  * I tried using various Node.js packages and none of them give the right numbers for memory usage.
  * I can't figure out how to use psutil in python becuase I can't figure out how to install it because pip is just bad. (I don't want to do this in python anyway.)
  * ``top`` does not give proper memory usage!? It always says I'm using 90-100% of my memory. (which is never the case).
  * ``vm_stat`` does not agree with Activity Monitor numbers. Monit agrees with these numbers however. It's probably using ``vm_stat`` itself.
  * I don't know what MEMORY PRESSURE in the memory section of Activity Monitor is supposed to mean. Maybe it's some kind of ratio of compressed memory to total memory? It's always green for me (I have 16 GB of RAM). It seems so unimportant that I don't understand why it takes up so much space.
  * App Memory in Activity Monitor corresponds with *no* other reports that I can find.
  * I don't know what *Cached Files* in the Memory section of the Activity Monitor means. I don't think I need to worry about it.
  * ``node-os-utils`` does not correctly report memory usage, at least on Mac.
  * ``node-os-utils`` ``netstat.inOut()`` not supported.
  * Many disagreements from different apps on disk space usage.
  * macOS's memory management is funky. How do I properly measure it even? Modern macOS dishes out pretty much all available memory but measures how much its getting used up with "Memory Pressure." Can I get memory pressure from a CLI?
    * The way I'm calculating memory leaves out ``kernal_task`` memory (and likely other process memory). The way I'm currently reading gives me numbers that make sense, but including ``kernal_task`` memory does indeed lead to it reporting that I'm using nearly ``100%`` of my memory all the time, which makes sense actually (might as well use all the memory I have). Memory Pressure is indeed a better way to report this.