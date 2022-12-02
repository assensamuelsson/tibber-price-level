rm -rf build
mkdir build
cp *.json build/
cp index.ts build/
cp -r src/ build/src
cd build
npm ci
npm run build
cd ..

docker build --tag tibber-price-level --platform=linux/amd64 .
rm -rf build

docker tag tibber-price-level:latest tibber-price-level:$1
docker tag tibber-price-level:$1 $2/tibber-price-level:$1
docker push $2/tibber-price-level:$1
docker push $2/tibber-price-level:latest
