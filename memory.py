#!/usr/bin/python

# MODIFIED FROM https://apple.stackexchange.com/a/4296/216714

# experimentations on tracking memory utilization

# TODO: rewrite all this in Node
import subprocess
import re

# Get process info
ps = subprocess.Popen(['ps', '-caxm', '-orss,comm'], stdout=subprocess.PIPE).communicate()[0].decode()
vm = subprocess.Popen(['vm_stat'], stdout=subprocess.PIPE).communicate()[0].decode()

# Iterate processes
processLines = ps.split('\n')
sep = re.compile('[\s]+')
rssTotal = 0 # kB
for row in range(1,len(processLines)):
    print processLines[row];
    rowText = processLines[row].strip()
    rowElements = sep.split(rowText)
    try:
        rss = float(rowElements[0]) * 1024
    except:
        rss = 0 # ignore...
    rssTotal += rss

# Process vm_stat
vmLines = vm.split('\n')
sep = re.compile(':[\s]+')
vmStats = {}
for row in range(1,len(vmLines)-2):
    rowText = vmLines[row].strip()
    rowElements = sep.split(rowText)
    vmStats[(rowElements[0])] = int(rowElements[1].strip('\.')) * 4096

# TODO: make this depend on system stats (not hard coded in)
total = 16
# I've determined that the following values agree with values that Monit reports
wired = float(vmStats['Pages wired down'])/pow(1024,3)
active = float(vmStats['Pages active'])/pow(1024,3)
compressed = float(vmStats['Pages occupied by compressor'])/pow(1024,3)
used = active + wired
free = total - wired - active - compressed
percent = (total-free) / total

print 'wired:\t\t%.2f' % wired
print 'active:\t\t%.2f' % active
print 'compressed:\t%.2f' % compressed
print 'free:\t\t%.2f' % free
print 'used:\t\t%.2f' % used
print '%d' % (percent * 100)

print '--------------------------------'

for key in vmStats:
    print(key + ':\t\t%.3f GB' % ( float(vmStats[key])/pow(1024,3)))