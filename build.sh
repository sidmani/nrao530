rm -rf gen/*
mkdir gen
browserify src/main.js --standalone sim > gen/bundle.js;
cp -r www/* gen/
