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
    const note = document.createElement('div')
    note.classList.add('note')
    note.innerHTML = `
    <div class="tools">
        <button class="minimize"><i class="fa-solid fa-window-minimize"></i></button>
        <button class="edit"><i class="fa-solid fa-pen"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>
    <div class="main"></div>
    <textarea class="hidden"></textarea>
    `
    const minBtn = note.querySelector('.minimize')
    const editBtn = note.querySelector('.edit')
    const delBtn = note.querySelector('.delete')

    const main = note.querySelector('.main')
    const cover = note.querySelector('.show')
    const textArea= note.querySelector('textarea')
    
    textArea.value = text
    main.innerHTML = marked.parse(text)

    minBtn.addEventListener('click',()=>{
        note.classList.toggle('minimized')
        cover.classList.toggle('show')
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