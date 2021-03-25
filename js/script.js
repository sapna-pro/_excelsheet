// decalaring rows and colums
let isMouseDown, isHighlighted;
const row =10,col = 7;

//function that load table on page load

window.onload = function (event) {
    LoadTable(event);
};

//on load funcation
let LoadTable = (event) =>{
    let tablearea = document.getElementById('table');
    //create table
    let table = document.createElement('table');
    //assign id to table
    table.setAttribute("id","tableId");
    
    
    let tbody = document.createElement('tbody');
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for(let i=0;i<=row;i++){
        
        // create row
        let tr = document.createElement('tr');
        tr.setAttribute("id","tr_"+i);

        //for columns

        if(i>0){
            for(let j =0;j<=col;j++){
                // create colums
                let td = document.createElement('td');
                //FocusEvent(td);
                eventHandlerTD(td);
                

                if(j>0){
                    //make cell as input field except first cell
                    let input = document.createElement("input");
                    input.setAttribute("type","text");
                    td.appendChild(input);
                    //assign id to each cell
                    td.setAttribute("id",str.charAt(j-1)+i);
                }else{
                    // column for number
                    let x = document.createTextNode(i);
                    td.appendChild(x);
                }
                tr.appendChild(td);
            }
        }else{

            for(let j=0;j<=col;j++){

                let th = document.createElement('th');
                if(j>0){
                    // alphabet as name of columns
                    let x = document.createTextNode(str.charAt(j-1));
                    th.appendChild(x);
                }else{
                    // First column of first row is made empty
                    let x = document.createTextNode("Table");
                    th.appendChild(x);
                }
                tr.appendChild(th);
            }
        }
        tbody.appendChild(tr);
        table.appendChild(tbody);
    }
    tablearea.appendChild(table);
}

// define all buttons
let addRow = document.getElementById("addRow");
let addCol = document.getElementById("addCol");
let delRow = document.getElementById("delRow");
let delCol = document.getElementById("delCol");
let upload = document.getElementById("upload");
let export_csv = document.getElementById("exportTableToCSV");



// all functions to each button
addRow.addEventListener('click',insertRow);
addCol.addEventListener('click',insertcol);
delRow.addEventListener('click',deleteRow);
delCol.addEventListener('click',deleteCol);
upload.addEventListener('click',Upload);
export_csv.addEventListener('click',exportTableToCSV);

// function to insert Row
document.onmouseup = mouseupHandler();
function mouseupHandler(){
    isMouseDown = false;
}

// var FocusEvent = (td) => {
//     td.addEventListener('focus',function(event){
//         let operation,dataId;
//         console.log("inside focus event");
//         if(event.isTrusted){
//             td.dataset.formula = td.querySelector('input').value;
            
//             td.classList.remove('highlight');
//             td.classList.add('formula');
//             console.log("inside if");
//             //td.querySelector('input').value = 
//             //document.getElementById(data.id).querySelector('input').value = data.sum;

//             let formulacells = Array.from(document.getElementsByClassName("formula"));
//             formulacells.forEach(formula =>{
//                  dataId = formula.id;
//                 let dataFormula = formula.dataset.formula;
//                 let regExp = /\(([^)]+)\)/;
//                 let matches = regExp.exec(dataFormula);
//                 if(!matches){
//                     operation = dataFormula;
//                     console.log(operation+"operation");
//                 }
//             });
//         }
//         document.getElementById(dataId).querySelector('input').value = operation;
//         console.log("value assign");
//     },true);
// }

