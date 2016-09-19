#!/bin/bash
#
#


cd /home/erapetti/Traslados
export NODE_ENV=production
exec sails lift --prod $1
