#!/usr/bin/python

# MODIFIED FROM https://apple.stackexchange.com/a/4296/216714

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

total = 16
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

# print 'Wired Memory:\t\t%.3f GB' % ( float(vmStats["Pages wired down"])/1024/1024/1024 )  # accurate
# print('Active Memory:\t\t%.3f GB' % ( float(vmStats["Pages active"])/1024/1024/1024 ))    # off by .5 GB from App Memory (too low)
# print('Inactive Memory:\t%.3f GB' % ( float(vmStats["Pages inactive"])/1024/1024/1024 ))  # no idea where this comes from
# print('Free Memory:\t\t%.3f GB' % ( float(vmStats["Pages free"])/1024/1024/1024 ))        # or this
# print('compressed:\t\t%.3f GB' % ( float(vmStats["Compressions"])/1024/1024/1024 ))       # what?
# print('Real Mem Total (ps):\t%.3f GB' % ( rssTotal/1024/1024/1024 ))                      # off by .1 GB (too high)
# 
# Pages purged: free
# Pages active: active
# Pages wired down: wired
# Pages occupied by compressor: compressed