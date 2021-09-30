import {useState} from 'react'
import { gql, useMutation } from "@apollo/client"
import Button from '@material-ui/core/Button';
import { LUOMINEN } from "./graphOperations"

const Lisaaminen = () => {

    const [osallistujat, setOsallistujat] = useState(["","","","",""])
	const [otsikko, setOtsikko] = useState("")
    const [vaiheet, setVaiheet] = useState(["","","","",""])
	const [numero, setNumero] = useState("")

    const LUO_TAPAHTUMA = gql`
        mutation luominen($otsikko: String!, $numero: String!, $osallistujat: [String!]!, $ehdotukset: [String!]!) {
            lisaaTapahtuma(tapahtuma: {
                otsikko: $otsikko,
				numero: $numero,
                osallistujat: $osallistujat
                ehdotukset: $ehdotukset
            })
        }
    `

	const Lisaaminen = async () => {
		console.log("Lisaaminen polkastu käyntiin")
		const tallennettu = await muokkaa()
		console.log(tallennettu)
	}

    const [muokkaa, {data, loading, error}] = useMutation<
    {viesti: string},
	{otsikko: string, numero: string, vaiheet: string[], osallistujat: string[]}
    >(LUOMINEN, {variables: {otsikko, numero, vaiheet, osallistujat}})

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
					null
			)
	}


    return(
        <>
			<Palaute />
            <h1>Tapahtuman lisääminen</h1>
            <label style={{"display": "block"}}>
				Otsikko:
				<input
					value={otsikko}
					onChange={(e) =>{
						setOtsikko(e.target.value)
					} }
				/>
			</label>
			<label>
				Puhelin (alkaa 358):
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
								let value = e.target.value
								jono[i] = value
								setOsallistujat([...jono])
								console.log(jono)
							}}
							/>
						</label>
					</div>
				)
			})}
            <h2>Ehdotukset</h2>
            {vaiheet.map((n, i) => {
				return (
					<div key={i}>
						<label>
							Vaihe:
							<input
								value={n} 
								onChange={(e) =>{
								let jono = vaiheet
								let value = e.target.value
								jono[i] = value
								setVaiheet([...jono])
							}}
							/>
						</label>
					</div>
				)
			})}
            <Button variant="contained" onClick={Lisaaminen}>luo tapahtuma</Button>
        </>
    )
}

export default Lisaaminen