var eventHandlerTD = (td) => {

    // to select cell double click
    td.addEventListener('dblclick',function(event){
        if(event.isTrusted){
            td.classList.toggle("highlight");
        }
    });
// check for Arithmatic operation on change of event

Rx.Observable.fromEvent(td,'change').subscribe(function(event){
    if(event.isTrusted){
        // find operation
        let validoperator = td.querySelector('input').value.toLowerCase().indexOf("=sum")==0 ||
                            td.querySelector('input').value.toLowerCase().indexOf("=diff")==0 ||
                            td.querySelector('input').value.toLowerCase().indexOf("=mul")==0 ||
                            td.querySelector('input').value.toLowerCase().indexOf("=div")==0;

        if(validoperator){
            // set formula as data attribute
            td.dataset.formula = td.querySelector('input').value;
            td.classList.remove('selected');
            td.classList.remove('highlight');
            td.classList.add('formula');

            let formulacells = Array.from(document.getElementsByClassName("formula"));
            formulacells.forEach(formula =>{
                let dataId = formula.id;
                // console.log(dataId+"dataId");
                // gets the formula
                let dataFormula = formula.dataset.formula;
                // console.log(dataFormula+"dataFormula")
                let regExp = /\(([^)]+)\)/;
                let matches = regExp.exec(dataFormula);
                if(matches){
                    // add range in array
                    let array = matches[1].toUpperCase().split(':');
                    // console.log(array[0]+"000000000000000000");
                    // console.log(array[1]+"11111111111111111111")
                    if(array.length == 2){
                        let f = dataFormula.toLowerCase();
                        if(f.indexOf("=sum") == 0){
                            sumSubs.next({id: dataId, x: array[0], y: array[1]});
                        }else if(f.indexOf("=diff") == 0){
                            diffSubs.next({id: dataId, x: array[0], y: array[1]});
                        }else if(f.indexOf("=mul") == 0){
                            mulSubs.next({id: dataId, x: array[0], y: array[1]});
                        }else if(f.indexOf("=div") == 0){
                            divSubs.next({id: dataId, x: array[0], y: array[1]});
                        }
                    }
                }
            });
        }else{
            td.dataset.formula = td.querySelector('input').value;
            var xyz = td.querySelector('input').value;
            td.classList.add('formula');
            let formulacells = Array.from(document.getElementsByClassName("formula"));
            formulacells.forEach(formula =>{
            let dataId = formula.id;
            //console.log(dataId+"dataId");
            let dataFormula = formula.dataset.formula;
            //console.log(dataFormula+"dataformula");
            let array = [];
            if(xyz.includes('+')){
                 array = dataFormula.toUpperCase().split('+');
            }else if(xyz.includes('-')){
                 array = dataFormula.toUpperCase().split('-');
            }else if(xyz.includes('*')){
                 array = dataFormula.toUpperCase().split('*');
            }else if(xyz.includes('/')){
                 array = dataFormula.toUpperCase().split('/');
            }
            //let array = dataFormula.toUpperCase().split('+');
            //console.log(array[0]+"array0");
            //console.log(array[1]+"array1");

            if(array.length == 2){
                array[0] = array[0].substr(1);
                //console.log(array[0]+"after remove");
                if(xyz.includes('+')){
                    sumSubs.next({id: dataId, x: array[0], y: array[1]});
                }else if(xyz.includes('-')){
                    diffSubs.next({id: dataId, x: array[0], y: array[1]});
                }else if(xyz.includes('*')){
                    mulSubs.next({id: dataId, x: array[0], y: array[1]});
                }else if(xyz.includes('/')){
                    divSubs.next({id: dataId, x: array[0], y: array[1]});
                }
            }
            
            });

            // if(xyz.includes('+')){
            //     console.log("here");
            //     let formulacells = Array.from(document.getElementsByClassName("formula"));
                
            //     sumSubs.next({id: dataId, x: array[0], y: array[1]});
                
            // }else if(xyz.includes('-')){
            //     diffSubs.next({id: dataId, x: array[0], y: array[1]});
            // }else if(xyz.includes('*')){
            //     mulSubs.next({id: dataId, x: array[0], y: array[1]});
            // }else if(xyz.includes('/')){
            //     divSubs.next({id: dataId, x: array[0], y: array[1]});
            // }else{

            // }

        }
    }
});

}

// sum calulation subscription

