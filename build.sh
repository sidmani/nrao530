rm -rf docs/*
mkdir docs
browserify src/main.js --standalone sim > docs/bundle.js;
cp -r www/* docs/
