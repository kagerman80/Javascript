
function init(turn) {
    document.body.innerHTML = '';
    draw_table.draw();
    if (turn == 2) {
        cputurn(draw_table.table);
    }

}

function think(table) {
    const winboard = [[0,4,8], [2,4,6], [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8]];
    let result = null;
    
    function doit(x, y) { // count x in array [x, x, x] return index of table

        for (let i = 0; i < winboard.length; i++) {
            let arr = winboard[i];
            let temp = arr.map((z) => table[z]); // fill winboard arr with table items

            if ((temp.filter(item => item===x).length === 2) && (temp.includes(y))) {
                result = arr[temp.indexOf(null)];
                return result;
            } 
        }
        return null;
    }
    
    if (table[4] == null) {result = 4;} else { // Not good... but works
        if (doit(2, null) == null) {
            if (doit(1, null) == null) {
                if (doit(null, 2) == null) {
                    if (doit(null, 1) == null) {
                        let moves = getmoves(table);
                        result = moves[Math.floor(Math.random() * moves.length)];
                    }
                }
            }
        }
    }
    return result;
   
}

function getmoves(table) {
    let moves = [];
    for (let i = 0; i < table.length; i++) {
        if (table[i] == null) {
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
    //console.log(think(table));
    let moves = getmoves(draw_table.table);
    rotate.blocker = true;
    setTimeout(() => rotate.blocker = false, 1500);
    if (moves != "") {
        let a = think(draw_table.table); //moves[Math.floor(Math.random() * moves.length)];
        let b = document.getElementById(a);
        //rotate(b, 2);
        setTimeout(() => rotate.doit(b, 2), 1000);
        
    } else setTimeout(() => sign("ROUND DRAW"), 1000);
}


function mouseclick() {
    let a = parseInt(this.id);
    if (draw_table.table[a] == null && rotate.blocker == false) {
        rotate.blocker = true;
        rotate.doit(this, 1);        
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
    let player = draw_table.table[combination[0]];
    combination.forEach(element => {    // make the bars darker
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

let draw_table = {
    
    table: [null, null, null, null, null, null, null, null, null],

    draw: function () {
        
        makeit("div", "canvas", "canvas");

        for (let index = 0; index < 9; index ++) {

            makeit("div", index, "wrapper", "canvas");
            makeit("div", "c" + index, "card", index);
            makeit("div", "f" + index, "front", "c" + index);
            makeit("div", "b" + index, "back", "c" + index);            
            document.getElementById(index).onclick = mouseclick;
        }    
        
    }

}

let rotate = {
    
    blocker: false,

    doit: function (target, player) {

        let a = parseInt(target.id);

        if (player == 1) {
            
            draw_table.table[a] = 1; // Players turn
            target.querySelector(".back").style.backgroundImage="url('svg/cros.svg')";
            target.querySelector(".front").style.transform = "rotateY(180deg)";
            target.querySelector(".back").style.transform = "rotateY(360deg)";

        } else {
            
            draw_table.table[a] = 2; // cpu turn
            target.querySelector(".back").style.backgroundImage="url('svg/circle.svg')";
            target.querySelector(".front").style.transform = "rotateY(180deg)";
            target.querySelector(".back").style.transform = "rotateY(360deg)";
            
        }

        isitwin(draw_table.table, player);
        
    }

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
        cputurn(draw_table.table);
    } 
        
}
