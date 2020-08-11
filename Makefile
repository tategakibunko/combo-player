all: app

.PHONY:src

src:
	rm -f dist/*
	tsc

app: src
	rm -f scripts/*
	webpack

server:
	browser-sync start --server --index="index.html" --files="index.html, scripts/main.js, styles/*.css, games/*.json"
