const maxRows = 60;
const maxCols = 60;
var rows = 30;
var cols = 40;
var bombs = 150;
var fields = rows * cols
const maxBombs = fields;
const flagIcon = '&#128681';
const bombIcon = '&#128163';
const hiddenIcon = ' ';

var game = 0;
var clearIds = [];
var bombIds = [];
var placedBombs = 0;
var placedFlags = 0;

document.addEventListener("contextmenu", function(e) {
    if (e.originalTarget.localName == 'td') {
        if (e.target.attributes.class.value.includes('hidden')) {
            e.preventDefault();
            flag(e.target.attributes.id.value);
        }
    }
}, false);

function sweep(id) {
    if (document.getElementById(id).classList.contains('hidden') && !document.getElementById(id).classList.contains('flagged') && game == 0) {
        if (bombIds.includes(id)) {
            lose();
        } else {
            var bombCount = parseInt(document.getElementById(id).classList[1].split('cell')[1]);
            document.getElementById(id).innerHTML = bombCount;
            if (bombCount == 0) {
                checkEmpty(id);
            }
        }
        document.getElementById(id).classList.remove('hidden');
        console.log(id)
    }
}

function flag(id) {
    if (document.getElementById(id).classList.contains('hidden')) {
        if (!document.getElementById(id).classList.contains('flagged') && placedFlags < placedBombs) {
            document.getElementById(id).classList.add('flagged');
            document.getElementById(id).innerHTML = flagIcon;
            placedFlags += 1;
        } else if (document.getElementById(id).classList.contains('flagged') && placedFlags <= placedBombs) {
            document.getElementById(id).classList.remove('flagged');
            document.getElementById(id).innerHTML = hiddenIcon;
            placedFlags -= 1;
        }
        document.getElementById('bombsleft').innerHTML = 'Bombs left: ' + (placedBombs - placedFlags)
    }
}

function checkBombs(id) {
    var bombCount = 0;
    var row = parseInt(id.split('.')[0]);
    var col = parseInt(id.split('.')[1]);
    for (let rowOff = -1; rowOff < 2; rowOff++) {
        for (let colOff = -1; colOff < 2; colOff++) {
            if (bombIds.includes(String(row + rowOff) + '.' + String(col + colOff))) {
                console.log(String(row + rowOff) + '.' + String(col + colOff))
                bombCount += 1;
            }
        }
    }
    return bombCount;
}

function checkEmpty(id) {
    if (!clearIds.includes(id)) {
        clearIds.push(id);
        let empties = [];
        var row = parseInt(id.split('.')[0]);
        var col = parseInt(id.split('.')[1]);
        for (let rowOff = -1; rowOff < 2; rowOff++) {
            for (let colOff = -1; colOff < 2; colOff++) {
                console.log('id: ' + id)
                console.log(colOff)
                console.log(rowOff)
                var current = String(row + rowOff) + '.' + String(col + colOff)
                console.log('checking: ' + current)
                if (document.getElementById(current)) {
                    if (document.getElementById(current).classList.contains('hidden') && current != id) {
                        empties.push(current);
                        console.log('empty: ' + current)
                        sweep(current);
                    }
                }
            }
        }
        console.log(empties)
    }

}

function setField() {
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement("tr");
        tr.id = "r" + String(i);
        document.getElementById('field').appendChild(tr);
        for (let j = 0; j < cols; j++) {
            const td = document.createElement("td");
            td.innerHTML = hiddenIcon;
            td.id = String(i) + '.' + String(j);
            td.classList.add('hidden');
            td.onclick = function() {
                sweep(String(i) + '.' + String(j));
            };
            document.getElementById(tr.id).appendChild(td);
        }
    }
    while (bombIds.length < bombs) {
        var id = String(Math.floor(Math.random() * rows)) + '.' + String(Math.floor(Math.random() * cols));
        if (!bombIds.includes(id)) {
            bombIds.push(id);
            document.getElementById(id).classList.add('bomb');
        }
    }
    placedBombs = bombIds.length;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            var id = String(i) + '.' + String(j);
            var bombCount = checkBombs(id);
            if (!bombIds.includes(id)) {
                document.getElementById(id).classList.add("cell" + bombCount);
            }
        }
    }
    document.getElementById('bombsleft').innerHTML = 'Bombs left: ' + (placedBombs - placedFlags)
}

function winCheck() {
    var points = 0;
    for (let i = 0; i < placedBombs; i++) {
        if (document.getElementsByClassName('bomb')[i].classList.contains('flagged')) {
            points += 1;
        }
    }
    if (points == placedBombs) {
        game = 1;
        document.getElementById('bombsleft').innerHTML = 'Won. ' + document.getElementById('bombsleft').innerHTML;
    }
}

function lose() {
    game = -1;
    document.getElementById('bombsleft').innerHTML = 'Lost. ' + document.getElementById('bombsleft').innerHTML;
    for (let i = 0; 0 < document.getElementsByClassName('bomb').length; i++) {
        var current = document.getElementsByClassName('bomb')[i];
        current.classList.remove('hidden');
        if (current.classList.contains('flagged')) {
            current.classList.remove('flagged');
        }
        if (bombIds.includes(current.id)) {
            current.innerHTML = bombIcon;
        } else {
            current.innerHTML = parseInt(current.classList[0].split('cell')[1]);
        }
    }
}



//          ---------dev---------



function showAll() {
    while (0 < document.getElementsByClassName('hidden').length) {
        var current = document.getElementsByClassName('hidden')[0];
        current.classList.remove('hidden');
        if (current.classList.contains('flagged')) {
            current.classList.remove('flagged');
        }
        if (bombIds.includes(current.id)) {
            current.innerHTML = bombIcon;
        } else {
            current.innerHTML = parseInt(current.classList[0].split('cell')[1]);
        }
    }
}

function autoSolve() {
    for (let i = 0; i < placedBombs; i++) {
        if (!document.getElementsByClassName('bomb')[i].classList.contains('flagged')) {
            document.getElementsByClassName('bomb')[i].classList.add('flagged');
            document.getElementsByClassName('bomb')[i].innerHTML = flagIcon;
            placedFlags += 1;
        }
    }
    winCheck();
}

function startHelp() {
    sweep(document.getElementsByClassName('cell0')[Math.floor(Math.random() * document.getElementsByClassName('cell0').length)].id)
}