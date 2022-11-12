rm -rf build
mkdir build
cp *.json build/
cp *.ts build/
cd build
npm ci
npm run build
cd ..

docker build --tag tibber-price-level .

docker tag tibber-price-level:latest tibber-price-level:$1

rm -rf build