var sumSubs = new Rx.Subject(); // subject is already observable
sumSubs.map(d =>{
    let{id,x,y} = d;
    let sum =0;
    console.log(x+"xxxxxxxxx");
    console.log(y+"yyyyyyy");
    if(x && y){
        let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let firstNumber;
        let lastNumber;
        // row id of first parameter
        let fnumber = document.getElementById(x).parentNode.id.split('_');
        // row id of second parameter
         let lnumber = document.getElementById(y).parentNode.id.split('_');
         // First letter of the first parameter of the range
        let firstLetter = document.getElementById(x).id;
        // First letter of the second parameter of the range
        let lastLetter = document.getElementById(y).id;
        let tablearea = document.getElementById('tableId');
        let rowNumber1,rowNumber2;
        let regex = /[+-]?\d+(?:\.\d+)?/g;
        let match1 = regex.exec(firstLetter);
        // starting range while calculating for numbers
        rowNumber1 = match1[0];
        regex.lastIndex = 0;
        let match2 = regex.exec(lastLetter);
        // ending range while calculating for column
        rowNumber2 = match2[0];
        // when operation is for rows
        if(fnumber[1] == lnumber[1]){
            let cellsarea = tablearea.rows[fnumber[1]].cells;
            for(let i=0;i<str.length;i++){
                // Get number equivalent of the letter which is the name of the column
                if(str[i] == firstLetter[0]){
                    firstNumber = i+1;
                }
                if(str[i] == lastLetter[0]){
                    lastNumber = i+1;
                }
            }
            // to calculate sum
            sum = 0;
            for(let i=firstNumber;i<=lastNumber;i++){
                let val1 = cellsarea[i].querySelector('input').value;
                // Only accept positive, negative and float numbers, else the value will be made 0
                if (val1 == "" || !val1.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                    val1 = 0;
                    document.getElementById("result").style.display = "block";
                    document.getElementById("result").style.color = "red";
                    document.getElementById("result").innerHTML= "Add correct value in cell";
                    console.log("inside result block");
                    setTimeout(function () {
                    document.getElementById("result").style.display="none";
                    },3000);
                }
                sum += parseFloat(val1);
            }
            // if operation is for columns
        }else if(firstLetter[0] == lastLetter[0]){
            let colNumber;
            for (let i = 0; i < str.length; i++) {
                // Get number value as the position of the letter in the column
                if (str[i] == firstLetter[0]) {
                    colNumber = i + 1;
                }
            }
            // to calculate sum
            sum =0;
            for (let j = parseInt(rowNumber1); j <= parseInt(rowNumber2); j++) {
                if (colNumber > 0) {
                    let val2 = tablearea.rows[j].querySelectorAll('td')[colNumber].querySelector('input').value;
                    // Only accept positive, negative and float numbers, else the value will be made 0
                    if (val2 == "" || !val2.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                        val2 = 0;
                        document.getElementById("result").style.display = "block";
                        document.getElementById("result").style.color = "red";
                        document.getElementById("result").innerHTML= "Add correct value in cell";
                        console.log("inside result block");
                        setTimeout(function () {
                        document.getElementById("result").style.display="none";
                        },3000);
                    }
                    sum += parseFloat(val2);
                }
            }
        }
        return {id: id, sum: sum};

    }

}).subscribe(data =>{
    document.getElementById(data.id).querySelector('input').value = data.sum;
});

