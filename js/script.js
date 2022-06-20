
const addBtn = document.getElementById('add')
const notesEl = document.getElementById('notes-c')
const notes = JSON.parse(localStorage.getItem('notes'))
if(notes){
    notes.forEach(note=>{
        addNewNote(note)
    })
}

function addNewNote(noteLS){
    const text = noteLS ? noteLS.text : ""
    const note = document.createElement('div')
    note.classList.add('note')
    note.innerHTML = `
    <div class="tools">
        <span class="title"></span>
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

    const title = note.querySelector('.title')
    const main = note.querySelector('.main')
    const textArea= note.querySelector('textarea')
    
    let name
    name = text.split('\n')[0]
    name = name.replace(/[^0-9a-zA-Z ,.;?!]/gi, '')
    name = name.substring(0,25)

    title.innerText = name
    main.innerHTML = marked.parse(text)
    textArea.value = text

    if(noteLS && noteLS.hide) {
        note.classList.toggle('min')

        showBtn.classList.remove('hidden')
        hideBtn.classList.add('hidden')
    }

    showBtn.addEventListener('click',()=>{
        note.classList.toggle('min')

        hideBtn.classList.remove('hidden')
        showBtn.classList.add('hidden')
    })
    hideBtn.addEventListener('click',()=>{
        note.classList.toggle('min')

        showBtn.classList.remove('hidden')
        hideBtn.classList.add('hidden')
    })
    editBtn.addEventListener('click',()=>{
        if(note.style.height!='0px'){
            main.classList.toggle('hidden')
            textArea.classList.toggle('hidden')
        }
    })
    delBtn.addEventListener('click',()=>{
        note.remove()
        setLS()
    })
    textArea.addEventListener('input',(e)=>{
        const { value } = e.target
        main.innerHTML = marked.parse(value)

        let name
        name = value.split('\n')[0]
        name = name.replace(/[^0-9a-zA-Z ,.;?!]/gi, '')
        name = name.substring(0,25)
        title.innerText = name

        setLS()
    })
    
    notesEl.appendChild(note)
}
addBtn.addEventListener('click',()=>{
    addNewNote()
})

function setLS(){
    const noteEls = document.querySelectorAll('.note')
    const notes = []
    noteEls.forEach(note=>{
        const main = note.querySelector('.main')
        const textArea= note.querySelector('textarea')
        const hidden = main.classList.contains('hidden') && textArea.classList.contains('hidden')
        notes.push({
            text: textArea.value,
            hide: hidden
        })
    })
    localStorage.setItem('notes',JSON.stringify(notes))
}