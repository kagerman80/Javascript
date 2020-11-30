
let pocket = {
    table: [null, null, null, null, null, null, null, null, null],
    blocker: false
}


function init(turn) {
    document.body.innerHTML = '';
    draw_table();
    if (turn == 2) {
        cputurn(pocket.table);
    }

}

function nextmove(x, y, table) { // count x in array [x, x, x] return index of table
    
    const winboard = shuffleit([[0,4,8], [2,4,6], [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8]]);
    result = [];

    for (const arr of winboard) {

        let temp = arr.map((z) => table[z]); // fill winboard arr with table items

        if ((temp.filter(item => item===x).length === 2) && (temp.includes(y))) {
            result = arr[temp.indexOf(null)];
            return result;
            
        } 
    }
    return null;
}


function think(table) {

    if (table[4] == null) {return 4;}

    function* generator() {
        yield nextmove(2, null, table);
        yield nextmove(1, null, table);
        yield nextmove(null, 2, table);
        yield nextmove(null, 1, table);
        yield nextmove(null, null, table);
        return 4;
        
    }
    
    let gena = generator();
    
    for (const i of gena) {
        if (i != null) {
            return i;
        } 
        
    }
   
}

function shuffleit(array) { // shuffling the array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getmoves(table) {
    let moves = [];
    for (const i of table) {
        if (i == null) {
            moves.push(i);
        }
        
    }
    return moves;
}

function onclickremove() {
    let wrp = document.getElementsByClassName("wrapper");
    for (const index of wrp) {
        index.onclick = null;
    }
}

function cputurn(table) {
    
    let moves = getmoves(table);
    pocket.blocker = true;
    setTimeout(() => pocket.blocker = false, 1500);
    if (moves != "") {
        let a = think(table); 
        let b = document.getElementById(a);
    
        setTimeout(() => rotate(b, 2), 1000);
        
    } else setTimeout(() => sign("ROUND DRAW"), 1000);
}


function mouseclick() {
    let a = parseInt(this.id);
    if (pocket.table[a] == null && pocket.blocker == false) {
        pocket.blocker = true;
        rotate(this, 1);        
    } else return;
    
}

function sign(words) {

    let winsign = document.createElement("div");
    winsign.className = "congrats";
    winsign.id = "congrats";
    winsign.innerHTML = words
    document.getElementById("canvas").appendChild(winsign);

}

function congrats(combination) {
    let player = pocket.table[combination[0]];
    combination.forEach(element => {    // makes the bars darker
        document.getElementById("b" + element).style.backgroundColor = " rgb(255, 153, 57)";
    });

    switch (player) {
        case 1:
            setTimeout(() => sign("You WIN!"), 1000);
            onclickremove();
            break;
        case 2:
            setTimeout(() => sign("You LOOSE"), 1000);
            onclickremove();
            break;
        default:
            break;
    }

}

function makeit(type, id, cname, parent) {

    let elem = document.createElement(type);
    elem.id = id;
    elem.className = cname;
    (parent != undefined) ? (document.getElementById(parent).appendChild(elem)) : (
    document.body.appendChild(elem))
}

function draw_table () {
    makeit("div", "canvas", "canvas");

    for (let index = 0; index < 9; index ++) {

        makeit("div", index, "wrapper", "canvas");
        makeit("div", "c" + index, "card", index);
        makeit("div", "f" + index, "front", "c" + index);
        makeit("div", "b" + index, "back", "c" + index);            
        document.getElementById(index).onclick = mouseclick;
        
    }

}

function rotate (target, player) {
    
    let a = parseInt(target.id);

    if (player == 1) {
        
        pocket.table[a] = 1; // Players turn
        target.querySelector(".back").style.backgroundImage="url('svg/cros.svg')";
        target.querySelector(".front").style.transform = "rotateY(180deg)";
        target.querySelector(".back").style.transform = "rotateY(360deg)";

    } else {
        
        pocket.table[a] = 2; // cpu turn
        target.querySelector(".back").style.backgroundImage="url('svg/circle.svg')";
        target.querySelector(".front").style.transform = "rotateY(180deg)";
        target.querySelector(".back").style.transform = "rotateY(360deg)";
        
    }

    isitwin(pocket.table, player); 

}

function isitwin(table, player) {
    
    const winboard = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    
    for (const j of winboard) {
        
        if (table[j[0]] == table[j[1]] && table[j[1]] == table[j[2]] && table[j[2]]  == player) {
            congrats(j);
            return;
        }
        
    }
    
    if (player == 1 || player == "1") {
        cputurn(pocket.table);
    } 
        
}
