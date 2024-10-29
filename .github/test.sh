cd src/backend
python3 app.py &
PID=`echo $!`
cd ../..;
pytest
kill -9 ${PID}
rm -rvf src/backend/instance