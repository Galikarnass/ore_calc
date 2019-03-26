for (let i = 0; i < ore_db.length; i++) {
    let req = new XMLHttpRequest();
    req.open("GET", ore_db[i][1], true);
    req.send();
    req.onload = function () {
        let json = JSON.parse(req.responseText);
        let price1 = Math.round(json.summaries[0].prices.sell.median * 100) / 100;
        ore_db[i].push(price1);
    };
}

function takeLessFromArray(arr, key) {
    let arrCopy = [];
    for (let i = 0; i < arr.length; i++) {
        arrCopy.push(arr[i][key])
    }
    let indexOfArray;
    const min = Math.min(...arrCopy);
    for (let k = 0; k < arrCopy.length; k++) {
        if (arrCopy[k] == min) {
            return indexOfArray = k;
        }
    }
}

function getCombinations(arr, prepend) {
    let i, version, el, el2, result = [];
    prepend = prepend || [];
    if (arr.length === 1) return [arr];
    for (i = 0; i < arr.length; i++) {
        if (arr.length === 2) {
            result.push(prepend.concat([parseInt(arr[i]), parseInt(arr[(i + 1) % 2])]));
        } else {
            version = arr.slice();
            el = version.splice(i, 1);
            el2 = parseInt(el);
            result = result.concat(getCombinations(version, prepend.concat(el2)));
        }
    }
    return result;
}

let combinations = getCombinations('01234567'.split(''));
combinations.map(e => e.join('')).join("\n");


function neededOre() {
    document.getElementById("result").innerHTML = '';

    function getParam(blockName) {
        return document.getElementById(blockName).value;
    }

    let getTritanium = parseInt(getParam("Tritanium"));
    let getPyerite = parseInt(getParam("Pyerite"));
    let getMexallon = parseInt(getParam("Mexallon"));
    let getIsogen = parseInt(getParam("Isogen"));
    let getNocxium = parseInt(getParam("Nocxium"));
    let getZydrine = parseInt(getParam("Zydrine"));
    let getMegacyte = parseInt(getParam("Megacyte"));
    let getMorphite = parseInt(getParam("Morphite"));
    let refineYeld = parseInt(getParam("% Yeld")) / 100;

    let result;
    let priceList = [];
    let orePrice;
    let oreQuantity;

    let testArr = [];

    for (let p = 0; p < combinations.length; p++) {
        let miniki = [getTritanium, getPyerite, getMexallon, getIsogen, getNocxium, getZydrine, getMegacyte, getMorphite];
        let overallPrice = 0;
        let overallResult = [];
        testArr = combinations[p];

        // пробегаемся по комбинации минералов
        for (let j = 0; j < testArr.length; j++) {
            let refineProm = [];

            // вычисляем необходимую руду на конкретный миник
            if (miniki[testArr[j]] > 0) {
                for (let i = 0; i < ore_db.length; i++) {
                    oreQuantity = Math.ceil(miniki[testArr[j]] / (ore_db[i][testArr[j] + 3]) / refineYeld);
                    orePrice = Math.round((oreQuantity * ore_db[i][11]) * 100) / 100;
                    refineProm.push([oreQuantity, ore_db[i][0], orePrice]);
                }

                // пушим ее в итоговый аррей, который будет выводиться юзеру
                let f = takeLessFromArray(refineProm, 2);
                overallResult.push(refineProm[f][0], refineProm[f][1]);
                overallPrice += refineProm[f][2];
                overallPrice = Math.round(overallPrice * 100) / 100;

                // вычитаем миники из запрашиваемого количества после первого прогона по руде
                for (let i = 0; i < miniki.length; i++) {
                    miniki[i] = miniki[i] - (refineProm[f][0] * ore_db[f][i + 3]);
                }
            }
        }
        priceList.push([overallPrice, overallResult, miniki]);
    }
    result = takeLessFromArray(priceList, 0);

    for (let i = 0; i < priceList[result][1].length / 2; i++) {
        document.getElementById("result").innerHTML += priceList[result][1][(i * 2) + 1] + ' ' + priceList[result][1][i * 2] + '<br>';
    }

    document.getElementById("result").innerHTML += '<br>' + 'Стоимостью: ' + priceList[result][0] + ' ISK' + '<br>' + '<br>' + 'сдача:' + '<br>' + '<br>';
    for (let i = 0; i < minerals.length; i++) {
        document.getElementById("result").innerHTML += minerals[i] + ' ' + Math.abs(priceList[result][2][i]) + '<br>';
    }


}
