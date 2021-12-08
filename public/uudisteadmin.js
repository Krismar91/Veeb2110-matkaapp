
let uudised

async function loeUudised() {
    const vastus = await fetch('/api/uudis')
    const andmed = await vastus.json()
    console.log(andmed)
    uudised = andmed
    naitaUudisteMenyyd(andmed)
}


async function muudaUudist(uudisIndex) {
    const pealkiri = document.getElementById("uudis-pealkiri").value

    const vastus = await fetch(`api/uudis/${uudisIndex}/muuda?pealkiri=${pealkiri}`)
    const andmed = await vastus.json()
    uudised[uudisIndex] = andmed
    naitaUudisteMenyyd(uudised)
    naitaPealkiri(uudisIndex)

}


function naitaUudisteMenyyd(uudised) {
    let vastus = ''
    for (let i in uudised) {
        const uudis=uudised[i]
        vastus += `
        <button class="btn btn-link" onclick="naitaPealkiri(${i})">
            ${uudis.pealkiri}
        </button> 
        `        
    }

    const menyyElement = document.getElementById("uudised-menyy")
    menyyElement.innerHTML = `
    <div>
        ${vastus}
    </div>
    `
}

function naitaPealkiri(uudiseId) {
    const uudis = uudised[uudiseId]

    const uudiseAndmedElement = document.getElementById("uudised-andmed")
    uudiseAndmedElement.innerHTML = `
        <h2>
            Uudise pealkiri
        </h2>
        <h3>
            ${uudis.pealkiri}
        </h3>

            <input id="uudis-pealkiri" type="text" value="${uudis.pealkiri}" placeholder="Pealkiri"/>
            
            <div>
                <button class="btn btn-primary" onclick="muudaUudist(${uudiseId})">
                    Salvesta
                </button>
                <button class="btn btn-secondary" onclick="naitaPealkiri(${uudiseId})">
                    Katkesta
                </button>
            </div>
            
    `
    
}




loeUudised()