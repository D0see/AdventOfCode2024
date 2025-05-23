const fs = require("fs");

// INTUT GATHERING & CLEANING

const rawInput = fs.readFileSync("./adventOfCode12Input.txt", {
    encoding: "utf-8",
});

const map = rawInput.split("\r\n").map((row) => row.split(""));

// PART 1

const floodFill = (y, x, map, vege = map[y][x], plotStats = {area : 0, perimeter : 0, fencePositions : {}}, fencedSpots = {}) => {
    //MARKS SPOT AS VISITED
    map[y][x] = null;
    //ADDS IT THE FENCED-SPOTS MAP
    fencedSpots[`${y}-${x}`] = true;
    plotStats.area++;
    [[y, x + 1, "RIGHT"], 
    [y, x - 1, "LEFT"], 
    [y + 1, x, "DOWN"], 
    [y - 1, x, "UP"]].forEach(([movY, movX, direction]) => {
        //IF DESTINATION IS NOT ALREADY VISITED AND HAS THE CORRECT VEGGIE
        if (map[movY]?.[movX] === vege) {
            floodFill(movY, movX, map, vege, plotStats, fencedSpots);
        //IF ITS NOT PART OF THIS PLOT
        } else if (!fencedSpots[`${movY}-${movX}`]) {
            plotStats.perimeter++;
            //SAVE FENCES AT CURRENT POS FOR PART 2
            plotStats.fencePositions[`${y}-${x}`] ? 
            plotStats.fencePositions[`${y}-${x}`][direction] = true : 
            plotStats.fencePositions[`${y}-${x}`] = {[direction] : true};
        }
    })
    return plotStats;
}

//COUNTSIDES USING FENCESPOSITIONS -> ORIENTATIONS MAP FOR PART 2 (this feels really stupid)
const countSides = (fencePositions) => {
    let result = 0;
    for (const key of Object.keys(fencePositions)) {
        const [y, x] = key.split('-').map(coordinate => parseInt(coordinate));
        for (const orientation of Object.keys(fencePositions[key])) {
            if (!fencePositions[key][orientation]) continue;
            fencePositions[key[orientation]] = false;
            if (["UP", "DOWN"].includes(orientation)) {
                let val = 1;
                while(fencePositions[`${y}-${x + val}`]?.[orientation]) {
                    fencePositions[`${y}-${x + val}`][orientation] = false;
                    val++;
                }
                val = -1;
                while(fencePositions[`${y}-${x + val}`]?.[orientation]) {
                    fencePositions[`${y}-${x + val}`][orientation] = false;
                    val--;
                }
            } else if (["LEFT", "RIGHT"].includes(orientation)) {
                let val = 1;
                while(fencePositions[`${y + val}-${x}`]?.[orientation]) {
                    fencePositions[`${y + val}-${x}`][orientation] = false;
                    val++;
                }
                val = -1;
                while(fencePositions[`${y + val}-${x}`]?.[orientation]) {
                    fencePositions[`${y + val}-${x}`][orientation] = false;
                    val--;
                }
            }
            result++;
        }
    }
    return result;
}

let result = 0;
let result2 = 0;

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
        if (map[y][x]) {
            // plotStats = {area : int, perimeter : int}
            const plotStats = floodFill(y, x, map);
            result += plotStats.area * plotStats.perimeter;
            result2 += countSides(plotStats.fencePositions) * plotStats.area;
        } 
    }
}

console.log(result);
console.log(result2);


// PART 2

// for part 2 i added a new property to plotStats which keeps track of the fences at Y-X positions (ex : y-x = {"Left" = true, "Right"= true}) 