// Difference Calculation Subscription
var diffSubs = new Rx.Subject();
diffSubs.map(d => {
	let {id, x, y} = d;
	let diff = 0;
	if (x && y) {
        let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let firstNumber;
        let lastNumber;
        // Row id of first parameter in the range
        let fnumber = document.getElementById(x).parentNode.id.split("_");
        // Row id of second parameter in the range
        let lnumber = document.getElementById(y).parentNode.id.split("_");
        // First letter of the first parameter of the range
        let firstLetter = document.getElementById(x).id;
        // First letter of the second parameter of the range
        let lastLetter = document.getElementById(y).id;
        let tablearea = document.getElementById('tableId');
        let rowNumber1, rowNumber2;
        let regex = /[+-]?\d+(?:\.\d+)?/g;
        let match1 = regex.exec(firstLetter);
        // Starting range while calculating for columns
        rowNumber1 = match1[0];
        regex.lastIndex = 0;
        let match2 = regex.exec(lastLetter);
        // Ending range while calculating for columns
        rowNumber2 = match2[0];
        // Check when the operation is for rows
        if (fnumber[1] == lnumber[1]) {
            let cellsarea = tablearea.rows[fnumber[1]].cells;
            for (let i = 0; i < str.length; i++) {
                // Get number equivalent of the letter which is the name of the column
                if (str[i] == firstLetter[0]) {
                    firstNumber = i + 1;
                }
                if (str[i] == lastLetter[0]) {
                    lastNumber = i + 1;
                }
            }
            // To calculate difference
            let value_1 = 0;
            for (let i = firstNumber; i <= lastNumber; i++) {
                let cellsVal1 = cellsarea[firstNumber].querySelector('input').value;
                // Only accept positive, negative and float numbers, else the value will be made 0
                if (cellsVal1 == "" || !cellsVal1.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                    cellsVal1 = 0;
                    document.getElementById("result").style.display = "block";
                    document.getElementById("result").style.color = "red";
                    document.getElementById("result").innerHTML= "Add correct value in cell";
                    console.log("inside result block");
                    setTimeout(function () {
                    document.getElementById("result").style.display="none";
                    },3000);
                }
                value_1 = parseFloat(cellsVal1);
                let val1 = cellsarea[i].querySelector('input').value;
                if (i > firstNumber) {
                    // Only accept positive, negative and float numbers, else the value will be made 0
                    if (val1 == "" || !val1.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                        val1 = 0;
                        document.getElementById("result").style.display = "block";
                        document.getElementById("result").style.color = "red";
                        document.getElementById("result").innerHTML= "Add correct value in cell";
                        console.log("inside result block");
                        setTimeout(function () {
                        document.getElementById("result").style.display="none";
                        },3000);
                    }
                    diff -= parseFloat(val1);
                    value_1 = diff;
                }
                diff = value_1;
            }
            document.getElementById(id).querySelector('input').value = diff;
        // Check when the operation is for columns
        } else if (firstLetter[0] == lastLetter[0]) {
            let colNumber;
            for (let i = 0; i < str.length; i++) {
                // Get number value as the position of the letter in the column
                if (str[i] == firstLetter[0]) {
                    colNumber = i + 1;
                }
            }
            //To calculate difference
            let value_1 = 0;
            for (let j = parseInt(rowNumber1); j <= parseInt(rowNumber2); j++) {
                if (colNumber > 0) {
                    let cellsVal2 = tablearea.rows[parseInt(rowNumber1)].querySelectorAll('td')[colNumber].querySelector('input').value;
                    // Only accept positive, negative and float numbers, else the value will be made 0
                    if (cellsVal2 == "" || !cellsVal2.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                        cellsVal2 = 0;
                        document.getElementById("result").style.display = "block";
                        document.getElementById("result").style.color = "red";
                        document.getElementById("result").innerHTML= "Add correct value in cell";
                        console.log("inside result block");
                        setTimeout(function () {
                        document.getElementById("result").style.display="none";
                        },3000);
                    }
                    value_1 = parseFloat(cellsVal2);
                    let val2 = tablearea.rows[j].querySelectorAll('td')[colNumber].querySelector('input').value;
                    if (j > parseInt(rowNumber1)) {
                        // Only accept positive, negative and float numbers, else the value will be made 0
                        if (val2 == "" || !val2.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                            val2 = 0;
                            document.getElementById("result").style.display = "block";
                            document.getElementById("result").style.color = "red";
                            document.getElementById("result").innerHTML= "Add correct value in cell";
                            console.log("inside result block");
                            setTimeout(function () {
                            document.getElementById("result").style.display="none";
                            },3000);

                        }
                        diff -= parseFloat(val2);
                        value_1 = diff;
                    }
                    diff = value_1;
                }
            }
        }
		return {id: id, diff: diff};
    }
})
.subscribe(data => {
	document.getElementById(data.id).querySelector('input').value = data.diff;
});

