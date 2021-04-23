const getAndSwimImage = () => {
  const url = "http://54.95.100.251:3000/uploadedList";
  fetch(url).then(res => res.json()).then(data => {
    console.log(data);
    
    const oldFish = document.getElementById("fish");
    if(oldFish) oldFish.remove();

    const imgLength = data.length;
    const rand = Math.floor(Math.random() * imgLength);
    const fish = document.createElement("img");
    fish.id = "fish"; fish.height = "300"; fish.width = "400";
    fish.style.position = "absolute"; fish.style.left = "0%"; fish.style.top = "0%";
    fish.src = `http://54.95.100.251:3000/uploads/${data[rand]}`;
    document.getElementById("aquarium").appendChild(fish);
    setInterval(function(){moveImg(fish)}, 1000 / 30);
  });
};

const moveImg = e => {
  const nowLeft = Number(e.style.left.split("%")[0]);
  e.style.left = String(nowLeft + 0.3) + "%";
}

setInterval(getAndSwimImage, 15000);
