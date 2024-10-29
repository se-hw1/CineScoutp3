cd src/backend
python3 app.py &
PID=`echo $!`
cd ../..;
sleep 5
pytest --cov=.
kill -9 $PID
rm -rvf src/backend/instance