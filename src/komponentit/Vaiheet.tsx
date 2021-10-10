import { useState } from "react"
import Button from '@material-ui/core/Button'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import { HAE_KAIKKI, AANESTA, EHDOTA } from '../graphOperations'
import { useQuery, useMutation } from '@apollo/client'
import { AanestaButton } from "./AanestaButton"
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import Container from '@mui/material/Container'
import blue from '@mui/material/colors/blue'
import { makeStyles } from '@material-ui/core/styles'

interface Props {
  id: string,
  n: any,
  accesTokenS: string
  kayttajaId: string
  setAanestetty: React.Dispatch<React.SetStateAction<boolean>>
  setLisatty: React.Dispatch<React.SetStateAction<boolean>>
  setEhdotusMax: React.Dispatch<React.SetStateAction<boolean>>
}

export const Vaiheet = ({
  id,
  n,
  accesTokenS,
  kayttajaId,
  setAanestetty,
  setLisatty,
  setEhdotusMax
}: Props) => {
  const [ehdotusValue, setEhdotusValue] = useState<string>("")

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


  const [ehdottaminen, { error, data, loading }] = useMutation<
    { ehdottaminen: String },
    { ehdotusInfo: EhdotusInput }>(EHDOTA, {
      variables: {
        ehdotusInfo: {
          token: accesTokenS,
          ehdotus: ehdotusValue,
          ehdottajaId: kayttajaId,
          vaiheId: n._id
        }
      }
    })
  /* ehdottaminen() */
  console.log("mutaatio on käynnissä")
  if (loading) {
    console.log("ladataan")
  } else if (data) {
    if (data.ehdottaminen == "max") {
      setEhdotusMax(true)
      setTimeout(() => { setEhdotusMax(false) }, 3500)
    } else {
      setLisatty(true)
      setTimeout(() => { setLisatty(false) }, 1500)
    }
  } else if (error) {
    console.log(error)
  }



  function lahetaEhdotus() {
    console.log("ehdotus käynnistyy")
    setEhdotusValue("")
    setLisatty(true)
    setTimeout(() => { setAanestetty(false) }, 1500)
  }

  const useStyles = makeStyles({

  })

  return (
    <div key={id}>
      <h3>{n.otsikko}</h3>
      <div >
        {n.ehdotukset.map((m: any, index: number) =>
          <div key={m._id} style={{ display: "block" }}>
            <p
              style={{ display: "inline-block" }}
              key={m._id}>
              <b>{m.ehdotus}</b> äänet: {Object.values(m.aanet).length}
            </p>
            <AanestaButton
              key={index}
              id={id}
              ehdotus={m}
              n={n}
              accesTokenS={accesTokenS}
              kayttajaId={kayttajaId}
              setAanestetty={setAanestetty}
            />
          </div>
        )}
      </div>
      <TextField
        style={{ backgroundColor: "#ffffff", borderRadius: "4px" }}
        value={ehdotusValue}
        label="lisää ehdotus"
        onChange={(e) => { setEhdotusValue(e.target.value) }}
      />
      <Button variant="contained" onClick={() => ehdottaminen()}>
        Lähetä
      </Button>
    </div>
  )
}