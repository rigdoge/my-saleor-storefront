rm -rf .next 
npm install
echo "start building.................................."
npm run build:prod
echo "start generate.................................."
npm run generate
echo "start run..........................................."
npm run start
