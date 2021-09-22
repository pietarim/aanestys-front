import React, {useState} from "react"
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

// @ts-ignore
const Vaihe = ({vaihe, kayttajaId }) => {
    console.log(vaihe)

    const [ehdotus, setEhdotus] = useState('')
    const [togleForm, setTogleForm] = useState(false)

    function ehdota() {
        console.log("ehdottaminen on suoritettu")
        setTogleForm(true)
    }

    const Lomake = () => {
        return(
            <>
                <form>
                    {/* <label>
                        ehdotus
                        <input />
                    </label> */}
                    <TextField id="filled-basic" label="Ehdotus" variant="filled" />
                    <Button type="submit" variant="contained" color="primary" >Lähetä</Button>
                    <Button variant="contained" color="secondary" onClick={() => setTogleForm(false)}>piilota</Button>
                </form>
            </>
        )
    }

    return(
        <>
            <h2>{vaihe.otsikko}</h2>
            <ul>
                {vaihe.ehdotukset.map((n: any) =>
                <>
                    
                    <li>{n.ehdotus}</li> <Button>äänestä</Button>
                    <p>äänet: {n.aanet.length}</p>

                </>
                )}
            </ul>
            {togleForm? <Lomake /> : <Button variant="contained" onClick={() => setTogleForm(true)}>ehdota</Button>}
            
        </>
    )
}

export default Vaihe