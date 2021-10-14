import { useState, useRef, useEffect } from 'react'
import Lisaaminen from './Lisaaminen'
import Typography from '@material-ui/core/Typography'
import MuiAlert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import { HAE_KAIKKI } from './graphOperations'
import { Vaiheet } from "./komponentit/Vaiheet"
import './App.css'
import Paper from '@mui/material/Paper'
import { useQuery } from '@apollo/client'
import { url } from "./config"

function App() {
  const [ehdotusMax, setEhdotusMax] = useState(false)
  const [accesTokenS, setAccesTokenS] = useState<string>("")
  const [aanestetty, setAanestetty] = useState(false)
  const [lisatty, setLisatty] = useState(false)
  const [kayttajaId, setKayttajaId] = useState('')
  const [esitettavaNimi, setEsitettavaNimi] = useState("")
  const kirjautunut2 = useRef<boolean>()

  const nimi = localStorage.getItem("nimi")

  const queryParams = new URLSearchParams(window.location.search)
  const kayttajaT = queryParams.get("k")
  const tapahtumaT = queryParams.get("t")

  const getAccesToken = async () => {
    const data = await axios.get(`${url}/accesToken`, { withCredentials: true })
    setAccesTokenS(data.data)
  }

  const expressKirajutuminen = async () => {
    const data = await axios.post(`${url}/kirjautuminen`,
      { osallistujaSalasana: kayttajaT, tapahtumaSalasana: tapahtumaT }, { withCredentials: true })
    setAccesTokenS(data.data.token)
    const nimiD = data.data.nimi
    const kayttajaIdD = data.data._id
    localStorage.setItem("nimi", nimiD)
    setEsitettavaNimi(nimiD)
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
    if (!kirjautunut2.current && kayttajaT && tapahtumaT) {
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
  }, [])

  async function kirjauduUlos() {
    localStorage.removeItem("nimi")
    localStorage.removeItem("kayttajaId")
    setAccesTokenS("")
    setKayttajaId("")
  }

  const HaeKaikki = () => {
    const { loading, error, data } = useQuery(HAE_KAIKKI, { variables: { accesTokenS } })
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
          return (
            <MuiAlert
              elevation={6}
              variant="filled"
              severity="success"
              style={{ width: "150px", margin: "auto" }}>
              Ääni lisätty
            </MuiAlert>
          )
        } else if (lisatty) {
          return (
            <MuiAlert
              elevation={6}
              variant="filled"
              severity="info"
              style={{ width: "150px", margin: "auto" }}>
              Ehdotus lisätty
            </MuiAlert>
          )
        } else if (ehdotusMax) {
          return (
            <MuiAlert
              elevation={6}
              variant="filled"
              severity="info"
              style={{ width: "150px", margin: "auto" }}>
              Ehdotusmaksimi on 4 ehdotusta, tapahtumavaihetta kohden
            </MuiAlert>
          )
        } else {
          return (
            null
          )
        }
      }

      const Ylapalkki = () => {
        let leveys = window.innerWidth
        if (leveys < 600) {
          return (
            <div id="palkki" style={{ display: "block" }} >
              {esitettavaNimi ? <Chip label={`${esitettavaNimi} kirjautunut sisään`} color="primary" /> : null}
              <Typography variant="h3" component="h2">{tieto.otsikko}</Typography>
              <Button variant="contained" onClick={() => kirjauduUlos()}>kirjaudu ulos</Button>
            </div>
          )
        } else if (leveys > 599) {
          return (
            <div id="palkki" style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              {esitettavaNimi ? <Chip label={`${esitettavaNimi} kirjautunut sisään`} color="primary" /> : null}
              <Typography variant="h3" component="h2">{tieto.otsikko}</Typography>
              <Button variant="contained" onClick={() => kirjauduUlos()}>kirjaudu ulos</Button>
            </div>
          )
        } else { return null }
      }

      return (
        <>
          <Ylapalkki />
          <Container component="main" maxWidth="md" sx={{ pb: 4, px: 0, mt: 1 }}>
            <Paper style={{ backgroundColor: "#bbdefb" }} variant="outlined" sx={{ pb: 4, mt: { sm: 1 } }}>
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
            </Paper>
          </Container>
          <Typography gutterBottom variant="h4" component="h3">Osallistujat</Typography>
          <div>
            {tieto.osallistujat.map((n: any) =>
              <p key={n._id}>{n.nimi}</p>
            )}
          </div>
        </>
      )
    } else if (error) {
      kirjauduUlos()
      return (<p>Tapahtuma on vanhentunut</p>)
    } else {
      return (<p>Jokin meni pieleen</p>)
    }
  }

  return (
    <div className="App">
      {accesTokenS ? <HaeKaikki /> : <Lisaaminen />}
    </div>
  )
}

export default App