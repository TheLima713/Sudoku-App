if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
        .then(()=>console.log('registered SW'))
        .catch(()=>console.log('didn\'t register SW'))
}

const digitsEl = document.getElementById('digits')
const boardEl = document.getElementById('board')

const playBtn = document.getElementById('play')
const timerEl = document.getElementById('timer')
const checkBtn = document.getElementById('check')

var digitCount = [-1,0,0,0,0,0,0,0,0,0]
var currNum = null
var currTile = null
var markMode = false
var time = 0

newGame()
updateTime()
setInterval(()=>{
    if(document.hasFocus()) updateTime()
},1000)


function updateTime(){
    time++

    const mins = Math.floor(time/60)
    const secs = Math.floor(time)%60
    
    timerEl.innerText = `${format(mins)}:${format(secs)}`
}

function format(time){
    return time < 10 ? (`0${time}`) : time
}

function newGame() {
    digitCount = [-1,0,0,0,0,0,0,0,0,0]
    let board = []
    for (let y = 0; y < 9; y++) {
        board[y] = []
        for (let x = 0; x < 9; x++) {
            board[y][x] = []
        }
    }
    randPlace(board,15,5)
    solve(board)
    randHide(board,45,10)

    playBtn.addEventListener('click',()=>{
        time = 0
        updateTime()
        newGame()
    })
    
    checkBtn.addEventListener('click',()=>{
        if(checkBoard(board)) {
            checkBtn.style.color = '#22dd00'
            checkBtn.style.backgroundColor = 'var(--main1)'
            checkBtn.style.borderColor = '#22dd00'
        }
        else {
            checkBtn.style.color = '#dd2200'
            checkBtn.style.backgroundColor = 'var(--main1)'
            checkBtn.style.borderColor = '#dd2200'
        }
        setTimeout(()=>{
            checkBtn.style.color = 'var(--main6)'
            checkBtn.style.backgroundColor = 'var(--main1)'
            checkBtn.style.borderColor = 'var(--main6)'
        },1000)
    })

    startTime = new Date()

    digitsEl.innerHTML = ''
    for (let i = 1; i <= 9; i++) {
        let digit = document.createElement('div')
        digit.classList.add('digit')
        digit.classList.add(`d${i}`)
        board.forEach(row=>{
            row.forEach(num=>{
                if(num==i) digitCount[i]++
            })
        })

        digit.id = i
        digit.innerHTML = `${i}<br>(${9-digitCount[i]})`

        digit.addEventListener('click',()=>{
            //deselect prev digit and select curr one
            let nums = digitsEl.querySelectorAll('.digit')

            if(digit.classList.contains('selected')) {
                nums.forEach(num=>num.classList.remove('selected'))
                //update number
                currNum = null
            }
            else {
                nums.forEach(num=>num.classList.remove('selected'))
                digit.classList.add('selected')
                //update number
                currNum = i
            }
            
            //if number clicked is not same as previous


            //highlight currently selected number cells
            let cells = document.querySelectorAll('.cell')
            cells.forEach(cell=>{
                if(cell.classList.contains(`n${currNum}`)) {
                    cell.classList.add('highlight')
                }
                else cell.classList.remove('highlight')
            })
        })
        digitsEl.appendChild(digit)
    }
    //notedown mark button
    let markBtn = document.createElement('button')
    markBtn.classList.add('edit-btn')
    markBtn.addEventListener('click',()=>{
        markBtn.classList.toggle('on')
        markMode = !markMode
        if(!markMode) {
            markBtn.style.backgroundColor = 'transparent';
            markBtn.style.color = 'var(--neutral5)';
            markBtn.style.border = '2px solid var(--main3)';
        }
        else {
            markBtn.style.backgroundColor = 'var(--main6)';
            markBtn.style.color = 'var(--main1)';
            markBtn.style.border = '2px solid var(--main6)';
        }
    })
    markBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    digitsEl.appendChild(markBtn)

    //for each box
    boardEl.innerHTML = ''
    for (let b = 0; b < 9; b++) {
        let box = document.createElement('div')
        box.id = `b${b}`
        box.classList.add('box')
        let boxWrap = document.createElement('div')
        boxWrap.classList.add('box-wrap')

        //do its cells
        for (let y = 3*Math.floor(b/3); y < 3*Math.floor(b/3)+3; y++) {
            for (let x = 3*(b%3); x < 3*(b%3)+3; x++) {
                let cellWrap = document.createElement('div')
                cellWrap.classList.add('cell-wrap')
                let cell = document.createElement('div')
                cell.classList.add('cell')
                cell.classList.add(`${x}-${y}`)

                if(board[y][x][0]==0) {
                    cell.classList.add('placed')
                    board[y][x] = []
                }
                else {
                    cell.innerText = board[y][x][0]
                    cell.classList.add('init')
                    cell.classList.add(`n${board[y][x]}`)
                }
                cell.addEventListener('click',()=>{
                    if(currNum==null) return
                    let arr = board[y][x]
                    let num = currNum
                    let mark = markMode
                    let type = 'num'
                    if(cell.classList.contains('init')) type = 'init'
                    if(cell.classList.contains('mark')) type = 'mark'
                    if(type=='init') return
                    board[y][x] = updateCell(cell,num,mark,arr,type)
                })
                cellWrap.appendChild(cell)
                boxWrap.appendChild(cellWrap)
            }      
        }
        box.appendChild(boxWrap)
        boardEl.appendChild(box)
    }
}

