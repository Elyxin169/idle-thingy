class Building {
    constructor(cost, name, cps, count, source) {
        this.cost = cost;
        this.name = name;
        this.cps = cps;
        this.count = count || 0;
        this.source = source;

        this.scaleCost = () => {
            this.cost += 1;
        }
    }
};
class Game {
    constructor(currencyTotal, buildings) {
        this.currencyTotal = currencyTotal || 0;
        this.buildings = buildings;
        this.getCPS = () => {
            let s = 0;
            this.buildings.forEach(v => {
                s += v.cps * v.count;
            });
            return s;
        }
    }
};

var buildings = [
    new Building(10, "addition", 0.1, 0, ""),
    new Building(50, "subtraction", 0.3, 2, ""),
    new Building(200, "multiplication", 2, 0, "")
];

var game = new Game(8, buildings);

function buy(obj) {
    let filtered = game.buildings.filter(v => {
        return v.name === obj.children[0].children[1].children[0].innerText
    });
    let building = filtered[0];

    if (game.currencyTotal > building.cost) {
        game.currencyTotal -= building.cost;
        document.getElementById("money").innerText = Math.round((document.getElementById("money").innerText - building.cost) * 1000) / 1000;
        building.scaleCost();
        building.count++;
        updateBuildings();
    }
}

// stolen from chatgpt
function createElem(tag, id, className, text, src, alt) {
    let elem = document.createElement(tag);
    if (id) elem.id = id;
    if (className) elem.className = className;
    if (text) elem.textContent = text;
    if (src) elem.src = src;
    if (alt) elem.alt = alt;
    return elem;
}
function generateBuildingDOM(build) {
    let row = createElem('div', null, 'row');

    let building = createElem('button', null, 'building');
    let col4 = createElem('div', null, 'col-4');
    let img = createElem('img', 'icon', 'img-fluid', null, build.source);
    col4.appendChild(img);

    let col6 = createElem('div', null, 'col-6');
    let h2 = createElem('h2', 'name', null, build.name);
    let p = createElem('p', 'cost', null, build.cost);
    col6.appendChild(h2);
    col6.appendChild(p);

    let col2 = createElem('div', null, 'col-2');
    let h4 = createElem('h4', 'count', null, build.count !== 0 ? build.count : "0");
    col2.appendChild(h4);

    row.appendChild(col4);
    row.appendChild(col6);
    row.appendChild(col2);
    building.appendChild(row);

    building.onclick = function () {
        buy(this);
    }

    return building;
}
// end of stolen from chatgpt

const updateBuildings = () => {
    document.getElementById("buildings").innerHTML = "";
    game.buildings.forEach(v => {
        document.getElementById("buildings").appendChild(generateBuildingDOM(v));
    });
}

updateBuildings();
document.getElementById("money").innerText = game.currencyTotal;

const mainLoop = () => {
    setInterval(() => {
        game.currencyTotal += game.getCPS();
        document.getElementById("money").innerText = Math.round(game.currencyTotal * 1000) / 1000;
    }, 1000);
}
mainLoop();