// Muliplication Calculation Subscription
var mulSubs = new Rx.Subject();
mulSubs.map(d => {
	let {id, x, y} = d;
	let total = 0;
	if (x && y) {
        let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let firstNumber;
        let lastNumber;
        // Row id of first parameter in the range
        let fnumber = document.getElementById(x).parentNode.id.split("_");
        // Row id of second parameter in the range
        let lnumber = document.getElementById(y).parentNode.id.split("_");
        // First letter of the first parameter of the range
        let firstLetter = document.getElementById(x).id;
        // First letter of the second parameter of the range
        let lastLetter = document.getElementById(y).id;
        let tablearea = document.getElementById('tableId');
        let rowNumber1, rowNumber2;
        let regex = /[+-]?\d+(?:\.\d+)?/g;
        let match1 = regex.exec(firstLetter);
        // Starting range while calculating for columns
        rowNumber1 = match1[0];
        regex.lastIndex = 0;
        let match2 = regex.exec(lastLetter);
        // Ending range while calculating for columns
        rowNumber2 = match2[0];
        // Check when the operation is for rows
        if (fnumber[1] == lnumber[1]) {
            let cellsarea = tablearea.rows[fnumber[1]].cells;
            for (let i = 0; i < str.length; i++) {
                // Get number equivalent of the letter which is the name of the column
                if (str[i] == firstLetter[0]) {
                    firstNumber = i + 1;
                }
                if (str[i] == lastLetter[0]) {
                    lastNumber = i + 1;
                }
            }
            //  To calculate multiplication
            let value_1 = 0;
            for (let i = firstNumber; i <= lastNumber; i++) {
                let cellsVal1 = cellsarea[firstNumber].querySelector('input').value;
                // Only accept positive, negative and float numbers, else the value will be made 0
                if (cellsVal1 == "" || !cellsVal1.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                    cellsVal1 = 0;
                    document.getElementById("result").style.display = "block";
                    document.getElementById("result").style.color = "red";
                    document.getElementById("result").innerHTML= "Add correct value in cell";
                    console.log("inside result block");
                    setTimeout(function () {
                    document.getElementById("result").style.display="none";
                    },3000);
                }
                value_1 = parseFloat(cellsVal1);
                if (i > firstNumber) {
                    let val1 = cellsarea[i].querySelector('input').value;
                    // Only accept positive, negative and float numbers, else the value will be made 0
                    if (val1 == "" || !val1.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                        val1 = 0;
                        document.getElementById("result").style.display = "block";
                        document.getElementById("result").style.color = "red";
                        document.getElementById("result").innerHTML= "Add correct value in cell";
                        console.log("inside result block");
                        setTimeout(function () {
                        document.getElementById("result").style.display="none";
                        },3000);
                    }
                    total *= parseFloat(val1);
                    value_1 = total;
                }
                total = value_1;
            }
        // Check when the operation is for columns
        } else if (firstLetter[0] == lastLetter[0]) {
            let colNumber;
            for (let i = 0; i < str.length; i++) {
                // Get number value as the position of the letter in the column
                if (str[i] == firstLetter[0]) {
                    colNumber = i + 1;
                }
            }
            //  To calculate multiplication
            let value_1 = 0;
            for (let j = parseInt(rowNumber1); j <= parseInt(rowNumber2); j++) {
                let cellsVal2 = tablearea.rows[parseInt(rowNumber1)].querySelectorAll('td')[colNumber].querySelector('input').value;
                // Only accept positive, negative and float numbers, else the value will be made 0
                if (cellsVal2 == "" || !cellsVal2.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                    cellsVal2 = 0;
                    document.getElementById("result").style.display = "block";
                    document.getElementById("result").style.color = "red";
                    document.getElementById("result").innerHTML= "Add correct value in cell";
                    console.log("inside result block");
                    setTimeout(function () {
                    document.getElementById("result").style.display="none";
                    },3000);
                }
                if (colNumber > 0) {
                    value_1 = parseFloat(cellsVal2);
                    let val2 = tablearea.rows[j].querySelectorAll('td')[colNumber].querySelector('input').value;
                    // Only accept positive, negative and float numbers, else the value will be made 0
                    if (val2 == "" || !val2.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                        val2 = 0;
                        document.getElementById("result").style.display = "block";
                        document.getElementById("result").style.color = "red";
                        document.getElementById("result").innerHTML= "Add correct value in cell";
                        console.log("inside result block");
                        setTimeout(function () {
                        document.getElementById("result").style.display="none";
                        },3000);
                    }
                    if (j > parseInt(rowNumber1)) {

                        total *= parseFloat(val2);
                        value_1 = total;
                    }
                    total = value_1;
                }
            }
        }
		return {id: id, mul: total}
    }
})
.subscribe(data => {
	document.getElementById(data.id).querySelector('input').value = data.mul;
});

