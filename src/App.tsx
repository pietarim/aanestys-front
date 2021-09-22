import React, { useState, useRef, useEffect } from 'react';
import Lisaaminen from './Lisaaminen'
import Kirjautuminen from './Kirjautuminen';
import Vaihe from './Vaihe'
import Typography from '@material-ui/core/Typography'
import MuiAlert/* , { AlertProps } */ from '@material-ui/lab/Alert';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import CSS from 'csstype';
import { HAE_KAIKKI, AANESTA, EHDOTA } from './graphOperations';
import { Vaiheet } from "./Vaiheet"

import './App.css';
import { useQuery, useMutation } from '@apollo/client';
import { Visibility } from '@material-ui/icons';
/* import { BrowserRouter as Router, Route, Link } from "react-router-dom"; */

function App() {

  const [vaaraTunnus, setVaaraTunnus] = useState(false)
  const [kirjautunut, setKirjautunut] = useState<boolean>()
  const [accesTokenS, setAccesTokenS] = useState<string>("")
  const [aanestetty, setAanestetty] = useState(false)
  const [lisatty, setLisatty] = useState(false)
  const [kayttajaId, setKayttajaId] = useState('')
  const [esitettavaNimi, setEsitettavaNimi] = useState("")
  const aaniTimeId = useRef()
  const kirjautunut2 = useRef<boolean>()
  const [ehdotusValue, setEhdotusValue] = useState("")
  
  let accesToken: string

  const nimi = localStorage.getItem("nimi")
  /* const kayttajaId = localStorage.getItem("kayttajaId") */

  console.log("nimi localstoragesta; ", nimi)

  const queryParams = new URLSearchParams(window.location.search);
  const kayttajaT = queryParams.get("k")
  const tapahtumaT = queryParams.get("t")

  const getAccesToken = async () => {
    console.log("GETACCESTOKEN()")
    const data = await axios.get("http://localhost:3001/accesToken", {withCredentials: true})
    setAccesTokenS(data.data)
    console.log("accesToken getAccestoken() sisällä: ", accesTokenS)
  }

  const expressKirajutuminen = async () => {
    console.log("EXPRESSKIRJOUTUMINEN()")
    console.log({osallistujaSalasana: kayttajaT, tapahtumaSalasana: tapahtumaT})
    const data = await axios.post("http://localhost:3001/kirjautuminen",
     {osallistujaSalasana: kayttajaT, tapahtumaSalasana: tapahtumaT}, {withCredentials: true})
    /* accesToken = data.data.token */
    setAccesTokenS(data.data.token)
    console.log(data)
    const nimiD = data.data.nimi
    const kayttajaIdD = data.data._id
    localStorage.setItem("nimi", nimiD)
    localStorage.setItem("kayttajaId", kayttajaIdD)
    if (accesTokenS.length > 2) {
      kirjautunut2.current = true
      /* kirjautuminen.current = true */
    }
    console.log("kirajutuminen.current kirajutuminen.current kirajutuminen.current ")
  }

  

  useEffect(() => {
    const nimi = localStorage.getItem("nimi")
    console.log("I eka use effect useEffect [],)")
    if (!nimi) {
      console.log("nimi ei löydy kirjautunut ulos")
      kirjautunut2.current = false
    } else {
      console.log("nimi löytyy kirjautunut sisään")
      kirjautunut2.current = true
    }
  }, [])

  useEffect(() => {
    console.log("II toinen useffect useEffect [],)")
    if ( !kirjautunut2.current ) {
      console.log("kirjautuminen käynnissä")
      expressKirajutuminen()
    } else if (kirjautunut2.current) {
      console.log("haetaan uusi acces token")
      getAccesToken()
      console.log("accesToken II useEffect sisällä: ", accesTokenS)
    }
  }, [])

  useEffect(() => {
    const nimi = localStorage.getItem("nimi")
    if (nimi) {
      setEsitettavaNimi(nimi)
    }
    const kayttajaId = localStorage.getItem("kayttajaId")
    if (kayttajaId) {
      setKayttajaId(kayttajaId)
    }
  })

  async function kirjauduUlos() {
    console.log("Kirjaudu ulos funktio käynnistetty")
    localStorage.removeItem("nimi")
    localStorage.removeItem("kayttajaId")
    setAccesTokenS("")
    setKayttajaId("")
    console.log(localStorage.getItem("nimi"))

    const tulos = await axios.get("http://localhost:3001/removeCookie", {withCredentials: true})
  }
  
  /* const osoite = queryParams.get('osoite'); */
  const salaus = queryParams.get('salaus');
  const tapahtumaId = queryParams.get('tapahtuma');
  /* const kayttajaId = queryParams.get("kayt"); */
  const osallistujaTunnus = queryParams.get('osallistuja');

  interface AaniInput {
    token: string,
    osallistujaId: string,
    vaiheId: string
    ehdotusId: string
    tapahtumaId: string
  }

  interface EhdotusInput {
    token: string
    ehdotus: string
    ehdottajaId: string
    vaiheId: string
  }

  interface aaniTargetValue {
    vaiheId: string
    ehdotusId: string
    tapahtumaId: string
  }

  interface EhdotusInput {
    token: string
    ehdotus: string
    ehdottajaId: string
    vaiheId: string
  }

  interface ehdotusTargetValue {
    ehdotus: string
    vaiheId: string
  }

  function aanesta(value: aaniTargetValue) {
    setAanestetty(true)
    const [aanestys, {error, data }] = useMutation<
    { viesti: String },
    { aaniInfo: AaniInput }
    >(AANESTA, {
      variables: { aaniInfo: { 
        token: accesTokenS, 
        osallistujaId: kayttajaId, 
        vaiheId: value.vaiheId, 
        ehdotusId: value.ehdotusId, 
        tapahtumaId: value.tapahtumaId } }
    })
    setTimeout(() => {setAanestetty(false)},1500)
  }

  function ehdota(value: ehdotusTargetValue) {
    const [ehdotus, {error, data}] = useMutation<
    {viesti: String},
    {ehdotusInfo: EhdotusInput}>(EHDOTA, {
      variables: { ehdotusInfo: {
        token: accesTokenS,
        ehdotus: value.ehdotus,
        ehdottajaId: kayttajaId,
        vaiheId: value.vaiheId
      }}
    })
    setLisatty(true)

    setTimeout(() => {setLisatty(false)}, 1500)
  }

  /* function kasitteleEhdotusMuutos(e) {
    const arvo = e.target.value
    setEhdotusValue(arvo)
  } */

  const HaeKaikki = () => {
    console.log("HaeKaikki accesToken ",accesTokenS)
    const { loading, error, data } = useQuery(HAE_KAIKKI, {variables: {accesTokenS}})
    console.log("HAE KAIKKI ON KÄYNNISSÄ")
    if (loading) {
      return (
        <div>
          <p>ladataan...</p>
        </div>
      )
    } if (data) {
      let tieto = data.dbKaikkiHaku
      /* console.log(tieto) */
      console.log(tieto.osallistujat)

      const Notification = () => {
        if (aanestetty) {
          return(
              <MuiAlert elevation={6} variant="filled" severity="success" style={{ width: "150px", margin: "auto" }}>Ääni lisätty</MuiAlert>
          )
        } else if (lisatty) {
          return (
            <MuiAlert elevation={6} variant="filled" severity="info" style={{ width: "150px", margin: "auto" }}>Ehdotus lisätty</MuiAlert>
          )
        } /* else if (ehdotusrajaYlitetty) {
          return (
            <MuiAlert elevation={6} variant="filled" severity="info" style={{ width: "150px", margin: "auto" }}>Ehdotusmaksimi on 4 ehdotusta, tapahtumavaihetta kohden</MuiAlert>
          )
        } */ else {
          return (
            null
          )
        }
      }

      const Terve = () => {
        return(
          <p>hei</p>
        )
      }


      let osallistujat: any = []
      return (
        <>
          {esitettavaNimi ? <p>{esitettavaNimi} kirjautunut sisään</p> : null}
          <Typography gutterBottom variant="h3" component="h2">{tieto.otsikko}</Typography>
          <Terve />
          <Notification />
          {tieto.vaiheet.map((n: any) => 
            <Vaiheet n={n} accesTokenS={accesTokenS} kayttajaId={kayttajaId} setAanestetty={setAanestetty} setLisatty={setLisatty} />
            /* <>
              <h3>{n.otsikko}</h3>
              <>
                {n.ehdotukset.map((m: any) => 
                <>
                  
                  <p key={m.ehdottajaId}>{m.ehdotus} äänet: {m.aanet.lenght} <Button value={m.aanet} variant="contained" onClick={()=> aanesta({vaiheId: n._id, ehdotusId: m._id, tapahtumaId: n._id})}>äänestä</Button></p>
                </> )}
                <label>
                  lisää ehdotus:  <input value={ehdotusValue} onChange={() => kasitteleEhdotusMuutos } /> <Button variant="contained" onClick={() => ehdota({ehdotus: "heiii", vaiheId: n._id})}>Lähetä</Button>
                </label>
              </>
            </> */
          )}
          <Typography gutterBottom variant="h4" component="h3">Osallistujat</Typography>
          {tieto.osallistujat.map((n: any) => 
          <>
            <p key={n._id}>{n.nimi}</p>
          </>
          )}
        </>
      )
    } else {
      return (<p>ei toimi</p>)
    }
  }

  const EiLoytynet = () => {
    return(
      <h1>Väärä tunnus</h1>
    )
  }

  return (
    <div className="App">
      <Button variant="contained" onClick={() => kirjauduUlos()}>kirjaudu ulos</Button>
      {accesTokenS ? <HaeKaikki /> : <Lisaaminen /> }
    </div>
  );
}

export default App;
