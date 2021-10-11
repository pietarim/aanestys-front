import { useState } from "react"
import Button from '@material-ui/core/Button'
import TextField from '@mui/material/TextField'
import { EHDOTA } from '../graphOperations'
import { useMutation } from '@apollo/client'
import { AanestaButton } from "./AanestaButton"

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

  interface EhdotusInput {
    token: string
    ehdotus: string
    ehdottajaId: string
    vaiheId: string
  }

  interface EhdotusInput {
    token: string
    ehdotus: string
    ehdottajaId: string
    vaiheId: string
  }

  const [ehdottaminen, { error, data }] = useMutation<
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
  if (data) {
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