// Division Calculation Subscription
var divSubs = new Rx.Subject();
divSubs.map(d => {
	let {id, x, y} = d;
	let total = 0;
	if (x && y) {
        let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let firstNumber;
        let lastNumber;
        // Row id of first parameter in the range
        let fnumber = document.getElementById(x).parentNode.id.split("_");
        // Row id of second parameter in the range
        let lnumber = document.getElementById(y).parentNode.id.split("_");
        // First letter of the first parameter of the range
        let firstLetter = document.getElementById(x).id;
        // First letter of the second parameter of the range
        let lastLetter = document.getElementById(y).id;
        let tablearea = document.getElementById('tableId');
        let rowNumber1, rowNumber2;
        let regex = /[+-]?\d+(?:\.\d+)?/g;
        let match1 = regex.exec(firstLetter);
        // Starting range while calculating for columns
        rowNumber1 = match1[0];
        regex.lastIndex = 0;
        let match2 = regex.exec(lastLetter);
        // Ending range while calculating for columns
        rowNumber2 = match2[0];
        // Check when the operation is for rows
        if (fnumber[1] == lnumber[1]) {
            let cellsarea = tablearea.rows[fnumber[1]].cells;
            for (let i = 0; i < str.length; i++) {
                // Get number equivalent of the letter which is the name of the column
                if (str[i] == firstLetter[0]) {
                    firstNumber = i + 1;
                }
                if (str[i] == lastLetter[0]) {
                    lastNumber = i + 1;
                }
            }
            //  To calculate division
            let value_1 = 0;

            for (let i = firstNumber; i <= lastNumber; i++) {
                let cellsVal1 = cellsarea[firstNumber].querySelector('input').value;
                // Only accept positive, negative and float numbers, else the value will be made 0
                if (cellsVal1 == "" || !cellsVal1.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                    cellsVal1 = 0;
                }
                value_1 = parseFloat(cellsVal1);
                if (i > firstNumber) {
                    let val1 = cellsarea[i].querySelector('input').value;
                    // Only accept positive, negative and float numbers, else the value will be made 0
                    if (val1 == "" || !val1.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                        val1 = 0;
                    }
                    total /= parseFloat(val1);
                    value_1 = total;
                }
                total = value_1;
                if(isNaN(total)) {
                    total = 0;
                }
            }
        // Check when the operation is for columns
        } else if (firstLetter[0] == lastLetter[0]) {
            let colNumber;
            for (let i = 0; i < str.length; i++) {
                // Get number value as the position of the letter in the column
                if (str[i] == firstLetter[0]) {
                    colNumber = i + 1;
                }
            }
            //  To calculate division
            let value_1 = 0;
            for (let j = parseInt(rowNumber1); j <= parseInt(rowNumber2); j++) {
                if (colNumber > 0) {
                    let cellsVal2 = tablearea.rows[parseInt(rowNumber1)].querySelectorAll('td')[colNumber].querySelector('input').value;
                    // Only accept positive, negative and float numbers, else the value will be made 0
                    if (cellsVal2 == "" || !cellsVal2.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                        cellsVal2 = 0;
                    }
                    value_1 = parseFloat(cellsVal2);
                    if (j > parseInt(rowNumber1)) {
                        let val2 = tablearea.rows[j].querySelectorAll('td')[colNumber].querySelector('input').value;
                        // Only accept positive, negative and float numbers, else the value will be made 0
                        if (val2 == "" || !val2.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
                            val2 = 0;
                        }
                        total /= parseFloat(val2);
                        value_1 = total;
                    }
                    total = value_1;
                }
                if(isNaN(total)) {
                    total = 0;
                }
            }
        }
		return {id: id, div: total};
    }
})
.subscribe(data => {
	document.getElementById(data.id).querySelector('input').value = data.div;
});


