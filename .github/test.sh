cd src/backend
coverage run app.py &
PID=`echo $!`
cd ../..;
sleep 5
pytest --cov=.
kill -s SIGTERM $PID
sleep 2
rm -rvf src/backend/instance