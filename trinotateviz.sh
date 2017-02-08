#!/bin/bash
sed "s@input_db@$1@" $2/trinotateviz.html  > $3;
cp -r $2/static/* $(dirname $3);
