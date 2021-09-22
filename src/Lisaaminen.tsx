import React, {useState} from 'react'
import { gql, useMutation } from "@apollo/client"
import { string } from 'yargs'

const Lisaaminen = () => {

    const [osallistujat, setOsallistujat] = useState(["","","","",""])
	const [otsikko, setOtsikko] = useState("")
    const [ehdotukset, setEhdotukset] = useState(["","","","",""])
	const [numero, setNumero] = useState("")

    const LUO_TAPAHTUMA = gql`
        mutation luominen($otsikko: String!, $numero: String!, $osallistujat: [String!]!, $ehdotukset: [String!]!) {
            tapahtumaLisays(tapahtuma: {
                otsikko: $otsikko,
				numero: $numero,
                osallistujat: $osallistujat
                ehdotukset: $ehdotukset
            }) {
                otsikko
            }
        }
    `

    /* interface ehdotukset{
        otsikko: string
        aanet: string[]
    } */

	const Lisaaminen = async () => {
		console.log("Lisaaminen polkastu käyntiin")
		/* setOsallistujat(["","","","",""])
		setOtsikko("")
		setEhdotukset(["","","","",""]) */
		const tallennettu = await muokkaa()
		console.log(tallennettu)
	}

    const [muokkaa, {data, loading, error}] = useMutation<
    {tapahtumaLisays: {otsikko: string, osallistujat: string[], ehdotukset: string[] }},
	{otsikko: string, osallistujat: string[], ehdotukset: string[]}
    >(LUO_TAPAHTUMA, {variables: {otsikko, osallistujat, ehdotukset}})

	const Palaute = () => {
		if (data) {
			return (
				<>
					<p>lisääminen suoritettu</p>
				</>
			)}
		if (loading) {
			return (
				<>
					<p>lataa...</p>
				</>
			)}
		if (error) {
			return (
				<>
					<p>joku meni pieleen</p>
				</>
			)
		} 
			return(
					<p>ei mitään</p>
			)
	}


    return(
        <>
			<Palaute />
            <h1>Tapahtuman lisääminen</h1>
            <label>
				Otsikko:
				<input
					value={otsikko}
					onChange={(e) =>{
						setOtsikko(e.target.value)
					} }
				/>
			</label>
			<label>
				Puhelin:
				<input
					value={numero}
					onChange={(e) =>{
						setNumero(e.target.value)
					}}
				/>
			</label>
            <h2>Osallistujat</h2>
            {osallistujat.map((n, i) => {
				return (
					<div key={i}>
						<label>
							osallistuja:
							<input
								value={n} 
								onChange={(e) =>{
								let jono = osallistujat
								console.log(e.target.value)
								console.log(jono[i])
								console.log(jono)
								console.log(i)
								let value = e.target.value
								jono[i] = value
								setOsallistujat([...jono])
								console.log(jono)
								/* setOsallistujat(draft => {
									draft[i] = e.target.value
								}) */
								//setOsallistujat([...jono])
							}}
							/>
						</label>
					</div>
				)
			})}
            <h2>Ehdotukset</h2>
            {ehdotukset.map((n, i) => {
				return (
					<div key={i}>
						<label>
							osallistuja:
							<input
								value={n} 
								onChange={(e) =>{
								let jono = ehdotukset
								console.log(e.target.value)
								console.log(jono[i])
								console.log(jono)
								console.log(i)
								let value = e.target.value
								jono[i] = value
								setEhdotukset([...jono])
								console.log(jono)
								/* jono[i] = e.target.value
								console.log(jono) */
								/* jono[i] = e.target.value */
								/* setOsallistujat([...jono]) */
								/* osallistujat */
								/* setOsallistujat(draft => {
									draft[i] = e.target.value
								}) */
								//setOsallistujat([...jono])
							}}
							/>
						</label>
					</div>
				)
			})}
            <button onClick={Lisaaminen}>luo tapahtuma</button>
        </>
    )
}

export default Lisaaminen