function insertRow(event){
    if(event.isTrusted){
        let table = document.getElementById('tableId');
        let count_row = table.rows.length;
        let row = table.insertRow(count_row);
        // assign id to row
        row.setAttribute("id","tr_"+count_row);
        // add cell in each newly added row
        for(let i=0;i<table.rows[0].cells.length;i++){
            create_cell(row.insertCell(i),i,count_row);
        }
    }
}

// function to create cell
function create_cell(cell,count,rowCount){
    let str="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// add input field in cell except first cell
if(count>0){
    let x = document.createElement("input");
    x.setAttribute("type","text");
    cell.appendChild(x);
    // id to each cell
    cell.setAttribute("id",str.charAt(count-1)+rowCount);
}else{
    // for the first cell of row assign number
    let x = document.createTextNode(rowCount);
    cell.appendChild(x);
}
//FocusEvent(td);
eventHandlerTD(cell);
//FocusEvent(cell);
}
//function to insert Columns

function insertcol(event){

    if(event.isTrusted){
        let tablearea = document.getElementById('table');
        let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let tr = document.getElementsByTagName('tr');
        let length = tr.length;

        // insert column in each row
        for(let i=0;i<length;i++){
            if(i>0){
                let td = tr[i].insertCell();
                //FocusEvent(td);
                eventHandlerTD(td);
                
                // add input field in cell
                let x = document.createElement('input');
                x.setAttribute("type","text");
                td.appendChild(x);
                // assign id to cell
                td.setAttribute("id",str.charAt(tr[0].cells.length - 2)+i);
            }else{
                let th = document.createElement('th');
                // first column assign by letter
                let x = document.createTextNode(str.charAt(tr[0].cells.length-1));
                th.appendChild(x);
                tr[i].appendChild(th);
            }
        }
    }

}
//function to delete Row
function deleteRow(event){
    if(event.isTrusted){
        let table = document.getElementById('tableId');
        let cell_selected = document.getElementsByClassName("highlight");

        // if row is selected
        if(cell_selected.length>0){
            let r = cell_selected[0].parentNode.id;
            // now extract the id
            let s = r.split("_");
            // convert id to integer
            let l = parseInt(s[1]);
            // now delete row
            table.deleteRow(s[1]);

            //update the text of the first cell of each row

            for(let i =l+1;i<=table.rows.length;i++){
                let rw = document.getElementById("tr_"+i);
                rw.setAttribute("id","tr_"+(i-1));
                let cells = rw.getElementsByTagName("td");
                cellls[0].innerText = i-1;

                //update the id of each cells
                for(let j=1;j<cells.length;j++){
                    let ind = cells[j].id;
                    let alpha = ind.split("");
                    let regex = /[+-]?\d+(?:\.\d+)?/g;
                    let match = regex.exec(ind);
                    let new_id = alpha[0] + (match[0] - 1);
                    cells[j].setAttribute("id", new_id);
                }

            }
        }else{
            document.getElementById("result").style.display = "block";
            document.getElementById("result").style.color = "red";
            document.getElementById("result").innerHTML= "select the cell first";
            setTimeout(function () {
                document.getElementById("result").style.display="none";
            },3000);
        }
    }
}
// function to delete Columns

