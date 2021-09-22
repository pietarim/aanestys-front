import React, { useState } from 'react'
import { gql, useMutation } from "@apollo/client"

const Kirjautuminen = (props: any) => {
    
    const [salasana, setSalasana] = useState('')

    const kirj = () => {
        /* if (salasana === "a") { */
            kirjaudu()
            /* localStorage.setItem("kirjaus", "true")
            props.setState(true) */
        /* } else {
            console.log("epäonnistuminen")
        } */
    }

    const Palaute = () => {
        if (data) {
            const tieto = data.kirjautuminen.tunnus
            if (tieto === "yes") {
                localStorage.setItem("kirjaus", "true")
                props.setState(true)
                return (
                    <>
                        <p>kirjautuminen onnistui</p>
                    </>
                )
            } else if (tieto === "no") {
                return (
                    <>
                        <p>kirjautuminen epäonnistui</p>
                    </>
                )
            }
            
        } if (loading) {
            return(
                <>
                    <p>ladataan...</p>
                </>
            )
        } if (error) {
            return(
                <>
                    <p>joku meni pieleen</p>
                </>
            )
        } else {
            return(
                <p>eiiiii</p>
            )
        }
    }

    const TUNNUKSEN_LAH = gql`
        mutation kirjaus($salasana: String!) {
            kirjautuminen( tunnus: {
                tunnus: $salasana
            }) {
                tunnus
            }
        }
    `

    const [kirjaudu, {data, loading, error}] = useMutation<
    {kirjautuminen: {tunnus: string}},
    {salasana: string}
    >(TUNNUKSEN_LAH, {variables: {salasana}})

    return(
        <div className="App">
            <button>kirjaudu ulos</button>
            <h1>Tapahtuman luominne</h1>
            <Palaute />
                <label>
                    salasana
                    <input
                        /* type="password" */
                        value = {salasana}
                        onChange={e => 
                            setSalasana(e.target.value)
                        } 
                    />
                </label>
                
            <button onClick={kirj} >mutaatio</button>
        </div>
    )
}

export default Kirjautuminen