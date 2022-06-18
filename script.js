const addBtn = document.getElementById('add')
const notesEl = document.getElementById('notes-c')
const notes = JSON.parse(localStorage.getItem('notes'))
if(notes){
    notes.forEach(note=>{
        addNewNote(note)
    })
}

function addNewNote(text = ''){
    console.log(text)
    const title = text.split('\n')[0]
    const note = document.createElement('div')
    note.classList.add('note')
    note.innerHTML = `
    <div class="tools">
        <span>${title.substring(0,35) + (text.length>35?'...':'')}</span>
        <button class="show hidden"><i class="fa-solid fa-plus"></i></button>
        <button class="hide"><i class="fa-solid fa-minus"></i></button>
        <button class="edit"><i class="fa-solid fa-pen"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>
    <div class="main"></div>
    <textarea class="hidden"></textarea>
    `
    const showBtn = note.querySelector('.show')
    const hideBtn = note.querySelector('.hide')
    const editBtn = note.querySelector('.edit')
    const delBtn = note.querySelector('.delete')

    const main = note.querySelector('.main')
    const textArea= note.querySelector('textarea')
    
    textArea.value = text
    main.innerHTML = marked.parse(text)

    showBtn.addEventListener('click',()=>{
        main.classList.remove('hidden')
        note.style.width = '75%'
        note.style.height = '400px'

        hideBtn.classList.remove('hidden')
        showBtn.classList.add('hidden')
    })
    hideBtn.addEventListener('click',()=>{
        main.classList.add('hidden')
        textArea.classList.add('hidden')

        note.style.width = 'fit-content'
        note.style.height = '0px'

        showBtn.classList.remove('hidden')
        hideBtn.classList.add('hidden')
    })
    editBtn.addEventListener('click',()=>{
        main.classList.toggle('hidden')
        textArea.classList.toggle('hidden')
    })
    delBtn.addEventListener('click',()=>{
        note.remove()
        setLS()
    })
    textArea.addEventListener('input',(e)=>{
        const { value } = e.target
        main.innerHTML = marked.parse(value)

        setLS()
    })
    
    notesEl.appendChild(note)
}
addBtn.addEventListener('click',()=>{
    addNewNote()
})

function setLS(){
    const notesText = document.querySelectorAll('textarea')
    const notes = []
    notesText.forEach(note=>{
        notes.push(note.value)
    })
    localStorage.setItem('notes',JSON.stringify(notes))
}