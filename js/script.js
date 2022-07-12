/*if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
        .then(()=>console.log('registered SW'))
        .catch(()=>console.log('didn\'t register SW'))
}*/

const digitsEl = document.getElementById('digits')
const boardEl = document.getElementById('board')

var currNum = null
var currTile = null
var markMode = false

newGame()

function newGame() {
    let board = []
    for (let y = 0; y < 9; y++) {
        board[y] = []
        for (let x = 0; x < 9; x++) {
            board[y][x] = [0]
        }
    }
    randPlace(board,15,5)
    solve(board)
    randHide(board,45,10)

    digitsEl.innerHTML = ''
    for (let i = 1; i <= 9; i++) {
        let digit = document.createElement('div')
        digit.classList.add('digit')
        digit.classList.add(`d${i}`)
        let nCount = 0
        board.forEach(row=>{
            row.forEach(num=>{
                if(num==i) nCount++
            })
        })

        digit.id = i
        digit.innerHTML = `${i}<br>(${9-nCount})`

        digit.addEventListener('click',()=>{
            //deselect prev digit and select curr one
            let nums = digitsEl.querySelectorAll('.digit')
            nums.forEach(num=>num.classList.remove('selected'))
            currNum = i
            digit.classList.add('selected')

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
        console.log(markMode)
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
                cell.classList.add(`n${board[y][x]}`)
                cell.classList.add(`${x}-${y}`)

                if(!board[y][x].every(item=>item==0)) {
                    board[y][x].forEach(mark=>{
                        cell.innerText+= `${mark} `
                    })
                    cell.classList.add('init')
                }
                cell.addEventListener('click',()=>{
                    if(currNum && !cell.classList.contains('init')) {
                        if(cell.innerText.search(`${currNum}`)>=0) {
                            cell.innerText = cell.innerText.replace(`${currNum}`,'')
                            cell.classList.remove('placed')
                            cell.classList.remove(`n${currNum}`)
                            cell.classList.remove('highlight')
                            board[y][x] = [0]
                        }
                        else {
                            cell.innerText += ` ${currNum} `
                            cell.id = `n${board[y][x]} ${x}-${y}`
                            cell.classList.add('placed')
                            cell.classList.remove(`n${board[y][x]}`)
                            board[y][x] = currNum
                            cell.classList.add(`n${currNum}`)
                            cell.classList.add('highlight')
                        }
                        let nCount = 0
                        board.forEach(row=>{
                            row.forEach(num=>{
                                if(num==currNum) nCount++
                            })
                        })
                        let digit = document.querySelector(`.d${currNum}`)
                        if(digit) digit.innerHTML = `${currNum}<br>${9-nCount > 0 ? `(${9-nCount})` : ''}`
                        else console.log('didnt find')
                        try{
                          if(board[y][x].length>1) cell.classList.add('mark')
                          else cell.classList.remove('mark')
                        }
                        catch(err){cell.innerText=err}
                    }
                })
                cellWrap.appendChild(cell)
                boxWrap.appendChild(cellWrap)
            }      
        }
        box.appendChild(boxWrap)
        boardEl.appendChild(box)
    }
}

function inRow(board, row, num) {
    return board[row].some(n=>n[0]==num)
}

function inCol(board, col, num) {
    for (let y = 0; y < 9; y++) {
        if(board[y][col][0]==num) return true
    }
    return false
}

function inBox(board, row, col, num) {
    row -= row % 3
    col -= col % 3
    for (let y = row; y < row + 3; y++) {
        for (let x = col; x < col + 3; x++) {
            if(board[y][x][0]==num) return true
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
            console.log(`failed to place ${randN} at ${randX},${randY}, ${tries} tries left`)
            randPlace(board, 1, tries-1)
        }
        else {
            console.log(`placed ${randN} at ${randX},${randY}`)
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
            console.log(`(${repeat}) hid ${randX}, ${randY}`)
            board[randY][randX][0] = 0
        }
        else {
            console.log(`(${repeat}) failed to hide ${randX}, ${randY}`)
            randHide(board,1, tries-1)
        }
        
    }
}
