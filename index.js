const express = require('express')
const { MongoClient } = require("mongodb");
const path = require('path')
const PORT = process.env.PORT || 5000

const salasona = "Discovery.484"
const andmebaas = "matkaApp"
const mongoUrl = 
`mongodb+srv://matka--app:${salasona}@cluster0.epark.mongodb.net/${andmebaas}?retryWrites=true&w=majority`

const client = new MongoClient(mongoUrl);



const matkad = [    
 
        { 
        id: 0,
        nimetus: "Kanuumatk",
        kirjeldus: "Mõnus kanuumatk ilusal Ahja jõel",
        piltUrl: "/assets/kanuumatk1.jpg",
        osalejad: [],
        kasNahtav: true,
        kasRegistreerumineAvatud: true
        },
  
        { 
        id: 1,
        nimetus: "Rabamatk",
        kirjeldus: "Valgesoo on Põlvamaa väikseim, kuid põnevaim raba. Laiudes 330 hektaril, peidab ta endas väikeseid soosaari, sipelgakolooniaid, metsloomade varjepaiku.",
        piltUrl: "/assets/rabamatk1.jpg",
        osalejad: [],
        kasNahtav: true,
        kasRegistreerumineAvatud: true
        },
            
        { 
        id: 2,
        nimetus: "Supimatk",
        kirjeldus: "Mõnus liug vee peal koos supilauaga",
        piltUrl: "/assets/supimatk.jpg",
        osalejad: [],
        kasNahtav: true,
        kasRegistreerumineAvatud: false
        }
]

function naitaMatk(req, res) {
    const matkIndex = req.params.matkIndex
    const yksMatk = matkad[matkIndex]
    res.render("pages/matk", {yksMatk})
}


async function registreerumiseKinnitus(req, res) {
    console.log(req.query.nimi)
    if (!req.query.email) {
        res.end("Emaili ei ole - registreerumine ebaõnnestus")
        return false
    }

    const matk = matkad[req.params.matkaId]

    const registreerumine = {
        matkId: matk.id,
        nimi: req.query.nimi,
        email: req.query.email,
        teade: req.query.teade
    }

    
    matk.osalejad.push(registreerumine)

    await client.connect()
    const database = client.db(andmebaas)
    const registreerumised = database.collection("registreerumised")
    const tulemus = await registreerumised.insertOne(registreerumine)
    console.log(`Lisati registreerumine id-ga: ${tulemus.insertedId}`)

    res.end(`Registreeruti matkale`)
}


const uudised = [
    {
        id: 0,
        pealkiri: 'HOOAJAPILETID SAADAVAL VEEL LOETUD TUNNID!',
        kokkuvõte: 'Head mäesportlased! Väike sõbralik meeldetuletus – 2021/22 Kuutsemäe ja V-Munamäe hooajapiletite eelmüük kestab veel viimaseid tunde!',
        uudistekst: 'Eelmüügi kogused on tavapärasest limiteeritumad ja periood lühem, kuna nii kahju kui ka ei ole, võib eeldada, et ka tuleval talvel hakkavad välitingimustes kehtima COVID-19 piirangud.Hetkel usume, et limiiti jagub täna kuni kl 21:00, kuid müük lõppeb kindlasti keskööl. Juhul, kui pandeemia seda võimaldab, saab hooajapileteid jälle osta peale talvehooaja algust, aga siis juba täishinnaga.',
        uudispilt: '/assets/kuutsemae.jpeg',
    },

    {
        id: 1,
        pealkiri: 'Suur huvi üle-eestilise jõulumatka vastu tõi lisamatkad',
        kokkuvõte: 'Kolmapäeva keskpäeval toimub esimene üle-eestiline jõulumatk, millega pannakse punkt kogu aasta väldanud Eesti Vabariik 100 juubelimatkade sarjale.',
        uudistekst: 'Kokku toimub täna üle 80 Eesti loodust ja selle mitmekülgsust tutvustavat  tasuta matka. "EV100 juubelimatkade sari viis tänavu kümned tuhanded inimesed Eesti looduse mitmekesisusest osa saama. Esimene üle-eestiline jõulumatk annabki veel hea võimaluse pärast jõululaus istumist koos pere või sõpradega ennast veidi Eesti looduses liigutada," ütles Eesti Vabariik 100 programmijuht Maarja-Liisa Soe.',
        uudispilt: '/assets/talvematk.jpg',
    },

    {
        id: 2,
        pealkiri: 'Enam kui sada matkajat avastasid Haapsalu ümbrust',
        kokkuvõte: 'MTÜ Elamusretked on kümne aasta jooksul korraldanud Eestis ligi 130 retke, mis viivad avastama paiku, kuhu külalised igapäevaselt ei satu. "Aktuaalne kaamera" käis kaasas Haapsalu ümbruses peetud matkal ja uuris, mis toob inimesed hilissügisel toast välja.',
        uudistekst: 'Matk algas Haapsalu raudteejaamast, mis on linna üks tuntumaid atraktsioone, kuid enam kui neli tundi kestnud teekonna ülejäänud sihtkohad asusid juba kõrvalisemates paikades. Haapsalu ümbruses seikles kolme grupi peale kokku ligi 150 inimest.',
        uudispilt: '/assets/gigasilma.jpg'
    }    

]


