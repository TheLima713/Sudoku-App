const colors = ['#ddf','#f24','#f82','#fd2','#2f4','#2df','#24f','#82f','#f2d']

const notesEl = document.getElementById('notes-c')
const addBtn = document.getElementById('add')

const notes = JSON.parse(localStorage.getItem('notes'))
if(notes) notes.forEach(note=>addNote(note))
let note0 = {
    state:'active',//'archive'/'deleted',
    title: 'Title',
    text:'Text',
    color: 0,
    tags:[],
}

//disable right click
document.addEventListener('contextmenu',(e)=>{e.preventDefault()})
addBtn.addEventListener('click',()=>{
    addNote()
    putLS()
})

function addNote(note = note0){
    let text = note.text
    let tags = ''
    if(tags)note.tags.forEach(tag=>
        tags+=`
        <li>
            <p class="tag">${tag}</p>
            <button class="del-tag">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </li>
        `
    )
    let noteDiv = `
     <div class='header hidden'>
        <button>
            <i class='fa-solid fa-arrow-left'></i>
        </button>
        <button>
            <i class='fa-solid fa-palette'></i>
        </button>
        <button>
            <i class='fa-solid fa-tag'></i>
        </button>
        <button>
            <i class='fa-solid fa-box-archive'></i>
        </button>
        <button>
            <i class='fa-solid fa-trash-alt'></i>
        </button>
    </div>
    <ul class='tags hidden'>${tags}</ul>
    <div class='content'>
        <p class='p-title'>${note.title}</p><br>
        <textarea spellcheck='false' class='hidden title'>${note.title}</textarea>
        <p class='p-text'>${text}</p>
        <textarea spellcheck='false' class='hidden text'>${text}</textarea>
    </div>
   `
    let noteEl = document.createElement('div')
    noteEl.innerHTML = noteDiv
    noteEl.classList.add(note.state)
    noteEl.classList.add('note')
    noteEl.classList.add(`color-${note.color}`)

    let contentEl = noteEl.querySelector('.content')
    let titleEl = noteEl.querySelector('.title')
    let pTitleEl = noteEl.querySelector('.p-title')
    let textEl = noteEl.querySelector('.text')
    let pTextEl = noteEl.querySelector('.p-text')
    let tagsEl = noteEl.querySelector('.tags')

    noteEl.style.color = colors[note.color]

    let [backBtn, colorBtn, tagBtn, archiveBtn, delBtn] = noteEl.querySelectorAll('button')

    contentEl.addEventListener('click',()=>{
        let open = document.querySelector('.show')
        if(open) open.classList.remove('show')
        if(!noteEl.classList.contains('show')){ 
            noteEl.classList.add('show')
        }
        textEl.classList.toggle('hidden')
        pTextEl.classList.toggle('hidden')
        titleEl.classList.toggle('hidden')
        pTitleEl.classList.toggle('hidden')
    })
    titleEl.addEventListener('input',(e)=>{
        let {value}= e.target
        titleEl.innerHTML = value
        pTitleEl.innerText = value
        putLS()
    })
    textEl.addEventListener('input',(e)=>{
        let {value}= e.target
        textEl.innerHTML = value
        pTextEl.innerText = value
        putLS()
    })
    backBtn.addEventListener('click',()=>{
        noteEl.classList.remove('show')
        textEl.classList.toggle('hidden')
        pTextEl.classList.toggle('hidden')
        titleEl.classList.toggle('hidden')
        pTitleEl.classList.toggle('hidden')
        putLS()
    })
    colorBtn.addEventListener('click',()=>{
        noteEl.classList.remove(`color-${note.color}`)
        note.color = (note.color+1)%colors.length
        noteEl.style.color = colors[note.color]
        noteEl.classList.add(`color-${note.color}`)
        putLS()
    })
    colorBtn.addEventListener('contextmenu',()=>{
        noteEl.classList.remove(`color-${note.color}`)
        note.color = (colors.length+note.color-1)%colors.length
        noteEl.style.color = colors[note.color]
        noteEl.classList.add(`color-${note.color}`)
        putLS()
    })
    tagBtn.addEventListener('click',()=>{
        tagsEl.classList.toggle('hidden')
        if(tagsEl.style.height=='fit-content') tagsEl.style.height='0px'
        else tagsEl.style.height='fit-content'
        putLS()
    })
    archiveBtn.addEventListener('click',()=>{
        noteEl.classList.remove(note.state)
        noteEl.classList.add('archive')
        note.state = 'archive'
        putLS()
    })
    delBtn.addEventListener('click',()=>{
        noteEl.classList.remove(note.state)
        noteEl.classList.add('deleted')
        note.state = 'deleted'
        noteEl.remove()//add 30 day period, TODO
        putLS()
    })
    
    notesEl.appendChild(noteEl)
}
function putLS(){
    let notesLS = []
    let noteEls = document.querySelectorAll('.note')
    noteEls.forEach((noteEl)=>{
        let classes = noteEl.classList[0]

        let tagEls = noteEl.querySelectorAll('.tag')
        let tags = []
        tagEls.forEach((tag)=>{tags.push(tag.innerHTML)})
        let col = 0
        for (let i = 0; i < colors.length; i++) {
            if(noteEl.classList.contains(`color-${i}`)) {
                col = i
            }
        }

        let noteLS = {
            state:classes,
            title:noteEl.querySelector('.title').value,
            text:noteEl.querySelector('.text').value,
            color: col,
            tags:tags
        }
        notesLS.push(noteLS)
        
    })
    localStorage.setItem('notes',JSON.stringify(notesLS))
}