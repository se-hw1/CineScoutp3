cd src/backend
coverage run app.py &
PID=`echo $!`
cd ../..;
sleep 5
pytest --cov=.
kill -9 $PID
mv .coverage .coverage_a
mv src/backend/.coverage .coverage_api
coverage combine .coverage_a .coverage_api
coverage report -m
rm -rvf src/backend/instance