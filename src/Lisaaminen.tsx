import { useState } from 'react'
import { produce } from "immer"
import MuiAlert from '@material-ui/lab/Alert'
import { useMutation } from "@apollo/client"
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Button from '@material-ui/core/Button'
import { LUOMINEN } from "./graphOperations"

const Lisaaminen = () => {

  const [osallistujat, setOsallistujat] = useState(["", "", "", "", ""])
  const [otsikko, setOtsikko] = useState("")
  const [vaiheet, setVaiheet] = useState(["", "", "", "", ""])
  const [numero, setNumero] = useState("")

  const Lisaaminen = async () => {
    const tallennettu = await muokkaa()
  }

  const [muokkaa, { data, loading, error }] = useMutation<
    { viesti: string },
    { otsikko: string, numero: string, vaiheet: string[], osallistujat: string[] }
  >(LUOMINEN, { variables: { otsikko, numero, vaiheet, osallistujat } })

  const PoistaRivi = () => {
    if (osallistujat.length > 5) {
      return (
        <Button onClick={() => rivinPoistaminen()} >Poista rivi</Button>
      )
    } else {
      return null
    }
  }

  const PoistaVaiRivi = () => {
    if (vaiheet.length > 5) {
      return (
        <Button onClick={() => vaiheRiviPoistaminen()} >Poista rivi</Button>
      )
    } else {
      return null
    }
  }

  function rivinPoistaminen() {
    const index = osallistujat.length - 1
    let textFieldArr: Array<string> = []
    for (let i = 0; i < index; i++) {
      textFieldArr = [...textFieldArr, osallistujat[i]]
    }
    setOsallistujat(textFieldArr)
  }

  function vaiheRiviPoistaminen() {
    const index = vaiheet.length - 1
    let textFieldArr: Array<string> = []
    for (let i = 0; i < index; i++) {
      textFieldArr = [...textFieldArr, vaiheet[i]]
    }
    setVaiheet(textFieldArr)
  }

  const Palaute = () => {
    if (data) {
      return (
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)" }}>
          Lisääminen suoritettu. Kirjaudu tapahtumaan tekstiviestin linkillä.
        </MuiAlert>
      )
    }
    if (loading) {
      return (
        <p>lataa...</p>
      )
    }
    if (error) {
      return (
        <p>joku meni pieleen</p>
      )
    }
    return (
      null
    )
  }

  return (
    <>
      <Palaute />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 3, md: 3 }, mx: { xs: 0.5 } }}>
          <h1>Tapahtuman lisääminen</h1>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tapahtuman nimi"
                value={otsikko}
                onChange={(e) => {
                  setOtsikko(e.target.value)
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Puhelin (mudossa 3581111111)"
                value={numero}
                onChange={(e) => {
                  setNumero(e.target.value)
                }}
              />
            </Grid>
          </Grid>
          <h2>Osallistujat</h2>
          <Grid container spacing={3}>
            {osallistujat.map((n, i) => {
              return (
                <Grid key={i} item xs={12} sm={6}>
                  <TextField
                    label="osallistuja"
                    value={n}
                    fullWidth
                    onChange={(e) => {
                      let jono = osallistujat
                      let value = e.target.value
                      jono[i] = value
                      setOsallistujat([...jono])
                    }}
                  />
                </Grid>
              )
            })}
            <Button style={{ paddingLeft: "24px" }} onClick={() => {
              setOsallistujat([...osallistujat, ""])
            }}>
              Lisaa rivi
            </Button>
            <PoistaRivi />
          </Grid>
          <h2>Vaiheet</h2>
          <Grid container spacing={3}>
            {vaiheet.map((n, i) => {
              return (
                <Grid key={i} item xs={12} sm={6}>
                  <TextField
                    label={`Vaihe ${i + 1}`}
                    value={n}
                    fullWidth
                    onChange={(e) => {
                      let jono = vaiheet
                      let value = e.target.value
                      jono[i] = value
                      setVaiheet([...jono])
                    }}
                  />
                </Grid>
              )
            })}
            <Button style={{ paddingLeft: "24px" }} onClick={() => {
              setVaiheet([...vaiheet, ""])
            }}>
              Lisaa rivi
            </Button>
            <PoistaVaiRivi />
          </Grid>
          <Button style={{ marginTop: "32px" }} variant="contained" onClick={Lisaaminen}>luo tapahtuma</Button>
        </Paper>
      </Container>
    </>
  )
}

export default Lisaaminen