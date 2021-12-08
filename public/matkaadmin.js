
let matkad 

async function loeMatkad() {
    const vastus = await fetch('/api/matk')
    const andmed = await vastus.json()
    console.log(andmed)
    matkad = andmed
    naitaMatkadeMenyyd(andmed)
}

async function muudaMatka(matkaIndeks, kasAvatud) {
    const vastus = await fetch(`/api/matk/${matkaIndeks}/muuda?avatud=${kasAvatud}`)
    const andmed = await vastus.json()
    console.log(andmed)
    matkad[matkaIndeks] = andmed
    naitaMatkadeMenyyd(matkad)
    naitaOsalejaid(matkaIndeks)
}

async function muudaMatkaKirjeldust(matkaIndeks) {
    const nimetus = document.getElementById("matk-nimetus").value
    const piltUrl = document.getElementById("matk-pilt").value
    const kirjeldus = document.getElementById("matk-kirjeldus").value


    const vastus = await fetch(`/api/matk/${matkaIndeks}/muuda?nimetus=${nimetus}&piltUrl=${piltUrl}&kirjeldus=${kirjeldus}`)
    const andmed = await vastus.json()
    console.log(andmed)
    matkad[matkaIndeks] = andmed
    naitaMatkadeMenyyd(matkad)
    naitaOsalejaid(matkaIndeks)
}


function naitaMatkadeMenyyd(matkad) {
    let vastus = ''
    for (let i in matkad) {
        const matk=matkad[i]
        vastus += `
        <button class="btn btn-link" onclick="naitaOsalejaid(${i})">
            ${matk.nimetus}
        </button>
        `
    }

    vastus += `
        <button class="btn btn-link" onclick="naitaUudiseLisamist()">
            Lisa uudis
        </button>
        `

    vastus += `
        <button class="btn btn-link" onclick="naitaMatkaLisamist()">
            Lisa matk
        </button>
        `

    const menyyElement = document.getElementById("matkad-menyy")
    menyyElement.innerHTML = `
    <div>
        ${vastus}
    </div>
    `
}

function naitaOsalejaid(matkaId) {
    const matk = matkad[matkaId]
    let vastus = ''
    for (let i in matk.osalejad) {
        const osaleja = matk.osalejad[i]
        vastus += `
        <div class="row">
            <div class="col-6">
                ${osaleja.nimi}
            </div>
            <div class="col-6">
                ${osaleja.email}
            </div>
        </div>
        `
    }

    let registreerumine = `
        <button 
            class="btn btn-link" 
            onclick="muudaMatka(${matkaId}, 'true')"
        >
            Ava registreerumine
        </button>
    `

    if (matk.kasRegistreerumineAvatud) {
        registreerumine = `
        <button 
            class="btn btn-link" 
            onclick="muudaMatka(${matkaId}, 'false')"
        >
            Sulge registreerumine
        </button>
    `
    }

    const matkaAndmedElement = document.getElementById("matka-andmed")
    matkaAndmedElement.innerHTML = `
        <h2>
            ${matk.nimetus}
        </h2>
            ${registreerumine}

            <input id="matk-nimetus" type="text" value="${matk.nimetus}" placeholder="nimetus"/>
            <input id="matk-pilt" type="text" value="${matk.piltUrl}" placeholder="pilt"/>
            <textarea id="matk-kirjeldus">${matk.kirjeldus}</textarea>
            
            <div>
                <button class="btn btn-primary" onclick="muudaMatkaKirjeldust(${matkaId})">
                    Salvesta
                </button>
                <button class="btn btn-secondary" onclick="naitaOsalejaid(${matkaId})">
                    Katkesta
                </button>
            </div>

        <h2>
            Osalejad
        </h2>
        ${vastus}
    `
}

function naitaMatkaLisamist() {
    const uusUudisHtml = `
    <h1>Lisa matk</h1>
        <input type="text" placeholder="nimetus" id="nimetus"/><br>
        <input type="text" placeholder="pildiUrl"id="pildiUrl"/>
    <div>
        <label>kirjeldus</label><br>
        <textarea id="kirjeldus" cols="40" rows="5"></textarea>
    </div>
    <div>
        <button class="btn btn-primary" onclick="lisaMatk()">
            lisa
        </button>    
    </div>
    `
    document.getElementById("matka-andmed").innerHTML = uusUudisHtml
}





function naitaUudiseLisamist() {
    const uusUudisHtml = `
    <h1>Uus uudis</h1>
        <input type="text" placeholder="pealkiri" id="pealkiri"/><br>
        <input type="text" placeholder="uudispilt"id="uudispilt"/>
    <div>
        <label>Kokkuvõte</label><br>
        <textarea id="kokkuvote" cols="20" rows="2"></textarea>
    </div>
    <div>
        <label>Uudistekst</label><br>
        <textarea id="uudistekst" cols="40" rows="5"></textarea>
    </div>
    <div>
        <button class="btn btn-primary" onclick="lisaUudis()">
            lisa
        </button>    
    </div>
    `
    document.getElementById("matka-andmed").innerHTML = uusUudisHtml
}

async function lisaUudis() {
    const pealkiri = document.getElementById("pealkiri").value
    const uudispilt = document.getElementById("uudispilt").value
    const kokkuvote = document.getElementById("kokkuvote").value
    const uudistekst = document.getElementById("uudistekst").value
    const uudis = {
        pealkiri,
        uudispilt,
        kokkuvote,
        uudistekst
    }
    console.log(uudis)
    const vastus = await fetch('/api/uudis', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'content-Type': 'application/json'
        },
        body: JSON.stringify(uudis)
    }) 
    //const andmed = await vastus.json()
    //console.log(andmed)
    if (vastus.ok) {
        document.getElementById("matka-andmed").innerHTML = `
        <div>
            <h2>Uudis lisatud</h2>
        </div>
        `
    }
}

async function lisaMatk() {
    const nimetus = document.getElementById("nimetus").value
    const pildiUrl = document.getElementById("pildiUrl").value
    const kirjeldus = document.getElementById("kirjeldus").value
    const matk = {
        nimetus,
        pildiUrl,
        kirjeldus,
        kasNahtav: true,
        kasRegistreerumineAvatud: true
    }
    console.log(matk)
    const vastus = await fetch('/api/matk', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'content-Type': 'application/json'
        },
        body: JSON.stringify(matk)
    }) 
    //const andmed = await vastus.json()
    //console.log(andmed)
    if (vastus.ok) {
        document.getElementById("matka-andmed").innerHTML = `
        <div>
            <h2>Matk lisatud</h2>
        </div>
        `
    }
}


loeMatkad()