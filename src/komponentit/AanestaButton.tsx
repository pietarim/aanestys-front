import { useState } from "react"
import { AANESTA } from '../graphOperations';
import Button from '@material-ui/core/Button';
import { useQuery, useMutation } from '@apollo/client';

interface Props {
    id: string
    ehdotus: any,
    n: any,
    accesTokenS: string,
    kayttajaId: string,
    setAanestetty: React.Dispatch<React.SetStateAction<boolean>>,
}

export const AanestaButton = ({
    id,
    ehdotus,
    n,
    accesTokenS,
    kayttajaId,
    setAanestetty
}:Props ) => {

    const [aanesta, {error, loading, data }] = useMutation<
        { viesti: String },
        { aaniInfo: AaniInput }
        >(AANESTA, {
          variables: { aaniInfo: { 
            token: accesTokenS, 
            osallistujaId: kayttajaId, 
            vaiheId: n._id, 
            ehdotusId: ehdotus._id, 
            tapahtumaId: id }}
        })
        if (error) {
          console.log("epännistuminen")
        } else if (loading) {
          console.log("lataaminen käynnisäs")
        } else if (data) {
          setAanestetty(true)
          setTimeout(() => {setAanestetty(false)},1500)
        }
        

    interface AaniInput {
        token: string,
        osallistujaId: string,
        vaiheId: string
        ehdotusId: string
        tapahtumaId: string
      }

      return (
          <div key={id}>
            <Button variant="contained" onClick={()=> aanesta()}>
                äänestä
            </Button>
          </div>
      )
}