function deleteCol(event){

    if(event.isTrusted){
        let table = document.getElementById('tableId');
        let cell_selected = document.getElementsByClassName("highlight");
        // check if cell is selected
        if(cell_selected.length>0){
            let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let col = cell_selected[0].id;
            let colInd = col.split("");
            let ind = str.indexOf(colInd[0]);
            let rowsDom = document.getElementsByTagName("tr");
            //delete column position from all rows

            for(let i=0;i<table.rows.length;i++){
                rowsDom[i].deleteCell(ind+1);
                if(i>0){
                    let colDom = rowsDom[i].getElementsByTagName('td');
                    // assign id to all cells
                    for(let m = ind+1;m<colDom.length;m++){
                        let indexCol = colDom[m].id;
                        let alpha = indexCol.split("");
                        let regex = /[+-]?\d+(?:\.\d+)?/g;
                        let match = regex.exec(indexCol);
                        regex.leftIndex = 0;
                        let new_id = str[m - 1] + (match[0]);
                        colDom[m].setAttribute("id", new_id);
                    }
                }
            }
            // change the header of the table

            let head = document.getElementsByTagName("th");
            for(let j=ind+1;j<=head.length;j++){
                head[j].innerText = str[j-1];
            }
            // if the cell is not selected
        }else{
            document.getElementById("result").style.display = "block";
            document.getElementById("result").style.color = "red";
            document.getElementById("result").innerHTML = "Please select the cell first";
            setTimeout(function () {
                document.getElementById("result").style.display = "none";
            }, 3000);
        }
    }
}

//Export to CSV Functions
function downloadCSV(csv, filename) {
    let csvFile;
    let downloadLink;

    // CSV file
    csvFile = new Blob([csv], {
        type: "text/csv"
    });
    if (navigator.msSaveBlob) {    
        navigator.msSaveBlob(csvFile, filename);
    } else {

        // Download link
        downloadLink = document.createElement("a");

        // File name
        downloadLink.download = filename;

        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        // Hide download link
        downloadLink.style.display = "none";

        // Add the link to DOM
        document.body.appendChild(downloadLink);

        // Click download link
        downloadLink.click();
    }
}
//Export CSV Main Function
function exportTableToCSV(event) {
    if (event.isTrusted) {
        let filename = 'spreadsheet.csv';
        let csv = [];
        let rows = document.querySelectorAll("table tr");

        for (let i = 0; i < rows.length; i++) {
            let row = [];
            if (i > 0) {
                let cols = rows[i].querySelectorAll("td");
                for (let j = 0; j <= cols.length; j++) {
                    if (j > 0) {
                        cols = rows[i].querySelectorAll("td input");
                        row.push(cols[j - 1].value);
                    } else {
                        row.push(cols[j].innerText);
                    }
                }
            } else {
                let cols = rows[i].querySelectorAll("th");
                for (let j = 0; j < cols.length; j++) {
                    row.push(cols[j].innerText);
                }
            }
            csv.push(row.join(","));
        }

        // Download CSV file
        downloadCSV(csv.join("\n"), filename);
    }
}

function Upload() {
    
        
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var table = document.createElement("table");
                var rows = e.target.result.split("\n");
                for (var i = 0; i < rows.length; i++) {
                    var cells = rows[i].split(",");
                    if (cells.length > 1) {
                        var row = table.insertRow(-1);
                        for (var j = 0; j < cells.length; j++) {
                            var cell = row.insertCell(-1);
                            cell.innerHTML = cells[j];
                        }
                    }
                }
                var dvCSV = document.getElementById("tableId");
                dvCSV.innerHTML = "";
                dvCSV.appendChild(table);
            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}







