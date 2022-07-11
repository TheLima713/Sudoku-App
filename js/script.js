if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
        .then(()=>console.log('registered SW'))
        .catch(()=>console.log('didn\'t register SW'))
}

const digitsEl = document.getElementById('digits')
const boardEl = document.getElementById('board')

var currNum = null
var currTile = null


let baseBoard = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
]

newGame(baseBoard)

function newGame(board) {
    randPlace(board,15,5)
    solve(board)
    randHide(board,45,5)

    digitsEl.innerHTML = ''
    for (let i = 1; i <= 9; i++) {
        let digit = document.createElement('div')
        digit.classList.add('digit')

        digit.id = i
        digit.innerText = i

        digit.addEventListener('click',()=>{
            let nums = digitsEl.querySelectorAll('.digit')
            nums.forEach(num=>num.classList.remove('selected'))
            currNum = i
            digit.classList.add('selected')
        })
        digitsEl.appendChild(digit)
    }

    boardEl.innerHTML = ''
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let cell = document.createElement('div')
            cell.classList.add('cell')

            cell.id = `${x}-${y}`
            if(board[y][x]>0) {
                cell.innerText = board[y][x]
                cell.classList.add('init')
            }
            cell.addEventListener('click',()=>{
                if(currNum && !cell.classList.contains('init')) {
                    if(currNum == cell.innerText) {
                        cell.innerText = ''
                        cell.classList.remove('placed')
                        board[x][y] = 0
                    }
                    else {
                        cell.innerText = currNum
                        cell.classList.add('placed')
                        board[x][y] = currNum
                    }
                }
            })
            
            boardEl.appendChild(cell)
        }      
    }
}

function inRow(board, row, num) {
    return board[row].some(n=>n==num)
}

function inCol(board, col, num) {
    for (let y = 0; y < 9; y++) {
        if(board[y][col]==num) return true        
    }
    return false
}

function inBox(board, row, col, num) {
    row -= row % 3
    col -= col % 3
    for (let y = row; y < row + 3; y++) {
        for (let x = col; x < col + 3; x++) {
            if(board[y][x]==num) return true
        }
    }
    return false
}

function canPlace(board, col, row, num) {
    return (!inRow(board, row,num) && !inCol(board, col,num) && !inBox(board, row,col,num))
}

function solve(board) {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if(board[y][x]==0) {
                for (let n = 1; n <= 9; n++) {
                    if(canPlace(board, x, y, n)) {
                        //try to solve the board with this guess
                        board[y][x] = n
                        //the guess worked, return success
                        if(solve(board)) return true
                        //the guess didn't work, clean it
                        else {
                            board[y][x] = 0
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
            console.log(`failed to place ${randN} at ${randX},${randY}, ${tries} tries left`)
            randPlace(board, 1, tries-1)
        }
        else {
            console.log(`placed ${randN} at ${randX},${randY}`)
            board[randY][randX] = randN
        }
    }
}

function randHide(board,repeat, tries) {
    if(tries<1) return
    for (let r = 0; r < repeat; r++) {
        let randX = Math.floor(9 * Math.random())
        let randY = Math.floor(9 * Math.random())
        if(board[randY][randX] != 0) {
            console.log(`(${repeat}) hid ${randX}, ${randY}`)
            board[randY][randX] = 0
        }
        else {
            console.log(`(${repeat}) failed to hide ${randX}, ${randY}`)
            randHide(board,1, tries-1)
        }
        
    }
}

function updateCells() {
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let cell = document.getElementById(x+'-'+y)
            cell.innerText = baseBoard[x][y] > 0 ? baseBoard[x][y] : ''
        }
    }
}