/*
    () num, []mark, {}fixed
    if num on fixed, keep fixed
    (1)->{2} = {2}
    if num on empty, set to num
    (1)->() = (1)
    1++
    if num on num, remove num
    (1)->(1) = ()
    1--
    if num1 on num2, set to num1
    (1)->(2) = (1)
    2--
    1++
    if mark on empty, add mark
    [1]->() = [1]
    if mark on mark, remove mark
    [1]->[1,2] = [2]
    if mark1 on mark2, add mark1
    [1]->[2] = [1,2]
    if mark on num, set to mark
    [1]->(1) = [1]
    1--
    if num on mark, set to num
    (1)->[1] = (1)
    1++
    
    if mark empty, is num
    [] = ()
*/
function updateCell(cell,num,mark,arr,type) {
    if(mark) {
        if(arr.length==1&&type=='num') digitCount[arr[0]]--
        cell.classList.add('mark')
        let foundNum = arr.find(item=>item==num)
        if(foundNum) {
            //if marking and board isnt num
            if(type!='num') {
                arr = arr.filter(item=>item!=foundNum)
                cell.classList.remove('n'+num)
                cell.classList.remove('highlight')
            }
        }
        else {
            arr.push(num)
            cell.classList.add('n'+num)
            cell.classList.add('highlight')
        }
        if(arr.length==0) cell.classList.remove('mark')
    }
    else {
        
        let foundNum = arr.find(item=>item==num)
        if(foundNum) {
            [1,2,3,4,5,6,7,8,9].forEach(n=>{
                cell.classList.remove('n'+n)
            })
            //
            if(type=='num') {
                digitCount[arr[0]]--
                arr = []
                cell.classList.remove('highlight')
            }
            else {
                digitCount[arr[0]]++
                arr = [num]
                cell.classList.add('n'+num)
            }
        }
        else {
            if(type=='num') digitCount[arr[0]]--
            digitCount[num]++
            [1,2,3,4,5,6,7,8,9].forEach(n=>{
                cell.classList.remove('n'+n)
            })
            arr = [num]
            cell.classList.add('n'+num)
            cell.classList.add('highlight')
        }
        cell.classList.remove('mark')
    }
    cell.innerText = `${arr}`.replaceAll(',',' ')

    let d =1
    let digits = digitsEl.querySelectorAll('.digit')
    digits.forEach(digit=>{
        digit.innerHTML = `${d}<br>${9-digitCount[d]>0 ? `(${9-digitCount[d]})`: ''}`
        d++
    })

    return arr
}

function inRow(board, row, num) {
    let count = 0
    board[row].forEach(n=>{
        if(n==num) count++
    })
    return count
}

function inCol(board, col, num) {
    let count = 0
    for (let y = 0; y < 9; y++) {
        if(board[y][col][0]==num) count++
    }
    return count
}

function inBox(board, row, col, num) {
    row -= row % 3
    col -= col % 3
    let count = 0
    for (let y = row; y < row + 3; y++) {
        for (let x = col; x < col + 3; x++) {
            if(board[y][x][0]==num) count++
        }
    }
    return count
}

function canPlace(board, col, row, num, check) {
    if(check) {
        return (
            inRow(board, row,num)==1
            && inCol(board, col,num)==1 
            && inBox(board, row,col,num)==1
        )
    }
    else {
        return (
            inRow(board, row,num)<1
            && inCol(board, col,num)<1 
            && inBox(board, row,col,num)<1
        )
    }
}

function solve(board) {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if(board[y][x]==0) {
                for (let n = 1; n <= 9; n++) {
                    if(canPlace(board, x, y, n)) {
                        //try to solve the board with this guess
                        board[y][x] = [n]
                        //the guess worked, return success
                        if(solve(board)) return true
                        //the guess didn't work, clean it
                        else {
                            board[y][x] = [0]
                        }
                    }
                }
                //something went wrong before me, can't place anything!
                return false
            }
        }
    }
    return true
}

function randPlace(board, repeat, tries) {
    if(tries<1) return
    for (let r = 0; r < repeat; r++) {
        let randX = Math.floor(9 * Math.random())
        let randY = Math.floor(9 * Math.random())
        let randN = Math.floor(1+9 * Math.random())
        if(!canPlace(board,randX,randY,randN) || board[randY][randX]!=0) {
            randPlace(board, 1, tries-1)
        }
        else {
            board[randY][randX] = [randN]
        }
    }
}

function randHide(board,repeat, tries) {
    if(tries<1) return
    for (let r = 0; r < repeat; r++) {
        let randX = Math.floor(9 * Math.random())
        let randY = Math.floor(9 * Math.random())
        if(board[randY][randX] != 0) {
            board[randY][randX][0] = 0
        }
        else {
            randHide(board,1, tries-1)
        }
        
    }
}

function checkBoard(board) {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if(board[y][x].length>1) return false
            if(board[y][x][0]==0) return false
            if(!canPlace(board,x,y,board[y][x][0],true)) return false
        }
    }
    return true
}
