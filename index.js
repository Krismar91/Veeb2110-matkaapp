const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const matkad = [    
 
        { 
        id: 0,
        nimetus: "Kanuumatk",
        kirjeldus: "Mõnus kanuumatk ilusal Ahja jõel",
        pildiURL: "/assets/kanuumatk1.jpg",
        osalejad: [],
        },
  
        { 
        id: 1,
        nimetus: "Rabamatk",
        kirjeldus: "Valgesoo on Põlvamaa väikseim, kuid põnevaim raba. Laiudes 330 hektaril, peidab ta endas väikeseid soosaari, sipelgakolooniaid, metsloomade varjepaiku.",
        pildiURL: "/assets/rabamatk1.jpg",
        osalejad: [],
        },
            
        { 
        id: 2,
        nimetus: "Suplemismatk",
        kirjeldus: "Mõnus liug vee peal koos supilauaga",
        pildiURL: "/assets/supimatk.jpg",
        osalejad: [],
        }
]


function registreerumiseKinnitus(req, res) {
    console.log(req.query.nimi)
    if (!req.query.email) {
        res.end("Emaili ei ole - registreerumine ebaõnnestus")
        return false
    }
    const registreerumine = {
        nimi: req.query.nimi,
        email: req.query.email,
        teade: req.query.teade
    }

    const matk = matkad[req.params.matkaId]
    matk.osalejad.push(registreerumine)

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


const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index', {matkad} ))
app.get('/kontakt', (req, res) => res.render('pages/kontakt', ))
app.get('/uudised', (req, res) => res.render('pages/uudised', {uudised} ))
app.get('/registreerumine/:matkaId', (req, res) => res.render('pages/registreerumine', {matk: matkad[req.params.matkaId]} ));
app.get("/kinnitus/:matkaId", registreerumiseKinnitus)
app.get("/uudis/:uudisIndex", naitaUudist)
app.listen(PORT, () => console.log(`Listening on ${PORT}`))
