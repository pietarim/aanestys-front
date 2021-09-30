import { useState, useRef, useEffect } from 'react';
import Lisaaminen from './Lisaaminen'
import Typography from '@material-ui/core/Typography'
import MuiAlert/* , { AlertProps } */ from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import { HAE_KAIKKI, AANESTA, EHDOTA } from './graphOperations';
import { Vaiheet } from "./komponentit/Vaiheet"
import './App.css';
import { useQuery, useMutation } from '@apollo/client';


function App() {

  const [ehdotusMax, setEhdotusMax] = useState(false)
  const [accesTokenS, setAccesTokenS] = useState<string>("")
  const [aanestetty, setAanestetty] = useState(false)
  const [lisatty, setLisatty] = useState(false)
  const [kayttajaId, setKayttajaId] = useState('')
  const [esitettavaNimi, setEsitettavaNimi] = useState("")
  const kirjautunut2 = useRef<boolean>()

  const nimi = localStorage.getItem("nimi")

  const queryParams = new URLSearchParams(window.location.search);
  const kayttajaT = queryParams.get("k")
  const tapahtumaT = queryParams.get("t")

  const getAccesToken = async () => {
    const data = await axios.get("http://localhost:3001/accesToken", {withCredentials: true})
    setAccesTokenS(data.data)
  }

  const expressKirajutuminen = async () => {
    const data = await axios.post("http://localhost:3001/kirjautuminen",
     {osallistujaSalasana: kayttajaT, tapahtumaSalasana: tapahtumaT}, {withCredentials: true})
    setAccesTokenS(data.data.token)
    const nimiD = data.data.nimi
    const kayttajaIdD = data.data._id
    localStorage.setItem("nimi", nimiD)
    localStorage.setItem("kayttajaId", kayttajaIdD)
    if (accesTokenS.length > 2) {
      kirjautunut2.current = true
    }
  }


  useEffect(() => {
    const nimi = localStorage.getItem("nimi")
    if (!nimi) {
      kirjautunut2.current = false
    } else {
      kirjautunut2.current = true
    }
  }, [])

  useEffect(() => {
    if ( !kirjautunut2.current && kayttajaT && tapahtumaT ) {
      expressKirajutuminen()
    } else if (kirjautunut2.current) {
      getAccesToken()
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
    localStorage.removeItem("nimi")
    localStorage.removeItem("kayttajaId")
    setAccesTokenS("")
    setKayttajaId("")

    const tulos = await axios.get("http://localhost:3001/removeCookie", {withCredentials: true})
  }
  

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

      const Notification = () => {
        if (aanestetty) {
          return(
              <MuiAlert elevation={6} variant="filled" severity="success" style={{ width: "150px", margin: "auto" }}>Ääni lisätty</MuiAlert>
          )
        } else if (lisatty) {
          return (
            <MuiAlert elevation={6} variant="filled" severity="info" style={{ width: "150px", margin: "auto" }}>Ehdotus lisätty</MuiAlert>
          )
        } else if (ehdotusMax) {
          return (
            <MuiAlert elevation={6} variant="filled" severity="info" style={{ width: "150px", margin: "auto" }}>Ehdotusmaksimi on 4 ehdotusta, tapahtumavaihetta kohden</MuiAlert>
          )
        } else {
          return (
            null
          )
        }
      }


      let osallistujat: any = []
      return (
        <>
          {esitettavaNimi ? <p>{esitettavaNimi} kirjautunut sisään</p> : null}
          <Typography gutterBottom variant="h3" component="h2">{tieto.otsikko}</Typography>
          <Notification />
          {tieto.vaiheet.map((n: any) => 
            <Vaiheet
              key={n._id}
              id={n._id} n={n} 
              accesTokenS={accesTokenS} 
              kayttajaId={kayttajaId} 
              setAanestetty={setAanestetty} 
              setLisatty={setLisatty} 
              setEhdotusMax={setEhdotusMax} 
            />
          )}
          <Typography gutterBottom variant="h4" component="h3">Osallistujat</Typography>
          <div>
            {tieto.osallistujat.map((n: any) => 
              <p key={n._id}>{n.nimi}</p>
            )}
          </div>
          
        </>
      )
    } else {
      return (<p>ei toimi</p>)
    }
  }

  return (
    <div className="App">
      <Button variant="contained" onClick={() => kirjauduUlos()}>kirjaudu ulos</Button>
      {accesTokenS ? <HaeKaikki /> : <Lisaaminen /> }
    </div>
  );
}

export default App;
