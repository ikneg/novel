let data = null;
let images = {};
let loading = true;

function setup() {
    createCanvas(600, 400);

    fetch("charactorImageData.json")
        .then((res) => res.json())
        .then((loadedData) => {
            data = loadedData;
            console.log("loaded JSON:", data);

            const keys = Object.keys(data);
            if (keys.length === 0) {
                throw new Error("JSON にデータがありません");
            }

            keys.forEach((key) => {
                loadImage(
                    data[key],
                    (img) => {
                        images[key] = img;
                        console.log(`loaded image ${key}`);
                        if (Object.keys(images).length === keys.length) {
                            loading = false;
                        }
                    },
                    (err) => {
                        console.error(`loadImage error ${key}`, err);
                        loading = false;
                    },
                );
            });
        })
        .catch((err) => {
            console.error("fetch JSON error", err);
            loading = false;
        });
}

function draw() {
    background(220);
    fill(0);
    textSize(18);
    textAlign(LEFT);
    text("こんにちは", 20, 300);
    image(images.normal, 400, 100, 200, 300);
}
