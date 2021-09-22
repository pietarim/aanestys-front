import { useState } from "react"
import Button from '@material-ui/core/Button';
import { HAE_KAIKKI, AANESTA, EHDOTA } from './graphOperations';
import { useQuery, useMutation } from '@apollo/client';

interface Props {
    n: any,
    accesTokenS: string
    kayttajaId: string

    setAanestetty: React.Dispatch<React.SetStateAction<boolean>>
    setLisatty: React.Dispatch<React.SetStateAction<boolean>>
}

export const Vaiheet = ({
        n, 
        accesTokenS, 
        kayttajaId, 
        setAanestetty, 
        setLisatty
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
    
      interface ehdotusTargetValue {
        ehdotusValue: string
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

    
    
      function ehdota({ehdotusValue, vaiheId} : ehdotusTargetValue) {
        const [ehdotus, {error, data}] = useMutation<
        {viesti: String},
        {ehdotusInfo: EhdotusInput}>(EHDOTA, {
          variables: { ehdotusInfo: {
            token: accesTokenS,
            ehdotus: ehdotusValue,
            ehdottajaId: kayttajaId,
            vaiheId: vaiheId
          }}
        })
        setLisatty(true)
        setEhdotusValue("")
        setTimeout(() => {setLisatty(false)}, 1500)
      }

    function lahetaEhdotus() {
        console.log("ehdotus käynnistyy")
        setEhdotusValue("")
        setLisatty(true)
        setTimeout(() => {setAanestetty(false)},1500)
    }

    const kasitteleEhdotusMuutos = (e: React.FormEvent<HTMLInputElement>) => {
        setEhdotusValue(e.currentTarget.value)
    }

    /* function kasitteleEhdotusMuutos(e: React.FormEvent<HTMLInputElement>): void {
        setEhdotusValue(e.currentTarget.value)
    } */

    return (
        <>
            <h3>{n.otsikko}</h3>
            <>
            {n.ehdotukset.map((m: any) => 
            <>
                
                <p key={m.ehdottajaId}>
                    {m.ehdotus} äänet: {m.aanet.lenght} 
                    <Button value={m.aanet} variant="contained" onClick={()=> aanesta({vaiheId: n._id, ehdotusId: m._id, tapahtumaId: n._id})}>
                        äänestä
                    </Button>
                </p>
            </> )}
                <label>
                    lisää ehdotus:  <input value={ehdotusValue} onChange={kasitteleEhdotusMuutos} />
                </label>     
                    <Button variant="contained" onClick={() => ehdota({ehdotusValue: ehdotusValue, vaiheId: n._id})}>
                        Lähetä
                    </Button>
                  
            </>
        </>
    )    
}