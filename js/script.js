/*if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
        .then(()=>console.log('registered SW'))
        .catch(()=>console.log('didn\'t register SW'))
}*/

const digitsEl = document.getElementById('digits')
const boardEl = document.getElementById('board')
const checkBtn = document.getElementById('check')

var currNum = null
var currTile = null
var markMode = false

newGame()

function newGame() {
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
                    if(currNum && !cell.classList.contains('init')) {
                        //if number is on cell
                        if(cell.classList.contains(`n${currNum}`)) {
                            //remove text and class
                            cell.innerText = cell.innerText.replace(`${currNum}`,'')
                            cell.classList.remove(`n${currNum}`)
                            cell.classList.remove('highlight')
                            board[y][x] = board[y][x].filter(num=>{return num!=currNum})
                        }
                        else {
                            //update cell text
                            //remove previous number
                            if(markMode) {
                                cell.innerText += ` ${currNum} `
                                cell.classList.add(`n${currNum}`)
                                board[y][x].push(currNum)
                            }
                            else {
                                cell.classList.remove(`n${board[y][x]}`)
                                board[y][x] = [currNum]
                                cell.innerText = `${currNum}`
                            }
                            cell.classList.add('highlight')
                            cell.classList.add(`n${currNum}`)
                        }
                        if(board[y][x].length>1) cell.classList.add('mark')
                        else cell.classList.remove('mark')

                        let nCount = 0
                        board.forEach(row=>{
                            row.forEach(num=>{
                                if(num==currNum) nCount++
                            })
                        })
                        let digit = document.querySelector(`.d${currNum}`)
                        digit.innerHTML = `${currNum}<br>${9-nCount > 0 ? `(${9-nCount})` : ''}`
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