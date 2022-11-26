#!/bin/bash
#密码:Tx!code-fusheng
rsync -avz -e 'ssh -p 22221' --progress ./model-admin root@42.192.222.62:/usr/share/nginx/model-admin