function naitaUudist(req, res) {
    const uudisIndex = req.params.uudisIndex
    const uudis = uudised[uudisIndex]
    res.render("pages/uudis", { uudis } )
}

async function lisaUudis(req, res) {
    const uusUudis = {
        pealkiri: req.body.pealkiri,
        kokkuvote: req.body.kokkuvote,
        uudistekst: req.body.uudistekst,
        uudispilt: req.body.uudispilt
    }

    await client.connect()
    const database = client.db(andmebaas)
    const uudisedCollection = database.collection("uudised")
    const tulemus = await uudisedCollection.insertOne(uusUudis)
    uusUudis.id = tulemus.insertedId
    uudised.push(uusUudis)
    res.send(uusUudis)
}

async function lisaMatk(req, res) {
    const uusMatk = {
        nimetus: req.body.nimetus,
        pildiUrl: req.body.pildiUrl,
        kirjeldus: req.body.kirjeldus,
        osalejad: [],
        kasNahtav: req.body.kasNahtav,
        kasRegistreerumineAvatud: req.body.kasRegistreerumineAvatud
    }

    await client.connect()
    const database = client.db(andmebaas)
    const matkadCollection = database.collection("matk")
    const tulemus = await matkadCollection.insertOne(uusMatk)
    uusMatk.id = matkad.length
    matkad.push(uusMatk)
    res.send(uusMatk)
}

async function loeMatkad() {
    await client.connect()
    const database = client.db(andmebaas)
    const matkadCollection = database.collection("matk")
    const andmed = await matkadCollection.find().toArray
    for (i in andmed) {
        const matk = andmed[i]
        matk.id = matkad.length
        matkad.push(matk)
    }
    console.log("matkad loetud")
}






async function loeUudised() {
    await client.connect()
    const database = client.db(andmebaas)
    const uudisedCollection = database.collection("uudised")
    const andmed = await uudisedCollection.find().toArray
    for (i in andmed) {
        const uudis = andmed[i]
        uudis.id = uudised.length
        uudised.push(uudis)
    }
    console.log("uudised loetud")
}

function tagastaUudised(req, res) {
    res.send(uudised)
}


function matkNahtav(matk) {
    return matk.kasNahtav
}

function naitaMatkad(req, res) {
    const nahtavadMatkad = matkad.filter(matkNahtav)
    res.render('pages/index', {matkad: nahtavadMatkad} )
}

function tagastaMatkad(req, res) {
    res.send(matkad)
}



function muudaMatka(req, res) {
    const matk = matkad[req.params.matkaId]
    if (req.query.avatud != undefined) {
        matk.kasRegistreerumineAvatud = (req.query.avatud ==='true')
    }

    if (req.query.nahtav != undefined) {
        matk.kasNahtav = (req.query.nahtav ==='true')
    }

    if (req.query.nimetus != undefined) {
        matk.nimetus = req.query.nimetus
    }

    if (req.query.piltUrl != undefined) {
        matk.piltUrl = req.query.piltUrl
    }

    if (req.query.kirjeldus != undefined) {
        matk.kirjeldus = req.query.kirjeldus
    }


    console.log(matk)
    res.send(matk)
}

function muudaUudist(req, res) {
    const uudis = uudised[req.params.uudisIndex]
    if (req.query.pealkiri != undefined) {
        uudis.pealkiri = req.query.pealkiri
    }

    res.send(uudis)
}




async function loeRegistreerumised(matkId) {
    await client.connect()
    const database = client.db(andmebaas)
    const registreerumised = database.collection("registreerumised")

    let filter = {}

    if (matkId !== undefined) {
        filter = {matkId: parseInt(matkId)}
    }

    const tulemus = await registreerumised.find(filter).toArray()
    client.close()
    return tulemus
}

async function tagastaRegistreerumised(req, res) {
    const andmed = await loeRegistreerumised(req.params.matkId)
    res.send(andmed)
}

async function lisaOsalejadMatkadele() {
    for (matkId in matkad) {
        const matk = matkad[matkId]
        const osalejad = await loeRegistreerumised(matk.id)
        matk.osalejad = osalejad
    }
}

const app = express()
lisaOsalejadMatkadele()
loeUudised()
loeMatkad()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', naitaMatkad)
app.get('/kontakt', (req, res) => res.render('pages/kontakt', ))
app.get('/uudised', (req, res) => res.render('pages/uudised', {uudised} ))
app.get('/registreerumine/:matkaId', 
(req, res) => res.render('pages/registreerumine', 
{matk: matkad[req.params.matkaId]} ));

app.get("/kinnitus/:matkaId", registreerumiseKinnitus)
app.get("/uudis/:uudisIndex", naitaUudist)
app.get("/matk/:matkIndex", naitaMatk)
app.get("/api/matk", tagastaMatkad)
app.get("/api/uudis", tagastaUudised)
app.post("/api/uudis", lisaUudis)
app.post("/api/matk", lisaMatk)
app.get("/api/matk/:matkaId/muuda", muudaMatka)
app.get("/api/uudis/:uudisIndex/muuda", muudaUudist)
app.get("/api/registreerumised", tagastaRegistreerumised)
app.get("/api/registreerumised/:matkId", tagastaRegistreerumised)


app.listen(PORT, () => console.log(`Listening on ${PORT}`))
